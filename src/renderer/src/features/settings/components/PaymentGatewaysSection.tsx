import React from 'react';
import { CreditCard, TrendingUp } from 'lucide-react';
import { PaymentGatewaySettings } from '../types/settings.types';
import { PaymentGatewayRow } from './PaymentGatewayRow';

interface PaymentGatewaysSectionProps {
  payments: PaymentGatewaySettings;
  onChange: (updated: PaymentGatewaySettings) => void;
}

export const PaymentGatewaysSection: React.FC<PaymentGatewaysSectionProps> = ({
  payments,
  onChange,
}) => {
  const toggleGateway = (key: keyof Omit<PaymentGatewaySettings, 'codFee'>) => {
    onChange({ ...payments, [key]: !payments[key] });
  };

  const activeCount = [payments.madaApplePay, payments.tamara, payments.tabby, payments.cod].filter(Boolean).length;

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">بوابات الدفع والتحصيل السريع</h2>
              <p className="text-xs text-slate-400">روابط دفع تفاعلية ترسل داخل محادثة العميل بضغطة زر</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            {activeCount} بوابات نشطة
          </span>
        </div>

        <div className="space-y-3 mb-5">
          <PaymentGatewayRow
            badgeText="mada"
            title="مدى و Apple Pay (دفع سريع بنقرة واحدة)"
            tag="مباشر"
            description="توليد تلقائي لرابط Apple Pay الفوري داخل نافذة الشات"
            checked={payments.madaApplePay}
            onToggle={() => toggleGateway('madaApplePay')}
          />

          <PaymentGatewayRow
            badgeText="tamara"
            badgeBg="bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40"
            badgeTextColor="text-amber-600 dark:text-amber-400"
            title="تمارا (قسم مشترياتك على 4 دفعات)"
            tag="بدون فوائد"
            description="اقتراح ذكي للتقسيط من الوكيل إذا تردد العميل في سلة > 350 ر.س"
            checked={payments.tamara}
            onToggle={() => toggleGateway('tamara')}
          />

          <PaymentGatewayRow
            badgeText="tabby"
            badgeBg="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40"
            badgeTextColor="text-emerald-600 dark:text-emerald-400"
            title="تابي (قسّط على 4 دفعات مريحة)"
            tag="بدون فوائد"
            description="دعم تحصيل الأقساط الشهرية المعتمدة في السعودية والإمارات"
            checked={payments.tabby}
            onToggle={() => toggleGateway('tabby')}
          />

          <PaymentGatewayRow
            badgeText="COD"
            badgeBg="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            badgeTextColor="text-slate-700 dark:text-slate-300"
            title="الدفع عند الاستلام (Cash On Delivery)"
            description="تحصيل المبلغ نقداً عبر مناديب الشحن مع رسوم خدمة إضافية"
            checked={payments.cod}
            onToggle={() => toggleGateway('cod')}
          >
            {payments.cod && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="text-slate-500 font-medium">رسوم إضافية للطلب:</span>
                <input
                  type="number"
                  value={payments.codFee}
                  onChange={(e) => onChange({ ...payments, codFee: Number(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                />
                <span className="text-slate-400">ر.س</span>
              </div>
            )}
          </PaymentGatewayRow>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>معدل اكتمال الدفع الآلي: 94.2%</span>
        </span>
        <span>تشفير 256-bit آمن</span>
      </div>
    </section>
  );
};
