import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import { IElectronAPI } from './contracts';

const api: IElectronAPI = {
  session: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SESSION_GET_STATUS),
    start: (sessionName) => ipcRenderer.invoke(IPC_CHANNELS.SESSION_START, { sessionName }),
    logout: () => ipcRenderer.invoke(IPC_CHANNELS.SESSION_LOGOUT),
    simulatePair: (phone) => ipcRenderer.invoke(IPC_CHANNELS.SESSION_SIMULATE_PAIR, { phone }),
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
    createProduct: (product) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_CREATE_PRODUCT, product),
    importKeys: (productId, keys) => ipcRenderer.invoke(IPC_CHANNELS.CATALOG_IMPORT_KEYS, { productId, keys }),
  },

  chat: {
    listConversations: () => ipcRenderer.invoke(IPC_CHANNELS.CHAT_LIST_CONVERSATIONS),
    getMessages: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.CHAT_GET_MESSAGES, { conversationId }),
    sendMessage: (conversationId, phone, body) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT_SEND_MESSAGE, { conversationId, phone, body }),
    takeover: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.CHAT_TAKEOVER, { conversationId }),
    returnToAgent: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.CHAT_RETURN_TO_AGENT, { conversationId }),
    onMessageReceived: (callback) => {
      const handler = (_event: any, data: any) => callback(data);
      ipcRenderer.on(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, handler);
    },
  },

  orders: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.ORDERS_LIST),
    updateStatus: (orderId, status, trackingNo, trackingUrl) =>
      ipcRenderer.invoke(IPC_CHANNELS.ORDERS_UPDATE_STATUS, { orderId, status, trackingNo, trackingUrl }),
    createManual: (data) => ipcRenderer.invoke(IPC_CHANNELS.ORDERS_CREATE_MANUAL, data),
  },

  customers: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.CUSTOMERS_LIST),
  },

  agent: {
    getConfig: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_GET_CONFIG),
    updateConfig: (config) => ipcRenderer.invoke(IPC_CHANNELS.AGENT_UPDATE_CONFIG, config),
    emergencyStop: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_EMERGENCY_STOP),
    testSandbox: (prompt) => ipcRenderer.invoke(IPC_CHANNELS.AGENT_SANDBOX_TEST, { prompt }),
    listRuns: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT_LIST_RUNS),
  },

  knowledge: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_LIST),
    create: (item) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_CREATE, item),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.KNOWLEDGE_DELETE, { id }),
  },

  campaigns: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.CAMPAIGNS_LIST),
  },

  analytics: {
    getKPIs: () => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_KPIS),
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
