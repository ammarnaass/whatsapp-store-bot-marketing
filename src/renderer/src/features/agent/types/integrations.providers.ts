import { ProviderMeta } from './integrations.types';

export const PROVIDER_META_LIST: ProviderMeta[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'موصى به لواتساب',
    description: 'محرك جوجل فائق السرعة، استدعاء أدوات المتجر الحي، وأقل تكلفة استهلاك.',
    defaultModel: 'gemini-2.5-flash',
    portalUrl: 'https://aistudio.google.com/apikey',
    portalLabel: 'Google AI Studio',
    accentColor: '#128C7E',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: 'الأعلى اقتصادياً V3 & R1',
    description: 'أقوى نموذج صيني اقتصادي متفوق في البرمجة والاستنتاج واللغة العربية.',
    defaultModel: 'deepseek-chat',
    portalUrl: 'https://platform.deepseek.com/api_keys',
    portalLabel: 'DeepSeek Platform',
    accentColor: '#0284C7',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    badge: 'الأذكى في الاستنتاج',
    description: 'نموذج Claude 3.7 Sonnet الرائد عالمياً في التحليل اللغوي الدقيق وخدمة العملاء.',
    defaultModel: 'claude-3-5-haiku-20241022',
    portalUrl: 'https://console.anthropic.com/settings/keys',
    portalLabel: 'Anthropic Console',
    accentColor: '#D97706',
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o)',
    badge: 'معيار الصناعة العالمي',
    description: 'نماذج GPT-4o و GPT-4o-mini الموثوقة عالمياً لاستجابات متزنة ورصينة.',
    defaultModel: 'gpt-4o-mini',
    portalUrl: 'https://platform.openai.com/api-keys',
    portalLabel: 'OpenAI Platform',
    accentColor: '#10B981',
  },
];
