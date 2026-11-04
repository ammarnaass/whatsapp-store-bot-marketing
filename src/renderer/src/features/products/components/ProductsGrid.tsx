import React from 'react';
import { Sparkles, Smartphone, Package } from 'lucide-react';
import { CatalogProduct } from '../types/products.types';
import { EmptyState } from '../../data-management';

interface ProductsGridProps {
  products: CatalogProduct[];
  onPreview: (product: CatalogProduct) => void;
  onAddNew: () => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  onPreview,
  onAddNew
}) => {
  if (products.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm">
        <EmptyState
          icon={<Package className="w-8 h-8 text-[#128C7E]" />}
          title="كتالوج المنتجات فارغ حالياً"
          description="لم تقم بإضافة أو استيراد أي منتجات بعد. أضف منتجاتك أو استوردها من سلة/زد أو قم بتعبئة بيانات تجريبية بنقرة زر."
          sectionKey="products"
          actionButton={
            <button
              onClick={onAddNew}
              className="px-4 py-2 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#075E54] transition-all cursor-pointer shadow-xs"
            >
              إضافة أول منتج
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((prod) => (
        <div
          key={prod.id}
          className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
        >
          <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
            <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-xs">
              {prod.category}
            </span>
            {prod.aiRecommended && (
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7C3AED] text-white flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" />
                AI Active
              </span>
            )}
          </div>

          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                {prod.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
              <div>
                <span className="text-base font-black text-[#128C7E]">{prod.price} ر.س</span>
                <span className="text-[11px] text-slate-400 block">المخزون: {prod.stock}</span>
              </div>

              <button
                onClick={() => onPreview(prod)}
                className="px-3 py-1.5 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#075E54] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>بطاقة واتساب</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
