import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 


interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}
const AccountPopup = ({setLoginPop}:props) => {

  const[currState, setCurrState] = useState<string>('Login')
  const [phone, setPhone] = useState<string>('');
  return (
    <div className='account-popup'>
      <form className='popup-component'>
        <label>
          <h4>{currState}</h4>
          <h4 onClick={() => setLoginPop(false)}>x</h4>
        </label>
        {
            currState === 'Login' ?
              <div>
                <input 
                  type='email'
                  placeholder='whispr@gmail.com'
                  required
                />
                <input
                  type='password'
                  placeholder='Enter your passkey'
                  required
                />
              </div>
            :
              <div>
                <input
                  type='name'
                  placeholder='Name'
                  required
                />
                <input
                  type='email'
                  placeholder='whispr@gmail.com'
                  required
                />
                <PhoneInput
                  country={'ng'} // default country
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{ width: '100%' }}
                />
              </div>
        }
        {
          currState === 'Sign Up' ? (
            <button>Continue</button>
            ) : currState === 'Login' ? (
            <button>Login</button>
          ) : null
        }
        <div className='popup-condition'>
          <input type='checkbox' required/>
          <p>By continuing, i agree to the terms of use & privacy policy</p>
        </div>
        {currState === 'Login' 
            ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
            : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p> 
        }

       
      </form>
    </div>
  )
}

export default AccountPopup