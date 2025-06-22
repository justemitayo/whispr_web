import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './Components/Navbar';
import AccountPopup from './Components/AccountPopup';
import Registration from './Components/Verify/Registration';
import Home from './screen/Home/Home';
import SeachModals from './screen/Modals/SeachModals';

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
        <Route path='/search' element={<SeachModals/>} />
        
      </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}


export default App;
