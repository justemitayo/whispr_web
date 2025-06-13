import { IMessage } from '../../interface/message';


export interface MessageBoxProps extends IMessage {
  chat_recipient_id: string;
}