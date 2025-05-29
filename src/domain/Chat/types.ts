import { IChat } from '../../interface/chat';

// Create Chat
export interface CreateChatRequest {
  recipient_id: string;
}
export interface CreateChatResponse extends ServerResponse<IChat> {}

// Get User Chats
export interface GetUserChatsRequest extends ServerPaginationRequest {
  user_id: string;
}
export interface GetUserChatsResponse
  extends ServerResponse<ServerPaginationResponse<IChat>> {}
