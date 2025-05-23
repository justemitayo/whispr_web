import React from 'react'
import './Messenger.css'
import Conversation from '../../Components/Cnversation/Conversation'
import Message from '../../Components/Message/Message'

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
          <div className='box-top'>
            <Message own={false}/>
            <Message own={true}/>
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
            <Message own={false} />
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