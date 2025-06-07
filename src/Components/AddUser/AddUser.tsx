import React from 'react'
import { AddUserProp } from './add-user_props'
import { useChatStore } from '../../store/chat.store'
import { useAuth } from '../../contexts/Auth/interface';
import { useSocket } from '../../contexts/Socket/interface';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateChat } from '../../domain/Chat/hooks';
import { INewChat } from '../../interface/socket';
import { showNotification } from '../../services/notification';
import Swal from 'sweetalert2';
import './AddUser.css'

const AddUser = ({
  user,
  currentUser,
  setAllUser
}:AddUserProp) => {
  const {chats, addChat} = useChatStore();
  const auth = useAuth().auth;
  const socket =useSocket().socket;
  const queryClient = useQueryClient();
  const createChat = useCreateChat();

  //if the chat exists
  const  chatExist = chats.some((chat) => chat?.recipient_info?.user_id === user?.user_id)

  // if the user exist
  const isUser = user?.user_id === currentUser?.user?.user_id

  // creating the new chat with our query, api, store and socket
  const createNewChat = () => {
    createChat.mutate(
      {recipient_id: String(user?.user_id)},
      {
        onError: (error: any) => {
          showNotification({
            title: 'Warning',
            message: `adding @${auth?.user?.full_name} failed`,
            type:'warning'
          })
        },
        onSuccess: (data, variables, _context) => {
          if(data?.data?.chat_id){
            addChat({...data.data}, queryClient, auth?.user?.user_id)
            socket?.emit('add_new_chat', {
              receiver_id: variables.recipient_id,
              chat: {
                chat_id: data.data.chat_id,
                created_at: data.data.created_at,
                updated_at: data.data.updated_at,
                recipient_info: {
                  bio: auth?.user?.bio,
                  full_name: auth?.user?.full_name,
                  phone_number: auth?.user?.phone_number,
                  profile_picture: auth?.user?.profile_picture,
                  user_id: auth?.user?.user_id,
                  user_name: auth?.user?.user_name,
                },
              },
            } as INewChat);
            setAllUser(false)
            showNotification({
              title: `@${user?.user_name} added!`,
              message: `You can now chat with @${user?.user_name}`,            
            })
          } else {
            showNotification({
              title: 'Error',
              message: data.msg || '',
              type: 'error',
            })
          }
        }
      }
    )
  }

  const confirmNewChat = async() =>{
    const result = await Swal.fire({
      title: 'Add Friend?',
      text: `Do you want to add @${user?.user_name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Add Friend',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      createNewChat();
    }
  }

  return (
    <div>
      <button className='addUser'
        onClick={confirmNewChat}
        disabled={chatExist || isUser || createChat.isPending}
      >Add</button>
    </div>
  )
}

export default AddUser