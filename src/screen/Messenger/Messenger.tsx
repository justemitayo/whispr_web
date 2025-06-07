import React, { useState } from 'react'
import './Messenger.css'
import Conversation from '../../Components/Cnversation/Conversation'
import Message from '../../Components/Message/Message'
import user from '../../assets/images/default_user_dark.jpg'
import { Online } from '../../Components/Online/Online'
import { useAuth } from '../../contexts/Auth/interface'
import { useChatStore } from '../../store/chat.store'
import { useOnlineStore } from '../../store/online.store'

const Messenger = () => {

  // const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(false);
  const auth = useAuth().auth;
  const {chats: users} = useChatStore();
  const isOnline = useOnlineStore().isOnline


  const [searchChat, setSearchChat] = useState<string>('');
  const filteredChats =
    users.filter(
      chat =>
        chat?.recipient_info?.full_name?.includes(searchChat) ||
        chat.recipient_info?.user_name?.includes(searchChat),
  ) || [];

  return (
    <div className='messenger'>
      <div className='chat-menu'>
        <div className='menu-wrapper'>
          <input 
            placeholder='search for friends'
            className='menu-input'
            value={searchChat}
            onChange={(e) => setSearchChat(e.target.value)}
          />
          <div className='menu-top' onClick={() => setCurrentChat(true)}>
          {(filteredChats || [])?.length > 0 ? (
            filteredChats?.map((chat, index) => (
            <Conversation 
              key={`${chat.chat_id} - ${index}`}
              {...chat}
              online={isOnline(chat?.recipient_info?.user_id || '')}
            />
          ))):(
            <span className='conversation-text' style={{fontSize:"2rem"}}>No Text Found!</span>
          )
        }
          </div>
        </div> 
      </div>
      <div className='chat-box'>
        <div className='box-wrapper'>
          { currentChat ?
            <>
              <div className='chat-header'>
                <div className='chat-header-top'>
                <span onClick={() => setCurrentChat(false)} style={{marginLeft:'1rem', marginRight:'0.5rem', fontSize:'1.4rem', cursor:'pointer'}}>x</span>
                  <div style={{position:'relative'}}>
                    <img alt='' src={user} style={{width:'3.5rem', height:'3.5rem', borderRadius:"50%"}} />
                    <Online />
                  </div>
                  <div style={{display:'flex', flexDirection:"column"}}>
                    <span>John Doe</span>
                    <span>heyy</span>
                  </div> 
                </div>
              </div>
              <div className='box-top'>
                <Message own={false}/>
                <Message own={true}/>
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={true}/>
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={true}/>
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
                <Message own={true}/>
                <Message own={false} />
                <Message own={false} />
                <Message own={false} />
              </div>
              <div className='box-bottom'>
                <textarea 

                />
                <button>send</button>
              </div> 
            </> : <span className='conversation-text'>Open a Conversation to Start a Chat.</span>
          }
        </div>
      </div>
    </div>
  )
}

export default Messenger