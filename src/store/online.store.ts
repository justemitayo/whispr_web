import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { IOnlineUser } from "../interface/socket";


type State = {
  online_user: IOnlineUser[]
}

type Action = {
  updateOnlineUsers: (online_users: IOnlineUser[]) => void;
  isOnline: (user_id: IOnlineUser['user_id']) => boolean;
  clearOnlineUsers: () => void;
}

export const useOnlineStore = create<
  State & Action,
  [['zustand/persist', unknown]] 
>(
  persist(
    (set, get) => ({
      online_user: [],
      updateOnlineUsers: online_user => set(() => ({ online_user })),
      isOnline: user_id => {
        return get().online_user.some(user => user.user_id === user_id);
      },
      clearOnlineUsers: () => set(() => ({ online_user: [] })),
    }),
    {
      name: 'online-users-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
  
)

