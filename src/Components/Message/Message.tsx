import React, { useEffect } from 'react'
// import './Message.css'
import user from '../../assets/images/default_user_dark.jpg'
import notSend from '../../assets/svg/not-sent.svg'
import tick from '../../assets/svg/tick.svg';
import doubletick from '../../assets/svg/double-tick.svg';
import { MessageBoxProps } from './MessageProps'
import { useAuth } from '../../contexts/Auth/interface'
import { useSocket } from '../../contexts/Socket/interface'
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { IMessage } from '../../interface/message';
import { MessageCipher } from '../../libs/Bytelock';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const Message = ({
  data,
  createdAt,
  sender_id,
  status,
  chat_recipient_id,
  type,
  _id,
  chat_id,
  updatedAt,
}: MessageBoxProps) => {
  const auth = useAuth().auth;
  const socket = useSocket().socket;

  const is_user: boolean = auth?.user?.user_id === sender_id;

  const cipherKey = MessageCipher.generateCipherKey(
    sender_id!,
    is_user ? chat_recipient_id : auth?.user?.user_id!,
  );
  const decipheredText =
    type === 'Text' ? MessageCipher.decipherMessage(data!, cipherKey) : '';

  useEffect(() => {
    if (!socket || status === 'N') {
      return;
    }

    if (status !== 'R' && sender_id !== auth?.user?.user_id) {
      socket.emit('on_message_read', {
        _id,
        chat_id,
        createdAt,
        data,
        sender_id,
        status,
        type,
        updatedAt,
      } as IMessage);
    }
  }, [
    socket,
    _id,
    chat_id,
    createdAt,
    data,
    sender_id,
    status,
    type,
    updatedAt,
    auth?.user?.user_id,
  ]);

  return (
    <div
  style={{
    display: 'flex',
    flexDirection: is_user ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    marginBottom: '17px',
    maxWidth: '100%',
  }}
>
  {/* Avatar */}
  <img
    src={is_user? auth?.user?.profile_picture : user } 
    alt='Profile'
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      objectFit: 'cover',
      marginLeft: is_user ? '12px' : '0',
      marginRight: is_user ? '0' : '12px',
    }}
  />

  {/* Message bubble */}
  <div
    style={{
      marginLeft: is_user ? 'auto' : undefined,
      minWidth: '75%',
      maxWidth: '75%',
      cursor: 'pointer',
      marginTop:'0.5rem',
      color:'white'
    }}
  >
    <div
      style={{
        minHeight: '50px',
        padding: '10px',
        paddingBottom: is_user ? '6px' : '10px',
        borderRadius: '12px',
        border: is_user ? '1px solid #ccc' : 'none',
        borderBottomLeftRadius: is_user ? '12px' : '0',
        borderBottomRightRadius: is_user ? '0' : '12px',
        backgroundColor: is_user ? 'transparent' : 'rgb(104, 42, 9)',
      }}
    >
      <p
        style={{
          color: is_user ? '#888' : '#fff',
          fontSize: '15px',
          margin: 0,
          whiteSpace: 'pre-wrap',
        }}
      >
        {decipheredText || 'hahaha'}
      </p>

      {is_user && (
        <>
          {status === 'N' ? (
            <img
              src={notSend}
              alt='Not Sent'
              style={{ width: 14, height: 14, marginTop: 4, backgroundColor:'yellow' }}
            />
          ) : (
            <img
              src={status === 'U' ? tick : doubletick}
              alt='Sent Status'
              style={{ width: status === 'U' ? 14 : 24, height: 'auto', marginTop: 4, backgroundColor:'yellow',display:"flex", alignContent:'flex-end'}}
            />
          )}
        </>
      )}
    </div>

    {createdAt && (
      <p
        style={{
          marginLeft: is_user ? undefined : 'auto',
          fontSize: '13px',
          color: '#999',
          marginTop: '4px',
        }}
      >
        {timeAgo.format(new Date(createdAt).getTime())}
      </p>
    )}
  </div>
</div>

  )
}

export default Message