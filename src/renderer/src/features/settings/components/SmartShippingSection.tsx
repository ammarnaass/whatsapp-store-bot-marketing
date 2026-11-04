import React from 'react';
import { Truck, CheckCircle2, PlusCircle, Sparkles } from 'lucide-react';
import { ShippingSettings } from '../types/settings.types';

interface SmartShippingSectionProps {
  shipping: ShippingSettings;
  onChange: (updated: ShippingSettings) => void;
}

export const SmartShippingSection: React.FC<SmartShippingSectionProps> = ({
  shipping,
  onChange
}) => {
  const toggleCarrier = (key: 'smsaActive' | 'aramexActive' | 'torodActive' | 'splActive') => {
    onChange({ ...shipping, [key]: !shipping[key] });
  };

  const updateField = <K extends keyof ShippingSettings>(key: K, value: ShippingSettings[K]) => {
    onChange({ ...shipping, [key]: value });
  };

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                الشحن الذكي وحساب التكلفة التلقائي
              </h2>
              <p className="text-xs text-slate-400">
                إصدار البوالص وإدارة رسوم التوصيل لجميع مناطق المملكة
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#128C7E]/10 text-[#128C7E] text-xs font-bold">
            بوالص آلية
          </span>
        </div>

        {/* Integrated Logistics Carriers Grid */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            شركات الشحن المعتمدة والمربوطة بالـ API
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Carrier 1: SMSA */}
            <div
              onClick={() => toggleCarrier('smsaActive')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                shipping.smsaActive
                  ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${shipping.smsaActive ? 'text-[#128C7E]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-900 dark:text-white">سمسا (SMSA)</span>
              <span className={`text-[10px] font-bold ${shipping.smsaActive ? 'text-[#128C7E]' : 'text-slate-400'}`}>
                {shipping.smsaActive ? 'متصل ونشط' : 'معطّل'}
              </span>
            </div>

            {/* Carrier 2: Aramex */}
            <div
              onClick={() => toggleCarrier('aramexActive')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                shipping.aramexActive
                  ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${shipping.aramexActive ? 'text-[#128C7E]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-900 dark:text-white">أرامكس (Aramex)</span>
              <span className={`text-[10px] font-bold ${shipping.aramexActive ? 'text-[#128C7E]' : 'text-slate-400'}`}>
                {shipping.aramexActive ? 'متصل ونشط' : 'معطّل'}
              </span>
            </div>

            {/* Carrier 3: Torod */}
            <div
              onClick={() => toggleCarrier('torodActive')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                shipping.torodActive
                  ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${shipping.torodActive ? 'text-[#128C7E]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-900 dark:text-white">طرود (Torod)</span>
              <span className={`text-[10px] font-bold ${shipping.torodActive ? 'text-[#128C7E]' : 'text-slate-400'}`}>
                {shipping.torodActive ? 'متصل ونشط' : 'معطّل'}
              </span>
            </div>

            {/* Carrier 4: SPL */}
            <div
              onClick={() => toggleCarrier('splActive')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                shipping.splActive
                  ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <PlusCircle className={`w-5 h-5 ${shipping.splActive ? 'text-[#128C7E]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-900 dark:text-white">سبل (SPL)</span>
              <span className="text-[10px] text-slate-400">
                {shipping.splActive ? 'متصل ونشط' : 'ربط حساب جديد'}
              </span>
            </div>
          </div>
        </div>

        {/* Flat Shipping & Smart Upsell Rule */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تكلفة الشحن الثابتة الافتراضية
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={shipping.flatShippingRate}
                  onChange={(e) => updateField('flatShippingRate', Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400 shrink-0 font-bold">ر.س / طلب</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">لكل مدن المملكة العربية السعودية</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                حد الشحن المجاني الذكي
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={shipping.freeShippingThreshold}
                  onChange={(e) => updateField('freeShippingThreshold', Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400 shrink-0 font-bold">ر.س</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">يقترح الوكيل منتجات تكميلية للوصول للحد</p>
            </div>
          </div>

          {/* Smart Upsell Prompt Preview Box */}
          <div className="p-3.5 rounded-xl bg-violet-50/70 dark:bg-[#7C3AED]/20 border border-violet-200/60 dark:border-violet-900/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#7C3AED]">
                ذكاء اقتراح السلة للشحن المجاني
              </h4>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                حين تصل سلة العميل إلى 240 ر.س مثلاً، سيقترح الوكيل الذكي تلقائياً:{' '}
                <em className="text-violet-700 dark:text-violet-300 font-bold not-italic">
                  "باقي لك 60 ريال ويصير شحنك مجاني بالكامل! تحب أضيف لك عطر المسك الصغير (65 ر.س)؟"
                </em>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-print Waybill Toggle */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1F293D]">
        <span className="text-xs text-slate-600 dark:text-slate-400">
          الطباعة التلقائية للبوليصة في المستودع فور الدفع
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={shipping.autoPrintWaybill}
            onChange={() => updateField('autoPrintWaybill', !shipping.autoPrintWaybill)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
        </label>
      </div>
    </section>
  );
};
