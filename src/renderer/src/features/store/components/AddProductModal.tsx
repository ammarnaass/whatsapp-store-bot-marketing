import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: {
    name: string;
    type: 'physical' | 'digital';
    description: string;
    price: number;
    stock: number;
  }) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'physical' | 'digital'>('physical');
  const [price, setPrice] = useState('45');
  const [stock, setStock] = useState('20');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        type,
        description: description.trim(),
        price: parseFloat(price) || 10,
        stock: parseInt(stock) || 10,
      });
      onClose();
      setName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="wasell-card w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-[#1F293D]">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#128C7E]" />
            إضافة منتج جديد للكتالوج
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">اسم المنتج</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: اشتراك سنوي أو شاحن سريع"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">نوع المنتج</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'physical' | 'digital')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
              >
                <option value="physical">فيزيائي (شحن واستلام)</option>
                <option value="digital">رقمي (مفاتيح وتراخيص)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">السعر ($)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
              {type === 'digital' ? 'عدد التراخيص الأولية' : 'الكمية في المستودع'}
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">الوصف التفصيلي</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للمنتج لمساعدة الوكيل الذكي في تقديم إجابات دقيقة للعملاء..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1F293D]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'جارٍ الإضافة...' : 'حفظ المنتج'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
