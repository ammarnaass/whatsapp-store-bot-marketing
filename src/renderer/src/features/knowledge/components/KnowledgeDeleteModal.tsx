import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { KnowledgeItem } from '../types/knowledge.types';

interface KnowledgeDeleteModalProps {
  item: KnowledgeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
}

export const KnowledgeDeleteModal: React.FC<KnowledgeDeleteModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const ok = await onConfirm(item.id);
      if (ok) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">تأكيد حذف مصدر المعرفة</h3>
          </div>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف الوثيقة <span className="font-bold text-slate-900 dark:text-white">"{item.title}"</span>؟ لن يعتمد عليها وكيل الذكاء الاصطناعي بعد الآن.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 text-xs transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'جارٍ الحذف...' : 'حذف الوثيقة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

