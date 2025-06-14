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
  const isReady = !!payload.user_id && isHydrated;

  console.log('useGetUserChats → isHydrated:', isHydrated, 'payload.user_id:', payload.user_id);

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
        if (!lastPage?.data?.page) {
          console.warn('getNextPageParam: lastPage or page data is missing', lastPage);
          return undefined;
        }

        const nextPage = lastPage?.data?.page?.next_page;
        return nextPage && nextPage > 0 ? nextPage : undefined;
      },
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      enabled: isReady,
  });
  useEffect(() => {
    // console.log('DEBUG: query state', {
    //   isHydrated,
    //   isReady,
    //   isSuccess: query.isSuccess,
    //   isError: query.isError,
    //   isLoading: query.isPending,
    //   error: query.error,
    //   data: query.data,
    // });
    if (!query.isSuccess || !query.data || !Array.isArray(query.data.pages)) {
      console.warn("⚠️ query.data is undefined or invalid:", query.data);
      return;
    }


    if (query.isSuccess && query.data&& Array.isArray(query?.data?.pages)){
        const userChatsData: IChat[] =
          (query.data?.pages || [])
          ?.flatMap((page) => page?.data || [])
          ?.flatMap((item) => item?.items || []) || [];


        updateChat(userChatsData);
    }else {
      console.warn('❌ query not successful', query.data)
    }


  }, [query.isSuccess, query.data, updateChat, query.isError]);


  return query;
}

