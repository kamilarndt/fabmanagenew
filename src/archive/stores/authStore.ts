import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  roles: string[];
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
  setRoles: (roles: string[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  roles: [],
  loading: false,
  signIn: async (email: string) => {
    set({ loading: true });
    // Mock sign in
    set({ user: { id: "1", email }, loading: false });
  },
  signOut: () => set({ user: null, roles: [] }),
  setRoles: (roles: string[]) => set({ roles }),
}));
