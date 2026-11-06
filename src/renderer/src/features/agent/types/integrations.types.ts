export type AiProvider = 'gemini' | 'deepseek' | 'claude' | 'openai';

export interface AiModelOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  speed: string;
  reasoning: string;
  isRecommended?: boolean;
}

export interface AiConnectionTestResult {
  success: boolean;
  latencyMs?: number;
  modelName?: string;
  sampleReply?: string;
  error?: string;
}

export interface ProviderMeta {
  id: AiProvider;
  name: string;
  badge: string;
  description: string;
  defaultModel: string;
  portalUrl: string;
  portalLabel: string;
  accentColor: string;
}

export { PROVIDER_META_LIST } from './integrations.providers';
export { PROVIDER_MODELS_MAP } from './integrations.models';
