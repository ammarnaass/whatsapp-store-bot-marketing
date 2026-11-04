import { create } from 'zustand';
import { api } from '../../../api-bridge';
import {
  DataSection,
  CatalogProduct,
  OrderItem,
  CustomerItem,
  ChatItem,
  WebhookLog,
  HsmTemplate
} from '../types/data-management.types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_CHATS,
  INITIAL_WEBHOOK_LOGS,
  INITIAL_TEMPLATES
} from '../mock-data';

const STORAGE_KEY = 'wasell_data_mode_v1';

export interface DashboardKPIState {
  revenue: number;
  ordersCount: number;
  activeChats: number;
  automationRate: number;
}

const DEFAULT_KPIS: DashboardKPIState = {
  revenue: 14850,
  ordersCount: 42,
  activeChats: 8,
  automationRate: 84
};

const EMPTY_KPIS: DashboardKPIState = {
  revenue: 0,
  ordersCount: 0,
  activeChats: 0,
  automationRate: 0
};

// ==========================================
// Mappers: من صيغة الـ SQLite / IPC إلى صيغة الواجهة
// ==========================================

function mapBackendProductToCatalogProduct(p: any): CatalogProduct {
  const firstVariant = p.variants?.[0];
  const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock_qty || 0), 0) ?? 0;
  return {
    id: p.id,
    name: p.name,
    sku: firstVariant?.sku || `SKU-${String(p.id).slice(-4)}`,
    category: p.category || 'عام',
    type: p.type || 'physical',
    price: firstVariant?.price || 0,
    stock: totalStock,
    image: (p.media && p.media.length > 0) ? p.media[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    aiRecommended: Boolean(p.active),
    salesCount: 0,
    conversionRate: 100,
    description: p.description || '',
    digitalKeysAvailable: p.type === 'digital' ? totalStock : undefined,
  };
}

function mapBackendOrderToOrderItem(o: any): OrderItem {
  const items = (o.items || []).map((it: any) => ({
    title: it.product_name || 'منتج',
    qty: it.qty || 1,
    price: it.unit_price || 0,
    icon: '📦',
  }));

  const paymentStatusMap: Record<string, 'paid' | 'pending' | 'failed'> = {
    PAID: 'paid',
    PENDING: 'pending',
    REFUNDED: 'failed',
  };

  const fulfillmentMap: Record<string, { status: 'new' | 'confirmed' | 'preparing' | 'shipped' | 'delivered'; label: string }> = {
    NEW: { status: 'new', label: 'طلب جديد' },
    CONFIRMED: { status: 'confirmed', label: 'مؤكد وجاهز للتجهيز' },
    PROCESSING: { status: 'preparing', label: 'جارٍ التجهيز' },
    SHIPPED: { status: 'shipped', label: 'تم الشحن' },
    DELIVERED: { status: 'delivered', label: 'تم التسليم بنجاح' },
    CANCELLED: { status: 'new', label: 'ملغي' },
  };

  const fulfillment = fulfillmentMap[o.status] || { status: 'new', label: o.status };

  return {
    id: o.id,
    orderNumber: String(o.id).startsWith('#') ? o.id : `#${o.id}`,
    customerName: o.contact?.name || 'عميل واتساب',
    customerPhone: o.contact?.phone || '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    items,
    source: o.source === 'agent' ? 'ai' : 'human',
    sourceLabel: o.source === 'agent' ? 'وكيل واتساب الذكي' : 'طلب يدوي',
    paymentMethod: o.payment_method === 'COD' ? 'cod' : 'apple_pay',
    paymentMethodLabel: o.payment_method === 'COD' ? 'الدفع عند الاستلام' : 'رابط دفع إلكتروني',
    paymentStatus: paymentStatusMap[o.payment_status] || 'pending',
    fulfillmentStatus: fulfillment.status,
    fulfillmentStatusLabel: fulfillment.label,
    total: o.total || 0,
    timeAgo: o.created_at ? new Date(o.created_at).toLocaleDateString('ar-SA') : 'الآن',
    city: 'الرياض',
  };
}

