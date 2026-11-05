import {
  Product,
  Category,
  Collection,
  CollectionFormData,
  Order,
  Conversation,
  Message,
  AgentConfig,
  KnowledgeItem,
  KnowledgeStats,
  KnowledgeRetrievalTestResult,
  Campaign,
  CampaignRecipient,
  Coupon,
  BlocklistEntry,
  DashboardKPIs,
  SessionStatus,
  TelegramConfig,
  TelegramBotInfo,
  TelegramStatusResult,
  TelegramSendOptions,
} from '../shared/types';

export interface IElectronAPI {
  // Session & WhatsApp
  session: {
    getStatus: () => Promise<{ status: SessionStatus; phone?: string }>;
    start: (sessionName?: string) => Promise<{ success: boolean; message: string; qr?: string; isOfflineDemo?: boolean }>;
    logout: () => Promise<boolean>;
    simulatePair?: (phone?: string) => Promise<{ success: boolean; phone: string }>;
    getPairingCode?: (phone: string) => Promise<{ success: boolean; code?: string; message?: string }>;
    onQrCode: (callback: (data: { qrCodeDataUrl: string; isOfflineDemo?: boolean }) => void) => () => void;
    onStatusChanged: (callback: (data: { status: SessionStatus; phone?: string }) => void) => () => void;
  };

  // Catalog & Products
  catalog: {
    listProducts: () => Promise<Product[]>;
    getProduct?: (params: { id: string }) => Promise<any>;
    createProduct: (product: Partial<Product>) => Promise<{ success: boolean; id: string }>;
    updateProduct?: (product: any) => Promise<{ success: boolean }>;
    deleteProduct?: (params: { id: string }) => Promise<{ success: boolean }>;
    toggleAi?: (params: { id: string; active: boolean }) => Promise<{ success: boolean }>;
    importKeys: (productId: string, keys: string[]) => Promise<{ inserted: number }>;
  };

  // Categories & Product Classification
  categories: {
    listCategories: () => Promise<Category[]>;
    getCategory?: (params: { id: string }) => Promise<Category | null>;
    createCategory: (data: Partial<Category>) => Promise<{ success: boolean; id: string }>;
    updateCategory: (data: Partial<Category>) => Promise<{ success: boolean }>;
    deleteCategory: (params: { id: string; reassignToId?: string }) => Promise<{ success: boolean }>;
    reorderCategories: (ids: string[]) => Promise<{ success: boolean }>;
  };

  // Collections & Marketing Curations
  collections: {
    list: () => Promise<Collection[]>;
    get: (params: { id: string }) => Promise<(Collection & { product_ids: string[] }) | null>;
    create: (data: CollectionFormData) => Promise<{ success: boolean; id: string }>;
    update: (data: Partial<Collection> & { id: string; product_ids?: string[] }) => Promise<{ success: boolean }>;
    delete: (params: { id: string }) => Promise<{ success: boolean }>;
    assignProducts: (params: { collectionId: string; productIds: string[] }) => Promise<{ success: boolean }>;
    getProducts: (params: { collectionId: string }) => Promise<Product[]>;
  };

  // Smart Inventory
  inventory: {
    getStockSummary: () => Promise<{
      totalSkus: number;
      totalQuantity: number;
      reservedQuantity: number;
      availableQuantity: number;
      lowStockCount: number;
      outOfStockCount: number;
    }>;
    adjustStock: (data: {
      variantId: string;
      changeQty: number;
      reason: string;
      orderId?: string;
      createdBy?: string;
    }) => Promise<{ success: boolean; quantityBefore: number; quantityAfter: number }>;
    getLogs: (params?: { variantId?: string; limit?: number }) => Promise<any[]>;
    getLicenseKeys: (params: { productId: string }) => Promise<any[]>;
    addLicenseKeys: (params: { productId: string; keys: string[] }) => Promise<{ success: boolean; count: number }>;
  };

  // Chat & Inbox
  chat: {
    listConversations: () => Promise<Conversation[]>;
    getMessages: (conversationId: string) => Promise<Message[]>;
    sendMessage: (conversationId: string, phone: string, body: string) => Promise<{ success: boolean; id: string }>;
    takeover: (conversationId: string) => Promise<{ success: boolean }>;
    returnToAgent: (conversationId: string) => Promise<{ success: boolean }>;
    syncConversations: () => Promise<{ success: boolean; count: number; error?: string }>;
    onMessageReceived: (callback: (message: any) => void) => () => void;
  };

