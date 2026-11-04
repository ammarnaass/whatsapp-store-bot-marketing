import React from 'react';
import { FileCheck, RefreshCw, Plus, CheckCircle2, Hourglass } from 'lucide-react';
import { HsmTemplate } from '../types/channels.types';
import { EmptyState } from '../../data-management';

interface HsmTemplatesCardProps {
  templates: HsmTemplate[];
  onSync: () => void;
  onCreateNew: () => void;
}

export const HsmTemplatesCard: React.FC<HsmTemplatesCardProps> = ({
  templates,
  onSync,
  onCreateNew
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              قوالب رسائل واتساب المعتمدة من Meta (Approved HSM Templates)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              القوالب التفاعلية التي يستخدمها وكيل الذكاء الاصطناعي لإعادة استهداف واسترداد العملاء
              تلقائياً.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSync}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#128C7E]" />
            <span>مزامنة القوالب مع Meta</span>
          </button>
          <button
            onClick={onCreateNew}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#128C7E] text-white hover:bg-[#075E54] text-xs font-bold transition-all shadow-md shadow-[#128C7E]/25 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إنشاء قالب جديد</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={<FileCheck className="w-8 h-8 text-[#128C7E]" />}
            title="لا توجد قوالب معتمدة حالياً"
            description="لم يتم تسجيل أي قوالب رسائل واتساب معتمدة بعد. يمكنك إنشاء قالب جديد أو تعبئة بيانات تجريبية."
            sectionKey="channels"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-[#128C7E]/40 hover:shadow-md transition-all space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {tpl.status === 'approved' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#128C7E]" />
                      معتمد (Approved)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Hourglass className="w-3 h-3 text-amber-600" />
                      قيد المراجعة (In Review)
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-bold">{tpl.category}</span>
                </div>

                <span
                  className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate block"
                  title={tpl.name}
                >
                  {tpl.name}
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {tpl.preview}
                </p>
              </div>

              <div className="pt-2.5 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-100 dark:border-[#1F293D] flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-medium">{tpl.metricLabel}</span>
                <span className="text-[#128C7E] font-bold text-xs">{tpl.metricValue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
