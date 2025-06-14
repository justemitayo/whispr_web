import instance from "../../Configs/Api";

import {
  CreateChatRequest,
  GetUserChatsRequest,
  CreateChatResponse,
  GetUserChatsResponse,
} from './types';

export async function createChat(
  payload: CreateChatRequest,
): Promise<CreateChatResponse> {
  const response = await instance.post('/chat/create', payload);
  return response.data;
}

export async function getUserChats(
  payload: GetUserChatsRequest,
): Promise<GetUserChatsResponse> {
  const response = await instance.get(`/chat/get_chats/${payload.user_id}`, {
    params: {
      page: payload.page,
      limit: payload.limit,
    },
  });

  console.log('👀 API response from getUserChats:', response.data);
  return response.data;
}
