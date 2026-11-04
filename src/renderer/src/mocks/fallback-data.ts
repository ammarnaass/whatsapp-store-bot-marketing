import { Product, Order, Conversation, Message, AgentConfig, KnowledgeItem, Campaign } from '../../shared/types';

export const fallbackProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'سماعة بلوتوث لاسلكية عازلة للضوضاء Pro',
    type: 'physical',
    description: 'سماعات احترافية تدعم ميزة إلغاء الضوضاء النشط ANC مع بطارية تدوم 36 ساعة ومقاومة للماء IPX5.',
    media: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    category: 'إلكترونيات',
    active: true,
    created_at: new Date().toISOString(),
    variants: [
      { id: 'var_1', product_id: 'prod_1', sku: 'HP-PRO-BLK', options: { 'اللون': 'أسود ملكي' }, price: 45, currency: 'USD', stock_qty: 25, reserved_qty: 0 },
      { id: 'var_2', product_id: 'prod_1', sku: 'HP-PRO-WHT', options: { 'اللون': 'أبيض لؤلؤي' }, price: 45, currency: 'USD', stock_qty: 18, reserved_qty: 0 },
    ],
  },
  {
    id: 'prod_2',
    name: 'ترخيص برنامج إدارة المبيعات الاحترافي (سنة واحدة)',
    type: 'digital',
    description: 'نسخة رقمية رسمية تتضمن ترخيصاً سنوياً كاملاً مع التحديثات والدعم الفني، تسليم المفتاح فوري داخل المحادثة.',
    media: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'],
    category: 'برمجيات وتراخيص',
    active: true,
    created_at: new Date().toISOString(),
    variants: [
      { id: 'var_3', product_id: 'prod_2', sku: 'SW-PRO-1Y', options: { 'الخطة': 'اشتراك سنوي' }, price: 29, currency: 'USD', stock_qty: 99, reserved_qty: 0 },
    ],
  },
];

export const fallbackOrders: Order[] = [
  {
    id: 'ORD-9842',
    contact_id: 'cnt_1',
    contact: { id: 'cnt_1', phone: '+966551234567', name: 'عبدالله السعيد', tags: ['VIP'], opted_out: false, source: 'WHATSAPP', created_at: '' },
    source: 'agent',
    status: 'CONFIRMED',
    payment_method: 'PAYMENT_LINK',
    payment_status: 'PAID',
    subtotal: 45,
    discount_amount: 0,
    shipping_fee: 0,
    total: 45,
    notes: 'توصيل في الفترة المسائية',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [{ id: 'item_1', order_id: 'ORD-9842', product_name: 'سماعة بلوتوث Pro', variant_desc: 'أسود ملكي', qty: 1, unit_price: 45 }],
  },
  {
    id: 'ORD-9841',
    contact_id: 'cnt_2',
    contact: { id: 'cnt_2', phone: '+971509876543', name: 'محمد النعيمي', tags: [], opted_out: false, source: 'WHATSAPP', created_at: '' },
    source: 'agent',
    status: 'DELIVERED',
    payment_method: 'PAYMENT_LINK',
    payment_status: 'PAID',
    subtotal: 29,
    discount_amount: 0,
    shipping_fee: 0,
    total: 29,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [{ id: 'item_2', order_id: 'ORD-9841', product_name: 'ترخيص برنامج المبيعات', variant_desc: 'اشتراك سنوي', qty: 1, unit_price: 29 }],
  },
];

export const fallbackConversations: Conversation[] = [];

export const fallbackMessages: Record<string, Message[]> = {};

export const fallbackAgentConfig: AgentConfig = {
  id: 'default',
  persona_name: 'مساعد المتجر الذكي',
  tone: 'friendly',
  languages: ['ar', 'en'],
  system_instructions: 'أنت موظف مبيعات وخدمة عملاء ذكي في المتجر. تحدث بالعربية الفصحى المبسطة مع فهم كامل لكل اللهجات العربية. هدفك خدمة العميل وتقديم المنتجات بدقة، لا تقدم أي خصم إضافي غير معتمد في المتجر. إذا غضب العميل أو طلب التحدث مع موظف بشري قم بتحويله فوراً.',
  max_discount_percent: 0.0,
  max_order_amount_auto: 200.0,
  daily_cost_limit: 10.0,
  provider: 'gemini',
  model_name: 'gemini-3.8-flash',
  created_at: '',
  updated_at: '',
};

export const fallbackKnowledge: KnowledgeItem[] = [
  { id: 'kb_1', title: 'سياسة الشحن والتوصيل', category: 'shipping', content: 'الشحن متوفر لجميع المدن. التوصيل خلال 24-48 ساعة داخل العاصمة وباقي المدن من 2-4 أيام عمل. الشحن مجاني للطلبات فوق 50$.', source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' },
  { id: 'kb_2', title: 'سياسة الاسترجاع والاستبدال', category: 'return_policy', content: 'المنتجات الفيزيائية قابلة للإرجاع خلال 14 يوماً بحالتها الأصلية. التراخيص الرقمية غير قابلة للاسترجاع بعد استلام المفتاح.', source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' },
  { id: 'kb_3', title: 'طرق الدفع المعتمدة', category: 'faq', content: 'الدفع بروابط دفع إلكترونية آمنة، والتحويل البنكي المباشر، والدفع عند الاستلام للمنتجات الفيزيائية.', source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' },
];

export const fallbackCampaigns: Campaign[] = [
  { id: 'camp_1', name: 'عرض نهاية الأسبوع: شحن مجاني لسماعات Pro', template: 'أهلاً بك {الاسم}! استمتع بشحن مجاني وضمان سنتين على سماعات Pro اللاسلكية بنهاية هذا الأسبوع فقط. للطلب رد على هذه الرسالة أو اكتب "سماعة". للإلغاء اكتب "إيقاف".', status: 'RUNNING', min_delay_sec: 20, max_delay_sec: 45, daily_limit: 200, recipients_count: 140, sent_count: 85, delivered_count: 81, created_at: new Date().toISOString() },
];

