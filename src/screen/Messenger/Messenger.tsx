import  {  useEffect, useMemo, useRef, useState } from 'react'
import './Messenger.css'
import Conversation from '../../Components/Cnversation/Conversation'
import Message from '../../Components/Message/Message'
import user from '../../assets/images/default_user_dark.jpg'
import { Online } from '../../Components/Online/Online'
import { useAuth } from '../../contexts/Auth/interface'
import { useChatStore } from '../../store/chat.store'
import { useOnlineStore } from '../../store/online.store'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '../../contexts/Socket/interface'
import { useMessageStore } from '../../store/message.store'
import {IMessage} from '../../interface/message'
import { INewMessage, IRequestChatMessages} from '../../interface/socket'
import { IChat } from '../../interface/chat'
import { truncate } from '../../slice/truncate';
import { MessageCipher } from '../../libs/Bytelock'
import { useGetUserChats } from '../../domain/Chat/hooks'

interface props {
  isSidebar: boolean
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Messenger = ({isSidebar, setIsSidebar}:props) => {

  // this is for conversation

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [recipientInfo, setRecipientInfo] = useState<IChat['recipient_info'] | null>(null)
  const [currentChat, setCurrentChat] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const socket = useSocket().socket;
  const updateChatMessage = useChatStore().updateChatMessage;
  const {user_message, updateMessages, isHydrated, addMessageOffline} = useMessageStore()
  const auth = useAuth().auth;
  const {chats: users} = useChatStore();
  const isOnline = useOnlineStore().isOnline;

  

  const { isPending, fetchNextPage, isFetching, refetch } = useGetUserChats({
    limit: 20,
    user_id: auth?.user?.user_id!,
    
  });
  console.log('DEBUG: auth.user:', auth?.user);
  console.log('DEBUG: isHydrated:', isHydrated);


  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
  
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
  
      const isBottom = scrollTop + clientHeight >= scrollHeight - 100;
      const isTop = scrollTop <= 0;
  
      if (isBottom && !isFetching) {
        fetchNextPage();
      }
  
      if (isTop && !isFetching) {
        refetch();
      }
    };
  
