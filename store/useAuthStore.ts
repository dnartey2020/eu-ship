// lib/store/auth-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  user: { id: string; email: string; name: string } | null;
  setUser: (user: { id: string; email: string; name: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearAuth: async () => {
        // Clear client-side state
        set({ user: null });

        // Clear server-side cookies
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
