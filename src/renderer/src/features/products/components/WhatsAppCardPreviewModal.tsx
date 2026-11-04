import React from 'react';
import { Smartphone, X } from 'lucide-react';
import { CatalogProduct } from '../types/products.types';

interface WhatsAppCardPreviewModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  onInstantOrder: (product: CatalogProduct) => void;
  onAskDetails: (product: CatalogProduct) => void;
}

export const WhatsAppCardPreviewModal: React.FC<WhatsAppCardPreviewModalProps> = ({
  product,
  onClose,
  onInstantOrder,
  onAskDetails
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-[#1F293D] shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1F293D]">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#128C7E]" />
            معاينة رسالة بطاقة المنتج في واتساب
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulating WhatsApp Chat Background */}
        <div className="bg-[#EFEAE2]/60 dark:bg-[#0A0E17] p-3 rounded-2xl border border-slate-200/60 dark:border-[#1F293D] space-y-2">
          {/* Product WhatsApp Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xs border border-slate-100 dark:border-slate-700">
            <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
            <div className="p-3.5 space-y-2 text-right">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                {product.category}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
              <div className="pt-1 flex items-baseline gap-2">
                <span className="text-base font-black text-[#128C7E]">{product.price} ر.س</span>
                {product.oldPrice && (
                  <span className="text-xs line-through text-slate-400">{product.oldPrice} ر.س</span>
                )}
              </div>
            </div>

            {/* Simulated Interactive Buttons inside WhatsApp */}
            <div className="border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 text-center font-bold text-xs text-[#128C7E]">
              <button
                onClick={() => onInstantOrder(product)}
                className="w-full py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>طلب فوري عبر سلة 🛒</span>
              </button>
              <button
                onClick={() => onAskDetails(product)}
                className="w-full py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
              >
                <span>استفسار عن المقاس والضمان</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-left pl-1">
            04:22 م ✓✓
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          إغلاق المعاينة
        </button>
      </div>
    </div>
  );
};
