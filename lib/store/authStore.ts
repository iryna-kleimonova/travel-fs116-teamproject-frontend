import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,

      setUser: (user: User) => {
        console.log('🔄 Setting user in store:', user);
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearIsAuthenticated: () => {
        console.log('🔄 Clearing authentication');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        isAuthenticated: state.user ? true : false,
        user: state.user,
      }),
      onRehydrateStorage: () => state => {
        // Після відновлення з localStorage - встановлюємо isLoading в true
        // щоб AuthProvider міг перевірити актуальний стан
        if (state) {
          // ✅ Встановлюємо isLoading: true після відновлення
          state.setLoading(true);
          // ✅ Якщо є user в localStorage, встановлюємо isAuthenticated: true
          // Але все одно дозволяємо AuthProvider перевірити актуальний стан
          if (state.user) {
            // ✅ Тимчасово встановлюємо isAuthenticated: true на основі user
            // Але AuthProvider все одно перевірить сесію
            state.isAuthenticated = true;
          } else {
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);

// Селектори для оптимізації ре-рендерів
export const useIsAuthenticated = () =>
  useAuthStore(state => state.isAuthenticated);

export const useUser = () => useAuthStore(state => state.user);

export const useIsLoading = () => useAuthStore(state => state.isLoading);
