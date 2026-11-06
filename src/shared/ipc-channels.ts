/**
 * ثوابت قنوات التواصل الداخلي IPC بين Electron Main والـ Renderer
 */
export const IPC_CHANNELS = {
  // Session & WhatsApp Gateway
  SESSION_GET_STATUS: 'session:get-status',
  SESSION_START: 'session:start',
  SESSION_LOGOUT: 'session:logout',
  SESSION_SIMULATE_PAIR: 'session:simulate-pair',
  SESSION_GET_PAIRING_CODE: 'session:get-pairing-code',
  SESSION_QR_EVENT: 'session:qr-event',
  SESSION_STATUS_CHANGED: 'session:status-changed',

  // Catalog & Inventory
  CATALOG_LIST_PRODUCTS: 'catalog:list-products',
  CATALOG_GET_PRODUCT: 'catalog:get-product',
  CATALOG_CREATE_PRODUCT: 'catalog:create-product',
  CATALOG_UPDATE_PRODUCT: 'catalog:update-product',
  CATALOG_DELETE_PRODUCT: 'catalog:delete-product',
  CATALOG_TOGGLE_AI: 'catalog:toggle-ai',
  CATALOG_IMPORT_KEYS: 'catalog:import-keys',

  // Categories & Product Classification
  CATEGORIES_LIST: 'categories:list',
  CATEGORIES_GET: 'categories:get',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',
  CATEGORIES_REORDER: 'categories:reorder',

  // Collections & Marketing Curations
  COLLECTIONS_LIST: 'collections:list',
  COLLECTIONS_GET: 'collections:get',
  COLLECTIONS_CREATE: 'collections:create',
  COLLECTIONS_UPDATE: 'collections:update',
  COLLECTIONS_DELETE: 'collections:delete',
  COLLECTIONS_ASSIGN_PRODUCTS: 'collections:assign-products',
  COLLECTIONS_GET_PRODUCTS: 'collections:get-products',

  // Smart Inventory
  INVENTORY_GET_STOCK_SUMMARY: 'inventory:get-stock-summary',
  INVENTORY_ADJUST_STOCK: 'inventory:adjust-stock',
  INVENTORY_GET_LOGS: 'inventory:get-logs',
  INVENTORY_GET_LICENSE_KEYS: 'inventory:get-license-keys',
  INVENTORY_ADD_LICENSE_KEYS: 'inventory:add-license-keys',

  // Inbox & Chat
  CHAT_LIST_CONVERSATIONS: 'chat:list-conversations',
  CHAT_GET_MESSAGES: 'chat:get-messages',
  CHAT_SEND_MESSAGE: 'chat:send-message',
  CHAT_TAKEOVER: 'chat:takeover',
  CHAT_RETURN_TO_AGENT: 'chat:return-to-agent',
  CHAT_SYNC_CONVERSATIONS: 'chat:sync-conversations',
  CHAT_MESSAGE_RECEIVED_EVENT: 'chat:message-received-event',

  // Orders & Checkout
  ORDERS_LIST: 'orders:list',
  ORDERS_GET_DETAILS: 'orders:get-details',
  ORDERS_UPDATE_STATUS: 'orders:update-status',
  ORDERS_CREATE_MANUAL: 'orders:create-manual',
  ORDERS_CANCEL: 'orders:cancel',
  ORDERS_GENERATE_PAYMENT_LINK: 'orders:generate-payment-link',

  // Shipping & Logistics
  SHIPPING_LIST_SHIPMENTS: 'shipping:list-shipments',
  SHIPPING_GET_SHIPMENT: 'shipping:get-shipment',
  SHIPPING_CREATE_SHIPMENT: 'shipping:create-shipment',
  SHIPPING_UPDATE_STATUS: 'shipping:update-status',
  SHIPPING_LIST_ZONES: 'shipping:list-zones',
  SHIPPING_SAVE_ZONE: 'shipping:save-zone',
  SHIPPING_DELETE_ZONE: 'shipping:delete-zone',
  SHIPPING_GET_KPIS: 'shipping:get-kpis',

  // Marketing Campaigns
  CAMPAIGNS_LIST: 'campaigns:list',
  CAMPAIGNS_CREATE: 'campaigns:create',
  CAMPAIGNS_CONTROL: 'campaigns:control',
  CAMPAIGNS_DELETE: 'campaigns:delete',
  CAMPAIGNS_GET_RECIPIENTS: 'campaigns:get-recipients',
  CAMPAIGNS_ESTIMATE_AUDIENCE: 'campaigns:estimate-audience',
  CAMPAIGNS_PROGRESS_EVENT: 'campaigns:progress-event',

  // Marketing Coupons
  COUPONS_LIST: 'coupons:list',
  COUPONS_CREATE: 'coupons:create',
  COUPONS_TOGGLE: 'coupons:toggle',
  COUPONS_DELETE: 'coupons:delete',
  COUPONS_VALIDATE: 'coupons:validate',

  // Marketing Blocklist (Anti-Ban / Opt-Out)
  BLOCKLIST_LIST: 'blocklist:list',
  BLOCKLIST_ADD: 'blocklist:add',
  BLOCKLIST_REMOVE: 'blocklist:remove',

  // AI Agent & Sandbox
  AGENT_GET_CONFIG: 'agent:get-config',
  AGENT_UPDATE_CONFIG: 'agent:update-config',
  AGENT_TEST_API_CONNECTION: 'agent:test-api-connection',
  AGENT_GET_MODE: 'agent:get-mode',
  AGENT_SET_MODE: 'agent:set-mode',
  AGENT_EMERGENCY_STOP: 'agent:emergency-stop',
  AGENT_SANDBOX_TEST: 'agent:sandbox-test',
  AGENT_LIST_RUNS: 'agent:list-runs',
  AGENT_REVIEW_RUN: 'agent:review-run',

  // Knowledge Base & Catalog
  KNOWLEDGE_LIST: 'knowledge:list',
  KNOWLEDGE_GET: 'knowledge:get',
  KNOWLEDGE_CREATE: 'knowledge:create',
  KNOWLEDGE_UPDATE: 'knowledge:update',
  KNOWLEDGE_DELETE: 'knowledge:delete',
  KNOWLEDGE_TOGGLE_ACTIVE: 'knowledge:toggle-active',
  KNOWLEDGE_TEST_RETRIEVAL: 'knowledge:test-retrieval',
  KNOWLEDGE_GET_STATS: 'knowledge:get-stats',

  // Authentication & Account Management
  AUTH_LOGIN: 'auth:login',
  AUTH_REGISTER: 'auth:register',
  AUTH_GET_CURRENT_USER: 'auth:get-current-user',
  AUTH_UPDATE_PROFILE: 'auth:update-profile',
  AUTH_CHANGE_PASSWORD: 'auth:change-password',
  AUTH_LIST_USERS: 'auth:list-users',
  AUTH_CREATE_USER: 'auth:create-user',
  AUTH_UPDATE_USER: 'auth:update-user',
  AUTH_DELETE_USER: 'auth:delete-user',
  AUTH_TOGGLE_USER_STATUS: 'auth:toggle-user-status',
  AUTH_ADMIN_RESET_PASSWORD: 'auth:admin-reset-password',
  AUTH_VALIDATE_SESSION: 'auth:validate-session',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_LIST_SESSIONS: 'auth:list-sessions',
  AUTH_REVOKE_SESSION: 'auth:revoke-session',
  AUTH_REVOKE_ALL_SESSIONS: 'auth:revoke-all-sessions',
  AUTH_CHECK_HAS_USERS: 'auth:check-has-users',

  // Telegram Bot Gateway
  TELEGRAM_GET_CONFIG: 'telegram:get-config',
  TELEGRAM_SAVE_CONFIG: 'telegram:save-config',
  TELEGRAM_DELETE_TOKEN: 'telegram:delete-token',
  TELEGRAM_TEST_TOKEN: 'telegram:test-token',
  TELEGRAM_START: 'telegram:start',
  TELEGRAM_STOP: 'telegram:stop',
  TELEGRAM_GET_STATUS: 'telegram:get-status',
  TELEGRAM_SEND_MESSAGE: 'telegram:send-message',
  TELEGRAM_MESSAGE_RECEIVED_EVENT: 'telegram:message-received-event',

  // Software Solutions & Licenses Hub
  SOFTWARE_LIST: 'software:list',
  SOFTWARE_GET: 'software:get',
  SOFTWARE_CREATE: 'software:create',
  SOFTWARE_UPDATE: 'software:update',
  SOFTWARE_DELETE: 'software:delete',
  SOFTWARE_ADD_KEYS: 'software:add-keys',
  SOFTWARE_GET_KEYS: 'software:get-keys',

  // Customers & Analytics
  CUSTOMERS_LIST: 'customers:list',
  CUSTOMERS_GET: 'customers:get',
  CUSTOMERS_UPDATE_NOTES: 'customers:update-notes',
  CUSTOMERS_UPDATE_TAGS: 'customers:update-tags',
  ANALYTICS_GET_KPIS: 'analytics:get-kpis',
  ANALYTICS_GET_SUMMARY: 'analytics:get-summary',
  ANALYTICS_GET_FUNNEL: 'analytics:get-funnel',
  ANALYTICS_GET_INTELLIGENCE: 'analytics:get-intelligence',
  ANALYTICS_GET_PEAK_HOURS: 'analytics:get-peak-hours',
  ANALYTICS_GET_INSIGHTS: 'analytics:get-insights',

  // Channels & WhatsApp Cloud API
  CHANNELS_GET_CONFIG: 'channels:get-config',
  CHANNELS_SAVE_CONFIG: 'channels:save-config',
  CHANNELS_TEST_CLOUD_API: 'channels:test-cloud-api',
  CHANNELS_TEST_WEBHOOK: 'channels:test-webhook',
  CHANNELS_GET_WEBHOOK_LOGS: 'channels:get-webhook-logs',
  CHANNELS_SET_ACTIVE_PROVIDER: 'channels:set-active-provider',

  // Store & Application Settings
  SETTINGS_GET_STORE_SETTINGS: 'settings:get-store-settings',
  SETTINGS_SAVE_STORE_SETTINGS: 'settings:save-store-settings',
  SETTINGS_RESET_DEFAULTS: 'settings:reset-defaults',
  SETTINGS_CREATE_BACKUP: 'settings:create-backup',
  SETTINGS_LIST_BACKUPS: 'settings:list-backups',
  SETTINGS_RESTORE_BACKUP: 'settings:restore-backup',
  SETTINGS_DELETE_BACKUP: 'settings:delete-backup',

  // Window Management & Fullscreen
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_UNMAXIMIZE: 'window:unmaximize',
  WINDOW_TOGGLE_MAXIMIZE: 'window:toggle-maximize',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized',
  WINDOW_TOGGLE_FULLSCREEN: 'window:toggle-fullscreen',
  WINDOW_IS_FULLSCREEN: 'window:is-fullscreen',
  WINDOW_CLOSE: 'window:close',
  WINDOW_STATE_CHANGED_EVENT: 'window:state-changed-event',
} as const;
