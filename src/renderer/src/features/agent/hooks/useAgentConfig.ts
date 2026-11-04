import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { AgentConfig, KnowledgeItem } from '../../../../shared/types';

export function useAgentConfig() {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const cfg = await api.agent.getConfig();
      const kb = await api.knowledge.list();
      setConfig(cfg);
      setKnowledgeList(kb);
      if (cfg?.api_key) setApiKeyInput(cfg.api_key);
    } catch (err) {
      console.error('Failed to load agent config:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveConfig = async (updatedConfig: AgentConfig, apiKey: string) => {
    await api.agent.updateConfig({
      ...updatedConfig,
      api_key: apiKey,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    await loadData();
  };

  const emergencyStop = async () => {
    await api.agent.emergencyStop();
    await loadData();
  };

  const createKnowledgeItem = async (title: string, category: string, content: string) => {
    await api.knowledge.create({
      title,
      category: category as any,
      content,
    });
    await loadData();
  };

  const deleteKnowledgeItem = async (id: string) => {
    await api.knowledge.delete(id);
    await loadData();
  };

  return {
    config,
    apiKeyInput,
    setApiKeyInput,
    knowledgeList,
    savedSuccess,
    saveConfig,
    emergencyStop,
    createKnowledgeItem,
    deleteKnowledgeItem,
    refresh: loadData,
  };
}
