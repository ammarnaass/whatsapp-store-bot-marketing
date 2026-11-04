import { UnifiedAIProvider, GenerateContentInput, GenerateContentOutput } from './types';

export class DeepSeekProvider implements UnifiedAIProvider {
  public id = 'deepseek' as const;
  public name = 'DeepSeek';
  public defaultModel = 'deepseek-chat';
  private endpoint = 'https://api.deepseek.com/v1/chat/completions';

  public async testConnection(apiKey: string, modelName?: string) {
    const startTime = Date.now();
    try {
      const model = modelName || this.defaultModel;
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'فحص اتصال مزود DeepSeek API لمنصة WaSell.' }],
          max_tokens: 30,
        }),
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as any;
        throw new Error(errorData?.error?.message || `خطأ HTTP ${res.status}: فشل الاتصال بخادم DeepSeek`);
      }

      const data = (await res.json()) as any;
      const sample = data?.choices?.[0]?.message?.content || 'تم الاتصال بنجاح';

      return {
        success: true,
        latencyMs: Date.now() - startTime,
        sampleReply: sample.slice(0, 80),
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        error: err?.message || 'فشل الاتصال بـ DeepSeek API',
      };
    }
  }

  public async generateResponse(input: GenerateContentInput): Promise<GenerateContentOutput> {
    const startTime = Date.now();
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: input.systemPrompt },
    ];

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
        Authorization: `Bearer ${input.apiKey}`,
      },
      body: JSON.stringify({
        model: input.modelName || this.defaultModel,
        messages,
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => ({}))) as any;
      throw new Error(errJson?.error?.message || `فشل استدعاء DeepSeek: HTTP ${res.status}`);
    }

    const data = (await res.json()) as any;
    const replyText = data?.choices?.[0]?.message?.content || 'أهلاً بك! كيف يمكنني خدمتك اليوم؟';

    return {
      replyText,
      toolsCalled: [],
      latencyMs: Date.now() - startTime,
    };
  }
}

