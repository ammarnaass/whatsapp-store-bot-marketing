import React from 'react';
import { Smartphone, Edit2, Trash2 } from 'lucide-react';
import { CatalogProduct } from '../types/products.types';
import { StockStatusBadge } from './badges/StockStatusBadge';
import { CategoryBadge } from '../../categories';
import { formatCurrency } from '@shared/currencies';

interface Props {
  prod: any;
  onToggleAi: (id: string) => void;
  onPreview: (product: CatalogProduct) => void;
  onEdit?: (product: CatalogProduct) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ProductTableRow: React.FC<Props> = ({ prod, onToggleAi, onPreview, onEdit, onDelete }) => {
  const cost = prod.cost_price || Math.round(prod.price * 0.6);
  const margin = Math.round((((prod.price - cost) / (prod.price || 1)) * 100) * 10) / 10;
  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">{prod.sku}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <CategoryBadge name={prod.category} size="sm" />
        <span className="text-[10px] text-slate-400 block mt-1">{prod.type === 'physical' ? '📦 فيزيائي (شحن)' : '🔑 رقمي'}</span>
      </td>
      <td className="py-3 px-4 text-center">
        <div className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(prod.price, prod.currency)}</div>
        <div className="text-[10px] text-slate-400 font-mono">
          تكلفة: {formatCurrency(cost, prod.currency)} <span className="text-emerald-600 font-semibold">(+{margin}%)</span>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <StockStatusBadge stock={prod.stock} />
        <div className="text-[10px] text-slate-400 mt-0.5">{prod.type === 'physical' ? `${prod.weight || 0.5} كجم` : 'تسليم فوري'}</div>
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onToggleAi(prod.id)}
          className={`h-6 px-2.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
            prod.aiRecommended ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
          }`}
        >
          {prod.aiRecommended ? 'مفعّل' : 'معطّل'}
        </button>
      </td>
      <td className="py-3 px-4 text-center text-[11px] text-slate-600 dark:text-slate-300 font-mono">
        {prod.salesCount || 0} طلب ({prod.conversionRate || 0}%)
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => onPreview(prod)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#128C7E] hover:bg-slate-100 dark:hover:bg-slate-800" title="معاينة كارت واتساب">
            <Smartphone className="w-4 h-4" />
          </button>
          {onEdit && (
            <button onClick={() => onEdit(prod)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40" title="تعديل المنتج">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(prod.id, prod.name)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="حذف المنتج">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
