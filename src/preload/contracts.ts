import {
  Product,
  Order,
  Conversation,
  Message,
  AgentConfig,
  KnowledgeItem,
  Campaign,
  DashboardKPIs,
  SessionStatus,
} from '../shared/types';

export interface IElectronAPI {
  // Session & WhatsApp
  session: {
    getStatus: () => Promise<{ status: SessionStatus; phone?: string }>;
    start: (sessionName?: string) => Promise<{ success: boolean; message: string; qr?: string }>;
    logout: () => Promise<boolean>;
    onQrCode: (callback: (data: { qrCodeDataUrl: string }) => void) => () => void;
    onStatusChanged: (callback: (data: { status: SessionStatus }) => void) => () => void;
  };

  // Catalog & Products
  catalog: {
    listProducts: () => Promise<Product[]>;
    createProduct: (product: Partial<Product>) => Promise<{ success: boolean; id: string }>;
    importKeys: (productId: string, keys: string[]) => Promise<{ inserted: number }>;
  };

  // Chat & Inbox
  chat: {
    listConversations: () => Promise<Conversation[]>;
    getMessages: (conversationId: string) => Promise<Message[]>;
    sendMessage: (conversationId: string, phone: string, body: string) => Promise<{ success: boolean; id: string }>;
    takeover: (conversationId: string) => Promise<{ success: boolean }>;
    returnToAgent: (conversationId: string) => Promise<{ success: boolean }>;
    onMessageReceived: (callback: (message: any) => void) => () => void;
  };

  // Orders
  orders: {
    list: () => Promise<Order[]>;
    updateStatus: (orderId: string, status: string, trackingNo?: string, trackingUrl?: string) => Promise<{ success: boolean }>;
    createManual: (data: { customerName: string; customerPhone: string; productTitle: string; price: number; notes?: string }) => Promise<{ success: boolean; id: string }>;
  };

  // Customers & CRM
  customers: {
    list: () => Promise<any[]>;
  };

  // AI Agent & Sandbox
  agent: {
    getConfig: () => Promise<AgentConfig>;
    updateConfig: (config: Partial<AgentConfig>) => Promise<{ success: boolean }>;
    emergencyStop: () => Promise<{ stopped: boolean }>;
    testSandbox: (prompt: string) => Promise<{ replyText: string; toolsCalled: any[]; handoffTriggered: boolean; latencyMs: number }>;
    listRuns: () => Promise<any[]>;
  };

  // Knowledge Base
  knowledge: {
    list: () => Promise<KnowledgeItem[]>;
    create: (item: Partial<KnowledgeItem>) => Promise<{ success: boolean; id: string }>;
    delete: (id: string) => Promise<{ success: boolean }>;
  };

  // Campaigns
  campaigns: {
    list: () => Promise<Campaign[]>;
  };

  // Dashboard & Analytics
  analytics: {
    getKPIs: () => Promise<DashboardKPIs>;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
