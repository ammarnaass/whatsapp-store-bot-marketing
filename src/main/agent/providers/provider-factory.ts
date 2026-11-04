import { AIProviderId, UnifiedAIProvider } from './types';
import { GeminiProvider } from './gemini.provider';
import { DeepSeekProvider } from './deepseek.provider';
import { ClaudeProvider } from './claude.provider';
import { OpenAIProvider } from './openai.provider';

export class AIProviderFactory {
  private static providers: Map<AIProviderId, UnifiedAIProvider> = new Map([
    ['gemini', new GeminiProvider()],
    ['deepseek', new DeepSeekProvider()],
    ['claude', new ClaudeProvider()],
    ['openai', new OpenAIProvider()],
  ]);

  public static getProvider(providerId?: string): UnifiedAIProvider {
    const normalized = (providerId || 'gemini').toLowerCase() as AIProviderId;
    return this.providers.get(normalized) || this.providers.get('gemini')!;
  }

  public static getAllProviders(): UnifiedAIProvider[] {
    return Array.from(this.providers.values());
  }
}

