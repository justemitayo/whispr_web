import React from 'react'
import './Conversation.css';
import { Online } from '../Online/Online';
import { useAuth } from '../../contexts/Auth/interface';
import { ConversationProps } from './conversation_props';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import profile from '../../assets/images/default_user_dark.jpg';
import { truncate } from '../../slice/truncate';
import notSent from '../../assets/svg/not-sent.svg';
import tick from '../../assets/svg/tick.svg';
import doubletick from '../../assets/svg/double-tick.svg';


TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');
const Conversation = (
  {
    online,
    chat_id,
    recipient_info,
    last_message_info
  }:ConversationProps
) => {
  const auth = useAuth().auth;
  const messageDate = last_message_info?.at ? new Date(last_message_info.at) : null;

  return (
    <div className='conversation'>
      <div className='conversation-content'>
          <img  alt='' src={recipient_info?.profile_picture? recipient_info?.profile_picture : profile}/>
          <Online rightOffset={20} online={online || false} />
      </div>
        <div className='conversation-component'>
          <div className='conversation-left'>
            {/* <span>{truncate(recipient_info?.user_name || '', 23)}</span> */}
            <span>john doe</span>
            <span>{messageDate? timeAgo.format(
              new Date(last_message_info?.at || '').getTime()
            ): ''}</span>
          </div>
          <div className='conversation-bottom'>
            <p style={{color:'gray', fontSize:'0.9rem'}}>{`send a mesage to ${truncate(recipient_info?.full_name || '', 40)}...`}</p>
            { last_message_info?.data ? (
              <>
                {typeof last_message_info?.unread === 'number' && last_message_info?.unread > 0 ? 
                  (<p>{last_message_info?.unread>9 ? '9+' : last_message_info?.unread.toString()}</p>)
                  :
                  last_message_info?.status === 'N' ? <img  alt='' src={notSent} className='notsent'/> : <img alt='' src={last_message_info?.status === 'U' ? tick : doubletick } className='tick'/>
                }
              </>
            ): 
            <div className='new-icon'><p>new</p></div>
            }
          </div>
        </div>

    </div>
  )
}

export default Conversation