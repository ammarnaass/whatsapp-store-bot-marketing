import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { formatQrCodeDataUrl, getMockWhatsAppQrDataUrl } from '../../../utils/qr.utils';

interface OpenWAQrModalProps {
  isOpen: boolean;
  qrCodeData: string;
  countdown: number;
  isOfflineDemo?: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onSimulatePair?: () => void;
}

export const OpenWAQrModal: React.FC<OpenWAQrModalProps> = ({
  isOpen,
  qrCodeData,
  countdown,
  isOfflineDemo = false,
  onClose,
  onRefresh,
  onSimulatePair,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // عرض رمز QR الحقيقي من واتساب، أو رمز المعاينة فقط إذا كان وضع Demo صريح
  const hasRealQr = qrCodeData && (qrCodeData.startsWith('data:image/') || qrCodeData.startsWith('http'));
  const safeQrSrc = hasRealQr
    ? formatQrCodeDataUrl(qrCodeData)
    : isOfflineDemo
    ? getMockWhatsAppQrDataUrl()
    : '';

  const handleCopyQr = () => {
    navigator.clipboard.writeText(qrCodeData || safeQrSrc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1F293D] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex p-3 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] dark:bg-[#128C7E]/20 mb-2.5">
            <Smartphone className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            ربط واتساب بمسح رمز الاستجابة السريعة (QR Code)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اربط رقم متجرك مباشرة عبر بروتوكول Multi-Device الذاتي التكلفة
          </p>
        </div>

        {/* FR-77 / FR-80: Security Disclaimer & Dedicated Number Recommendation */}
        <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">توصية أمان الحساب (FR-77 & FR-80):</span>
            <span className="text-[11px] leading-relaxed block text-amber-800 dark:text-amber-300">
              يُوصى باستخدام رقم مخصص للتطبيق لتجنب قيود واتساب. الاتصال يتم عبر بوابة OpenWA المحلية غير الرسمية مع تفعيل التباطؤ والتدفئة لحماية الرقم.
            </span>
          </div>
        </div>

        {/* Sandbox Offline Banner if applicable */}
        {isOfflineDemo && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">وضع المعاينة السريعة (Sandbox Demo):</span>
              <span>
                بوابة OpenWA المحلية غير مشغلة على المنفذ 2785. تم توليد رمز تجريبي صالح للعرض، ويمكنك اختبار تجربة الربط الكاملة بنقرة واحدة أدناه.
              </span>
            </div>
          </div>
        )}

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="relative p-4 rounded-2xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
            {safeQrSrc ? (
              <img
                src={safeQrSrc}
                alt="WhatsApp Pairing QR Code"
                className="w-56 h-56 object-contain select-none"
                onError={(e) => {
                  // Fallback إن حدث خطأ في تحميل الـ Data URL
                  const target = e.currentTarget;
                  target.src = getMockWhatsAppQrDataUrl();
                }}
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-50 text-slate-400 rounded-xl">
                <RefreshCw className="w-8 h-8 animate-spin mb-2 text-[#128C7E]" />
                <span className="text-xs font-semibold">جارٍ توليد الرمز...</span>
              </div>
            )}
          </div>

          {/* Countdown & Refresh Indicator */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>تحديث تلقائي بعد:</span>
            <span className="font-mono font-bold text-[#128C7E] text-xs bg-[#128C7E]/10 px-2 py-0.5 rounded-md">
              {countdown}s
            </span>
            <button
              type="button"
              onClick={onRefresh}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#128C7E] transition-all cursor-pointer mr-1"
              title="تحديث يدوي فوري"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopyQr}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#128C7E] transition-all cursor-pointer mr-1"
              title="نسخ بيانات الرمز"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Action: Quick Simulation Pair for Demo / Testing */}
        {onSimulatePair && (
          <div className="my-3">
            <button
              type="button"
              onClick={onSimulatePair}
              className="w-full h-[38px] px-4 rounded-xl text-xs font-bold bg-[#128C7E] hover:bg-[#0e7064] text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>محاكاة مسح الرمز والربط الفوري (+966 50 123 4567)</span>
            </button>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-700/60 my-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>خطوات الربط في ثوانٍ:</span>
          </h4>
          <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <span>افتح تطبيق واتساب على هاتفك الذكي.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <span>اذهب إلى الإعدادات أو القائمة (⁝) واضغط على <strong>الأجهزة المرتبطة</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <span>اضغط على <strong>ربط جهاز</strong> ووجّه كاميرا الهاتف نحو الرمز أعلاه.</span>
            </li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>تشفير طرف لطرف (End-to-End Encrypted)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
