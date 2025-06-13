import { useInfiniteQuery, type InfiniteData, useMutation } from '@tanstack/react-query';
import { createChat, getUserChats } from './api';
import { GetUserChatsRequest, CreateChatRequest, CreateChatResponse, GetUserChatsResponse, } from './types';
import { useChatStore } from '../../store/chat.store';
import { IChat } from '../../interface/chat';
import { useEffect } from 'react';


export const useCreateChat = () => {
  return useMutation<CreateChatResponse, Error, CreateChatRequest>({
    mutationFn: createChat,
  });
};

export const useGetUserChats = (payload: GetUserChatsRequest) => {

  const { updateChat, isHydrated } = useChatStore();

  const query = useInfiniteQuery<GetUserChatsResponse, Error, InfiniteData<GetUserChatsResponse>, [string, string], number>({
    queryKey: ['getUserChats', payload.user_id],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getUserChats({
        user_id: payload.user_id,
        page: pageParam,
        limit: payload.limit || 20,
      }),
      getNextPageParam: (lastPage,  _allPages): number | undefined => {
        const nextPage = lastPage?.data?.page?.next_page
        return nextPage ? nextPage : undefined;
      },
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      enabled: isHydrated,
  });
  useEffect(() => {
    if (query.isSuccess && query.data){
        const userChatsData: IChat[] =
          (query?.data?.pages || [])
          ?.flatMap((page) => page?.data || [])
          ?.flatMap((item) => item?.items || []) || [];


        updateChat(userChatsData);
    }
  }, [query.isSuccess, query.data, updateChat]);
  return query;
}

