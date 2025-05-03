import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Navbar from './Component/Navbar';
import AccountPopup from './Component/AccountPopup';
import Verification from './Component/Verify/Verification';

const App:React.FC = () => {

  const [loginPop, setLoginPop] = useState<boolean>(false)
  return (
    <BrowserRouter>
       {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
      <div className="App">
      <Navbar setLoginPop ={setLoginPop}/>
      <Verification email=''/>
      {/* <Routes>
        <Route path=''  />
      </Routes> */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}


export default App;
