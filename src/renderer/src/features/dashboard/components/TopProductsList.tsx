import React from 'react';
import { Package } from 'lucide-react';
import { useDataStore } from '../../data-management';

interface ProductItem {
  name: string;
  type: string;
  price: string;
  sales: string;
  badge: string;
}

const DEFAULT_PRODUCTS: ProductItem[] = [
  { name: 'محصول بن كولومبي مختص 250g', type: 'فيزيائي', price: '68 ر.س', sales: '84 طلب', badge: 'bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E]' },
  { name: 'طاحونة قهوة يدوية احترافية C3', type: 'فيزيائي', price: '240 ر.س', sales: '46 طلب', badge: 'bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E]' },
  { name: 'كود تفعيل اشتراك برو السنوي', type: 'رقمي', price: '199 ر.س', sales: '38 طلب', badge: 'bg-violet-100 dark:bg-[#7C3AED]/20 text-violet-600' },
  { name: 'ميزان قهوة رقمي مع مؤقت ذكي', type: 'فيزيائي', price: '135 ر.س', sales: '31 طلب', badge: 'bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E]' },
];

export const TopProductsList: React.FC = () => {
  const isMockDataActive = useDataStore((s) => s.isMockDataActive);

  return (
    <div className="wasell-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-[#128C7E]" />
          أفضل المنتجات مبيعاً
        </h3>
        <span className="text-xs text-slate-400">الترتيب</span>
      </div>

      {!isMockDataActive ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <span>لا توجد بيانات مبيعات كافية للترتيب بعد</span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {DEFAULT_PRODUCTS.map((prod, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-[#1F293D]">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{prod.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${prod.badge}`}>{prod.type}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{prod.sales}</span>
              </div>
              <span className="font-extrabold text-xs font-mono text-[#128C7E]">{prod.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
