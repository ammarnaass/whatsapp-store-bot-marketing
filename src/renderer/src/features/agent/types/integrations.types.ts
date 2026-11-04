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

export const PROVIDER_MODELS_MAP: Record<AiProvider, AiModelOption[]> = {
  gemini: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      tag: 'موصى به للتجارة الإلكترونية',
      description: 'الأنسب للرد السريع على العملاء في واتساب واستدعاء أدوات المتجر بأقل تكلفة.',
      speed: '< 0.8s',
      reasoning: 'دقيق وعالي الكفاءة',
      isRecommended: true,
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      tag: 'الاستنتاج المعقد والدعم الفني',
      description: 'قدرات استنتاج استثنائية لمطابقة المنتجات المعقدة وحل استفسارات العملاء المتقدمة.',
      speed: '~ 1.6s',
      reasoning: 'أعلى مستوى استنتاج',
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      tag: 'الجيل الأحدث فائق التطور',
      description: 'إصدار الجيل القادم لزمن استجابة قياسي وفهم عميق للهجات العربية المتنوعة.',
      speed: '< 0.6s',
      reasoning: 'استجابة فائقة السرعة',
    },
  ],
  deepseek: [
    {
      id: 'deepseek-chat',
      name: 'DeepSeek-V3',
      tag: 'أعلى قيمة اقتصادية بالعالم',
      description: 'نموذج محادثة متطور ومنافس لأكبر النماذج العالمية بتكلفة شبه معدومة.',
      speed: '< 1.1s',
      reasoning: 'استنتاج ممتاز وعربي فصيح',
      isRecommended: true,
    },
    {
      id: 'deepseek-reasoner',
      name: 'DeepSeek-R1 (Thinking)',
      tag: 'التفكير المنطقي المتعمق',
      description: 'نموذج التفكير المنطقي المعقد لسلاسل الإمداد ومقارنة الفواتير والسياسات الصعبة.',
      speed: '~ 2.8s',
      reasoning: 'تفكير متسلسل عميق (CoT)',
    },
  ],
  claude: [
    {
      id: 'claude-3-7-sonnet-20250219',
      name: 'Claude 3.7 Sonnet',
      tag: 'النموذج الأقوى في العالم حالياً',
      description: 'الذكاء الهجين فائق القدرة على التفكير السريع والعميق، الأفضل في صياغة الرسائل.',
      speed: '~ 1.4s',
      reasoning: 'أذكى نموذج لغوي متاح',
      isRecommended: true,
    },
    {
      id: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      tag: 'أداء متوازن فائق الموثوقية',
      description: 'معيار الجودة في خدمة العملاء وصياغة العروض التسويقية دون أخطاء لغوية.',
      speed: '~ 1.2s',
      reasoning: 'دقة فائقة في اللغة العربية',
    },
    {
      id: 'claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      tag: 'السرعة والخفة العالية',
      description: 'أسرع نماذج عائلة كلود للرد الفوري على استفسارات الأسعار والمخزون.',
      speed: '< 0.8s',
      reasoning: 'خفيف وذكي',
    },
  ],
  openai: [
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      tag: 'موصى به للمحادثات السريعة',
      description: 'نموذج خفيف وسريع وذكي مخصص للمحادثات الكثيفة وخدمة العملاء الآلية.',
      speed: '< 0.9s',
      reasoning: 'سريع واقتصادي',
      isRecommended: true,
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o (Omni)',
      tag: 'النموذج الرئيسي الرائد',
      description: 'قدرات متقدمة في الفهم المنطقي وتحليل نصوص العملاء وحل الشكاوى.',
      speed: '~ 1.5s',
      reasoning: 'استنتاج متعدد الجوانب',
    },
    {
      id: 'o3-mini',
      name: 'OpenAI o3-mini',
      tag: 'الاستنتاج العلمي السريع',
      description: 'نموذج التفكير الجديد المتخصص في الحسابات والأرقام وجرد المخزون.',
      speed: '~ 2.2s',
      reasoning: 'استنتاج حسابي عالي',
    },
  ],
};