    container.addEventListener('scroll', handleScroll);
  
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching, fetchNextPage, refetch]);

    // Auto-close sidebar on resize if screen is wide
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setIsSidebar(false);
        }
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [setIsSidebar]);
  



  const [searchChat, setSearchChat] = useState<string>('');
  const filteredChats = users.filter(chat => {
    const fullName = chat?.recipient_info?.full_name?.toLowerCase().trim();
    const userName = chat?.recipient_info?.user_name?.toLowerCase().trim();
    const search = searchChat.toLowerCase().trim();
  
    return fullName?.includes(search) || userName?.includes(search);
  });

  //this is for the message portion of the screen
  const cipherKey =
  auth?.user?.user_id && recipientInfo?.user_id
    ? MessageCipher.generateCipherKey(auth.user.user_id, recipientInfo.user_id)
    : null;

  const [newMsg, setNewMsg] =  useState<string>('')
  const flatListRef = useRef<HTMLDivElement | null>(null);

  

  //get existing message from the store
  const chatMessages = useMemo(() => {
    if (!currentChatId) return [];
    return user_message?.[currentChatId] || [];
  }, [currentChatId, user_message]);

    //scroll down to last chat
    useEffect(() => {
      const timer = setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollTop = flatListRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [chatMessages?.length]);

      // Scroll on resize (keyboard open) and scroll the flatList
  useEffect(() => {
    const handleResize = () => {
      if (flatListRef.current) {
        flatListRef.current.scrollTop = flatListRef.current.scrollHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    // get chat messages using socket
  // Socket message listener
  useEffect(() => {
    if (!socket || !isHydrated) {return};

    //fetch latest message from the server
    const last_created_at =
      [...(chatMessages || [])]
        .reverse()
        .find(item => item?._id)?.createdAt || '';

        //this tell the backend "Send me new messages in this chat after last_created_at"
    socket.emit('request_user_messages', {
      chat_id: currentChatId,
      from: last_created_at,
    } as IRequestChatMessages);

    //if there is any message in the local message then we update the last message
    socket.on('get_user_messages', (data: IMessage[]) => {
      if ((data || []).length > 0 && currentChatId) {
        updateMessages(currentChatId, data);
        updateChatMessage(
          currentChatId,
          data.sort((a, b) => b?.createdAt!?.localeCompare(a?.createdAt!))?.[0],
          'receiving',
          queryClient,
          auth?.user?.user_id,
        );
      }
    });

    return () => {
      socket.off('get_user_messages');
    };
  }, [isHydrated, auth?.user?.user_id, currentChatId, queryClient, chatMessages, socket, updateChatMessage, updateMessages]);  


  const currentChats = users?.find(chat => chat.chat_id === currentChatId);
  const sendMessage = (msg: {data: IMessage['data']; type: IMessage['type']; }) => {
    if (!currentChatId || !auth?.user?.user_id || !currentChats) return;
    const date = new Date();

    const temp_msg: IMessage = {
      chat_id: currentChatId || '',
      data: msg.data,
      sender_id: auth?.user?.user_id,
      type: msg.type,
      status: 'U',
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };

    addMessageOffline(currentChatId, { ...temp_msg, status: 'N' });

    updateChatMessage(currentChatId, { ...temp_msg, status: 'N' }, 'sending', queryClient, auth?.user?.user_id);

    socket?.emit('send_message', {
      receiver_id: recipientInfo?.user_id,
      message: temp_msg,
    } as INewMessage);

    setNewMsg('');
  };

  //prepare the messge for sending
  const preSendMessage = (msg: { data: IMessage['data']; type: IMessage['type'] }) => {
    if (msg?.data) {
      if (msg?.type === 'Text') {
       const cipheredData = cipherKey !== null? MessageCipher.cipherMessage(msg.data, cipherKey): '';

        sendMessage({
          ...msg,
          data: cipheredData,
        });
      } else {
        sendMessage({ ...msg });
      }
    }
  };




  return (
    <div className='messenger'>
      <div className={`chat-menu ${isSidebar ? 'open' : ''}`}>
        <div className='menu-wrapper'>
          <div className='sidebar'>
            <input 
              placeholder='search for friends'
              className='menu-input'
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
            />
            <button className='close-btn' onClick={() => setIsSidebar(false)}>x</button>
        



          {isPending && users?.length === 0 ? (<p>Loading Chats...</p>) : (
              <div className='menu-top'          
               ref={scrollRef}>
              {(filteredChats || [])?.length > 0 ? (
                  filteredChats?.map((chat, index) => (
                    <div
                      key={`${chat.chat_id} - ${index}`}
                      onClick={() => {
                        setCurrentChatId(chat.chat_id ?? '');
                        setRecipientInfo(chat.recipient_info);
                        setCurrentChat(true);
                        setIsSidebar(false)
                      }}
                    >
                    <Conversation 
                      {...chat}
                      online={isOnline(chat?.recipient_info?.user_id || '')}
                    />
                    <Conversation 
                      {...chat}
                      online={isOnline(chat?.recipient_info?.user_id || '')}
                    />
                    <Conversation 
                      {...chat}
                      online={isOnline(chat?.recipient_info?.user_id || '')}
                    />
                    <Conversation 
                      {...chat}
                      online={isOnline(chat?.recipient_info?.user_id || '')}
                    />
                    <Conversation 
                      {...chat}
                      online={isOnline(chat?.recipient_info?.user_id || '')}
                    />
                    <Conversation 
                      {...chat}
                      online={isOnline(chat?.recipient_info?.user_id || '')}
                    />
                  </div>
                ))):(
                  <span className='conversation-text' style={{fontSize:"2rem"}}>No Chat Found!</span>
                )
              }
                </div>
          )}
            </div>
        </div> 
      </div>
      <div className='chat-box'>
        {/* <div className='box-wrapper'> */}

          { currentChat && recipientInfo ?
            <>
              <div className='chat-header'>
                <div className='chat-header-top'>
                  <span onClick={() => setCurrentChat(false)} style={{marginLeft:'1rem', marginRight:'0.5rem', fontSize:'1.4rem', cursor:'pointer'}}>x</span>
                  <div style={{position:'relative'}}>
                    <img alt='' src={recipientInfo.profile_picture? recipientInfo.profile_picture: user} style={{width:'3.5rem', height:'3.5rem', borderRadius:"50%"}} />
                    <Online rightOffset={4} online={isOnline(recipientInfo?.user_id || '')}/>
                  </div>
                  <div style={{display:'flex', flexDirection:"column", width:'contain'}}>
                    <span>{truncate(recipientInfo?.user_name || '', 23)}</span>
                    <span>{truncate(recipientInfo?.bio || '', 40)}</span>
                  </div> 
                </div>
              </div>
              {!isHydrated ? <span>Loading Screen</span> : 
                <div className='box-top' ref={flatListRef}>
                {(chatMessages || []).length === 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
                   <span style={{ fontSize: '15px', color: '#999' }}>No Messages Found!</span>
                  </div>
                ) : (
                chatMessages.map((item, index) => (
                  <Message 
                    key={`${item._id} - ${index}`}
                    {...item}
                    chat_recipient_id={recipientInfo?.user_id || ''}
                  />
                )))}
                </div>
              }
              <div className='box-bottom'>
                <textarea 
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  autoComplete='off'
                  autoCorrect='off'
                  placeholder='Start typing...'
                  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      preSendMessage({ type: 'Text', data: newMsg });
                    }
                  }}
                />
                <button
                  onClick={() => {
                    preSendMessage({
                      type:'Text',
                      data: newMsg
                    })
                  }}
                  disabled={!newMsg}  
                >send</button>
              </div> 
            </> 
            : <span className='conversation-text'>Open a Conversation to Start a Chat.</span>
          }
        </div>
      {/* </div> */}
    </div>
  )
}

export default Messenger