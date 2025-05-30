import { IMessage } from '../../interface/message';

// Create Message
export interface CreateMessageRequest
  extends Pick<IMessage, 'chat_id' | 'type' | 'data'> {}
export interface CreateMessageResponse extends ServerResponse<string> {}

// Get Chat Messages
export interface GetUserMessagesRequest {
  chat_id: string;
  from: string;
}
export interface GetUserMessagesResponse extends ServerResponse<IMessage[]> {}
