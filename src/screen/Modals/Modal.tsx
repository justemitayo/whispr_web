import React from 'react'
import { ReactComponent as SearchModal } from '../../assets/svg/search-modal.svg' 
import './Modal.css';
import { useAuth } from '../../contexts/Auth/interface';
import darkProfile from '../../assets/images/default_user_dark.jpg'
import { reset } from '../../Configs/Storage';
import { useAuthStore } from '../../store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { Online } from '../../Components/Online/Online';
// import { useMessageStore } from '../../store/message.store';
import { useOnlineStore } from '../../store/online.store';
// import { useChatStore } from '../../store/chat.store';
import Swal from 'sweetalert2';


interface props{
  setAllUser :  React.Dispatch<React.SetStateAction<boolean>>
}
const Modal = ({setAllUser}:props) => {

  const auth = useAuth().auth;
  const clearAuth = useAuthStore().clearAuth;
  // const clearMessages = useMessageStore().clearMessages
  const queryClient = useQueryClient();
  const isOnline = useOnlineStore().isOnline;
  // const clearChat = useChatStore().clearChat;


  const handleLogout = async() =>{
    await reset();
    clearAuth();
    // clearMessages();
    // clearChat();
    queryClient.clear();
  }
  const confirmLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Do you want to log out of your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      handleLogout();
    }
  };
  return (
    <div className='modal'>
      <h2>Conversation</h2>
      <div className='modal-content'>

          <SearchModal style={{width:'2.5rem', height:'2.5rem'}} onClick={() => setAllUser(true)}/>


          <div className='profile'>
            <div style={{position:'relative'}}>
              <img alt='profilepicture' src={auth?.user?.profile_picture ? auth?.user?.profile_picture : darkProfile} onClick={confirmLogout} 
              style={{width:'2.5rem', height:'2.5rem', borderRadius:'50%', cursor:"pointer"}}
              />
              <Online rightOffset={-4} online={isOnline(auth?.user?.user_id || '')}/>
            </div>

      </div>
      </div>
    </div>
  )
}

export default Modal



