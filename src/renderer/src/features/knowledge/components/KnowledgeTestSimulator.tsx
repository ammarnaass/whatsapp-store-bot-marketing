import React from 'react';
import { Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useKnowledgeTester } from '../hooks/useKnowledgeTester';
import { KnowledgeCategoryBadge } from './KnowledgeCategoryBadge';

export const KnowledgeTestSimulator: React.FC = () => {
  const { query, setQuery, result, isTesting, runTest } = useKnowledgeTester();

  const sampleQueries = [
    'كم يستغرق الشحن للرياض والدمام؟',
    'ما هي شروط استرجاع المنتجات؟',
    'هل أقدر أدفع عن طريق تمارا أو تابي؟',
    'متى أوقات دوام خدمة العملاء؟',
  ];

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runTest();
  };

  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
              محاكي استرجاع المعرفة الذكي (Retrieval Simulator)
            </h3>
            <p className="text-[11px] text-slate-400">
              اختبر استفسارات العملاء واعرف أي من وثائق المتجر يستند إليها الوكيل وكيف يصيغ الإجابة
            </p>
          </div>
        </div>
      </div>

      {/* Quick query chips */}
      <div className="flex flex-wrap gap-1.5">
        {sampleQueries.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuery(q);
              runTest(q);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#128C7E] transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleTestSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اكتب استفساراً تجريبياً من عميل واتساب..."
          className="flex-1 h-9 px-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
        />
        <button
          type="submit"
          disabled={isTesting || !query.trim()}
          className="h-9 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'جارٍ الفحص...' : 'فحص الاسترجاع'}</span>
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              الوثائق المسترجعة ({result.matchedItems.length})
            </span>
            <span className="text-slate-400 font-mono">"{result.query}"</span>
          </div>

          {result.matchedItems.length === 0 ? (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>لم يعثر المحرك على وثائق ذات صلة مباشرة. يُنصح بإضافة وثيقة خاصة بهذا الموضوع.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {result.matchedItems.map(({ item, score }) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KnowledgeCategoryBadge category={item.category} size="sm" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    تطابق: {score}%
                  </span>
                </div>
              ))}

              <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>الصياغة المقترحة لرد الوكيل:</span>
                </div>
                {result.suggestedAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
