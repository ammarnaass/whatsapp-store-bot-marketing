import React from 'react';
import { Sparkles } from 'lucide-react';
import { TEMPLATE_VARIABLES, PRESET_CAMPAIGN_TEMPLATES } from '../../constants/marketing.constants';
import { LiveWhatsAppPreview } from './LiveWhatsAppPreview';

interface StepContentEditorProps {
  name: string;
  onNameChange: (val: string) => void;
  template: string;
  onTemplateChange: (val: string) => void;
}

export const StepContentEditor: React.FC<StepContentEditorProps> = ({
  name,
  onNameChange,
  template,
  onTemplateChange,
}) => {
  const handleInsertTag = (tag: string) => {
    onTemplateChange(`${template} ${tag} `);
  };

  const handleApplyPreset = (presetText: string) => {
    onTemplateChange(presetText);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* القسم الأيمن: إدخال الاسم والنص */}
      <div className="space-y-3.5">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 text-xs">
            اسم الحملة التسويقية
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="مثال: عروض الجمعة البيضاء للعملاء النشطين"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-medium"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
              نص رسالة واتساب
            </label>
            <span className="text-[10px] text-slate-400">انقر على الرمز لإدراجه</span>
          </div>

          {/* رقاقات المتغيرات الحية */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {TEMPLATE_VARIABLES.map((v) => (
              <button
                key={v.tag}
                type="button"
                onClick={() => handleInsertTag(v.tag)}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900/50 hover:bg-pink-100 cursor-pointer transition-colors"
              >
                + {v.tag}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            required
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            placeholder="أدخل رسالتك الترويجية هنا..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white leading-relaxed"
          />
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-1">
            ملاحظة أمان: يُنصح دائماً بترك عبارة «للإلغاء اكتب إيقاف» في ذيل الرسالة لحماية رقمك من بلاغات الحظر.
          </span>
        </div>

        {/* قوالب جاهزة سريعة */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" /> نماذج قوالب مقترحة:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CAMPAIGN_TEMPLATES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p.text)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* القسم الأيسر: المعاينة الحية للرسالة */}
      <div className="flex flex-col justify-center">
        <LiveWhatsAppPreview template={template} />
      </div>
    </div>
  );
};

