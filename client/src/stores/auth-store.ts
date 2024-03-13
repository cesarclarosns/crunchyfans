import { create } from 'zustand';

import { type Auth } from '@/schemas/auth/auth';

interface AuthState {
  auth: Auth | null;
  isAuthenticated: boolean;
  setAuth: (auth: Auth | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: null,
  isAuthenticated: false,
  setAuth: (auth) => set(() => ({ auth })),
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
}));
