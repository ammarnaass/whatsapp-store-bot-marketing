import React from 'react';
import { Key, Eye, EyeOff, ShieldCheck, ExternalLink } from 'lucide-react';
import { ProviderMeta } from '../../types/integrations.types';

interface AiApiKeyManagerProps {
  providerMeta: ProviderMeta;
  apiKey: string;
  showApiKey: boolean;
  onApiKeyChange: (val: string) => void;
  onToggleShowApiKey: () => void;
}

export const AiApiKeyManager: React.FC<AiApiKeyManagerProps> = ({
  providerMeta,
  apiKey,
  showApiKey,
  onApiKeyChange,
  onToggleShowApiKey,
}) => {
  const hasKey = apiKey.trim().length > 0;

  const getPlaceholder = () => {
    switch (providerMeta.id) {
      case 'gemini':
        return 'AIzaSy... (Gemini API Key)';
      case 'deepseek':
        return 'sk-... (DeepSeek API Key)';
      case 'claude':
        return 'sk-ant-... (Anthropic Claude API Key)';
      case 'openai':
        return 'sk-proj-... (OpenAI API Key)';
      default:
        return 'أدخل مفتاح API...';
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              مفتاح واجهة برمجة التطبيقات ({providerMeta.name} API Key)
            </h4>
            <p className="text-[11px] text-slate-400">
              أدخل المفتاح الخاص بحسابك على منصة {providerMeta.portalLabel}
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            hasKey
              ? 'bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-[#25D366]' : 'bg-amber-500'}`} />
          <span>{hasKey ? 'المفتاح جاهز' : 'المفتاح مطلوب'}</span>
        </span>
      </div>

      {/* Input Group with Masking Toggle */}
      <div className="relative">
        <input
          type={showApiKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full h-11 pr-3.5 pl-12 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-mono focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          dir="ltr"
        />

        <button
          onClick={onToggleShowApiKey}
          type="button"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title={showApiKey ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
        >
          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Security & Direct Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#128C7E] dark:text-emerald-400 shrink-0" />
          <span>محفوظ ومشفّر محلياً في قاعدة البيانات عبر Electron SafeStorage</span>
        </div>

        <a
          href={providerMeta.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#128C7E] dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer shrink-0"
        >
          <span>إصدار المفتاح من {providerMeta.portalLabel}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

