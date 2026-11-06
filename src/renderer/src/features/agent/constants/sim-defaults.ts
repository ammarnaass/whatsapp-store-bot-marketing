import { SimMessage } from '../types/agent.types';

export const INITIAL_SIM_MESSAGES: SimMessage[] = [
  {
    id: '1',
    role: 'customer',
    text: 'السلام عليكم، هل آيفون 16 برو ماكس متوفر حالياً؟ وكم سعره مع التوصيل؟',
    time: '04:15 م',
  },
  {
    id: '2',
    role: 'agent',
    text: 'وعليكم السلام ورحمة الله وبركاته! يا هلا بك في متجرنا التقني 📱\n\nنعم، هاتف iPhone 16 Pro Max متوفر فوراً بالمستودع بسعر 5,199 ر.س شامل الضريبة والتوصيل مجاني.',
    time: '04:15 م',
    hasProduct: true,
    latency: '0.8s',
  },
];

export const RESET_SIM_MESSAGES: SimMessage[] = [
  {
    id: '1',
    role: 'customer',
    text: 'السلام عليكم، هل بطاقات بلايستيشن الرقمية متوفرة للتسليم الفوري؟',
    time: '04:15 م',
  },
  {
    id: '2',
    role: 'agent',
    text: 'وعليكم السلام ورحمة الله! أهلاً بك 🎮\n\nنعم، تتوفر بطاقات PlayStation Store للتسليم التلقائي الفوري فور إتمام الدفع مع كود التفعيل مباشرة عبر واتساب.',
    time: '04:15 م',
    hasProduct: true,
    latency: '0.7s',
  },
];
