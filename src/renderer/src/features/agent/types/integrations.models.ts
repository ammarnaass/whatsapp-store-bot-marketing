import { AiProvider, AiModelOption } from './integrations.types';

export const PROVIDER_MODELS_MAP: Record<AiProvider, AiModelOption[]> = {
  gemini: [
    {
      id: 'gemini-3.5-flash-lite',
      name: 'Gemini 3.5 Flash Lite',
      tag: 'الأعلى رصيداً وموصى به (500 طلب/يوم)',
      description: 'أعلى رصيد مجاني نشط لحسابك (500 طلب يومياً و 250 ألف رمز)، فائق السرعة وخفيف للرد على العملاء.',
      speed: '< 0.7s',
      reasoning: 'استجابة فائقة السرعة وأعلى رصيد',
      isRecommended: true,
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      tag: 'رصيد عالي واحتياطي قوي (500 طلب/يوم)',
      description: 'خيار إضافي برصيد وفير (500 طلب يومياً) لضمان استمرارية الردود التلقائية دون أي توقف.',
      speed: '< 0.8s',
      reasoning: 'ثبات عالي واستجابة فورية',
    },
    {
      id: 'gemini-3.6-flash',
      name: 'Gemini 3.6 Flash',
      tag: 'الجيل المتطور عالي الدقة',
      description: 'إصدار فلاش الحديث لفهم عميق للهجات العربية وتفاصيل منتجات المتجر بدقة استثنائية.',
      speed: '< 0.9s',
      reasoning: 'دقيق وعالي الكفاءة',
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      tag: 'الجيل الأحدث 3.8',
      description: 'أحدث محركات فلاش لخدمة العملاء والاستنتاج الذكي في التجارة الإلكترونية.',
      speed: '< 0.9s',
      reasoning: 'أحدث قدرات الاستنتاج',
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

