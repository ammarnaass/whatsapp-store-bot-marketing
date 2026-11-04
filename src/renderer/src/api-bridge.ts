import { IElectronAPI } from '../../preload/contracts';
import { Product, Order, Conversation, Message, AgentConfig, KnowledgeItem, Campaign, DashboardKPIs } from '../../shared/types';

// بيانات تجريبية افتراضية للمتصفح أو وضع الاختبار
let mockProducts: Product[] = [
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

let mockOrders: Order[] = [
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

let mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    session_id: 'default',
    contact_id: 'cnt_1',
    contact: { id: 'cnt_1', phone: '+966551234567', name: 'عبدالله السعيد', tags: ['مهتم بالسماعات'], opted_out: false, memory_summary: 'يفضل اللون الأسود، استفسر عن عزل الضوضاء واشترى سماعة Pro', source: 'WHATSAPP', created_at: '' },
    handler: 'agent',
    state: 'open',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 600000).toISOString(),
    last_message_body: 'تم استلام رابط الدفع وسأقوم بالسداد حالاً، شكراً لك!',
    created_at: new Date().toISOString(),
  },
  {
    id: 'conv_2',
    session_id: 'default',
    contact_id: 'cnt_3',
    contact: { id: 'cnt_3', phone: '+966504445555', name: 'سارة خالد', tags: [], opted_out: false, memory_summary: 'طلبت التحدث مع موظف بخصوص شحنة متأخرة', source: 'WHATSAPP', created_at: '' },
    handler: 'human',
    state: 'waiting_human',
    unread_count: 2,
    last_message_at: new Date(Date.now() - 120000).toISOString(),
    last_message_body: 'لو سمحت متى توصل الشحنة؟ محتاجاها ضروري اليوم',
    created_at: new Date().toISOString(),
  },
];

let mockMessages: Record<string, Message[]> = {
  conv_1: [
    { id: 'm1', conversation_id: 'conv_1', direction: 'INBOUND', type: 'text', body: 'مرحباً، عندكم سماعات بلوتوث ممتازة؟', status: 'READ', ts: '10:30 ص' },
    { id: 'm2', conversation_id: 'conv_1', direction: 'OUTBOUND', type: 'text', body: 'أهلاً بك أستاذ عبدالله! نعم، متوفر لدينا سماعة بلوتوث لاسلكية Pro بعزل ضوضاء ANC وبطارية 36 ساعة بسعر 45$ فقط (شحن مجاني اليوم). هل تفضل اللون الأسود الملكي أم الأبيض؟', status: 'READ', ts: '10:31 ص' },
    { id: 'm3', conversation_id: 'conv_1', direction: 'INBOUND', type: 'text', body: 'أبي اللون الأسود لو تكرمت. كيف أطلب؟', status: 'READ', ts: '10:33 ص' },
    { id: 'm4', conversation_id: 'conv_1', direction: 'OUTBOUND', type: 'text', body: 'ممتاز! تم حجز اللون الأسود لك. يرجى تزويدنا بمدينتك وعنوان التوصيل وسأصدر لك رابط الدفع المباشر فوراً.', status: 'READ', ts: '10:33 ص' },
    { id: 'm5', conversation_id: 'conv_1', direction: 'INBOUND', type: 'text', body: 'الرياض - حي الياسمين - شارع القادسية', status: 'READ', ts: '10:35 ص' },
    { id: 'm6', conversation_id: 'conv_1', direction: 'OUTBOUND', type: 'text', body: 'تم تسجيل طلبك #ORD-9842 بنجاح!\nالإجمالي: 45$ (الشحن مجاني للرياض).\nرابط الدفع المباشر:\nhttps://checkout.mystore.com/pay/ORD-9842', status: 'SENT', ts: '10:35 ص' },
  ],
  conv_2: [
    { id: 'm20', conversation_id: 'conv_2', direction: 'INBOUND', type: 'text', body: 'لو سمحت متى توصل الشحنة؟ محتاجاها ضروري اليوم', status: 'DELIVERED', ts: '11:15 ص' },
  ],
};

