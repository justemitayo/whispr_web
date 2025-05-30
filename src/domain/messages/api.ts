import instance from "../../Configs/Api";
import {
  CreateMessageRequest,
  GetUserMessagesRequest,
  CreateMessageResponse,
  GetUserMessagesResponse,
} from './types';

export async function createMessage(
  payload: CreateMessageRequest,
): Promise<CreateMessageResponse> {
  const response = await instance.post('/message/create', payload);
  return response.data;
}

export async function getChatMessages(
  payload: GetUserMessagesRequest,
): Promise<GetUserMessagesResponse> {
  const response = await instance.get(
    `/message/get_messages/${payload.chat_id}`,
    { params: { from: payload.from } },
  );
  return response.data; 
}