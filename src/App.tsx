import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Navbar from './Component/Navbar';
import AccountPopup from './Component/AccountPopup';
import Verification from './Component/Verify/Verification';
import Registration from './Component/Verify/Registration';
import Home from './screen/Home/Home';

const App:React.FC = () => {

  const [loginPop, setLoginPop] = useState<boolean>(false)
  return (
    <BrowserRouter>
       {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
      <div className="App">
      <Navbar setLoginPop ={setLoginPop}/>
      {/* <Verification email=''/> */}
      {/* <Registration /> */}
      <Routes>
        <Route path='/register-user' element={<Registration />} />
        {/* <Route path='/verify' element={<Verification email='' />} /> */}
        <Route path='/' element={<Home />} />
        
      </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}


export default App;
