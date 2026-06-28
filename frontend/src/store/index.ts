import { create } from 'zustand';
import type { User } from '../types';

const STORAGE_KEY = 'app_current_user';

// Restore user from sessionStorage on init
function getStoredUser(): User | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

interface AppState {
  currentUser: User | null;
  menuCollapsed: boolean;
  setCurrentUser: (user: User | null) => void;
  setMenuCollapsed: (collapsed: boolean) => void;
  toggleMenu: () => void;
  clearUser: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: getStoredUser(),
  menuCollapsed: false,

  setCurrentUser: (user) => {
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    set({ currentUser: user });
  },

  setMenuCollapsed: (collapsed) => set({ menuCollapsed: collapsed }),

  toggleMenu: () => set((state) => ({ menuCollapsed: !state.menuCollapsed })),

  clearUser: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({ currentUser: null });
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('cache_nations');
    sessionStorage.removeItem('cache_politics');
    sessionStorage.removeItem('cache_positions');
    sessionStorage.removeItem('cache_joblevels');
    sessionStorage.removeItem('cache_departments');
    set({ currentUser: null });
  },
}));

// Alias for convenience
export const useStore = useAppStore;
