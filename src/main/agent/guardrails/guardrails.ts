import { AppDatabase } from '../../database/db';

export interface GuardrailCheckResult {
  allowed: boolean;
  reason?: string;
  triggerHandoff?: boolean;
}

export class AgentGuardrails {
  private static db = AppDatabase.getInstance().db;

  /**
   * فحص محاولات حقن التعليمات والرسائل الخبيثة بحواجز ذكية متعددة الطبقات
   */
  public static checkPromptInjection(messageText: string): GuardrailCheckResult {
    const rawLower = messageText.toLowerCase();

    // 1. تطبيع النص العربي وإزالة التشكيل والمد (ـ) والفواصل غير المرئية
    const normalized = rawLower
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // إزالة التشكيل والتطويل
      .replace(/[أإآء]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // إزالة الأحرف الصفرية
      .replace(/\s+/g, ' ');

    // نصوص بدون مسافات لفحص محاولات التمويه بتفريق الحروف
    const compact = normalized.replace(/\s+/g, '');

    // أنماط حقن التعليمات المتقدمة
    const injectionRegexes = [
      /ignore\s*(all|previous|prior)\s*instructions/i,
      /system\s*(prompt|instructions|context)/i,
      /developer\s*mode|jailbreak|dan\s*mode/i,
      /api\s*_?\s*key|secret\s*_?\s*key/i,
      /reveal\s*(instructions|prompt|rules)/i,
      /تجاهل.*(التعليمات|الاوامر|القواعد)/i,
      /انس.*(التعليمات|السابق|الحكي|كل\s*شي)/i,
      /وضع.*(المطور|الادمن|المسؤول)/i,
      /التعليمات.*(البرمجيه|الداخليه|السريه)/i,
      /اكشف.*(مفتاح|الرمز|البرومبت)/i,
      /(انا|انا\s*هو)\s*(صاحب|مالك|مدير)\s*المتجر/i,
    ];

    for (const regex of injectionRegexes) {
      if (regex.test(normalized) || regex.test(compact)) {
        console.warn(`[Guardrails] Prompt injection pattern detected by regex: ${regex}`);
        return {
          allowed: false,
          reason: 'تم رصد محاولة غير مصرح بها للالتفاف على قواعد النظام وسياسات الأمان.',
          triggerHandoff: false,
        };
      }
    }

    // فحص الكلمات المفتاحية في النص الصغير والمضغوط
    const blockedKeywords = [
      'systemprompt',
      'ignoreall',
      'developer',
      'jailbreak',
      'تجاهلالتعليمات',
      'انسكلماقيل',
      'وضعالمطور',
      'كودالبرمجه',
      'مفتاحapi',
    ];

    for (const kw of blockedKeywords) {
      if (compact.includes(kw)) {
        console.warn(`[Guardrails] Blocked compact keyword detected: "${kw}"`);
        return {
          allowed: false,
          reason: 'تم رصد محاولة غير مصرح بها للالتفاف على قواعد النظام.',
          triggerHandoff: false,
        };
      }
    }

    return { allowed: true };
  }

  /**
   * فحص طلبات الخصم - يتم منع أي خصم آلي (0%) بناءً على إعدادات المالك
   */
  public static validateDiscount(requestedPercent: number): GuardrailCheckResult {
    const config = this.db.prepare('SELECT max_discount_percent FROM agent_config WHERE id = ?').get('default') as {
      max_discount_percent: number;
    } | undefined;

    const maxAllowed = config ? config.max_discount_percent : 0.0;

    if (requestedPercent > maxAllowed) {
      return {
        allowed: false,
        reason: `سياسة المتجر الصارمة تمنع تقديم أي خصم إضافي غير رسمي (الحد المسموح للوكيل: ${maxAllowed}%).`,
        triggerHandoff: true,
      };
    }

    return { allowed: true };
  }

  /**
   * التحقق من سقف مبلغ الطلب قبل الاعتماد التلقائي
   */
  public static validateOrderAmount(totalAmount: number): GuardrailCheckResult {
    const config = this.db.prepare('SELECT max_order_amount_auto FROM agent_config WHERE id = ?').get('default') as {
      max_order_amount_auto: number;
    } | undefined;

    const maxAuto = config ? config.max_order_amount_auto : 200.0;

    if (totalAmount > maxAuto) {
      return {
        allowed: false,
        reason: `قيمة الطلب (${totalAmount}$) تتجاوز السقف التلقائي المسموح (${maxAuto}$). يلزم مراجعة بشرية للطلب.`,
        triggerHandoff: true,
      };
    }

    return { allowed: true };
  }

  /**
   * فحص كلمات الانسحاب وإلغاء الاشتراك
   */
  public static isOptOutMessage(messageText: string): boolean {
    const trimmed = messageText.trim();
    const optOutWords = ['إيقاف', 'ايقاف', 'الغاء', 'إلغاء', 'توقف', 'stop', 'unsubscribe', 'optout'];
    return optOutWords.some((w) => trimmed.toLowerCase() === w || trimmed === w);
  }

  /**
   * تسجيل رقم في قائمة الحظر عند طلب الانسحاب
   */
  public static handleOptOut(phone: string): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO blocklist (phone, reason)
      VALUES (?, 'OPT_OUT_USER_REQUEST')
    `).run(phone);

    this.db.prepare(`
      UPDATE contacts SET opted_out = 1 WHERE phone = ?
    `).run(phone);

    console.log(`[Guardrails] Phone ${phone} added to blocklist & opted-out.`);
  }
}
