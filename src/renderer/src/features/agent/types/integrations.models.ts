import { AiProvider, AiModelOption } from './integrations.types';

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
      description: 'قدرات استنتاج استثنائية لمطابقة المنتجات وحل استفسارات العملاء المتقدمة.',
      speed: '~ 1.6s',
      reasoning: 'أعلى مستوى استنتاج',
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      tag: 'فائق السرعة وخفة الاستجابة',
      description: 'الجيل الثاني السريع جداً لمعالجة المحادثات الفورية في أجزاء من الثانية.',
      speed: '< 0.5s',
      reasoning: 'استجابة فائقة السرعة',
    },
  ],
  deepseek: [
    {
      id: 'deepseek-chat',
      name: 'DeepSeek-V3',
      tag: 'أعلى قيمة اقتصادية بالعالم',
      description: 'نموذج محادثة متطور ومنافس لأكبر النماذج بتكلفة شبه معدومة.',
      speed: '< 1.1s',
      reasoning: 'استنتاج ممتاز وعربي فصيح',
      isRecommended: true,
    },
    {
      id: 'deepseek-reasoner',
      name: 'DeepSeek-R1 (Thinking)',
      tag: 'التفكير المنطقي المتعمق',
      description: 'نموذج التفكير المنطقي لسلاسل الإمداد ومقارنة الفواتير والسياسات.',
      speed: '~ 2.8s',
      reasoning: 'تفكير متسلسل عميق (CoT)',
    },
  ],
  claude: [
    {
      id: 'claude-3-7-sonnet-20250219',
      name: 'Claude 3.7 Sonnet',
      tag: 'النموذج الأقوى في العالم',
      description: 'الذكاء الهجين فائق القدرة على التفكير السريع والعميق وصياغة الرسائل.',
      speed: '~ 1.4s',
      reasoning: 'أذكى نموذج لغوي متاح',
      isRecommended: true,
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
      description: 'قدرات متقدمة في الفهم وتحليل نصوص العملاء وحل الشكاوى.',
      speed: '~ 1.5s',
      reasoning: 'استنتاج متعدد الجوانب',
    },
  ],
};

