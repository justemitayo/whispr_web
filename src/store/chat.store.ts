import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { IChat } from "../interface/chat";
import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { IMessage } from "../interface/message";
import { IMessageStat } from "../interface/socket";
import { GetUserChatsResponse } from "../domain/Chat/types";

type State ={
  chats: IChat[];
  isHydrated: boolean; 
}
type Action ={
  addChat: (chat: IChat, queryClient?: QueryClient, userId?: String) => void;
  updateChat: (chats: IChat[]) => void;
  updateChatMessage: (
    chat_id: IChat['chat_id'],
    message: IMessage,
    stat: IMessageStat,
    queryClient?:QueryClient,
    userId?: string
  ) => void;
  clearChat: () => void;
  setHydrated: () => void;
}

export const useChatStore = create<
  State & Action,
  [['zustand/persist', unknown]] 
>(
  persist(
    (set, get) => ({
      chats: [],
      isHydrated: false,
      addChat: (chat, queryClient, userId) => {
        set(() => {
          if (queryClient && userId) {
            queryClient.invalidateQueries({queryKey: ['getUserChats', userId]})
            // triggers the old data to be updated
          }
          

          return {
            chats: [...get().chats, { ...chat }]?.sort((a, b) =>
              b?.updated_at!?.localeCompare(a?.updated_at!),

            // localeCompare() is used to compare two date strings (assuming updated_at is a string in ISO format).
            // b.localeCompare(a) results in a descending order (most recent chats first).
            // The ! is the non-null assertion operator (TypeScript), telling the compiler you’re sure updated_at is not null or undefined.
            ),
          };
        })
      },
      updateChat: (chats) => {
        //putting the latest message first
        set(() => ({
            chats: [...chats]?.sort((a, b) =>
            b?.updated_at!?.localeCompare(a?.updated_at!)
          )
        }))
      },
      updateChatMessage: (chat_id, message, stat, queryClient, userId) => {
        set((state) => {
              // Find the chat in the state that matches chat_id
          const chat_to_update = state.chats?.find((check) => check?.chat_id === chat_id);

              // Cancel any ongoing fetches for the user's chats to avoid race conditions
          if(chat_to_update && message?.data) {
            if(queryClient && userId){
              queryClient.cancelQueries({queryKey: ['getUserChats', userId]});
              // cancels the one in addchat

              const old_chat: InfiniteData<GetUserChatsResponse> | undefined = 
                queryClient.getQueryData(['getUserChats', userId]);

                  // 🔒 prevent crash if no cache exists yet
              if (!old_chat || !Array.isArray(old_chat.pages)) {
                return state; // or skip queryClient.setQueryData completely
              }


                // Create a new updated version of the cached data, updating the chat message info
              const new_chat: InfiniteData<GetUserChatsResponse> | undefined = 
                {
                  // pageParams keeps track of the parameters or cursors used to fetch each page of the infinite list. For example, if you're paginating with a cursor or page number, pageParams stores those values so React Query knows how to fetch the next page.
                  pageParams: old_chat?.pageParams!,
                  pages: old_chat?.pages?.map((page) => {
                    return{
                      ...page,
                      data:{
                        page: page.data?.page,
                        items: page.data?.items?.map((item) => {
                          if(item.chat_id === chat_id) {
                            return{
                              ...item,
                              created_at: message?.createdAt,
                              updated_at: message?.updatedAt,
                              last_message_info: {
                                ...item?.last_message_info,
                                at: message?.createdAt,
                                data: message?.data,
                                type: message?.type,
                                status: message?.status,
                                sender_id: message?.sender_id,
                                unread:
                                  stat === 'sending'
                                    ? 0
                                    : (item?.last_message_info?.unread || 0) +
                                      1,
                              },
                            }
                          }
                          return item;
                          // this is closeout for items?.map
                        })
                      }
                    }
                  })as GetUserChatsResponse[],
                }
                // end of const newChat 
              queryClient.setQueryData(['getUserChats', userId], new_chat);
              queryClient.resumePausedMutations();
            }
            // the return below is for if(queryClient && userId){
            //  Update the local zustand state with the new chat info
            return{
              chats: [...state.chats]?.map((ch) => {
                if (ch?.chat_id === chat_to_update?.chat_id) {
                  return {
                    ...ch,
                    created_at: message?.createdAt,
                    updated_at: message?.updatedAt,
                    last_message_info: {
                      ...ch?.last_message_info,
                      at: message?.createdAt,
                      data: message?.data,
                      type: message?.type,
                      status: message?.status,
                      sender_id: message?.sender_id,
                      unread:
                        stat === 'sending'
                          ? 0
                          : (ch?.last_message_info?.unread || 0) + 1,
                    },
                  };
                }
                return ch
              })
              ?.sort((a, b) => b?.updated_at!?.localeCompare(a?.updated_at!)),
            }
          } else {
            return state
          }
        })
      },
      clearChat: () => {
        set(() => ({ chats: [] }));
      },
      setHydrated: () => {
        set(() => ({ isHydrated: true }));
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    }
  )
)