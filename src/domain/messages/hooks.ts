import {  useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
import { createMessage, getChatMessages } from "./api";
import {
  CreateMessageRequest, GetUserMessagesRequest, CreateMessageResponse, GetUserMessagesResponse,
} from './types';
import { useMessageStore } from '../../store/message.store';
import { useChatStore } from '../../store/chat.store';
import { useEffect } from 'react';

export const useCreateMessage = (): UseMutationResult<CreateMessageResponse, Error, CreateMessageRequest> => {
  return useMutation<CreateMessageResponse, Error, CreateMessageRequest>({
    mutationFn: createMessage,
  });
};
 
export const useGetChatMessages = ({chat_id} : {chat_id: GetUserMessagesRequest['chat_id']}) => {
  const { updateMessages, user_message, isHydrated } = useMessageStore();
  const updateChatMessage = useChatStore().updateChatMessage;

  const last_created_at: string =
  [...(user_message?.[chat_id] || [])]?.reverse()?.find(item => item?._id)
    ?.createdAt || '';

  const query = useQuery<GetUserMessagesResponse, Error>({
    queryKey: ['getChatMessages', chat_id],
    queryFn: () => 
      getChatMessages({
        chat_id: chat_id,
        from: last_created_at
      }),
        refetchIntervalInBackground: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        enabled: isHydrated,
        refetchInterval: 1 * 60 * 1000,   // TODO: Find a suitable time
        refetchOnMount: true,
  });
  useEffect (() => {
    if(query.isSuccess && query?.data?.data?.length){

      const sortedMessages = [...query.data.data].sort((a, b) =>
        a.createdAt!.localeCompare(b.createdAt!));

        updateMessages(chat_id, sortedMessages );
        updateChatMessage(
          chat_id,
          sortedMessages[sortedMessages.length - 1], // latest message
          'receiving',
        );
    }
  }, [query.isSuccess, query.data, chat_id, updateChatMessage, updateMessages]);
  return query;
}