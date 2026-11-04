import { UnifiedAIProvider, GenerateContentInput, GenerateContentOutput } from './types';

export class ClaudeProvider implements UnifiedAIProvider {
  public id = 'claude' as const;
  public name = 'Anthropic Claude';
  public defaultModel = 'claude-3-5-haiku-20241022';
  private endpoint = 'https://api.anthropic.com/v1/messages';

  public async testConnection(apiKey: string, modelName?: string) {
    const startTime = Date.now();
    try {
      const model = modelName || this.defaultModel;
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 30,
          messages: [{ role: 'user', content: 'فحص اتصال مزود Anthropic Claude API لمنصة WaSell.' }],
        }),
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as any;
        throw new Error(errJson?.error?.message || `خطأ HTTP ${res.status}: فشل الاتصال بخادم Claude`);
      }

      const data = (await res.json()) as any;
      const sample = data?.content?.[0]?.text || 'تم الاتصال بنجاح';

      return {
        success: true,
        latencyMs: Date.now() - startTime,
        sampleReply: sample.slice(0, 80),
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        error: err?.message || 'فشل الاتصال بـ Anthropic Claude API',
      };
    }
  }

  public async generateResponse(input: GenerateContentInput): Promise<GenerateContentOutput> {
    const startTime = Date.now();
    const messages: Array<{ role: string; content: string }> = [];

    if (input.history && input.history.length > 0) {
      for (const turn of input.history) {
        messages.push({
          role: turn.role === 'assistant' ? 'assistant' : 'user',
          content: turn.text,
        });
      }
    }
    messages.push({ role: 'user', content: input.userMessage });

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': input.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: input.modelName || this.defaultModel,
        system: input.systemPrompt,
        messages,
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => ({}))) as any;
      throw new Error(errJson?.error?.message || `فشل استدعاء Claude: HTTP ${res.status}`);
    }

    const data = (await res.json()) as any;
    const replyText = data?.content?.[0]?.text || 'أهلاً بك! كيف يمكنني مساعدتك في المتجر اليوم؟';

    return {
      replyText,
      toolsCalled: [],
      latencyMs: Date.now() - startTime,
    };
  }
}

