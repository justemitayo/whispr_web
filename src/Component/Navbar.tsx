import React from 'react'
import './Navbar.css'
import { useAuthStore } from '../store/auth.store'


interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}
const Navbar = ({setLoginPop}: props) => {
  const Auth =useAuthStore().auth
  return (
    <div className='navbar'>
      <div>
        <h2>Whispr</h2>
      </div>
      {
        Auth ? <></> :  <button onClick={() => setLoginPop(true)}>Sign In</button>
      }

    </div>
  )
}

export default Navbar