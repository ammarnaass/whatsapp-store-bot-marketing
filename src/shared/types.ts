/**
 * الأنواع والواجهات المشتركة للنظام بالكامل (Shared Types & Contracts)
 * تستخدم بين Electron Main و Preload Script و React Renderer
 */

// 1. الجلسات والاتصال بواتساب
export type SessionStatus = 'CONNECTED' | 'DISCONNECTED' | 'QR_READY' | 'STARTING' | 'SCAN_QR' | 'WORKING' | 'STOPPED' | 'FAILED';
export type ChannelProviderType = 'meta_cloud' | 'openwa_gateway' | 'hybrid';
export type AgentMode = 'AUTONOMOUS' | 'SEMI_AUTONOMOUS' | 'SUGGESTIVE' | 'DISABLED';

export interface Session {
  id: string;
  name: string;
  phone?: string;
  status: SessionStatus;
  proxy?: string;
  agent_mode: AgentMode;
  created_at: string;
}

// 2. جهات الاتصال وسجل العملاء
export interface Contact {
  id: string;
  phone: string;
  name?: string;
  tags: string[]; // JSON parsed array
  opted_out: boolean;
  address_json?: string;
  memory_summary?: string; // ملخص تفضيلات وسجل العميل للوكيل الذكي
  source: string;
  created_at: string;
}

// 3. المحادثات وصندوق الوارد
export type ConversationHandler = 'agent' | 'flow' | 'human';
export type ConversationState = 'open' | 'waiting_human' | 'closed';

export interface Conversation {
  id: string;
  session_id: string;
  contact_id: string;
  contact?: Contact;
  handler: ConversationHandler;
  state: ConversationState;
  assignee?: string;
  unread_count: number;
  last_message_at?: string;
  last_message_body?: string;
  created_at: string;
}

// 4. الرسائل
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'button_response';
export type MessageDeliveryStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface Message {
  id: string;
  conversation_id: string;
  direction: MessageDirection;
  type: MessageType;
  body?: string;
  media_path?: string;
  status: MessageDeliveryStatus;
  ts: string;
}

// 5. الكتالوج والمنتجات
export type ProductType = 'physical' | 'digital';

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  options: Record<string, string>; // e.g. {"color": "أزرق", "size": "XL"}
  price: number;
  currency: string;
  stock_qty: number;
  reserved_qty: number;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description?: string;
  media: string[]; // Array of image URLs/paths
  category?: string;
  active: boolean;
  variants?: ProductVariant[];
  created_at: string;
}

// 6. الأصول الرقمية ومفاتيح التراخيص
export interface DigitalAsset {
  id: string;
  product_id: string;
  plan: string;
  file_path?: string;
  download_url_template?: string;
}

export interface LicenseKey {
  id: string;
  product_id: string;
  key_code: string;
  status: 'available' | 'sold' | 'revoked';
  order_id?: string;
  sold_at?: string;
}

// 7. الشحن ومناطق التوصيل
export interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  fee: number;
  free_over?: number;
}

// 8. الطلبات والدفع
export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type PaymentMethod = 'PAYMENT_LINK' | 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';
export type OrderSource = 'agent' | 'flow' | 'human';

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id?: string;
  product_name: string;
  variant_desc?: string;
  qty: number;
  unit_price: number;
}

export interface Order {
  id: string;
  contact_id: string;
  contact?: Contact;
  source: OrderSource;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_link?: string;
  payment_status: PaymentStatus;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
}

// 9. الكوبونات
export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  expires_at?: string;
  max_uses: number;
  times_used: number;
}

// 10. إعدادات وكيل الذكاء الاصطناعي (Agent Configuration)
export interface AgentConfig {
  id: string;
  persona_name: string;
  tone: 'formal' | 'friendly' | 'sales_focused';
  languages: string[];
  system_instructions: string;
  max_discount_percent: number; // 0% افتراضياً وفق تفضيل المالك
  max_order_amount_auto: number;
  daily_cost_limit: number;
  provider: 'gemini' | 'openai' | 'ollama';
  model_name: string;
  api_key?: string; // مُخزن بأمان
  created_at: string;
  updated_at: string;
}

// 11. بنك المعرفة (Knowledge Base)
export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'faq' | 'shipping' | 'return_policy' | 'product_guide' | 'general';
  content: string;
  source: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// 12. سجل قرارات وتشغيل الوكيل (Agent Runs & Review)
export interface AgentRun {
  id: string;
  conversation_id: string;
  user_input: string;
  context_used_json?: string;
  tools_called_json?: string;
  agent_output: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_estimate: number;
  latency_ms: number;
  confidence_score?: number;
  ts: string;
}

export interface AgentReview {
  id: string;
  run_id: string;
  rating: 'GOOD' | 'BAD';
  correction_text?: string;
  applied_to_kb: boolean;
  reviewed_by?: string;
  reviewed_at: string;
}

// 13. الحملات التسويقية
export type CampaignStatus = 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface Campaign {
  id: string;
  name: string;
  template: string;
  media_path?: string;
  status: CampaignStatus;
  scheduled_at?: string;
  min_delay_sec: number;
  max_delay_sec: number;
  daily_limit: number;
  recipients_count?: number;
  sent_count?: number;
  delivered_count?: number;
  created_at: string;
}

// 14. قائمة الحظر والانسحاب
export interface BlocklistEntry {
  phone: string;
  reason: string;
  added_at: string;
}

// 15. مؤشرات لوحة التحكم (Analytics KPI Summary)
export interface DashboardKPIs {
  totalRevenue: number;
  totalOrders: number;
  agentHandledOrders: number;
  agentHandledPercentage: number;
  activeConversations: number;
  waitingHumanCount: number;
  campaignsActive: number;
  lowStockItemsCount: number;
}
