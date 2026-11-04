import { OrderItem } from '../types/data-management.types';

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord_1',
    orderNumber: '#ORD-9421',
    customerName: 'سلطان الشمري',
    customerPhone: '+966 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    items: [
      { title: 'عطر العود الملكي (100ml)', qty: 1, price: 380, icon: '🌿' },
      { title: 'مخلط العود النادر الصغير', qty: 1, price: 180, icon: '🧴' }
    ],
    source: 'ai',
    sourceLabel: 'إغلاق آلي بـ WaSell AI',
    paymentMethod: 'apple_pay',
    paymentMethodLabel: 'Apple Pay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'confirmed',
    fulfillmentStatusLabel: 'مؤكد وجاهز للتجهيز',
    total: 476,
    timeAgo: 'منذ 8 دقائق',
    city: 'الرياض',
    carrier: 'سمسا SMSA',
    trackingNumber: 'SMSA-98241029'
  },
  {
    id: 'ord_2',
    orderNumber: '#ORD-9420',
    customerName: 'ريما الصالح',
    customerPhone: '+966 55 222 3344',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    items: [
      { title: 'ساعة ذكية ألترا بريميوم', qty: 1, price: 890, icon: '⌚' }
    ],
    source: 'ai',
    sourceLabel: 'إغلاق آلي بـ WaSell AI',
    paymentMethod: 'mada',
    paymentMethodLabel: 'مدى Mada',
    paymentStatus: 'paid',
    fulfillmentStatus: 'preparing',
    fulfillmentStatusLabel: 'قيد التجهيز بالمستودع',
    total: 890,
    timeAgo: 'منذ 24 دقيقة',
    city: 'الرياض',
    carrier: 'أرامكس Aramex',
    trackingNumber: 'ARX-55102938'
  },
  {
    id: 'ord_3',
    orderNumber: '#ORD-9419',
    customerName: 'محمد الدوسري',
    customerPhone: '+966 50 777 5566',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    items: [
      { title: 'سماعات بلوتوث عازلة للضوضاء', qty: 1, price: 420, icon: '🎧' },
      { title: 'شاحن جداري سريع 65W', qty: 1, price: 110, icon: '🔌' }
    ],
    source: 'human',
    sourceLabel: 'تدخل موظف بشري',
    paymentMethod: 'tamara',
    paymentMethodLabel: 'تمارا (قسمها على 4)',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    fulfillmentStatusLabel: 'تم الشحن مع المندوب',
    total: 530,
    timeAgo: 'منذ ساعة',
    city: 'الخبر',
    carrier: 'سمسا SMSA',
    trackingNumber: 'SMSA-77332211'
  },
  {
    id: 'ord_4',
    orderNumber: '#ORD-9418',
    customerName: 'فيصل العتيبي',
    customerPhone: '+966 56 444 1122',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    items: [
      { title: 'بكج الحماية المتكامل للهاتف', qty: 2, price: 140, icon: '📱' }
    ],
    source: 'ai',
    sourceLabel: 'سلة مسترجعة بـ AI',
    paymentMethod: 'apple_pay',
    paymentMethodLabel: 'Apple Pay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'new',
    fulfillmentStatusLabel: 'طلب جديد',
    total: 280,
    timeAgo: 'منذ ساعتين',
    city: 'الدمام'
  },
  {
    id: 'ord_5',
    orderNumber: '#ORD-9417',
    customerName: 'فاطمة الشهري',
    customerPhone: '+966 53 111 9988',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    items: [
      { title: 'باقة هدايا العود الفاخرة المخصصة', qty: 1, price: 1250, icon: '🎁' }
    ],
    source: 'ai',
    sourceLabel: 'إغلاق آلي بـ WaSell AI',
    paymentMethod: 'mada',
    paymentMethodLabel: 'مدى Mada',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    fulfillmentStatusLabel: 'تم التسليم بنجاح',
    total: 1250,
    timeAgo: 'منذ 3 ساعات',
    city: 'أبها',
    carrier: 'سمسا SMSA',
    trackingNumber: 'SMSA-11009988'
  }
];
