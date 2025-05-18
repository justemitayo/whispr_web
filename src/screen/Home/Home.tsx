import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import './Home.css'
import Log from '../Log/Log';
import Modal from '../Modals/Modal';


interface props{
  setAllUser :  React.Dispatch<React.SetStateAction<boolean>>
}
const Home = ({setAllUser}: props) => {

  const [showWelcome, setShowWelcome] = useState<boolean>(true);

   const Auth = useAuthStore().auth;

   useEffect(() => {
    if (Auth) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 120000); 

      return () => clearTimeout(timer); 
    }
  }, [Auth]);


  return (
    <div>
      {Auth ? (
        <>
          {showWelcome && (
            <p style={{ border: '1px dashed rgb(174, 76, 23)' }}>
              Welcome back, {Auth.user?.user_name || 'User'}!
            </p>
          )}
          <Modal setAllUser={setAllUser}/>
        </>
      ) : (
        <Log />
      )}
    </div>
  )
}

export default Home


// const [searchChat, setSearchChat] = useState<string>('');
// const filteredChats =
//   userChats.filter(
//     chat =>
//       chat?.recipient_info?.full_name?.includes(searchChat) ||
//       chat.recipient_info?.user_name?.includes(searchChat),
//   ) || [];