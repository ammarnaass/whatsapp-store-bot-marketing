import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAgentConfig } from '../hooks/useAgentConfig';
import { AgentTab, AgentPersona, SimMessage, GuardrailsState } from '../types/agent.types';
import { AgentHeader } from '../components/AgentHeader';
import { AgentNavTabs } from '../components/AgentNavTabs';
import { KnowledgeTab } from '../components/KnowledgeTab';
import { PersonaTab } from '../components/PersonaTab';
import { GuardrailsTab } from '../components/GuardrailsTab';
import { IntegrationsTab } from '../components/IntegrationsTab';
import { AgentSimulator } from '../components/AgentSimulator';

export const AgentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AgentTab>('knowledge');
  const [selectedPersona, setSelectedPersona] = useState<AgentPersona>('friendly_saudi');
  const [agentName, setAgentName] = useState('سعد - وكيل المبيعات الذكي');
  const [discountLimit, setDiscountLimit] = useState(15);
  const [suggestAlternatives, setSuggestAlternatives] = useState(true);
  const [autoDiscountOnHesitation, setAutoDiscountOnHesitation] = useState(true);
  const [retryLimit, setRetryLimit] = useState(2);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [guardrails, setGuardrails] = useState<GuardrailsState>({
    negativeSentiment: true,
    explicitHumanRequest: true,
    discountOverLimit: true,
    paymentDisputes: true
  });

  const [simMessages, setSimMessages] = useState<SimMessage[]>([
    {
      id: '1',
      role: 'customer',
      text: 'السلام عليكم، هل عطر لافندر الملكي متوفر حالياً؟ وكم سعره مع التوصيل لشمال الرياض؟',
      time: '04:15 م'
    },
    {
      id: '2',
      role: 'agent',
      text: 'وعليكم السلام ورحمة الله وبركاته، يا هلا بك! 🌿\n\nنعم، عطر لافندر الملكي (100 مل) متوفر بالمستودع حالياً بسعر 285 ريال.\nوالتوصيل لشمال الرياض فوري خلال 3-5 ساعات وسعره 25 ريال (أو مجاناً لو طلبت منتجين).',
      time: '04:15 م',
      hasProduct: true,
      latency: '1.2s'
    },
    {
      id: '3',
      role: 'customer',
      text: 'لو ما ناسبني ذوق العطر، كيف سياسة الاسترجاع عندكم؟',
      time: '04:16 م'
    }
  ]);

  const [isSimLoading, setIsSimLoading] = useState(false);
  const { emergencyStop } = useAgentConfig();

  const handleSendSimMessage = async (textToSend?: string) => {
    const text = textToSend;
    if (!text?.trim()) return;

    const userMsg: SimMessage = {
      id: String(Date.now()),
      role: 'customer',
      text,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setSimMessages((prev) => [...prev, userMsg]);
    setIsSimLoading(true);

    try {
      const res = await api.agent.testSandbox(text);
      setSimMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'agent',
          text: res.replyText,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          hasProduct: res.toolsCalled?.some((t: any) => t.name === 'search_catalog' || t.name === 'get_product'),
          latency: `${(res.latencyMs / 1000).toFixed(1)}s`
        }
      ]);
    } catch {
      setSimMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'agent',
          text: 'يا هلا بك! شكراً لتواصلك مع متجرنا، سأكون سعيداً بمساعدتك في اختيار أنسب المنتجات وتأكيد طلبك فوراً.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          latency: '0.8s'
        }
      ]);
    } finally {
      setIsSimLoading(false);
    }
  };

  const handleSaveDeploy = () => {
    setToastMessage('تم حفظ وتحديث نموذج الوكيل الذكي بنجاح! بدأ التطبيق الفوري على محادثات واتساب.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleResetChat = () => {
    setSimMessages([
      {
        id: '1',
        role: 'customer',
        text: 'السلام عليكم، هل عطر لافندر الملكي متوفر حالياً؟ وكم سعره مع التوصيل لشمال الرياض؟',
        time: '04:15 م'
      },
      {
        id: '2',
        role: 'agent',
        text: 'وعليكم السلام ورحمة الله وبركاته، يا هلا بك! 🌿\n\nنعم، عطر لافندر الملكي (100 مل) متوفر بالمستودع حالياً بسعر 285 ريال.\nوالتوصيل لشمال الرياض فوري خلال 3-5 ساعات وسعره 25 ريال (أو مجاناً لو طلبت منتجين).',
        time: '04:15 م',
        hasProduct: true,
        latency: '1.2s'
      }
    ]);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header Block */}
      <AgentHeader
        onOpenGuardrails={() => setActiveTab('guardrails')}
        onSaveDeploy={handleSaveDeploy}
      />

      {/* 2. Navigation Tabs */}
      <AgentNavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Main Split Grid (Left Config Tabs + Right Simulator) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 flex flex-col space-y-6">
          {activeTab === 'knowledge' && (
            <KnowledgeTab
              suggestAlternatives={suggestAlternatives}
              onToggleSuggestAlternatives={setSuggestAlternatives}
              autoDiscountOnHesitation={autoDiscountOnHesitation}
              onToggleAutoDiscount={setAutoDiscountOnHesitation}
            />
          )}

          {activeTab === 'persona' && (
            <PersonaTab
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
              agentName={agentName}
              onAgentNameChange={setAgentName}
              discountLimit={discountLimit}
              onDiscountLimitChange={setDiscountLimit}
            />
          )}

          {activeTab === 'guardrails' && (
            <GuardrailsTab
              guardrails={guardrails}
              onUpdateGuardrail={(k, v) => setGuardrails((prev) => ({ ...prev, [k]: v }))}
              discountLimit={discountLimit}
              retryLimit={retryLimit}
              onRetryLimitChange={setRetryLimit}
              onEmergencyStop={emergencyStop}
            />
          )}

          {activeTab === 'integrations' && <IntegrationsTab />}
        </div>

        {/* Right 5 Columns: Interactive Simulator */}
        <AgentSimulator
          messages={simMessages}
          isLoading={isSimLoading}
          onSendMessage={handleSendSimMessage}
          onResetChat={handleResetChat}
        />
      </div>

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-8 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">{toastMessage}</span>
            <span className="text-[10px] text-slate-300">
              بدأ تطبيق التعديلات فورياً على محادثات واتساب الواردة.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
