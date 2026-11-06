import { GoogleGenAI } from '@google/genai';
import { UnifiedAIProvider, GenerateContentInput, GenerateContentOutput } from './types';

function formatGeminiError(err: any): string {
  const raw = err?.message || String(err || '');
  if (raw.includes('API_KEY_INVALID') || raw.includes('API key not valid')) {
    return 'مفتاح API غير صالح. يرجى التأكد من نسخه بدقة من Google AI Studio (يبدأ بـ AQ... أو AIzaSy...).';
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429') || raw.includes('quota')) {
    return 'تم تجاوز حد الاستخدام المسموح به لمفتاح API (Quota Exceeded). يرجى مراجعة Google AI Studio.';
  }
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.includes('high demand')) {
    return 'النموذج يواجه ضغطاً مؤقتاً في خوادم Google، يرجى المحاولة بعد لحظات أو استخدام Gemini 3.5 Flash.';
  }
  if (raw.includes('NOT_FOUND') || raw.includes('not found') || raw.includes('404')) {
    return 'النموذج المحدد غير متاح. يرجى استخدام Gemini 3.5 Flash.';
  }
  if (raw.includes('fetch failed') || raw.includes('ENOTFOUND') || raw.includes('ECONNREFUSED')) {
    return 'تعذر الاتصال بخوادم Google. يرجى التحقق من الاتصال بالإنترنت.';
  }
  return raw.length > 150 ? raw.slice(0, 150) + '...' : raw;
}

export class GeminiProvider implements UnifiedAIProvider {
  public id = 'gemini' as const;
  public name = 'Google Gemini';
  public defaultModel = 'gemini-3.5-flash-lite';

  private normalizeModel(modelName?: string): string {
    if (!modelName || modelName === 'gemini-2.5-flash' || modelName === 'gemini-3-flash') {
      return this.defaultModel;
    }
    return modelName;
  }

  public async testConnection(apiKey: string, modelName?: string) {
    const startTime = Date.now();
    const client = new GoogleGenAI({ apiKey: apiKey.trim() });
    const model = this.normalizeModel(modelName);

    try {
      const response: any = await client.models.generateContent({
        model,
        contents: 'فحص اتصال مزود Google Gemini API لمنصة WaSell.',
      });
      const sample = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'تم الاتصال بنجاح';
      return { success: true, latencyMs: Date.now() - startTime, sampleReply: sample.slice(0, 80) };
    } catch (err: any) {
      if (model !== this.defaultModel) {
        try {
          const fbRes: any = await client.models.generateContent({
            model: this.defaultModel,
            contents: 'فحص اتصال مزود Google Gemini API لمنصة WaSell.',
          });
          const sample = fbRes?.candidates?.[0]?.content?.parts?.[0]?.text || 'تم الاتصال بنجاح';
          return { success: true, latencyMs: Date.now() - startTime, sampleReply: sample.slice(0, 80), modelName: this.defaultModel };
        } catch {}
      }
      return { success: false, latencyMs: Date.now() - startTime, error: formatGeminiError(err) };
    }
  }

  public async generateResponse(input: GenerateContentInput): Promise<GenerateContentOutput> {
    const startTime = Date.now();
    const client = new GoogleGenAI({ apiKey: input.apiKey.trim() });
    let model = this.normalizeModel(input.modelName);

    const contents: any[] = [];
    if (input.history && input.history.length > 0) {
      for (const turn of input.history) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: input.userMessage }] });

    let response: any;
    try {
      response = await client.models.generateContent({
        model,
        contents,
        config: { systemInstruction: input.systemPrompt, temperature: 0.3 },
      });
    } catch {
      response = await client.models.generateContent({
        model: this.defaultModel,
        contents,
        config: { systemInstruction: input.systemPrompt, temperature: 0.3 },
      });
    }

    const candidate = response?.candidates?.[0];
    const textPart = candidate?.content?.parts?.find((p: any) => p.text);
    const replyText = textPart?.text || 'أهلاً بك، كيف يمكنني مساعدتك في متجرنا اليوم؟';

    return { replyText, toolsCalled: [], latencyMs: Date.now() - startTime };
  }
}
