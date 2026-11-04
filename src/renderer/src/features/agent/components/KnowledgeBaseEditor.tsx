import React, { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { KnowledgeItem } from '../../../../shared/types';

interface KnowledgeBaseEditorProps {
  knowledgeList: KnowledgeItem[];
  onCreateItem: (title: string, category: string, content: string) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export const KnowledgeBaseEditor: React.FC<KnowledgeBaseEditorProps> = ({
  knowledgeList,
  onCreateItem,
  onDeleteItem,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'faq' | 'shipping' | 'return_policy' | 'general'>('faq');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateItem(title.trim(), category, content.trim());
      setTitle('');
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. قائمة مصادر المعرفة الحالية */}
      <div className="wasell-card p-4 space-y-3">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#7C3AED]" />
          مصادر المعرفة المزامنة ({knowledgeList.length})
        </h4>

        <div className="space-y-2 overflow-y-auto max-h-[480px]">
          {knowledgeList.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-[#1F293D] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.title}</span>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-[#7C3AED]/20 text-violet-600">
                {item.category}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. إضافة مصدر معرفة جديد */}
      <div className="lg:col-span-2 wasell-card p-5 space-y-4">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#128C7E]" />
          إضافة وثيقة معرفية جديدة للوكيل
        </h4>

        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">عنوان الموضوع أو السؤال</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: سياسة الاستبدال والاسترجاع، أو مواعيد التوصيل للرياض"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">تصنيف الوثيقة</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="faq">أسئلة شائعة (FAQ)</option>
              <option value="shipping">سياسة الشحن والتوصيل</option>
              <option value="return_policy">سياسة الاسترجاع والضمان</option>
              <option value="general">معلومات عامة عن المتجر</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">المحتوى والإجابة الدقيقة</label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب الإجابة بوضوح كما تريد أن يخبر بها الوكيل عملاء واتساب..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ في قاعدة المعرفة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
