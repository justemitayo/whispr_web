import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import './Home.css'
import Log from '../Log/Log';
import Modal from '../Modals/Modal';
import Messenger from '../Messenger/Messenger';



const Home = () => {
  const [isSidebar, setIsSidebar] = useState(false)

  // const [showWelcome, setShowWelcome] = useState<boolean>(true);

   const Auth = useAuthStore().auth;

  //  useEffect(() => {
  //   if (Auth) {
  //     const timer = setTimeout(() => {
  //       setShowWelcome(false);
  //     }, 10000); 

  //     return () => clearTimeout(timer); 
  //   }
  // }, [Auth]);


  return (
    <div>
      {Auth ? (
        <>
          {/* {showWelcome && (
            <p style={{ border: '1px dashed rgb(174, 76, 23)' }}>
              Welcome back, {Auth.user?.user_name || 'User'}!
            </p>
          )} */}
          <Modal isSidebar={isSidebar} setIsSidebar={setIsSidebar}/>
          <Messenger isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
        </>
      ) : (
        <Log />
      )}
    </div>
  )
}

export default Home


