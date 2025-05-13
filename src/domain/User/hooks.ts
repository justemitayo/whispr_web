import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from './api';
import { GetUsersRequest } from './types';

export const useGetUsers = (payload: GetUsersRequest) => {
  return useInfiniteQuery(
    ['getUsers', payload.search, payload.limit],
    ({ pageParam = 1 }) =>
      getUsers({
        search: payload.search,
        page: pageParam,
        limit: payload.limit || 20,
      }),
    {
      getNextPageParam: (lastPage, _allPages) => {
        const nextPage = lastPage?.data?.page?.next_page;
        return nextPage ? nextPage : undefined;
      },
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  );
}



