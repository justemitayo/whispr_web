import React, { useState } from 'react';
import './AccounPopup.css'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 
import { useGetOTP } from '../Auths/hooks';
import { toast } from 'react-toastify';
import Verification from './Verify/Verification';
// import { useNavigate } from 'react-router-dom';


interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}
const AccountPopup = ({setLoginPop}:props) => {

  const[currState, setCurrState] = useState<string>('Login')
  // const [phone, setPhone] = useState<string>('');


  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [email, setEmail] = useState('');

  const [reg, setReg] = useState({
    user_name: "",
    email: "",
    phone_number: "",
  });


  const getOTP = useGetOTP();
    // console.log(getOTPMutate.isLoading);
  // const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReg({ ...reg, [e.target.name]: e.target.value });
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email: reg.email.trim(),
      user_name: reg.user_name.trim(),
      phone_number: reg.phone_number.trim(),
    };
    if (!payload.email || !payload.phone_number || !payload.user_name) {
      toast.error('Both fields are required');
      return;
    }

    getOTP.mutate(payload, {
      onSuccess: (data) => {
        toast.success('OTP sent successfully!');
        console.log('OTP Success:', data);
        localStorage.setItem('pendingUser', JSON.stringify(payload));
        setEmail(payload.email);
        setStep('otp');
      },
      onError: (error: any) => {
        toast.error(`Error: ${error.message || 'Unknown error'}`);
        console.error('OTP Error:', error);
      },
    })
    // if(getOTP.isSuccess){
    //   navigate('/verify')
    // }
  }


  return (
    <div className='account-popup'>
      {step === 'signup' ? (
      <form className='popup-component'>
        <label>
          <h4>{currState}</h4>
          <h3 onClick={() => setLoginPop(false)}>x</h3>
        </label>
        {
            currState === 'Login' ?
              <div className='account-input'>
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
              <div className='account-input' >
                <input
                  type='name'
                  name='user_name'
                  placeholder='userName'
                  required
                  value={reg.user_name}
                  onChange={handleChange}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='whispr@gmail.com'
                  required
                  value={reg.email}
                  onChange={handleChange}
                />
                <PhoneInput
                  country={'ng'} // default country
                  value={reg.phone_number}
                  onChange={(value: string) =>
                    setReg((prev) => ({ ...prev, phone_number: value }))
                  }
                  inputStyle={{ width: '100%' }}
                />
              </div>
        }
        {
          currState === 'Sign Up' ? (
            <button onClick={handleContinue} disabled={getOTP.isPending}>{getOTP.isPending ? 'Sending OTP...' : 'Continue'}</button>
            ) : currState === 'Login' ? (
            <button>Login</button>
          ) : null
        }
        <div className='popup-condition'>
          <input type='checkbox' required/>
          <p>By continuing, i agree to the terms of use & privacy policy</p>
        </div>
        {currState === 'Login' 
            ? <p style={{color:'white'}}>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
            : <p style={{color:'white'}}>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p> 
        }

       
      </form> 
       ) : (
        // <Verification email={email}/>
        <p>here i am</p>
       )
      } 
    </div>
  )
}

export default AccountPopup