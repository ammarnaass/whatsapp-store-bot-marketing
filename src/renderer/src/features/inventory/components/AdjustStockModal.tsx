import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { InventoryItem } from '../types/inventory.types';

interface AdjustStockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (variantId: string, changeQty: number, reason: string) => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ item, isOpen, onClose, onConfirm }) => {
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [qty, setQty] = useState<number>(10);
  const [reason, setReason] = useState<string>('توريد شحنة جديدة من المورد');

  if (!isOpen || !item) return null;

  const changeQty = operation === 'add' ? qty : -qty;
  const newStock = Math.max(0, item.stockQty + changeQty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return;
    onConfirm(item.id, changeQty, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1F293D] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">تعديل رصيد المخزون</h3>
          </div>
          <button onClick={onClose} type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOperation('add')}
              className={`h-9 rounded-xl text-xs font-bold transition-all ${
                operation === 'add' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              + إضافة رصيد / توريد
            </button>
            <button
              type="button"
              onClick={() => setOperation('subtract')}
              className={`h-9 rounded-xl text-xs font-bold transition-all ${
                operation === 'subtract' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              - خصم / تصحيح / تالف
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الكمية المراد تعديلها</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              required
              className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] rounded-xl outline-none focus:border-[#128C7E] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سبب الحركة (لتسجيل التدقيق)</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] rounded-xl outline-none"
            >
              <option value="توريد شحنة جديدة من المورد">توريد شحنة جديدة من المورد</option>
              <option value="تصحيح جرد دوري">تصحيح جرد دوري بالمستودع</option>
              <option value="تلف أو كسر أثناء النقل">تلف أو كسر أثناء النقل والتخزين</option>
              <option value="استرجاع من عميل">استرجاع طلب تم إلغاؤه</option>
              <option value="سحب عينات أو ترويجي">سحب عينات تسويقية</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">الرصيد بعد التعديل:</span>
            <div className="font-mono font-black text-emerald-900 dark:text-emerald-200">
              <span className="line-through text-slate-400 mr-1.5">{item.stockQty}</span>
              <span>{newStock} قطعة</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1F293D]">
            <button onClick={onClose} type="button" className="h-9 px-4 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              إلغاء
            </button>
            <button type="submit" className="h-9 px-5 bg-[#128C7E] hover:bg-[#0da08e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95">
              <Check className="w-3.5 h-3.5" />
              <span>تأكيد التعديل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

