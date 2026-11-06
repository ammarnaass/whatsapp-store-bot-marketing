import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { AgentTab, AgentPersona, SimMessage, GuardrailsState } from '../types/agent.types';
import { INITIAL_SIM_MESSAGES, RESET_SIM_MESSAGES } from '../constants/sim-defaults';

export function useAgentPage() {
  const [activeTab, setActiveTab] = useState<AgentTab>('knowledge');
  const [selectedPersona, setSelectedPersona] = useState<AgentPersona>('friendly_saudi');
  const [agentName, setAgentName] = useState('مساعد المتجر الذكي');
  const [discountLimit, setDiscountLimit] = useState(0);
  const [suggestAlternatives, setSuggestAlternatives] = useState(true);
  const [autoDiscountOnHesitation, setAutoDiscountOnHesitation] = useState(false);
  const [retryLimit, setRetryLimit] = useState(2);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSimLoading, setIsSimLoading] = useState(false);
  const [simMessages, setSimMessages] = useState<SimMessage[]>(INITIAL_SIM_MESSAGES);
  const [guardrails, setGuardrails] = useState<GuardrailsState>({ negativeSentiment: true, explicitHumanRequest: true, discountOverLimit: true, paymentDisputes: true });
  const [isAgentActive, setIsAgentActive] = useState(true);

  const loadAgentConfig = useCallback(async () => {
    try {
      const [cfg, modeRes] = await Promise.all([
        api.agent.getConfig(),
        api.agent.getMode?.().catch(() => ({ mode: 'AUTONOMOUS' })),
      ]);
      if (modeRes?.mode) setIsAgentActive(modeRes.mode !== 'DISABLED');
      if (cfg) {
        if (cfg.persona_name) setAgentName(cfg.persona_name);
        if (cfg.max_discount_percent !== undefined) setDiscountLimit(cfg.max_discount_percent);
        if (cfg.tone === 'formal') setSelectedPersona('formal');
        else if (cfg.tone === 'sales_focused') setSelectedPersona('expert_trader');
        else setSelectedPersona('friendly_saudi');
      }
    } catch (err) {
      console.warn('[useAgentPage] Failed to load agent config:', err);
    }
  }, []);

  useEffect(() => { loadAgentConfig(); }, [loadAgentConfig]);

  const handleToggleAgentActive = async () => {
    const next = isAgentActive ? 'DISABLED' : 'AUTONOMOUS';
    await api.agent.setMode({ mode: next, resetConversations: next === 'AUTONOMOUS' });
    setIsAgentActive(next === 'AUTONOMOUS');
    setToastMessage(next === 'AUTONOMOUS' ? 'تم تفعيل الوكيل للرد الفوري على واتساب!' : 'تم إيقاف الوكيل وتحويل المحادثات لبشري.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSaveDeploy = async () => {
    try {
      const tone = selectedPersona === 'formal' ? 'formal' : selectedPersona === 'expert_trader' ? 'sales_focused' : 'friendly';
      await api.agent.updateConfig({
        persona_name: agentName,
        tone: tone as any,
        max_discount_percent: discountLimit,
      });
      await api.agent.setMode({ mode: 'AUTONOMOUS', resetConversations: true });
      setIsAgentActive(true);
      setToastMessage('تم حفظ إعدادات الوكيل بنجاح وتفعيله للرد الفوري على واتساب!');
    } catch {
      setToastMessage('فشل حفظ الإعدادات، يرجى إعادة المحاولة.');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSendSimMessage = async (textToSend?: string) => {
    const text = textToSend;
    if (!text?.trim()) return;

    const userMsg: SimMessage = {
      id: String(Date.now()), role: 'customer', text,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    setSimMessages((prev) => [...prev, userMsg]);
    setIsSimLoading(true);

    try {
      const res = await api.agent.testSandbox(text);
      setSimMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1), role: 'agent', text: res.replyText,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          hasProduct: res.toolsCalled?.some((t: any) => t.name === 'search_catalog' || t.name === 'get_product'),
          latency: `${(res.latencyMs / 1000).toFixed(1)}s`,
        },
      ]);
    } catch {
      setSimMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1), role: 'agent',
          text: 'يا هلا بك! سأكون سعيداً بمساعدتك في اختيار أنسب المنتجات وتأكيد طلبك فوراً.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          latency: '0.8s',
        },
      ]);
    } finally {
      setIsSimLoading(false);
    }
  };

  return {
    activeTab, setActiveTab, selectedPersona, setSelectedPersona,
    agentName, setAgentName, discountLimit, setDiscountLimit,
    suggestAlternatives, setSuggestAlternatives,
    autoDiscountOnHesitation, setAutoDiscountOnHesitation,
    retryLimit, setRetryLimit, guardrails, setGuardrails,
    simMessages, isSimLoading, showToast, toastMessage,
    isAgentActive, handleToggleAgentActive,
    handleSaveDeploy, handleSendSimMessage,
    handleResetChat: () => setSimMessages(RESET_SIM_MESSAGES),
  };
}
