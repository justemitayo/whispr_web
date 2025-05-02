import React from 'react'
import './Navbar.css'


interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}
const Navbar = ({setLoginPop}: props) => {
  return (
    <div className='navbar'>
      <div>
        <h2>Whispr</h2>
      </div>
      <button onClick={() => setLoginPop(true)}>Sign In</button>
    </div>
  )
}

export default Navbar