import instance from '../../Configs/Api';
import { GetUsersRequest, GetUsersResponse } from './types';

export async function getUsers(
  payload: GetUsersRequest,
): Promise<GetUsersResponse> {
  const response = await instance.get('/user/get_users', {
    params: payload,
    // params is used with GET requests to send query parameters (e.g., ?search=foo&page=1&limit=20) in the URL.
  });
  console.log(response.data, 'iamamigo')

  return response.data;


}