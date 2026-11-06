import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useAgentPage } from '../hooks/useAgentPage';
import { useAgentConfig } from '../hooks/useAgentConfig';
import { AgentHeader } from '../components/AgentHeader';
import { AgentNavTabs } from '../components/AgentNavTabs';
import { KnowledgeTab } from '../components/KnowledgeTab';
import { PersonaTab } from '../components/PersonaTab';
import { GuardrailsTab } from '../components/GuardrailsTab';
import { IntegrationsTab } from '../components/IntegrationsTab';
import { AgentSimulator } from '../components/AgentSimulator';

export const AgentPage: React.FC = () => {
  const {
    activeTab, setActiveTab, selectedPersona, setSelectedPersona,
    agentName, setAgentName, discountLimit, setDiscountLimit,
    suggestAlternatives, setSuggestAlternatives,
    autoDiscountOnHesitation, setAutoDiscountOnHesitation,
    retryLimit, setRetryLimit, guardrails, setGuardrails,
    simMessages, isSimLoading, showToast, toastMessage,
    handleSaveDeploy, handleSendSimMessage, handleResetChat,
  } = useAgentPage();

  const { emergencyStop } = useAgentConfig();

  return (
    <div className="flex flex-col w-full space-y-6">
      <AgentHeader onOpenGuardrails={() => setActiveTab('guardrails')} onSaveDeploy={handleSaveDeploy} />
      <AgentNavTabs activeTab={activeTab} onTabChange={setActiveTab} />

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

        <AgentSimulator
          messages={simMessages}
          isLoading={isSimLoading}
          onSendMessage={handleSendSimMessage}
          onResetChat={handleResetChat}
        />
      </div>

      {showToast && (
        <div className="fixed bottom-6 left-8 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">{toastMessage}</span>
            <span className="text-[10px] text-slate-300">بدأ تطبيق التعديلات فورياً على محادثات واتساب.</span>
          </div>
        </div>
      )}
    </div>
  );
};
