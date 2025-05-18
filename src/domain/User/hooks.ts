import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { getUsers } from './api';
import { GetUsersRequest, GetUsersResponse } from './types';

export const useGetUsers = (payload: GetUsersRequest) => {
  return useInfiniteQuery<GetUsersResponse, Error,  InfiniteData<GetUsersResponse>, [string, string], number>({
  queryKey: ['getUsers', payload.search],
  initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getUsers({
        search: payload.search,
        page: pageParam,
        limit: payload.limit || 20,
      }),
      getNextPageParam: (lastPage,  _allPages): number | undefined => {
        const nextPage = lastPage?.data?.page.next_page;
        return nextPage ? nextPage : undefined;
      },
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      // enabled: !!payload.search

});
}



