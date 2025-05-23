import React from 'react'
import './Message.css'
import user from '../../assets/images/default_user_dark.jpg'

const Message = ({own}:any) => {
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className='message-top'>
        <img alt=''
          src={user}
        />
        <p className='message-text'>Hello this  is a message Lorem ipsum, dolor sit amet consectetur adipisicing elit. </p>
      </div>
      {/* <div className='message-bottom'> */}
        <p className='message-bottom'>1 hour ago</p>
      {/* </div> */}
    </div>
  )
}

export default Message