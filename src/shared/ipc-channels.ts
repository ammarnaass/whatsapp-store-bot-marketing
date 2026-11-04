/**
 * ثوابت قنوات التواصل الداخلي IPC بين Electron Main والـ Renderer
 */
export const IPC_CHANNELS = {
  // Session & WhatsApp Gateway
  SESSION_GET_STATUS: 'session:get-status',
  SESSION_START: 'session:start',
  SESSION_LOGOUT: 'session:logout',
  SESSION_SIMULATE_PAIR: 'session:simulate-pair',
  SESSION_QR_EVENT: 'session:qr-event',
  SESSION_STATUS_CHANGED: 'session:status-changed',

  // Catalog & Inventory
  CATALOG_LIST_PRODUCTS: 'catalog:list-products',
  CATALOG_GET_PRODUCT: 'catalog:get-product',
  CATALOG_CREATE_PRODUCT: 'catalog:create-product',
  CATALOG_UPDATE_PRODUCT: 'catalog:update-product',
  CATALOG_DELETE_PRODUCT: 'catalog:delete-product',
  CATALOG_IMPORT_KEYS: 'catalog:import-keys',

  // Inbox & Chat
  CHAT_LIST_CONVERSATIONS: 'chat:list-conversations',
  CHAT_GET_MESSAGES: 'chat:get-messages',
  CHAT_SEND_MESSAGE: 'chat:send-message',
  CHAT_TAKEOVER: 'chat:takeover',
  CHAT_RETURN_TO_AGENT: 'chat:return-to-agent',
  CHAT_MESSAGE_RECEIVED_EVENT: 'chat:message-received-event',

  // Orders & Checkout
  ORDERS_LIST: 'orders:list',
  ORDERS_GET_DETAILS: 'orders:get-details',
  ORDERS_UPDATE_STATUS: 'orders:update-status',
  ORDERS_CREATE_MANUAL: 'orders:create-manual',
  ORDERS_GENERATE_PAYMENT_LINK: 'orders:generate-payment-link',

  // Marketing Campaigns
  CAMPAIGNS_LIST: 'campaigns:list',
  CAMPAIGNS_CREATE: 'campaigns:create',
  CAMPAIGNS_CONTROL: 'campaigns:control',
  CAMPAIGNS_PROGRESS_EVENT: 'campaigns:progress-event',

  // AI Agent & Sandbox
  AGENT_GET_CONFIG: 'agent:get-config',
  AGENT_UPDATE_CONFIG: 'agent:update-config',
  AGENT_SET_MODE: 'agent:set-mode',
  AGENT_EMERGENCY_STOP: 'agent:emergency-stop',
  AGENT_SANDBOX_TEST: 'agent:sandbox-test',
  AGENT_LIST_RUNS: 'agent:list-runs',
  AGENT_REVIEW_RUN: 'agent:review-run',

  // Knowledge Base
  KNOWLEDGE_LIST: 'knowledge:list',
  KNOWLEDGE_CREATE: 'knowledge:create',
  KNOWLEDGE_UPDATE: 'knowledge:update',
  KNOWLEDGE_DELETE: 'knowledge:delete',

  // Customers & Analytics
  CUSTOMERS_LIST: 'customers:list',
  CUSTOMERS_GET: 'customers:get',
  ANALYTICS_GET_KPIS: 'analytics:get-kpis',
} as const;
