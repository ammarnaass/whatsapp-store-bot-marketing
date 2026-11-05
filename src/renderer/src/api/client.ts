import { IElectronAPI } from '../../preload/contracts';
import { cleanFallbackApi } from './fallbacks/clean-fallbacks';

/**
 * دالة استخراج كائن Electron API الحي من الـ window
 */
function getLive(): IElectronAPI {
  if (typeof window !== 'undefined') {
    if (window.electronAPI) return window.electronAPI;
    if ((window as any).api) return (window as any).api;
  }
  return cleanFallbackApi;
}

/**
 * كائن API مباشر يعتمد على getters لتفادي أي أخطاء متعلقة بقيود Proxy
 * ويوفر وصولاً حياً ومتوافقاً بنسبة 100% مع واجهة ContextBridge
 */
export const api: IElectronAPI = {
  get session() { return getLive().session; },
  get catalog() { return getLive().catalog; },
  get inventory() { return getLive().inventory; },
  get chat() { return getLive().chat; },
  get orders() { return getLive().orders; },
  get shipping() { return getLive().shipping; },
  get customers() { return getLive().customers; },
  get agent() { return getLive().agent; },
  get knowledge() { return getLive().knowledge; },
  get auth() { return getLive().auth; },
  get campaigns() { return getLive().campaigns; },
  get coupons() { return getLive().coupons; },
  get blocklist() { return getLive().blocklist; },
  get analytics() { return getLive().analytics; },
  get settings() { return getLive().settings; },
  get telegram() { return getLive().telegram; },
  get channels() { return getLive().channels; },
  get window() { return getLive().window; },
};
