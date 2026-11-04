import { create } from 'zustand';
import { api } from '../../../api-bridge';
import { User } from '../types/auth.types';

const AUTH_STORAGE_KEY = 'wasell_active_user_v1';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAccountModalOpen: boolean;
  setAccountModalOpen: (open: boolean) => void;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  quickAdminLogin: () => Promise<boolean>;
  register: (data: { email: string; name: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isAccountModalOpen: false,

  setAccountModalOpen: (open) => set({ isAccountModalOpen: open }),

  initAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const liveUser = await api.auth.getCurrentUser({ userId: parsed.id });
        if (liveUser && liveUser.status !== 'suspended') {
          set({ currentUser: liveUser, isAuthenticated: true, isLoading: false });
          return;
        }
      }
      // إذا لم يكن هناك تخزين سابق، جلب المدير الافتراضي
      const defaultUser = await api.auth.getCurrentUser();
      if (defaultUser) {
        set({ currentUser: defaultUser, isAuthenticated: true, isLoading: false });
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      } else {
        set({ currentUser: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ currentUser: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.user) {
        set({ currentUser: res.user, isAuthenticated: true, isLoading: false });
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        return true;
      }
      set({ error: res.error || 'فشل تسجيل الدخول', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || 'حدث خطأ في الاتصال', isLoading: false });
      return false;
    }
  },

  quickAdminLogin: async () => {
    return await get().login('admin@wasell.store', 'admin123');
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.register(data);
      if (res.success && res.user) {
        set({ currentUser: res.user, isAuthenticated: true, isLoading: false });
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        return true;
      }
      set({ error: res.error || 'فشل إنشاء الحساب', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || 'حدث خطأ أثناء التسجيل', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ currentUser: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const user = get().currentUser;
    if (!user) return false;
    try {
      const res = await api.auth.updateProfile({ userId: user.id, ...data });
      if (res.success && res.user) {
        set({ currentUser: res.user });
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));

