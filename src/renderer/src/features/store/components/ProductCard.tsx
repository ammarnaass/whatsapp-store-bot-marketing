import React from 'react';
import { Package, Key } from 'lucide-react';
import { Product } from '../../../../shared/types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const variant = product.variants[0] || {};
  const isDigital = product.type === 'digital';

  return (
    <div className="wasell-card wasell-card-hover overflow-hidden flex flex-col justify-between">
      {/* صورة المنتج وشاراته */}
      <div className="relative h-44 bg-slate-900 overflow-hidden">
        <img
          src={product.media[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDigital ? 'bg-violet-900/90 text-violet-200 border border-violet-700' : 'bg-emerald-900/90 text-emerald-200 border border-emerald-700'
          }`}>
            {isDigital ? 'رقمي' : 'فيزيائي'}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700">
            {variant.sku || 'SKU'}
          </span>
        </div>
      </div>

      {/* تفاصيل المنتج والمخزون */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description || 'لا يوجد وصف متاح للمنتج'}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">السعر الأساسي:</span>
            <span className="text-base font-extrabold text-[#128C7E] font-mono">${variant.price || 0}</span>
          </div>

          <div className="text-left">
            <span className="text-slate-400 block text-[10px]">
              {isDigital ? 'المفاتيح المتاحة:' : 'المخزون المتبقي:'}
            </span>
            <span className={`font-mono font-bold flex items-center gap-1 ${
              (variant.stock_qty || 0) < 5 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {isDigital ? <Key className="w-3.5 h-3.5 text-violet-500" /> : <Package className="w-3.5 h-3.5 text-emerald-500" />}
              {variant.stock_qty || 0} وحدة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
