import React from 'react';
import { CreditCard, TrendingUp, Check } from 'lucide-react';
import { PaymentGatewaySettings } from '../types/settings.types';

interface PaymentGatewaysSectionProps {
  payments: PaymentGatewaySettings;
  onChange: (updated: PaymentGatewaySettings) => void;
}

export const PaymentGatewaysSection: React.FC<PaymentGatewaysSectionProps> = ({
  payments,
  onChange
}) => {
  const toggleGateway = (key: keyof Omit<PaymentGatewaySettings, 'codFee'>) => {
    onChange({ ...payments, [key]: !payments[key] });
  };

  const updateCodFee = (fee: number) => {
    onChange({ ...payments, codFee: fee });
  };

  const activeCount = [
    payments.madaApplePay,
    payments.tamara,
    payments.tabby,
    payments.cod
  ].filter(Boolean).length;

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                بوابات الدفع والتحصيل السريع
              </h2>
              <p className="text-xs text-slate-400">
                روابط دفع تفاعلية ترسل داخل محادثة العميل بضغطة زر
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            {activeCount} بوابات نشطة
          </span>
        </div>

        {/* Gateways List */}
        <div className="space-y-3 mb-5">
          {/* Gateway 1: Mada & Apple Pay */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center font-black text-xs text-[#128C7E] shadow-xs shrink-0">
                mada
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    مدى و Apple Pay (دفع سريع بنقرة واحدة)
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#128C7E]/10 text-[#128C7E] font-bold">
                    مباشر
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  توليد تلقائي لرابط Apple Pay الفوري داخل نافذة الشات
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={payments.madaApplePay}
              onChange={() => toggleGateway('madaApplePay')}
              className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Gateway 2: Tamara */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center font-black text-xs text-amber-600 dark:text-amber-400 shadow-xs shrink-0">
                tamara
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    تمارا (قسم مشترياتك على 4 دفعات)
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold">
                    بدون فوائد
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  اقتراح ذكي للتقسيط من الوكيل إذا تردد العميل في سلة &gt; 350 ر.س
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={payments.tamara}
              onChange={() => toggleGateway('tamara')}
              className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Gateway 3: Tabby */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center font-black text-xs text-[#25D366] shadow-xs shrink-0">
                tabby
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    تابي (قسطها على 4 بدون فوائد)
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-[#128C7E]/20 text-emerald-700 dark:text-emerald-400 font-bold">
                    موافقة فورية
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  إرسال رابط استكمال التقسيط مع إشعار بالقبول الفوري
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={payments.tabby}
              onChange={() => toggleGateway('tabby')}
              className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Gateway 4: COD */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300 shadow-xs shrink-0">
                  COD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      الدفع عند الاستلام (COD)
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      رسوم إضافية
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    يتطلب تأكيد رقم الهاتف التلقائي عبر OTP بالواتساب
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={payments.cod}
                onChange={() => toggleGateway('cod')}
                className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
              />
            </div>

            {payments.cod && (
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  رسوم الدفع عند الاستلام الإضافية:
                </span>
                <div className="flex items-center gap-1.5 w-28">
                  <input
                    type="number"
                    value={payments.codFee}
                    onChange={(e) => updateCodFee(Number(e.target.value))}
                    className="w-full text-center py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 shrink-0 font-bold">ر.س</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Conversion Insight Micro-Bar */}
      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-[#128C7E]/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#128C7E]" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            معدل التحويل عبر روابط واتساب المباشرة:
          </span>
        </div>
        <span className="text-xs font-extrabold text-[#128C7E]">
          68.4% (+14% هذا الشهر)
        </span>
      </div>
    </section>
  );
};
