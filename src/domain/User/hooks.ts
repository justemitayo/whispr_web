import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from './api';
import { GetUsersRequest, GetUsersResponse } from './types';

export const useGetUsers = (payload: GetUsersRequest) => {
  return useInfiniteQuery<GetUsersResponse, Error, GetUsersResponse,  [string, string, number?],  number  >({
  queryKey: ['getUsers', payload.search, payload.limit],
  initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getUsers({
        search: payload.search,
        page: pageParam,
        limit: payload.limit || 20,
      }),
      getNextPageParam: (lastPage: GetUsersResponse) => {
        const nextPage = lastPage?.data?.page.next_page;
        return nextPage ? nextPage : undefined;
      },
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      enabled: !!payload.search,

});
}