  // Orders
  orders: {
    list: () => Promise<Order[]>;
    getDetails?: (params: { orderId: string }) => Promise<any>;
    updateStatus: (orderId: string, status: string, trackingNo?: string, trackingUrl?: string) => Promise<{ success: boolean }>;
    createManual: (data: { customerName: string; customerPhone: string; productTitle: string; price: number; notes?: string }) => Promise<{ success: boolean; id: string }>;
    cancel?: (params: { orderId: string; reason?: string }) => Promise<{ success: boolean }>;
  };

  // Shipping & Logistics
  shipping: {
    listShipments: () => Promise<any[]>;
    createShipment: (data: { orderId: string; carrier?: string; trackingNo?: string; trackingUrl?: string; customerPhone?: string; address?: any }) => Promise<{ success: boolean; id: string; trackingNo: string; trackingUrl: string }>;
    updateStatus: (params: { shipmentId: string; status: string }) => Promise<{ success: boolean }>;
    listZones: () => Promise<any[]>;
    saveZone: (data: { id?: string; name: string; cities: string[]; fee: number; freeOver?: number }) => Promise<{ success: boolean; id: string }>;
    deleteZone: (params: { id: string }) => Promise<{ success: boolean }>;
  };

  // Customers & CRM
  customers: {
    list: () => Promise<any[]>;
    get: (params: { phone?: string; contactId?: string }) => Promise<any>;
    updateNotes: (contactId: string, notes: string) => Promise<{ success: boolean }>;
    updateTags: (contactId: string, tags: string[]) => Promise<{ success: boolean }>;
  };

  // AI Agent & Sandbox
  agent: {
    getConfig: () => Promise<AgentConfig>;
    updateConfig: (config: Partial<AgentConfig>) => Promise<{ success: boolean }>;
    testApiConnection: (params?: { apiKey?: string; modelName?: string; provider?: string }) => Promise<{
      success: boolean;
      latencyMs?: number;
      modelName?: string;
      sampleReply?: string;
      error?: string;
    }>;
    emergencyStop: () => Promise<{ stopped: boolean }>;
    testSandbox: (prompt: string) => Promise<{ replyText: string; toolsCalled: any[]; handoffTriggered: boolean; latencyMs: number }>;
    listRuns: () => Promise<any[]>;
  };

  // Knowledge Base & Catalog
  knowledge: {
    list: (filters?: { category?: string; source_type?: string; search?: string }) => Promise<KnowledgeItem[]>;
    get?: (params: { id: string }) => Promise<KnowledgeItem | null>;
    create: (item: Partial<KnowledgeItem>) => Promise<{ success: boolean; id: string }>;
    update?: (item: Partial<KnowledgeItem>) => Promise<{ success: boolean }>;
    delete: (id: string) => Promise<{ success: boolean }>;
    toggleActive?: (params: { id: string; active: boolean }) => Promise<{ success: boolean }>;
    getStats?: () => Promise<KnowledgeStats>;
    testRetrieval?: (params: { query: string }) => Promise<KnowledgeRetrievalTestResult>;
  };

  // Authentication & Account Management
  auth: {
    login: (credentials: { email: string; password: string; rememberMe?: boolean; deviceName?: string }) => Promise<{ success: boolean; user?: any; sessionToken?: string; error?: string }>;
    register: (data: { email: string; name: string; password: string; phone?: string; storeName?: string; deviceName?: string }) => Promise<{ success: boolean; user?: any; sessionToken?: string; error?: string }>;
    getCurrentUser: (params?: { userId?: string }) => Promise<any>;
    updateProfile: (data: { userId: string; name?: string; phone?: string; avatar?: string }) => Promise<{ success: boolean; user?: any; error?: string }>;
    changePassword: (data: { userId: string; oldPassword: string; newPassword: string }) => Promise<{ success: boolean; error?: string }>;
    listUsers: () => Promise<any[]>;
    createUser: (data: { email: string; name: string; password: string; role?: string; phone?: string }) => Promise<{ success: boolean; id?: string; error?: string }>;
    deleteUser: (params: { userId: string }) => Promise<{ success: boolean; error?: string }>;
    validateSession: (params: { sessionToken: string }) => Promise<{ valid: boolean; user?: any; sessionToken?: string; error?: string }>;
    logout: (params: { sessionToken?: string }) => Promise<{ success: boolean }>;
    checkHasUsers: () => Promise<{ hasUsers: boolean; count: number }>;
    listSessions: (params: { userId: string; currentToken?: string }) => Promise<any[]>;
    revokeSession: (params: { sessionToken: string }) => Promise<{ success: boolean }>;
    revokeAllSessions: (params: { userId: string; keepCurrentToken?: string }) => Promise<{ success: boolean }>;
  };

