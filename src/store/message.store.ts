import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { IChat } from "../interface/chat";
import { IMessage } from "../interface/message";


type State ={     
                //  "chat1": [msg1, msg2, msg3],track messages separately for each chat. 
  user_message : { [chat_id: string]: IMessage[]};
  isHydrated: boolean;
}

type Action = {
  addMessageOffline: (chat_id: IChat['chat_id'], message: IMessage) => void;
  // Update a chat's messages with an array (e.g., from server sync)
  updateMessages: (chat_id: IChat['chat_id'], messages: IMessage[]) => void;
  clearMessages: () => void;
  setHydrated: () => void;
}

export const useMessageStore = create<
  State & Action,
  [['zustand/persist', unknown]] 
>(
  persist(
    (set) => ({
      user_message: {},
      isHydrated: false,
      addMessageOffline: (chat_id, message) => {
        set((state) => {
          const existing_data = state.user_message?.[chat_id!] ?? [];
          // Update the chat latest message in useChatStore

          return {
             // Return updated state with new message 
            user_message: {
              ...state.user_message,
              [chat_id!]: [...existing_data, {...message}]
            }
          }
        })
      },
      updateMessages: (chat_id, messages) => {
        set((state) => {
                    // Get existing messages that have a valid _id
          const existing_data = state.user_message?.[chat_id!]?.filter((msg) => msg?._id) || [];
          const update_data = 
            messages.reduce((acc, new_msg) => {
              const index = acc.findIndex(msg => msg._id === new_msg._id);
                if (index !== -1) {
                acc[index] = new_msg; // update existing
                } else {
                  acc.push(new_msg);  //add new
                }
                return acc
            }, [...existing_data] //start with a copy of existing
            ) || [];

          // Sort messages by createdAt ascending to maintain order
          const new_message = [...update_data]?.filter((msg) => 
            msg._id && msg.createdAt
          )?.sort((a,b) => a.createdAt!?.localeCompare(b.createdAt!))
          return {
            user_message: {
              ...state?.user_message,
              [chat_id!]: new_message, 
            }
          }
        })
      },
      clearMessages: () => {
        set(() => ({ user_message: {} }));
      },
      setHydrated: () => {
        set(() => ({ isHydrated: true }));
      },

    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
)