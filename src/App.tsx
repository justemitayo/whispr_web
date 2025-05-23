import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Navbar from './Components/Navbar';
import AccountPopup from './Components/AccountPopup';
import Registration from './Components/Verify/Registration';
import Home from './screen/Home/Home';
import SeachModals from './screen/Modals/SeachModals';

const App:React.FC = () => {

  const [loginPop, setLoginPop] = useState<boolean>(false)
  const [allUser, setAllUser] = useState<boolean>(false)
  return (
    <BrowserRouter>
       {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
       {allUser ? <SeachModals setAllUser={setAllUser}/> : <></>}
      <div className="App">
      <Navbar setLoginPop ={setLoginPop}/>
      {/* <Verification email=''/> */}
      {/* <Registration /> */}
      <Routes>
        <Route path='/register-user' element={<Registration />} />
        {/* <Route path='/verify' element={<Verification email='' />} /> */}
        <Route path='/' element={<Home setAllUser={setAllUser}/>} />
        
      </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}


export default App;
