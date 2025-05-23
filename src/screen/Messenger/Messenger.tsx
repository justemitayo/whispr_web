import React from 'react'
import './Messenger.css'
import Conversation from '../../Components/Cnversation/Conversation'
import Message from '../../Components/Message/Message'
import user from '../../assets/images/default_user_dark.jpg'
import { Online } from '../../Components/Online/Online'

const Messenger = () => {
  return (
    <div className='messenger'>
      <div className='chat-menu'>
        <div className='menu-wrapper'>
          <input 
            placeholder='search for friends'
            className='menu-input'
          />
          <div className='menu-top'>
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
          </div>
        </div>
      </div>
      <div className='chat-box'>
        <div className='box-wrapper'>
          <div className='chat-header'>
            <div className='chat-header-top'>
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
        </div>
      </div>
    </div>
  )
}

export default Messenger