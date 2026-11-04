import React from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAgentIntegration } from '../hooks/useAgentIntegration';
import {
  AiProviderGrid,
  AiApiKeyManager,
  AiModelCatalog,
  AiConnectionTester,
  WhatsAppGatewayStatusCard,
} from './integrations';

export const IntegrationsTab: React.FC = () => {
  const {
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    activeApiKey,
    onApiKeyChange,
    showApiKey,
    toggleShowApiKey,
    dailyCostLimit,
    setDailyCostLimit,
    isTesting,
    testResult,
    isSaving,
    saveSuccess,
    errorToast,
    handleTestConnection,
    handleSaveConfig,
    availableModels,
    currentProviderMeta,
  } = useAgentIntegration();

  return (
    <div className="space-y-4">
      {/* Tab Top Bar with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>بوابة مزودات الذكاء الاصطناعي وواتساب</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300">
              Multi-Model AI Gateway
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            دعم متكامل لـ Google Gemini و DeepSeek و Anthropic Claude و OpenAI
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          type="button"
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#0E7A6E] hover:from-[#0E7A6E] hover:to-[#0A5C53] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-[#128C7E]/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'جارٍ الحفظ والتشفير...' : 'حفظ إعدادات المزود والـ API'}</span>
        </button>
      </div>

      {/* Success / Error Feedback */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>تم حفظ وتشفير مفتاح API وإعدادات المزود بنجاح في قاعدة البيانات المحلية! 💾</span>
        </div>
      )}

      {errorToast && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 transition-all">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>خطأ: {errorToast}</span>
        </div>
      )}

      {/* 1. WhatsApp Active Session Card */}
      <WhatsAppGatewayStatusCard />

      {/* 2. Global AI Provider Grid (Gemini, DeepSeek, Claude, OpenAI) */}
      <AiProviderGrid
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
      />

      {/* 3. API Key Manager with SafeStorage */}
      <AiApiKeyManager
        providerMeta={currentProviderMeta}
        apiKey={activeApiKey}
        showApiKey={showApiKey}
        onApiKeyChange={onApiKeyChange}
        onToggleShowApiKey={toggleShowApiKey}
      />

      {/* 4. Provider-Filtered Models Catalog */}
      <AiModelCatalog
        providerMeta={currentProviderMeta}
        models={availableModels}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      {/* 5. Live Latency Test & Cost Safety Cap */}
      <AiConnectionTester
        isTesting={isTesting}
        testResult={testResult}
        dailyCostLimit={dailyCostLimit}
        onDailyCostLimitChange={setDailyCostLimit}
        onRunTest={handleTestConnection}
      />
    </div>
  );
};
