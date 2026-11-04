import React from 'react';
import { Truck, Box, Info } from 'lucide-react';
import { ProductFormData, ProfitAnalysis } from '../../types/products.types';
import { SHIPPING_TYPE_OPTIONS } from '../../constants/products.constants';

interface ProductShippingSectionProps {
  formData: ProductFormData;
  profitAnalysis: ProfitAnalysis;
  onChange: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
}

export const ProductShippingSection: React.FC<ProductShippingSectionProps> = ({
  formData,
  profitAnalysis,
  onChange,
}) => {
  if (formData.type === 'digital') {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
        <Info className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">منتج رقمي - لا يتطلب شحناً فيزيائياً</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          يتم تسليم المفاتيح الرقمية وروابط التحميل للعميل فورياً ومجاناً عبر واتساب بمجرد تأكيد الدفع.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            الوزن الفعلي للشحنة (كجم)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.weight}
            onChange={(e) => onChange('weight', Number(e.target.value))}
            placeholder="مثال: 0.75"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            الوزن الحجمي التقديري
          </label>
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono flex items-center justify-between">
            <span>{profitAnalysis.volumetricWeight} كجم</span>
            <span className="text-[10px] text-slate-400">(الطول×العرض×الارتفاع/5000)</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
          أبعاد التغليف (سم): [ الطول × العرض × الارتفاع ]
        </label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="الطول (سم)"
            value={formData.length || ''}
            onChange={(e) => onChange('length', e.target.value ? Number(e.target.value) : undefined)}
            className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-center"
          />
          <input
            type="number"
            placeholder="العرض (سم)"
            value={formData.width || ''}
            onChange={(e) => onChange('width', e.target.value ? Number(e.target.value) : undefined)}
            className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-center"
          />
          <input
            type="number"
            placeholder="الارتفاع (سم)"
            value={formData.height || ''}
            onChange={(e) => onChange('height', e.target.value ? Number(e.target.value) : undefined)}
            className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-center"
          />
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block font-bold text-slate-700 dark:text-slate-300">
          سياسة ورسوم الشحن لهذا المنتج
        </label>
        <div className="space-y-2">
          {SHIPPING_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                formData.shipping_type === opt.value
                  ? 'bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping_type"
                  value={opt.value}
                  checked={formData.shipping_type === opt.value}
                  onChange={() => onChange('shipping_type', opt.value as any)}
                  className="text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[11px] text-slate-400">{opt.desc}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {formData.shipping_type === 'fixed' && (
          <div className="p-3 bg-cyan-50/40 dark:bg-cyan-950/20 rounded-xl border border-cyan-200 dark:border-cyan-900/50">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              قيمة الشحن الثابتة (ر.س)
            </label>
            <input
              type="number"
              min="0"
              value={formData.shipping_fee || 0}
              onChange={(e) => onChange('shipping_fee', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
};

