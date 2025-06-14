import React from 'react'
import './Conversation.css';
import { Online } from '../Online/Online';
import { ConversationProps } from './conversation_props';
import TimeAgo from 'javascript-time-ago';
import profile from '../../assets/images/default_user_dark.jpg';
import { truncate } from '../../slice/truncate';
import notSent from '../../assets/svg/not-sent.svg';
import tick from '../../assets/svg/tick.svg';
import orange from '../../assets/svg/orange-tick.svg';
import doubletick from '../../assets/svg/double-tick.svg';
import { useAuth } from '../../contexts/Auth/interface';
import { MessageCipher } from '../../libs/Bytelock';

const timeAgo = new TimeAgo('en-US');
const Conversation = (
  {
    online,
    recipient_info,
    last_message_info
  }:ConversationProps
) => {
  const auth = useAuth().auth;
  const messageDate = last_message_info?.at ? new Date(last_message_info.at) : null;

  const is_user = auth?.user?.user_id === last_message_info?.sender_id;

  const senderId = last_message_info?.sender_id;
  const recipientId = is_user ? recipient_info?.user_id : auth?.user?.user_id;
  
  let deciphered_text = '';
  
  if (senderId && recipientId && last_message_info?.type === 'Text') {
    try {
      const cipherKey = MessageCipher.generateCipherKey(senderId, recipientId);
      deciphered_text = MessageCipher.decipherMessage(
        String(last_message_info.data),
        cipherKey
      );
    } catch (err) {
      console.error('Decryption failed:', err);
      deciphered_text = '[Unable to decrypt message]';
    }
  }
  
  return (
    <div className='conversation'>
      <div className='conversation-content'>
          <img  alt='' src={recipient_info?.profile_picture? recipient_info?.profile_picture : profile}/>
          <Online rightOffset={20} online={online || false} />
      </div>
        <div className='conversation-component'>
          <div className='conversation-left'>
            <span>{truncate(recipient_info?.user_name || '', 23)}</span>
            <span>{messageDate? timeAgo.format(
              new Date(last_message_info?.at || '').getTime()
            ): ''}</span>
          </div>
          <div className='conversation-bottom'>
            <p style={{color:'gray', fontSize:'0.9rem'}}>
              {
              // truncate(last_message_info?.data || '', 40)
              deciphered_text
              ||`send a mesage to ${truncate(recipient_info?.full_name || '', 40)}...`}</p>
            { last_message_info?.data ? (
              <div className='conversation-side'>
                {typeof last_message_info?.unread === 'number' && last_message_info?.unread > 0 ? 
                  (<div style={{width:'1.3rem', height:'1.3rem', borderRadius:'50%', backgroundColor:'rgb(104, 42, 9)', display:'flex', alignItems:'center', justifyContent:'center'}}><span className='style-ish'>{last_message_info?.unread>9 ? '9+' : last_message_info?.unread.toString()}</span></div>)
                  :
                  last_message_info?.status === 'N' ? <img  alt='' src={notSent} className='notsent'/> : last_message_info?.status === 'U' ?<img alt='' src={tick} className='tick'/> : last_message_info?.status === 'D' ? <img alt='' src={doubletick} className='tick'/>: <img alt='' src={orange} className='tick'/> 
                }
              </div>
            ): 
            <div className='new-icon'><p>new</p></div>
            }
          </div>
        </div>

    </div>
  )
}

export default Conversation