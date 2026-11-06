import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { AiProvider, AiConnectionTestResult } from '../types/integrations.types';
import { PROVIDER_MODELS_MAP } from '../types/integrations.models';
import { PROVIDER_META_LIST } from '../types/integrations.providers';

export function useAgentIntegration() {
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [dailyCostLimit, setDailyCostLimit] = useState(10);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<AiConnectionTestResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [keysByProvider, setKeysByProvider] = useState<Record<AiProvider, string>>({
    gemini: '',
    deepseek: '',
    claude: '',
    openai: '',
  });

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const cfg = await api.agent.getConfig();
      if (cfg) {
        const prov = (cfg.provider as AiProvider) || 'gemini';
        setSelectedProvider(prov);
        if (cfg.model_name && cfg.model_name !== 'gemini-3.8-flash') {
          setSelectedModel(cfg.model_name);
        } else {
          setSelectedModel('gemini-2.5-flash');
        }
        if (cfg.daily_cost_limit !== undefined) setDailyCostLimit(cfg.daily_cost_limit);
        if (cfg.api_keys) setKeysByProvider((prev) => ({ ...prev, ...cfg.api_keys }));
        if (cfg.api_key) setKeysByProvider((prev) => ({ ...prev, [prov]: cfg.api_key }));
      }
    } catch (err) {
      console.warn('[useAgentIntegration] Failed to load config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const handleProviderSelect = useCallback((prov: AiProvider) => {
    setSelectedProvider(prov);
    setTestResult(null);
    const meta = (PROVIDER_META_LIST || []).find((p) => p.id === prov);
    if (meta) setSelectedModel(meta.defaultModel);
  }, []);

  const handleApiKeyChange = useCallback((val: string) => {
    setKeysByProvider((prev) => ({ ...prev, [selectedProvider]: val }));
  }, [selectedProvider]);

  const activeApiKey = keysByProvider[selectedProvider] || '';

  const handleTestConnection = useCallback(async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.agent.testApiConnection({
        provider: selectedProvider,
        apiKey: activeApiKey.trim(),
        modelName: selectedModel,
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || 'فشل فحص الاتصال' });
    } finally {
      setIsTesting(false);
    }
  }, [selectedProvider, activeApiKey, selectedModel]);

  const handleSaveConfig = useCallback(async () => {
    setIsSaving(true);
    setErrorToast(null);
    try {
      await api.agent.updateConfig({
        provider: selectedProvider,
        model_name: selectedModel,
        api_key: activeApiKey.trim(),
        api_keys: keysByProvider,
        daily_cost_limit: dailyCostLimit,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorToast(err?.message || 'فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  }, [selectedProvider, selectedModel, activeApiKey, keysByProvider, dailyCostLimit]);

  return {
    selectedProvider, setSelectedProvider: handleProviderSelect,
    selectedModel, setSelectedModel,
    activeApiKey, onApiKeyChange: handleApiKeyChange,
    showApiKey, toggleShowApiKey: () => setShowApiKey((v) => !v),
    dailyCostLimit, setDailyCostLimit,
    isLoading, isTesting, testResult, isSaving, saveSuccess, errorToast,
    handleTestConnection, handleSaveConfig,
    availableModels: (PROVIDER_MODELS_MAP && PROVIDER_MODELS_MAP[selectedProvider]) || [],
    currentProviderMeta: (PROVIDER_META_LIST || []).find((p) => p.id === selectedProvider) || (PROVIDER_META_LIST || [])[0],
  };
}