function mapBackendConversationToChatItem(c: any): ChatItem {
  return {
    id: c.id,
    name: c.contact?.name || c.contact?.phone || 'محادثة عميل',
    phone: c.contact?.phone || '',
    avatar: c.contact?.avatar || '',
    time: c.last_message_at
      ? new Date(c.last_message_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      : 'الآن',
    lastMessage: c.last_message_body || 'بدء المحادثة',
    isAi: c.handler === 'agent',
    needsHuman: c.state === 'waiting_human' || c.handler === 'human',
    isVip: c.contact?.tags?.includes('VIP') || false,
    tag: c.contact?.tags?.[0] || 'عميل واتساب',
  };
}

export interface DataState {
  isMockDataActive: boolean;
  isLoading: boolean;
  products: CatalogProduct[];
  orders: OrderItem[];
  customers: CustomerItem[];
  chats: ChatItem[];
  webhookLogs: WebhookLog[];
  templates: HsmTemplate[];
  kpis: DashboardKPIState;

  // Global Actions & Hydration
  hydrateFromApi: () => Promise<void>;
  clearAllMockData: () => Promise<void>;
  seedAllMockData: () => Promise<void>;

  // Granular Actions
  clearSection: (section: DataSection) => void;
  seedSection: (section: DataSection) => void;

  // Setters & Synced Operations
  setProducts: (items: CatalogProduct[] | ((prev: CatalogProduct[]) => CatalogProduct[])) => void;
  setOrders: (items: OrderItem[] | ((prev: OrderItem[]) => OrderItem[])) => void;
  setCustomers: (items: CustomerItem[] | ((prev: CustomerItem[]) => CustomerItem[])) => void;
  setChats: (items: ChatItem[] | ((prev: ChatItem[]) => ChatItem[])) => void;

  // Real-time Event Hook
  handleLiveMessageReceived: (data: { id: string; conversationId: string; phone: string; body: string; direction: string }) => void;
}

const getStoredPreference = (): boolean => {
  return false;
};

const initialIsActive = getStoredPreference();

export const useDataStore = create<DataState>((set, get) => ({
  isMockDataActive: initialIsActive,
  isLoading: false,
  products: [],
  orders: [],
  customers: [],
  chats: [],
  webhookLogs: [],
  templates: [],
  kpis: EMPTY_KPIS,

  hydrateFromApi: async () => {
    const isMock = get().isMockDataActive;
    set({ isLoading: true });
    try {
      const [rawProducts, rawOrders, rawCustomers, rawChats, rawKpis] = await Promise.all([
        api.catalog.listProducts().catch(() => []),
        api.orders.list().catch(() => []),
        api.customers.list().catch(() => []),
        api.chat.listConversations().catch(() => []),
        api.analytics.getKPIs().catch(() => null),
      ]);

      set({
        products: isMock && rawProducts.length === 0 ? [...INITIAL_PRODUCTS] : rawProducts.map(mapBackendProductToCatalogProduct),
        orders: isMock && rawOrders.length === 0 ? [...INITIAL_ORDERS] : rawOrders.map(mapBackendOrderToOrderItem),
        customers: (rawCustomers && rawCustomers.length > 0) ? rawCustomers : (isMock ? [...INITIAL_CUSTOMERS] : []),
        chats: rawChats.map(mapBackendConversationToChatItem),
        kpis: rawKpis
          ? {
              revenue: rawKpis.totalRevenue,
              ordersCount: rawKpis.totalOrders,
              activeChats: rawKpis.activeConversations || rawChats.length,
              automationRate: rawKpis.agentHandledPercentage,
            }
          : (isMock ? DEFAULT_KPIS : EMPTY_KPIS),
      });
    } catch (err) {
      console.error('[useDataStore] Failed to hydrate from API:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  clearAllMockData: async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'real');
    }
    set({ isMockDataActive: false });
    await get().hydrateFromApi();
  },

  seedAllMockData: async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'mock');
    }
    set({ isMockDataActive: true });
    await get().hydrateFromApi();
  },

  clearSection: (section) => {
    set((state) => {
      const updates: Partial<DataState> = {};
      if (section === 'products') updates.products = [];
      if (section === 'orders') updates.orders = [];
      if (section === 'customers') updates.customers = [];
      if (section === 'chats') updates.chats = [];
      if (section === 'channels') {
        updates.webhookLogs = [];
        updates.templates = [];
      }
      return updates;
    });
  },

  seedSection: (section) => {
    set((state) => {
      const updates: Partial<DataState> = {};
      if (section === 'products') updates.products = [...INITIAL_PRODUCTS];
      if (section === 'orders') updates.orders = [...INITIAL_ORDERS];
      if (section === 'customers') updates.customers = [...INITIAL_CUSTOMERS];
      if (section === 'chats') updates.chats = [...INITIAL_CHATS];
      if (section === 'channels') {
        updates.webhookLogs = [...INITIAL_WEBHOOK_LOGS];
        updates.templates = [...INITIAL_TEMPLATES];
      }
      return updates;
    });
  },

  setProducts: (updater) =>
    set((state) => ({ products: typeof updater === 'function' ? updater(state.products) : updater })),
  setOrders: (updater) =>
    set((state) => ({ orders: typeof updater === 'function' ? updater(state.orders) : updater })),
  setCustomers: (updater) =>
    set((state) => ({ customers: typeof updater === 'function' ? updater(state.customers) : updater })),
  setChats: (updater) =>
    set((state) => ({ chats: typeof updater === 'function' ? updater(state.chats) : updater })),

  handleLiveMessageReceived: (data) => {
    set((state) => {
      const cleanDataPhone = data.phone ? data.phone.replace(/\D/g, '') : '';
      const existingIndex = state.chats.findIndex(
        (c) => c.id === data.conversationId || (cleanDataPhone && c.phone && c.phone.replace(/\D/g, '') === cleanDataPhone)
      );
      const nowTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

      if (existingIndex >= 0) {
        const current = state.chats[existingIndex];
        const updatedChat: ChatItem = {
          ...current,
          lastMessage: data.body,
          time: nowTime,
        };
        // رفع المحادثة فوراً إلى أعلى القائمة
        const remainingChats = state.chats.filter((_, idx) => idx !== existingIndex);
        return { chats: [updatedChat, ...remainingChats] };
      }

      // إضافة محادثة جديدة فوراً في مقدمة القائمة
      const newChat: ChatItem = {
        id: data.conversationId,
        name: `عميل واتساب (${data.phone})`,
        phone: data.phone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        time: nowTime,
        lastMessage: data.body,
        isAi: true,
        needsHuman: false,
        tag: 'رسالة جديدة',
      };
      return { chats: [newChat, ...state.chats] };
    });
  },
}));
