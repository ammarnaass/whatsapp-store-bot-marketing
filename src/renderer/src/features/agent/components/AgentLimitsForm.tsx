import React, { useState } from 'react';
import { Sliders, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { AgentConfig } from '../../../../shared/types';

interface AgentLimitsFormProps {
  config: AgentConfig | null;
  apiKey: string;
  onApiKeyChange: (val: string) => void;
  onSave: (config: AgentConfig, apiKey: string) => Promise<void>;
  onEmergencyStop: () => Promise<void>;
  savedSuccess: boolean;
}

export const AgentLimitsForm: React.FC<AgentLimitsFormProps> = ({
  config,
  apiKey,
  onApiKeyChange,
  onSave,
  onEmergencyStop,
  savedSuccess,
}) => {
  const [mode, setMode] = useState<string>(config?.mode || 'autonomous');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    onSave({ ...config, mode: mode as any }, apiKey);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <form onSubmit={handleSubmit} className="wasell-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-[#1F293D]">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#7C3AED]" />
              إعدادات وحدود وكيل الذكاء الاصطناعي (Agent Limits)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">ضبط نمط العمل، حماية الأسعار، ومفتاح API</p>
          </div>

          {savedSuccess && (
            <span className="text-xs text-[#128C7E] font-bold flex items-center gap-1 bg-[#E7F6F2] dark:bg-[#128C7E]/20 px-2.5 py-1 rounded-xl">
              <CheckCircle className="w-4 h-4" /> تم الحفظ بنجاح
            </span>
          )}
        </div>

        {/* 1. نمط العمل (Operating Mode) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">نمط تشغيل الوكيل</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'autonomous', title: 'مستقل بالكامل (Autonomous)', desc: 'يرد ويؤكد مسودات الطلبات آلياً دون مراجعة بشرية' },
              { id: 'semi_autonomous', title: 'شبه مستقل (Semi-Auto)', desc: 'يرد آلياً ويحيل تأكيد الطلب النهائي للموظف' },
              { id: 'suggest_only', title: 'اقتراح فقط (Suggest Only)', desc: 'يقترح الردود للموظف دون إرسالها للعميل' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  mode === m.id
                    ? 'border-[#7C3AED] bg-violet-50/50 dark:bg-[#7C3AED]/20 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-bold text-xs">{m.title}</div>
                <div className="text-[10px] mt-1 leading-relaxed opacity-70">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. مفتاح Gemini API والنموذج المعتمد */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              مفتاح Gemini API
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              النموذج المعتمد
            </label>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#7C3AED]">gemini-3.8-flash</span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* 3. حد الخصم الصارم (0%) */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-amber-900 dark:text-amber-300">حد الخصم الصارم: 0% (ممنوع تقديم أي خصم)</h5>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
              وفقاً لوثيقة PRD v0.3، الوكيل غير مخول بأي تخفيض للأسعار. يتم رصد محاولات التفاوض السعري فوراً ورفضها بأدب واحترافية.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1F293D]">
          <button
            type="button"
            onClick={onEmergencyStop}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 border border-red-200 dark:border-red-900 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            تفعيل الإيقاف الطارئ
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-violet-700 text-white shadow-md transition-all cursor-pointer"
          >
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
};
