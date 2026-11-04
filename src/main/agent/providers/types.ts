export type AIProviderId = 'gemini' | 'deepseek' | 'claude' | 'openai';

export interface GenerateContentInput {
  apiKey: string;
  modelName: string;
  systemPrompt: string;
  userMessage: string;
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
  tools?: any[];
}

export interface GenerateContentOutput {
  replyText: string;
  toolsCalled: Array<{ name: string; args: any }>;
  latencyMs: number;
}

export interface UnifiedAIProvider {
  id: AIProviderId;
  name: string;
  defaultModel: string;
  testConnection(
    apiKey: string,
    modelName?: string
  ): Promise<{
    success: boolean;
    latencyMs: number;
    sampleReply?: string;
    error?: string;
  }>;
  generateResponse(input: GenerateContentInput): Promise<GenerateContentOutput>;
}

