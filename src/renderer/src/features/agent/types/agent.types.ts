export type AgentTab = 'knowledge' | 'persona' | 'guardrails' | 'integrations';

export type AgentPersona = 'friendly_saudi' | 'formal' | 'expert_trader';

export interface SimMessage {
  id: string;
  role: 'customer' | 'agent';
  text: string;
  time: string;
  hasProduct?: boolean;
  latency?: string;
}

export interface GuardrailsState {
  negativeSentiment: boolean;
  explicitHumanRequest: boolean;
  discountOverLimit: boolean;
  paymentDisputes: boolean;
}
