import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, template: string) => Promise<void>;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState(
    'أهلاً بك {الاسم}! نوفر لك اليوم عرضاً خاصاً على منتجاتنا مع شحن مجاني لكافة المدن. للطلب رد على هذه الرسالة. للإلغاء اكتب "إيقاف".'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !template.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), template.trim());
      onClose();
      setName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="wasell-card w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-[#1F293D]">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#128C7E]" />
            إنشاء حملة تسويقية جديدة
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">اسم الحملة</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عروض نهاية الأسبوع للعملاء المميزين"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
              نص الرسالة (يدعم المتغيرات مثل &#123;الاسم&#125;)
            </label>
            <textarea
              rows={4}
              required
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              ملاحظة: يجب تضمين خيار الانسحاب "للإلغاء اكتب إيقاف" لحماية الرقم من البلاغات.
            </span>
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
              className="px-5 py-2 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              {isSubmitting ? 'جارٍ الإطلاق...' : 'إطلاق الحملة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
