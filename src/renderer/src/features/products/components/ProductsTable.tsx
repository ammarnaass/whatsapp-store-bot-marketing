import React from 'react';
import { Bot, Smartphone, Package } from 'lucide-react';
import { CatalogProduct } from '../types/products.types';
import { EmptyState } from '../../data-management';

interface ProductsTableProps {
  products: CatalogProduct[];
  onToggleAi: (id: string) => void;
  onPreview: (product: CatalogProduct) => void;
  onAddNew: () => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onToggleAi,
  onPreview,
  onAddNew
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-[#1F293D]">
            <tr>
              <th className="py-3.5 px-4">المنتج والـ SKU</th>
              <th className="py-3.5 px-4">الفئة والنوع</th>
              <th className="py-3.5 px-4 text-center">السعر</th>
              <th className="py-3.5 px-4 text-center">المخزون المتوفر</th>
              <th className="py-3.5 px-4 text-center">اقتراح الوكيل (AI)</th>
              <th className="py-3.5 px-4 text-center">معدل الإغلاق</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8">
                  <EmptyState
                    icon={<Package className="w-8 h-8 text-[#128C7E]" />}
                    title="كتالوج المنتجات فارغ حالياً"
                    description="لم تقم بإضافة أو استيراد أي منتجات بعد. أضف منتجاتك أو استوردها من سلة/زد أو قم بتعبئة بيانات تجريبية بنقرة زر."
                    sectionKey="products"
                    actionButton={
                      <button
                        onClick={onAddNew}
                        className="h-[38px] px-4 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#075E54] transition-all cursor-pointer shadow-xs glow-whatsapp"
                      >
                        إضافة أول منتج
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">{prod.sku}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{prod.category}</span>
                      <span className="text-[11px] text-slate-400">
                        {prod.type === 'physical' ? '📦 شحن فيزيائي' : '🔑 ترخيص رقمي فوري'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      <span>{prod.price} ر.س</span>
                      {prod.oldPrice && (
                        <span className="text-xs line-through text-slate-400 font-normal">
                          {prod.oldPrice}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tabular-nums ${
                        prod.stock <= 5
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200'
                          : prod.stock <= 10
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-emerald-50 text-[#075E54] dark:bg-[#128C7E]/20 dark:text-emerald-300'
                      }`}
                    >
                      {prod.stock} قطعة متبقية
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleAi(prod.id)}
                      className={`h-[28px] inline-flex items-center gap-1.5 px-3 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                        prod.aiRecommended
                          ? 'bg-violet-100 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{prod.aiRecommended ? 'مفعّل بـ AI' : 'معطّل'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-[#128C7E] font-mono tabular-nums">
                      <span>{prod.conversionRate}%</span>
                      <span className="text-xs text-slate-400">({prod.salesCount} طلب)</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onPreview(prod)}
                      className="h-[30px] px-3 rounded-xl bg-[#128C7E]/10 hover:bg-[#128C7E] text-[#128C7E] hover:text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      title="معاينة بطاقة واتساب التفاعلية"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>معاينة واتساب</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
