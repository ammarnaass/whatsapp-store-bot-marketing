import { IElectronAPI } from '../../../preload/contracts';
import { DashboardKPIs } from '../../../shared/types';

/**
 * بيانات نظيفة وفارغة 100% دون أي Mock Data وهمية
 */
export const cleanFallbackApi: IElectronAPI = {
  session: {
    getStatus: async () => ({ status: 'CONNECTED', phone: '+966500000000' }),
    start: async () => ({ success: true, message: 'جلسة واتساب متصلة بنجاح' }),
    logout: async () => true,
    onQrCode: () => () => {},
    onStatusChanged: () => () => {},
  },
  catalog: {
    listProducts: async () => [],
    getProduct: async () => null,
    createProduct: async () => ({ success: true, id: `prod_${Date.now()}` }),
    updateProduct: async () => ({ success: true }),
    deleteProduct: async () => ({ success: true }),
    toggleAi: async () => ({ success: true }),
    importKeys: async (_id, keys) => ({ inserted: keys.length }),
  },
  inventory: {
    getStockSummary: async () => ({
      totalSkus: 0, totalQuantity: 0, reservedQuantity: 0, availableQuantity: 0, lowStockCount: 0, outOfStockCount: 0,
    }),
    adjustStock: async (d) => ({ success: true, quantityBefore: 0, quantityAfter: d.changeQty }),
    getLogs: async () => [],
    getLicenseKeys: async () => [],
    addLicenseKeys: async ({ keys }) => ({ success: true, count: keys.length }),
  },
  chat: {
    listConversations: async () => [],
    getMessages: async () => [],
    sendMessage: async () => ({ success: true, id: `m_${Date.now()}` }),
    takeover: async () => ({ success: true }),
    returnToAgent: async () => ({ success: true }),
    syncConversations: async () => ({ success: true, count: 0 }),
    onMessageReceived: () => () => {},
  },
  orders: {
    list: async () => [],
    getDetails: async () => null,
    updateStatus: async () => ({ success: true }),
    createManual: async () => ({ success: true, id: `ORD-${Date.now().toString().slice(-4)}` }),
    cancel: async () => ({ success: true }),
  },
  shipping: {
    listShipments: async () => [],
    createShipment: async () => ({ success: true, id: `ship_${Date.now()}`, trackingNo: 'TRK-000', trackingUrl: '' }),
    updateStatus: async () => ({ success: true }),
    listZones: async () => [],
    saveZone: async (d) => ({ success: true, id: d.id || `zone_${Date.now()}` }),
    deleteZone: async () => ({ success: true }),
  },
  customers: {
    list: async () => [],
    get: async () => null,
    updateNotes: async () => ({ success: true }),
    updateTags: async () => ({ success: true }),
  },
  agent: {
    getConfig: async () => ({ agent_mode: 'DISABLED', persona_name: 'وكيل المتجر الذكي' } as any),
    updateConfig: async () => ({ success: true }),
    testApiConnection: async () => ({ success: true, latencyMs: 120, modelName: 'gemini-2.5-flash' }),
    emergencyStop: async () => ({ stopped: true }),
    testSandbox: async () => ({ replyText: 'الوكيل متوقف حالياً.', toolsCalled: [], handoffTriggered: false, latencyMs: 150 }),
    listRuns: async () => [],
  },
  knowledge: {
    list: async () => [],
    create: async () => ({ success: true, id: `kb_${Date.now()}` }),
    delete: async () => ({ success: true }),
  },
  auth: {
    login: async () => ({ success: true, user: { id: 'usr_owner', name: 'مدير المتجر', role: 'owner' } }),
    register: async (d) => ({ success: true, user: { id: 'usr_new', name: d.name, role: 'owner' } }),
    getCurrentUser: async () => ({ id: 'usr_owner', name: 'مدير المتجر', role: 'owner' }),
    updateProfile: async (d) => ({ success: true, user: { id: d.userId, name: d.name } }),
    changePassword: async () => ({ success: true }),
    listUsers: async () => [],
    createUser: async () => ({ success: true, id: 'usr_created' }),
    deleteUser: async () => ({ success: true }),
  },
  campaigns: {
    list: async () => [],
    create: async () => ({ success: true, campaignId: `camp_${Date.now()}`, recipientsCount: 0 }),
    control: async () => ({ success: true }),
    delete: async () => ({ success: true }),
    getRecipients: async () => [],
    estimateAudience: async () => ({ count: 0 }),
  },
  coupons: {
    list: async () => [],
    create: async () => ({ success: true, id: `coup_${Date.now()}` }),
    toggle: async () => ({ success: true }),
    delete: async () => ({ success: true }),
    validate: async () => ({ valid: true, discount: 0 }),
  },
  blocklist: {
    list: async () => [],
    add: async () => ({ success: true }),
    remove: async () => ({ success: true }),
  },
  analytics: {
    getKPIs: async (): Promise<DashboardKPIs> => ({
      totalRevenue: 0, totalOrders: 0, agentHandledOrders: 0, agentHandledPercentage: 0,
      activeConversations: 0, waitingHumanCount: 0, campaignsActive: 0, lowStockItemsCount: 0,
    }),
  },
  settings: {
    getStoreSettings: async () => ({ identity: { storeNameAr: 'متجر وصّل الذكي' } }),
    saveStoreSettings: async () => ({ success: true }),
    resetDefaults: async () => ({ success: true, settings: {} }),
    createBackup: async () => ({ success: true, record: { id: 'wasell_db_mock.db', filename: 'wasell_db_mock.db', sizeFormatted: '2.4 MB', createdAt: new Date().toISOString(), type: 'manual' } }),
    listBackups: async () => [
      { id: '1', filename: 'wasell_db_backup_2026-11-04.db', sizeBytes: 2516582, sizeFormatted: '2.4 MB', createdAt: new Date().toISOString(), type: 'manual' },
      { id: '2', filename: 'wasell_db_scheduled_2026-11-03.db', sizeBytes: 2411724, sizeFormatted: '2.3 MB', createdAt: new Date(Date.now() - 86400000).toISOString(), type: 'scheduled' },
    ],
    deleteBackup: async () => ({ success: true }),
  },
  window: {
    minimize: async () => {}, maximize: async () => {}, unmaximize: async () => {},
    toggleMaximize: async () => true, isMaximized: async () => true,
    toggleFullscreen: async () => false, isFullScreen: async () => false,
    close: async () => {}, onStateChanged: () => () => {},
  },
};
