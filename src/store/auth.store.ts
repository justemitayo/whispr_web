import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';


type State = {
  auth: Auth | null;
};

type Action = {
  updateAuth: (auth: State['auth']) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(  
  persist(
    set => ({
      auth: null,
      updateAuth: auth => set(() => ({ auth })),
      clearAuth: () => set(() => ({ auth: null })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);


// zustand to persist input data







// localeCompare() is used to compare two date strings (assuming updated_at is a string in ISO format).
// b.localeCompare(a) results in a descending order (most recent chats first).
// The ! is the non-null assertion operator (TypeScript), telling the compiler you’re sure updated_at is not null or undefined.