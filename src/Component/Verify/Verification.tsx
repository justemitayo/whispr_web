import React,{useRef, useState, useEffect} from 'react'
import { useGetOTP, useVerifyOTP } from '../../Auths/hooks'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import './Verification.css'

interface props{
  email: string
}
const Verification = ({email}: props) => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendTimer, setResendTimer] = useState(60);

  const navigate =useNavigate()

  const verifyOTP = useVerifyOTP();
  const getOTP = useGetOTP();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);
//   It starts a countdown from the current resendTimer value (typically 60 seconds).
// Every second (1000ms), it decrements the timer by 1.

  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
    // Whenever activeIndex changes (e.g., after typing or backspacing), this effect runs.
  }, [activeIndex]);

    const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value) || index !== activeIndex) return;
    // ensures that only a single digit (0–9) is allowed. It ignores anything else.

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      setActiveIndex(index + 1);
      inputsRef.current[index + 1]?.focus(); 
      //  shifts the cursor to the next input field.
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
      // Checks if the pressed key is 'Backspace'.
      // If the current field is empty and it's not the first field, move focus back to the previous field.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');

    if (token.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }
        const payload ={
          email,
          token
        }

    verifyOTP.mutate(payload,
      {
        onSuccess: (data) => {
          toast.success(data.msg || 'OTP verified successfully!');
          console.log('Verification success:', data);
          // setLoginPop(false); 
          navigate('/register-user');
        },
        onError: (error: any) => {
          toast.error(error.message || 'OTP verification failed');
        },
      }
    );
  };
  const handleResend = () => {
    const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');

    if (!pendingUser?.email || !pendingUser?.user_name || !pendingUser?.phone_number) {
      toast.error('Missing user information. Please sign up again.');
      return;
    }

    getOTP.mutate(pendingUser, {
      onSuccess: () => {
        toast.success('OTP resent!');
        setOtp(Array(4).fill(''));
        setActiveIndex(0);
        setResendTimer(60);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to resend OTP');
      },
    });
  };


  return (
    <form onSubmit={handleSubmit} className='verify'>
      <h4>Enter the 4- digits code sent to {email}</h4>
      <div>
      {otp.map((digit, idx) => (
        <input
          key={idx}
          name='token'
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          ref={(el) => {(inputsRef.current[idx] = el)}}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          disabled={verifyOTP.isPending}
        />
      ))}
      </div>
      <button
        className='verify-button'
        type="submit"
        disabled={verifyOTP.isPending}
      >
        {verifyOTP.isPending ? 'Verifying...' : 'Verify OTP'}
      </button>
      <p>
        Didn’t get the code?{''}
        <button
        className='very'
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0 || getOTP.isPending}
          // style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
        </button>
      </p>
    </form>
  )
}

export default Verification










// import React, { useRef, useState } from 'react';
// import { useVerifyOTP } from '../Auths/hooks';
// import { toast } from 'react-toastify';

// interface OTPInputProps {
//   email: string;
// }

// const OTPInput: React.FC<OTPInputProps> = ({ email }) => {
//   const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
//   const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

//   const verifyMutation = useVerifyOTP();

//   const handleChange = (value: string, index: number) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < otp.length - 1) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = otp.join('');

//     if (token.length !== 4) {
//       toast.error('Please enter all 4 digits');
//       return;
//     }
        // const payload ={
        //   email,
        //   token
        // }

//     verifyMutation.mutate(
//       { email, code },
//       {
//         onSuccess: (data) => {
//           toast.success(data.message || 'OTP verified successfully!');
//           console.log('Verification success:', data);
//         },
//         onError: (error: any) => {
//           toast.error(error.message || 'OTP verification failed');
//         },
//       }
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
//       <div className="flex space-x-2">
//         {otp.map((digit, idx) => (
//           <input
//             key={idx}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             ref={(el) => (inputsRef.current[idx] = el)}
//             onChange={(e) => handleChange(e.target.value, idx)}
//             onKeyDown={(e) => handleKeyDown(e, idx)}
//             className="w-10 h-12 text-center border rounded text-lg"
//             disabled={verifyMutation.isPending}
//           />
//         ))}
//       </div>
//       <button
//         type="submit"
//         disabled={verifyMutation.isPending}
//         className="bg-blue-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
//       >
//         {verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
//       </button>
//     </form>
//   );
// };

// export default OTPInput;
 
