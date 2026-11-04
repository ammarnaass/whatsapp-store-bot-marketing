import { ChatItem } from '../types/data-management.types';

export const INITIAL_CHATS: ChatItem[] = [
  {
    id: 'c1',
    name: 'سلطان الشمري',
    phone: '+966 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    time: 'منذ دقيقتين',
    lastMessage: 'أرسلت لك كود خصم إضافي (SA15) على باقة العطور...',
    isAi: true,
    needsHuman: false,
    isVip: true,
    badge: 'عميل VIP',
    tag: 'الوكيل يتفاوض',
    cartValue: 560,
    sentiment: 92
  },
  {
    id: 'c2',
    name: 'نورة القحطاني',
    phone: '+966 54 999 8877',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    time: 'منذ 5 د',
    lastMessage: 'طلبت استرجاع المنتج لوصوله متأخراً عن موعد المناسبة',
    isAi: false,
    needsHuman: true,
    badge: 'تدخل بشري عاجل',
    tag: 'غضب من التوصيل',
    sentiment: 24
  },
  {
    id: 'c3',
    name: 'ريما الصالح',
    phone: '+966 55 222 3344',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    time: 'منذ 14 د',
    lastMessage: 'تم تأكيد الدفع بنجاح عبر Apple Pay وتم إصدار البوليصة',
    isAi: true,
    needsHuman: false,
    badge: 'تم الدفع',
    tag: 'طلب #9421',
    cartValue: 890,
    sentiment: 98
  },
  {
    id: 'c4',
    name: 'فيصل العتيبي',
    phone: '+966 56 444 1122',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    time: 'منذ 28 د',
    lastMessage: 'الوكيل الذكي: مرحباً فيصل، لاحظنا أنك تركت ساعتك المفضلة...',
    isAi: true,
    needsHuman: false,
    badge: 'استرجاع سلة',
    tag: 'سلة متروكة',
    cartValue: 420,
    sentiment: 65
  },
  {
    id: 'c5',
    name: 'محمد الدوسري',
    phone: '+966 50 777 5566',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    time: 'منذ 42 د',
    lastMessage: 'هل تتوفر مقاسات أكبر من عبوة 100 مل للعود الملكي؟',
    isAi: true,
    needsHuman: false,
    badge: 'استفسار كتالوج',
    tag: 'ذكاء اصطناعي نشط',
    sentiment: 80
  }
];