let mockAgentConfig: AgentConfig = {
  id: 'default',
  persona_name: 'مساعد المتجر الذكي',
  tone: 'friendly',
  languages: ['ar', 'en'],
  system_instructions: 'أنت موظف مبيعات وخدمة عملاء ذكي في المتجر. تحدث بالعربية الفصحى المبسطة مع فهم كامل لكل اللهجات العربية. هدفك خدمة العميل وتقديم المنتجات بدقة، لا تقدم أي خصم إضافي غير معتمد في المتجر. إذا غضب العميل أو طلب التحدث مع موظف بشري قم بتحويله فوراً.',
  max_discount_percent: 0.0, // 0% صارم وفق رغبة المستخدم
  max_order_amount_auto: 200.0,
  daily_cost_limit: 10.0,
  provider: 'gemini',
  model_name: 'gemini-3.8-flash',
  created_at: '',
  updated_at: '',
};

let mockKnowledge: KnowledgeItem[] = [
  { id: 'kb_1', title: 'سياسة الشحن والتوصيل', category: 'shipping', content: 'الشحن متوفر لجميع المدن. التوصيل خلال 24-48 ساعة داخل العاصمة وباقي المدن من 2-4 أيام عمل. الشحن مجاني للطلبات فوق 50$.', source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' },
  { id: 'kb_2', title: 'سياسة الاسترجاع والاستبدال', category: 'return_policy', content: 'المنتجات الفيزيائية قابلة للإرجاع خلال 14 يوماً بحالتها الأصلية. التراخيص الرقمية غير قابلة للاسترجاع بعد استلام المفتاح.', source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' },
  { id: 'kb_3', title: 'طرق الدفع المعتمدة', category: 'faq', content: 'الدفع بروابط دفع إلكترونية آمنة، والتحويل البنكي المباشر، والدفع عند الاستلام للمنتجات الفيزيائية.', source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' },
];

let mockCampaigns: Campaign[] = [
  { id: 'camp_1', name: 'عرض نهاية الأسبوع: شحن مجاني لسماعات Pro', template: 'أهلاً بك {الاسم}! استمتع بشحن مجاني وضمان سنتين على سماعات Pro اللاسلكية بنهاية هذا الأسبوع فقط. للطلب رد على هذه الرسالة أو اكتب "سماعة". للإلغاء اكتب "إيقاف".', status: 'RUNNING', min_delay_sec: 20, max_delay_sec: 45, daily_limit: 200, recipients_count: 140, sent_count: 85, delivered_count: 81, created_at: new Date().toISOString() },
];

// الجسر الذكي
export const api: IElectronAPI = (typeof window !== 'undefined' && window.electronAPI)
  ? window.electronAPI
  : {
      session: {
        getStatus: async () => ({ status: 'CONNECTED', phone: '+966500000000' }),
        start: async () => ({ success: true, message: 'جلسة متصلة' }),
        logout: async () => true,
        onQrCode: () => () => {},
        onStatusChanged: () => () => {},
      },
      catalog: {
        listProducts: async () => [...mockProducts],
        createProduct: async (p) => {
          const newP = { ...p, id: `prod_${Date.now()}`, active: true, created_at: new Date().toISOString() } as Product;
          mockProducts.unshift(newP);
          return { success: true, id: newP.id };
        },
        importKeys: async (_id, keys) => ({ inserted: keys.length }),
      },
      chat: {
        listConversations: async () => [...mockConversations],
        getMessages: async (id) => mockMessages[id] || [],
        sendMessage: async (convId, _phone, body) => {
          const newMsg: Message = { id: `m_${Date.now()}`, conversation_id: convId, direction: 'OUTBOUND', type: 'text', body, status: 'SENT', ts: 'الآن' };
          if (!mockMessages[convId]) mockMessages[convId] = [];
          mockMessages[convId].push(newMsg);
          return { success: true, id: newMsg.id };
        },
        takeover: async (convId) => {
          const conv = mockConversations.find((c) => c.id === convId);
          if (conv) { conv.handler = 'human'; conv.state = 'waiting_human'; }
          return { success: true };
        },
        returnToAgent: async (convId) => {
          const conv = mockConversations.find((c) => c.id === convId);
          if (conv) { conv.handler = 'agent'; conv.state = 'open'; }
          return { success: true };
        },
        onMessageReceived: () => () => {},
      },
      orders: {
        list: async () => [...mockOrders],
        updateStatus: async (id, status) => {
          const ord = mockOrders.find((o) => o.id === id);
          if (ord) ord.status = status as any;
          return { success: true };
        },
        createManual: async (data) => {
          const newOrd: Order = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            contact_id: `cnt_${Date.now()}`,
            contact: { id: `cnt_${Date.now()}`, phone: data.customerPhone, name: data.customerName, tags: [], opted_out: false, source: 'WHATSAPP', created_at: '' },
            source: 'human',
            status: 'CONFIRMED',
            payment_method: 'PAYMENT_LINK',
            payment_status: 'PAID',
            subtotal: data.price,
            discount_amount: 0,
            shipping_fee: 0,
            total: data.price,
            notes: data.notes || '',
            created_at: new Date().toISOString(),
            items: [{ id: `item_${Date.now()}`, order_id: '', product_name: data.productTitle, variant_desc: 'طلب يدوي', qty: 1, unit_price: data.price }],
          };
          mockOrders.unshift(newOrd);
          return { success: true, id: newOrd.id };
        },
      },
      customers: {
        list: async () => [
          {
            id: 'cnt_1',
            name: 'عبدالله السعيد',
            phone: '+966551234567',
            city: 'الرياض',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            segment: 'vip',
            segmentLabel: 'عميل VIP',
            tags: ['VIP', 'مهتم بالسماعات'],
            totalSpend: 135,
            ordersCount: 2,
            lastActive: 'منذ ساعتين',
            aiSummary: 'يفضل اللون الأسود، استفسر عن عزل الضوضاء واشترى سماعة Pro',
            buyingPropensity: 92,
          },
          {
            id: 'cnt_2',
            name: 'محمد النعيمي',
            phone: '+971509876543',
            city: 'دبي',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            segment: 'all',
            segmentLabel: 'نشط على واتساب',
            tags: ['تراخيص برمجية'],
            totalSpend: 29,
            ordersCount: 1,
            lastActive: 'منذ 5 ساعات',
            aiSummary: 'اشترى ترخيص برنامج المبيعات',
            buyingPropensity: 75,
          },
        ],
      },
      agent: {
        getConfig: async () => ({ ...mockAgentConfig }),
        updateConfig: async (cfg) => {
          mockAgentConfig = { ...mockAgentConfig, ...cfg };
          return { success: true };
        },
        emergencyStop: async () => {
          mockConversations.forEach((c) => { c.handler = 'human'; c.state = 'waiting_human'; });
          return { stopped: true };
        },
        testSandbox: async (prompt) => {
          const lower = prompt.toLowerCase();
          if (lower.includes('خصم') || lower.includes('discount')) {
            return {
              replyText: 'سياسة المتجر الصارمة تمنع تقديم أي خصم إضافي غير معتمد في الكتالوج (الحد الأقصى للوكيل: 0%). يمكنك الاستفادة من أسعارنا الحالية المميزة والشحن المجاني للطلبات فوق 50$!',
              toolsCalled: [{ name: 'validate_discount', args: { requested: 15 }, result: { allowed: false, reason: 'سياسة 0% خصم مطبقة' } }],
              handoffTriggered: false,
              latencyMs: 380,
            };
          }
          if (lower.includes('سماعة') || lower.includes('سماعات')) {
            return {
              replyText: 'متوفر لدينا سماعة بلوتوث لاسلكية Pro بعزل ضوضاء نشط ANC بسعر 45$ فقط باللونين الأسود والأبيض. هل تود أن أحجز لك قطعة منها الآن؟',
              toolsCalled: [{ name: 'search_catalog', args: { query: 'سماعات' }, result: { count: 1, available: true } }],
              handoffTriggered: false,
              latencyMs: 420,
            };
          }
          return {
            replyText: `أهلاً بك! أنا ${mockAgentConfig.persona_name}، كيف يمكنني مساعدتك في منتجاتنا أو تتبع طلبك اليوم؟`,
            toolsCalled: [],
            handoffTriggered: false,
            latencyMs: 310,
          };
        },
        listRuns: async () => [],
      },
      knowledge: {
        list: async () => [...mockKnowledge],
        create: async (item) => {
          const newKb = { ...item, id: `kb_${Date.now()}`, source: 'OWNER_INPUT', active: true, created_at: '', updated_at: '' } as KnowledgeItem;
          mockKnowledge.unshift(newKb);
          return { success: true, id: newKb.id };
        },
        delete: async (id) => {
          mockKnowledge = mockKnowledge.filter((k) => k.id !== id);
          return { success: true };
        },
      },
      campaigns: {
        list: async () => [...mockCampaigns],
      },
      analytics: {
        getKPIs: async (): Promise<DashboardKPIs> => ({
          totalRevenue: 2840,
          totalOrders: 42,
          agentHandledOrders: 31,
          agentHandledPercentage: 74,
          activeConversations: 8,
          waitingHumanCount: 1,
          campaignsActive: 1,
          lowStockItemsCount: 2,
        }),
      },
    };
