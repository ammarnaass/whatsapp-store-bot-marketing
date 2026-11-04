import { GoogleGenAI } from '@google/genai';
import { UnifiedAIProvider, GenerateContentInput, GenerateContentOutput } from './types';

export class GeminiProvider implements UnifiedAIProvider {
  public id = 'gemini' as const;
  public name = 'Google Gemini';
  public defaultModel = 'gemini-2.5-flash';

  public async testConnection(apiKey: string, modelName?: string) {
    const startTime = Date.now();
    try {
      const client = new GoogleGenAI({ apiKey });
      const model = modelName || this.defaultModel;

      const response: any = await client.models.generateContent({
        model,
        contents: 'فحص اتصال مزود Google Gemini API لمنصة WaSell.',
      });

      const sample = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'تم الاتصال بنجاح';
      return {
        success: true,
        latencyMs: Date.now() - startTime,
        sampleReply: sample.slice(0, 80),
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        error: err?.message || 'فشل الاتصال بـ Google Gemini API',
      };
    }
  }

  public async generateResponse(input: GenerateContentInput): Promise<GenerateContentOutput> {
    const startTime = Date.now();
    const client = new GoogleGenAI({ apiKey: input.apiKey });

    const contents: any[] = [];
    if (input.history && input.history.length > 0) {
      for (const turn of input.history) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: input.userMessage }],
    });

    const response: any = await client.models.generateContent({
      model: input.modelName || this.defaultModel,
      contents,
      config: {
        systemInstruction: input.systemPrompt,
        temperature: 0.3,
      },
    });

    const candidate = response?.candidates?.[0];
    const textPart = candidate?.content?.parts?.find((p: any) => p.text);
    const replyText = textPart?.text || 'أهلاً بك، كيف يمكنني مساعدتك في متجرنا اليوم؟';

    return {
      replyText,
      toolsCalled: [],
      latencyMs: Date.now() - startTime,
    };
  }
}

