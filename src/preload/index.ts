import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import { IElectronAPI } from './contracts';

const api: IElectronAPI = {
  session: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SESSION_GET_STATUS),
    start: (sessionName) => ipcRenderer.invoke(IPC_CHANNELS.SESSION_START, { sessionName }),
    logout: () => ipcRenderer.invoke(IPC_CHANNELS.SESSION_LOGOUT),
    simulatePair: (phone) => ipcRenderer.invoke(IPC_CHANNELS.SESSION_SIMULATE_PAIR, { phone }),
    getPairingCode: (phone) => ipcRenderer.invoke(IPC_CHANNELS.SESSION_GET_PAIRING_CODE, { phone }),
    onQrCode: (callback) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.SESSION_QR_EVENT, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SESSION_QR_EVENT, handler);
    },
    onStatusChanged: (callback) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.SESSION_STATUS_CHANGED, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SESSION_STATUS_CHANGED, handler);
    },
  },

  catalog: {
    listProducts: () => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_LIST_PRODUCTS),
    getProduct: (params) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_GET_PRODUCT, params),
    createProduct: (product) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_CREATE_PRODUCT, product),
    updateProduct: (product) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_UPDATE_PRODUCT, product),
    deleteProduct: (params) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_DELETE_PRODUCT, params),
    toggleAi: (params) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_TOGGLE_AI, params),
    importKeys: (productId, keys) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_IMPORT_KEYS, { productId, keys }),
  },

  categories: {
    listCategories: () => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_LIST),
    getCategory: (params) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_GET, params),
    createCategory: (data) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_CREATE, data),
    updateCategory: (data) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_UPDATE, data),
    deleteCategory: (params) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_DELETE, params),
    reorderCategories: (ids) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_REORDER, { ids }),
  },

  collections: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_LIST),
    get: (params) => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_GET, params),
    create: (data) => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_CREATE, data),
    update: (data) => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_UPDATE, data),
    delete: (params) => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_DELETE, params),
    assignProducts: (params) => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_ASSIGN_PRODUCTS, params),
    getProducts: (params) => ipcRenderer.invoke(IPC_CHANNELS.COLLECTIONS_GET_PRODUCTS, params),
  },

  inventory: {
    getStockSummary: () => ipcRenderer.invoke(IPC_CHANNELS.INVENTORY_GET_STOCK_SUMMARY),
    adjustStock: (data) => ipcRenderer.invoke(IPC_CHANNELS.INVENTORY_ADJUST_STOCK, data),
    getLogs: (params) => ipcRenderer.invoke(IPC_CHANNELS.INVENTORY_GET_LOGS, params),
    getLicenseKeys: (params) => ipcRenderer.invoke(IPC_CHANNELS.INVENTORY_GET_LICENSE_KEYS, params),
    addLicenseKeys: (params) => ipcRenderer.invoke(IPC_CHANNELS.INVENTORY_ADD_LICENSE_KEYS, params),
  },

  chat: {
    listConversations: () => ipcRenderer.invoke(IPC_CHANNELS.CHAT_LIST_CONVERSATIONS),
    getMessages: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.CHAT_GET_MESSAGES, { conversationId }),
    sendMessage: (conversationId, phone, body) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT_SEND_MESSAGE, { conversationId, phone, body }),
    takeover: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.CHAT_TAKEOVER, { conversationId }),
    returnToAgent: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.CHAT_RETURN_TO_AGENT, { conversationId }),
    syncConversations: () => ipcRenderer.invoke(IPC_CHANNELS.CHAT_SYNC_CONVERSATIONS),
    onMessageReceived: (callback) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, handler);
    },
  },

  orders: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.ORDERS_LIST),
    getDetails: (params) => ipcRenderer.invoke(IPC_CHANNELS.ORDERS_GET_DETAILS, params),
    updateStatus: (orderId, status, trackingNo, trackingUrl) =>
      ipcRenderer.invoke(IPC_CHANNELS.ORDERS_UPDATE_STATUS, { orderId, status, trackingNo, trackingUrl }),
    createManual: (data) => ipcRenderer.invoke(IPC_CHANNELS.ORDERS_CREATE_MANUAL, data),
    cancel: (params) => ipcRenderer.invoke(IPC_CHANNELS.ORDERS_CANCEL, params),
  },

  shipping: {
    listShipments: () => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_LIST_SHIPMENTS),
    createShipment: (data) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_CREATE_SHIPMENT, data),
    updateStatus: (params) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_UPDATE_STATUS, params),
    listZones: () => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_LIST_ZONES),
    saveZone: (data) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_SAVE_ZONE, data),
    deleteZone: (params) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_DELETE_ZONE, params),
    listMethods: (params) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_LIST_METHODS, params),
    saveMethod: (data) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_SAVE_METHOD, data),
    deleteMethod: (params) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_DELETE_METHOD, params),
    toggleMethod: (params) => ipcRenderer.invoke(IPC_CHANNELS.SHIPPING_TOGGLE_METHOD, params),
  },

  customers: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.CUSTOMERS_LIST),
    get: (params) => ipcRenderer.invoke(IPC_CHANNELS.CUSTOMERS_GET, params),
    updateNotes: (contactId, notes) => ipcRenderer.invoke(IPC_CHANNELS.CUSTOMERS_UPDATE_NOTES, { contactId, notes }),
    updateTags: (contactId, tags) => ipcRenderer.invoke(IPC_CHANNELS.CUSTOMERS_UPDATE_TAGS, { contactId, tags }),
  },

  agent: {
    getConfig: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_GET_CONFIG),
    updateConfig: (config) => ipcRenderer.invoke(IPC_CHANNELS.AGENT_UPDATE_CONFIG, config),
    testApiConnection: (params) => ipcRenderer.invoke(IPC_CHANNELS.AGENT_TEST_API_CONNECTION, params),
    emergencyStop: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_EMERGENCY_STOP),
    setMode: (params) => ipcRenderer.invoke(IPC_CHANNELS.AGENT_SET_MODE, params),
    getMode: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_GET_MODE),
    testSandbox: (prompt) => ipcRenderer.invoke(IPC_CHANNELS.AGENT_SANDBOX_TEST, { prompt }),
    listRuns: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_LIST_RUNS),
  },

  knowledge: {
    list: (filters) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_LIST, filters),
    get: (params) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_GET, params),
    create: (item) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_CREATE, item),
    update: (item) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_UPDATE, item),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_DELETE, { id }),
    toggleActive: (params) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_TOGGLE_ACTIVE, params),
    getStats: () => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_GET_STATS),
    testRetrieval: (params) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_TEST_RETRIEVAL, params),
  },

  auth: {
    login: (credentials) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGIN, credentials),
    register: (data) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_REGISTER, data),
    getCurrentUser: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_GET_CURRENT_USER, params),
    updateProfile: (data) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_UPDATE_PROFILE, data),
    changePassword: (data) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_CHANGE_PASSWORD, data),
    listUsers: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH_LIST_USERS),
    createUser: (data) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_CREATE_USER, data),
    updateUser: (data) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_UPDATE_USER, data),
    deleteUser: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_DELETE_USER, params),
    toggleUserStatus: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_TOGGLE_USER_STATUS, params),
    adminResetPassword: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_ADMIN_RESET_PASSWORD, params),
    validateSession: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_VALIDATE_SESSION, params),
    logout: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGOUT, params),
    checkHasUsers: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH_CHECK_HAS_USERS),
    listSessions: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_LIST_SESSIONS, params),
    revokeSession: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_REVOKE_SESSION, params),
    revokeAllSessions: (params) => ipcRenderer.invoke(IPC_CHANNELS.AUTH_REVOKE_ALL_SESSIONS, params),
  },

  campaigns: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_LIST),
    create: (data: any) => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_CREATE, data),
    control: (id: string, action: 'START' | 'PAUSE' | 'CANCEL') => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_CONTROL, { id, action }),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_DELETE, id),
    getRecipients: (campaignId: string) => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_GET_RECIPIENTS, campaignId),
    estimateAudience: (filter?: any) => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_ESTIMATE_AUDIENCE, filter),
  },

  coupons: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.COUPONS_LIST),
    create: (data: any) => ipcRenderer.invoke(IPC_CHANNELS.COUPONS_CREATE, data),
    toggle: (id: string, is_active: number) => ipcRenderer.invoke(IPC_CHANNELS.COUPONS_TOGGLE, { id, is_active }),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.COUPONS_DELETE, id),
    validate: (code: string, order_amount: number) => ipcRenderer.invoke(IPC_CHANNELS.COUPONS_VALIDATE, { code, order_amount }),
  },

  blocklist: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.BLOCKLIST_LIST),
    add: (phone: string, reason?: string) => ipcRenderer.invoke(IPC_CHANNELS.BLOCKLIST_ADD, { phone, reason }),
    remove: (phone: string) => ipcRenderer.invoke(IPC_CHANNELS.BLOCKLIST_REMOVE, phone),
  },

  analytics: {
    getKPIs: () => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_KPIS),
    getSummary: (period?: string) => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_SUMMARY, period),
    getFunnel: (period?: string) => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_FUNNEL, period),
    getIntelligence: (period?: string) => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_INTELLIGENCE, period),
    getPeakHours: () => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_PEAK_HOURS),
    getInsights: () => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_INSIGHTS),
  },

  settings: {
    getStoreSettings: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_STORE_SETTINGS),
    saveStoreSettings: (settings) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_STORE_SETTINGS, settings),
    resetDefaults: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_RESET_DEFAULTS),
    createBackup: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_CREATE_BACKUP),
    listBackups: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_LIST_BACKUPS),
    deleteBackup: (params: { filename: string }) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_DELETE_BACKUP, params),
  },

  telegram: {
    getConfig: () => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_GET_CONFIG),
    saveConfig: (data) => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_SAVE_CONFIG, data),
    deleteToken: () => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_DELETE_TOKEN),
    testToken: (token) => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_TEST_TOKEN, { token }),
    start: (token) => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_START, { token }),
    stop: () => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_STOP),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_GET_STATUS),
    sendMessage: (options) => ipcRenderer.invoke(IPC_CHANNELS.TELEGRAM_SEND_MESSAGE, options),
    onMessageReceived: (callback) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.TELEGRAM_MESSAGE_RECEIVED_EVENT, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.TELEGRAM_MESSAGE_RECEIVED_EVENT, handler);
    },
  },

  software: {
    list: (params) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_LIST, params),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_GET, { id }),
    create: (data) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_CREATE, data),
    update: (id, data) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_UPDATE, { id, data }),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_DELETE, { id }),
    addKeys: (params) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_ADD_KEYS, params),
    getKeys: (softwareId) => ipcRenderer.invoke(IPC_CHANNELS.SOFTWARE_GET_KEYS, { softwareId }),
  },

  channels: {
    getConfig: () => ipcRenderer.invoke(IPC_CHANNELS.CHANNELS_GET_CONFIG),
    saveConfig: (config) => ipcRenderer.invoke(IPC_CHANNELS.CHANNELS_SAVE_CONFIG, config),
    setActiveProvider: (provider) => ipcRenderer.invoke(IPC_CHANNELS.CHANNELS_SET_ACTIVE_PROVIDER, provider),
    testCloudApi: (params) => ipcRenderer.invoke(IPC_CHANNELS.CHANNELS_TEST_CLOUD_API, params),
    testWebhook: () => ipcRenderer.invoke(IPC_CHANNELS.CHANNELS_TEST_WEBHOOK),
    getWebhookLogs: () => ipcRenderer.invoke(IPC_CHANNELS.CHANNELS_GET_WEBHOOK_LOGS),
  },

  window: {
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),
    unmaximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_UNMAXIMIZE),
    toggleMaximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_TOGGLE_MAXIMIZE),
    isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_MAXIMIZED),
    toggleFullscreen: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_TOGGLE_FULLSCREEN),
    isFullScreen: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_FULLSCREEN),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),
    onStateChanged: (callback) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.WINDOW_STATE_CHANGED_EVENT, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.WINDOW_STATE_CHANGED_EVENT, handler);
    },
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
contextBridge.exposeInMainWorld('api', api);
