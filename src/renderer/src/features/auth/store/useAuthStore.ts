import { create } from 'zustand';
import { api } from '../../../api-bridge';
import { User } from '../types/auth.types';
const TOKEN_KEY = 'wasell_session_token_v1';
interface AuthState {
  currentUser: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstTimeSetup: boolean;
  error: string | null;
  isAccountModalOpen: boolean;
  setAccountModalOpen: (open: boolean) => void;
  clearError: () => void;
  initAuth: () => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (data: { email: string; name: string; password: string; phone?: string; storeName?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<boolean>;
  hasPermission: (slug: string) => boolean;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  sessionToken: null,
  isAuthenticated: false,
  isLoading: true,
  isFirstTimeSetup: false,
  error: null,
  isAccountModalOpen: false,
  setAccountModalOpen: (open) => set({ isAccountModalOpen: open }),
  clearError: () => set({ error: null }),
  initAuth: async () => {
    if (get().isAuthenticated && get().currentUser) return;
    set({ isLoading: true, error: null });
    try {
      const timeout = (ms: number) => new Promise<any>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
      const usersCheck = await Promise.race([api.auth.checkHasUsers(), timeout(4000)]);
      if (!usersCheck?.hasUsers) {
        set({ isFirstTimeSetup: true, isAuthenticated: false, currentUser: null, sessionToken: null, isLoading: false });
        return;
      }
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (!token) {
        set({ isFirstTimeSetup: false, isAuthenticated: false, currentUser: null, sessionToken: null, isLoading: false });
        return;
      }
      const res = await Promise.race([api.auth.validateSession({ sessionToken: token }), timeout(4000)]);
      if (res?.valid && res?.user && res.user.status !== 'suspended') {
        set({ currentUser: res.user, sessionToken: token, isAuthenticated: true, isFirstTimeSetup: false, isLoading: false });
      } else {
        localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY);
        set({ currentUser: null, sessionToken: null, isAuthenticated: false, isFirstTimeSetup: false, isLoading: false });
      }
    } catch {
      set({ currentUser: null, sessionToken: null, isAuthenticated: false, isLoading: false });
    }
  },
  login: async (email, password, rememberMe = true) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.login({ email, password, rememberMe });
      if (res.success && res.user && res.sessionToken) {
        const store = rememberMe ? localStorage : sessionStorage;
        (rememberMe ? sessionStorage : localStorage).removeItem(TOKEN_KEY);
        store.setItem(TOKEN_KEY, res.sessionToken);
        set({ currentUser: res.user, sessionToken: res.sessionToken, isAuthenticated: true, isFirstTimeSetup: false, isLoading: false });
        return true;
      }
      set({ error: res.error || 'فشل تسجيل الدخول، تأكد من بياناتك', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || 'حدث خطأ في الاتصال بالخادم', isLoading: false });
      return false;
    }
  },
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.register(data);
      if (res.success && res.user && res.sessionToken) {
        localStorage.setItem(TOKEN_KEY, res.sessionToken);
        set({ currentUser: res.user, sessionToken: res.sessionToken, isAuthenticated: true, isFirstTimeSetup: false, isLoading: false });
        return true;
      }
      set({ error: res.error || 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || 'حدث خطأ أثناء إنشاء الحساب', isLoading: false });
      return false;
    }
  },
  logout: async () => {
    const token = get().sessionToken;
    try { if (token) await api.auth.logout({ sessionToken: token }); } catch {}
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    set({ currentUser: null, sessionToken: null, isAuthenticated: false });
  },
  updateProfile: async (data) => {
    const user = get().currentUser;
    if (!user) return false;
    try {
      const res = await api.auth.updateProfile({ userId: user.id, ...data });
      if (res.success && res.user) {
        set({ currentUser: res.user });
        return true;
      }
      return false;
    } catch { return false; }
  },
  hasPermission: (slug: string) => {
    const user = get().currentUser;
    if (!user) return false;
    if (user.role === 'owner') return true;
    const perms = user.permissions || [];
    if (perms.includes('*')) return true;
    return perms.includes(slug);
  },
}));
