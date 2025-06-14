import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import './Home.css'
import Log from '../Log/Log';
import Modal from '../Modals/Modal';
import Messenger from '../Messenger/Messenger';


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
      }, 10000); 

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
          <Messenger />
        </>
      ) : (
        <Log />
      )}
    </div>
  )
}

export default Home


