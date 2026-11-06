import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ProductFormData, ProductFormErrors, ProfitAnalysis } from '../../types/products.types';
import { ProfitMarginBadge } from '../badges/ProfitMarginBadge';
import { SUPPORTED_CURRENCIES, getCurrencyInfo } from '@shared/currencies';

interface Props {
  formData: ProductFormData; profitAnalysis: ProfitAnalysis; errors: ProductFormErrors;
  onChange: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
}

export const ProductPricingSection: React.FC<Props> = ({ formData, profitAnalysis, errors, onChange }) => {
  const sym = getCurrencyInfo(formData.currency).symbol;

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block font-bold mb-1">العملة</label>
          <select
            value={formData.currency || 'USD'}
            onChange={(e) => onChange('currency', e.target.value)}
            className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold cursor-pointer"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">سعر البيع ({sym}) <span className="text-rose-500">*</span></label>
          <input
            type="number" min="0" step="0.01" value={formData.price}
            onChange={(e) => onChange('price', Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
          />
          {errors.price && <p className="text-rose-500 text-[11px] mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block font-bold mb-1">سعر التكلفة ({sym}) <span className="text-rose-500">*</span></label>
          <input
            type="number" min="0" step="0.01" value={formData.cost_price}
            onChange={(e) => onChange('cost_price', Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
          />
          {errors.cost_price && <p className="text-rose-500 text-[11px] mt-1">{errors.cost_price}</p>}
        </div>

        <div>
          <label className="block font-bold mb-1">السعر قبل الخصم ({sym})</label>
          <input
            type="number" min="0" step="0.01" value={formData.compare_at_price || ''}
            onChange={(e) => onChange('compare_at_price', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="سعر الشطب"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      {/* Live Profit Analysis Ribbon */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/40 dark:from-slate-800/60 dark:to-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>تحليل الربحية والهامش اللحظي:</span>
          </div>
          <ProfitMarginBadge profitAnalysis={profitAnalysis} />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block">صافي الربح للقطعة:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{profitAnalysis.netProfit} {sym}</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block">نسبة هامش الربح:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono text-sm">%{profitAnalysis.marginPercent}</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block">نسبة الزيادة:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 font-mono text-sm">%{profitAnalysis.markupPercent}</span>
          </div>
        </div>
      </div>

      {/* Tax configuration */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox" checked={formData.is_tax_inclusive}
            onChange={(e) => onChange('is_tax_inclusive', e.target.checked)}
            className="rounded text-[#128C7E] focus:ring-[#128C7E]"
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">السعر شامل للضريبة (VAT)</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">قيمة الضريبة: {profitAnalysis.taxAmount} {sym}</span>
      </div>
    </div>
  );
};
