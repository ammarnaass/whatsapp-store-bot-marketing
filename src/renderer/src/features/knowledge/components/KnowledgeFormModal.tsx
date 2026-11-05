import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { KnowledgeItem, KnowledgeFormData } from '../types/knowledge.types';
import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_SOURCE_TYPES } from '../constants/knowledge.constants';
import { useKnowledgeForm } from '../hooks/useKnowledgeForm';

interface KnowledgeFormModalProps {
  isOpen: boolean;
  initialItem?: KnowledgeItem | null;
  onClose: () => void;
  onSave: (data: KnowledgeFormData) => Promise<boolean>;
}

export const KnowledgeFormModal: React.FC<KnowledgeFormModalProps> = ({
  isOpen, initialItem, onClose, onSave,
}) => {
  const { formData, errors, handleChange, validate, resetForm } = useKnowledgeForm(initialItem);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const ok = await onSave(formData);
      if (ok) { resetForm(); onClose(); }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {formData.id ? 'تعديل وثيقة المعرفة' : 'إضافة وثيقة معرفية جديدة'}
            </h3>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs overflow-y-auto">
          {/* Source Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
            {KNOWLEDGE_SOURCE_TYPES.map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => handleChange('source_type', st.value)}
                className={`py-1 px-1.5 rounded-lg font-bold text-[11px] transition-all text-center ${
                  formData.source_type === st.value ? 'bg-white dark:bg-[#111827] text-[#128C7E] shadow-xs' : 'text-slate-500'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التصنيف *</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                {KNOWLEDGE_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الأولوية (الترجيح)</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', Number(e.target.value))}
                className="w-full h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                <option value={5}>⭐⭐⭐⭐⭐ أولوية قصوى (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ أولوية عالية (4/5)</option>
                <option value={3}>⭐⭐⭐ أولوية عادية (3/5)</option>
                <option value={2}>⭐⭐ أولوية ثانوية (2/5)</option>
                <option value={1}>⭐ أولوية منخفضة (1/5)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان الموضوع أو السؤال *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="مثال: مدة التوصيل لمدينة الرياض، أو سياسة استرجاع العطور"
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">محتوى المعرفة أو الإجابة النموذجية *</label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="اكتب الإجابة الدقيقة والحقائق التي يعتمد عليها الوكيل للرد على العملاء..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#128C7E]"
            />
            {errors.content && <p className="text-[11px] text-rose-500 mt-1">{errors.content}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ملخص سريع للبحث (اختياري)</label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="ملخص مركز في سطر واحد لتسريع مطابقة الذكاء الاصطناعي..."
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-[11px] focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting} className="h-8 px-5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold shadow-md shadow-[#128C7E]/20 transition-all disabled:opacity-50">
              {isSubmitting ? 'جارٍ الحفظ...' : formData.id ? 'حفظ التعديلات' : 'إضافة الوثيقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