  // Campaigns
  campaigns: {
    list: () => Promise<Campaign[]>;
    create: (data: any) => Promise<{ success: boolean; campaignId?: string; recipientsCount?: number; error?: string }>;
    control: (id: string, action: 'START' | 'PAUSE' | 'CANCEL') => Promise<{ success: boolean; status?: string; error?: string }>;
    delete: (id: string) => Promise<{ success: boolean; error?: string }>;
    getRecipients: (campaignId: string) => Promise<CampaignRecipient[]>;
    estimateAudience: (filter?: any) => Promise<{ count: number }>;
  };

  // Coupons
  coupons: {
    list: () => Promise<Coupon[]>;
    create: (data: any) => Promise<{ success: boolean; id?: string; error?: string }>;
    toggle: (id: string, is_active: number) => Promise<{ success: boolean; error?: string }>;
    delete: (id: string) => Promise<{ success: boolean; error?: string }>;
    validate: (code: string, order_amount: number) => Promise<{ valid: boolean; discount?: number; coupon?: Coupon; message?: string }>;
  };

  // Blocklist
  blocklist: {
    list: () => Promise<BlocklistEntry[]>;
    add: (phone: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
    remove: (phone: string) => Promise<{ success: boolean; error?: string }>;
  };

  // Dashboard & Analytics
  analytics: {
    getKPIs: () => Promise<DashboardKPIs>;
    getSummary: (period?: string) => Promise<any>;
    getFunnel: (period?: string) => Promise<any[]>;
    getIntelligence: (period?: string) => Promise<any>;
    getPeakHours: () => Promise<any>;
    getInsights: () => Promise<any[]>;
  };

  // Store & App Settings
  settings: {
    getStoreSettings: () => Promise<any>;
    saveStoreSettings: (settings: any) => Promise<{ success: boolean; error?: string }>;
    resetDefaults: () => Promise<{ success: boolean; settings: any; error?: string }>;
    createBackup: () => Promise<{ success: boolean; record?: any; error?: string }>;
    listBackups: () => Promise<any[]>;
    deleteBackup: (params: { filename: string }) => Promise<{ success: boolean; error?: string }>;
  };

  // Telegram Bot Gateway
  telegram: {
    getConfig: () => Promise<TelegramConfig | null>;
    saveConfig: (data: Partial<TelegramConfig>) => Promise<{ success: boolean }>;
    testToken: (token: string) => Promise<{ success: boolean; botInfo?: TelegramBotInfo; error?: string }>;
    start: (token?: string) => Promise<{ success: boolean; error?: string }>;
    stop: () => Promise<{ success: boolean }>;
    getStatus: () => Promise<TelegramStatusResult>;
    sendMessage: (options: TelegramSendOptions) => Promise<{ success: boolean; messageId?: number; error?: string }>;
    onMessageReceived: (callback: (data: any) => void) => () => void;
  };

  // Channels & WhatsApp Cloud API
  channels: {
    getConfig: () => Promise<any>;
    saveConfig: (config: any) => Promise<{ success: boolean }>;
    setActiveProvider: (provider: string) => Promise<{ success: boolean; activeProvider: string }>;
    testCloudApi: (params: { phoneNumberId: string; accessToken: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
    testWebhook: () => Promise<{ success: boolean; data?: any; error?: string }>;
    getWebhookLogs: () => Promise<any[]>;
  };

  // Window Controls & Fullscreen
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    unmaximize: () => Promise<void>;
    toggleMaximize: () => Promise<boolean>;
    isMaximized: () => Promise<boolean>;
    toggleFullscreen: () => Promise<boolean>;
    isFullScreen: () => Promise<boolean>;
    close: () => Promise<void>;
    onStateChanged: (callback: (state: { isMaximized: boolean; isFullScreen: boolean }) => void) => () => void;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
