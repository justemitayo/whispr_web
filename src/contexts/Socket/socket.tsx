import { useEffect, useState } from 'react';
import { SocketContext, ISocketProvider } from './interface';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../Auth/interface';
import { useChatStore } from '../../store/chat.store';
import { useMessageStore } from '../../store/message.store';
import { useOnlineStore } from '../../store/online.store';
import { useQueryClient } from '@tanstack/react-query';
import { EnvConfig } from '../../Utils/get-env';
import { IOnlineUser } from '../../interface/socket';
import { IChat } from '../../interface/chat';
import { showNotification } from '../../services/notification';
import { IMessage } from '../../interface/message';

export const SocketProvider: ISocketProvider = function SocketProvider({ children }) {
  const [socket, setSocket] = useState<Socket| null>(null);
  const auth = useAuth().auth;
  const {chats, addChat} = useChatStore();
  const updateChatMessage = useChatStore().updateChatMessage;
  const addMessageOffline = useMessageStore().addMessageOffline;
  const updateMessages = useMessageStore().updateMessages;
  const updateOnlineUsers = useOnlineStore().updateOnlineUsers;
  const queryClient = useQueryClient();

   // start socket connection
  useEffect(() => { 
    const newSocket = io(EnvConfig.baseURL, {
      query: {
        userId: auth?.user?.user_id
      },
    })
    setSocket(newSocket);
    return() => {
      newSocket.disconnect();
    }
  }, [auth]);
  
  //online users
  useEffect(() => { 
    if (!socket) {
      return;
    }
    socket.emit('add_new_online_user');
    socket.on('get_online_users', (data: IOnlineUser[]) =>{
      updateOnlineUsers(data)
    })

    return () => {
      socket.off('get_online_users');
    };

  }, [socket, updateOnlineUsers]);

  //new chat recieved
  useEffect(() => { 
    if(!socket){
      return
    }
    socket.on('recieve_new_chat', (data: IChat) => {
      if(data?.chat_id){
        addChat({...data}, queryClient, auth?.user?.user_id)
      }
      showNotification({
        title: `@${data.recipient_info?.user_name} is now your friend!`,
        message: 'Start chatting with them now...',
      });
    })
    return () => {
      socket.off('recieve_new_chat');
    };
  }, [socket, addChat, queryClient, auth?.user?.user_id]);

  //new message recieved
  useEffect(() => { 
    if(!socket){
      return
    }
    socket.on('get_message', (data: IMessage) => {
      if (data?.data) {
        addMessageOffline(data.chat_id, data);
        updateChatMessage(
          data.chat_id!,
          data,
          'receiving',
          queryClient,
          auth?.user?.user_id
        );
      }
    });
    return () => {
      socket.off('get_message');
    };
  }, [socket, addMessageOffline, updateChatMessage, queryClient, auth?.user?.user_id, chats]);

  //new message sent
  useEffect(() => { 
    if(!socket){
      return
    }
    socket.on('message_sent', (data: IMessage) => {
      if (data?.data) {
        updateMessages(data.chat_id, [data]);
        updateChatMessage(
          data.chat_id,
          data,
          'sending',
          queryClient,
          auth?.user?.user_id
        );
      }
    });

    return () => {
      socket.off('message_sent');
    };
  }, [socket,updateMessages,updateChatMessage, queryClient, auth?.user?.user_id]);

  //message read
  useEffect(() => { 
    if(!socket){
      return
    }
    socket.on('message_read', (data: IMessage) => {
      if (data?.data) {
        updateMessages(data.chat_id, [data]);
        updateChatMessage(
          data.chat_id,
          data,
          'sending',
          queryClient,
          auth?.user?.user_id
        );
      }
    });
    return () => {
      socket.off('message_read');
    };
  }, [socket, updateMessages, updateChatMessage, queryClient, auth?.user?.user_id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket, 
      }}>
      {children}
    </SocketContext.Provider>
  );
}