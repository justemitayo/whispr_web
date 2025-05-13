import instance from '../../Configs/Api';
import { GetUsersRequest, GetUsersResponse } from './types';

export async function getUsers(
  payload: GetUsersRequest,
): Promise<GetUsersResponse> {
  const response = await instance.get('/user/get_users', {
    params: payload,
  });
  return response.data;
}