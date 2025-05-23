import React from 'react'
import './Conversation.css';
import user from '../../assets/images/default_user_dark.jpg'
import { Online } from '../Online/Online';

const Conversation = () => {
  return (
    <div className='conversation'>
      <div className='conversation-content'>
        <img  alt='' src={user}/>
        <Online rightOffset={15} />
      </div>
      <span>John Doe</span>
    </div>
  )
}

export default Conversation