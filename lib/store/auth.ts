import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '../auth/session';

interface AuthStore {
  user: UserSession | null;
  selectedUserId: string | null;
  setUser: (user: UserSession | null) => void;
  selectUser: (userId: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      selectedUserId: null,
      
      setUser: (user) => set({ user }),
      
      selectUser: (userId) => set({ selectedUserId: userId }),
      
      logout: () => {
        set({ user: null, selectedUserId: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('userSession');
          localStorage.removeItem('adminAuthenticated');
          sessionStorage.clear();
        }
      },
      
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, selectedUserId: state.selectedUserId })
    }
  )
);
