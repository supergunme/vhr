import { create } from 'zustand';
import type { User } from '../types';

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
  currentUser: null,
  menuCollapsed: false,

  setCurrentUser: (user) => set({ currentUser: user }),

  setMenuCollapsed: (collapsed) => set({ menuCollapsed: collapsed }),

  toggleMenu: () => set((state) => ({ menuCollapsed: !state.menuCollapsed })),

  clearUser: () => set({ currentUser: null }),

  logout: () => set({ currentUser: null }),
}));

// Alias for convenience
export const useStore = useAppStore;
