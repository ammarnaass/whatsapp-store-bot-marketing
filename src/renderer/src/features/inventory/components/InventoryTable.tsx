import React from 'react';
import { SlidersHorizontal, Key, Boxes } from 'lucide-react';
import { InventoryItem } from '../types/inventory.types';

interface InventoryTableProps {
  items: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
  onManageKeys: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items, onAdjust, onManageKeys }) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-[#1F293D]">
            <tr>
              <th className="py-3 px-4">الصنف والـ SKU</th>
              <th className="py-3 px-4">النوع والتصنيف</th>
              <th className="py-3 px-4 text-center">السعر</th>
              <th className="py-3 px-4 text-center">الرصيد الكلي</th>
              <th className="py-3 px-4 text-center">المحجوز</th>
              <th className="py-3 px-4 text-center">المتاح للبيع</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Boxes className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="font-bold text-xs">لا توجد أصناف مطابقة للبحث أو الفلتر المختار</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold shrink-0">
                          📦
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.productName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold block">{item.category}</span>
                    <span className="text-[10px] text-slate-400">{item.type === 'physical' ? '📦 شحن فيزيائي' : '🔑 رخصة رقمية'}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white font-mono">${item.price}</td>

                  <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-900 dark:text-white">{item.stockQty}</td>

                  <td className="py-3.5 px-4 text-center text-slate-400 font-mono">{item.reservedQty}</td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      item.availableQty <= 0
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : item.availableQty <= 5
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {item.availableQty} متوفر
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onAdjust(item)}
                        className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#128C7E] hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="تعديل الكمية وتوريد رصيد"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>تعديل الرصيد</span>
                      </button>

                      {item.type === 'digital' && (
                        <button
                          onClick={() => onManageKeys(item)}
                          className="h-8 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          title="إدارة مفاتيح التراخيص الرقمية"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>المفاتيح</span>
                        </button>
                      )}
                    </div>
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

