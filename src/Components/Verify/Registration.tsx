import React, { useEffect, useState } from 'react';
import './Registration.css'
import { toast } from 'react-toastify';
import { useRegisterUser } from '../../domain/Auth/hooks';
import { saveString } from '../../Configs/Storage';
import { strings } from '../../Configs/Strings';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import picture from '../../assets/images/default_user_dark.jpg'

const Registration = () => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [regUser, setRegUser] = useState({
    user_name: '',
    full_name:'',
    bio:'',
    phone_number:'',
    email: '',
    password: '',
    confirm_password:''
  }) 

  const navigate = useNavigate()
  
  const updateAuth = useAuthStore().updateAuth;

  const registerUser = useRegisterUser();

  useEffect(() => {
    const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');

    if(pendingUser?.email || pendingUser?.user_name || pendingUser?.phone_number) {
      setRegUser((previous) => ({
        ...previous,
        user_name: pendingUser?.user_name || '',
        phone_number: pendingUser?.phone_number || '',
        email: pendingUser?.email || '',
      }))
    }
    
  }, []);

  const isValidEmail = (email: string) => {
    if (!email.includes('@')) return false;
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (!local || !domain || domain.split('.').length < 2) return false;
    return true;
  };

  const validateInputs = () => {
    const { full_name, phone_number, email, password, confirm_password } = regUser;
    const errors: string[] = [];
  
    if (!full_name.trim()) {
      toast.error('Full name is required.');
      errors.push('full_name');
    }
  
    if (!/^\+\d{10,15}$/.test(phone_number)) {
      toast.error('Phone number must start with +234 and be 10 to 15 digits total.');
      errors.push('phone_number');
    }
  
    if (!isValidEmail(email)) {
      toast.error('Email format is invalid.');
      errors.push('email');
    }
  
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      errors.push('password');
    }
  
    if (!confirm_password) {
      toast.error('Please confirm your password.');
      errors.push('confirm_password');
    } else if (password !== confirm_password) {
      toast.error('Passwords do not match.');
      errors.push('password_mismatch');
    }
  
    if (profilePicture && !profilePicture.type.startsWith('image/')) {
      toast.error('Profile picture must be an image file.');
      errors.push('profile_picture');
    }
  
    return errors;
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRegUser((previous) => ({...previous, [e.target.name]: e.target.value}))
  }


  const profileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateInputs();
    if (errors.length > 0) return;
  
    const payload = {
      user_name: regUser.user_name.trim(),
      full_name: regUser.full_name.trim(),
      bio: regUser.bio.trim(),
      phone_number: regUser.phone_number.trim(),
      email: regUser.email.trim(),
      password: regUser.password.trim(),
      profile_picture: profilePicture
    }

    registerUser.mutate(payload, {
      onSuccess: async(response) => {
        if (response.data?.token) {
        await saveString(strings.userToken, response.data.token);
        updateAuth(response.data)
        toast.success('Registration successful!');
        navigate('/')
        }
        // if (response.data?.token) {
        //   localStorage.setItem('token', response.data.token);
        // }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Registration Failed');
        console.log('iamaboy')
      },
    })

  }
  return (
    <form onSubmit={handleSubmit} className='register'>
      <div className='register-picture'>
        <input type="file" accept="image/*" onChange={profileChange} />
        {preview && <img src={preview ? preview : picture} alt="Preview"  />}
      </div>


      <div className='register-component'>
      <div className='register-content'>
        <label>UserName:</label>
        <input
          name='user_name'
          type='text'
          value={regUser.user_name}
          onChange={handleInputChange}
          required
        /> 
      </div>
      <div className='register-content'>
        <label>Full-Name:</label>
        <input
          name='full_name'
          type='text'
          value={regUser.full_name}
          onChange={handleInputChange}
          required
        /> 
      </div>
      <div className='register-content'>
        <label>PassWord:</label>
        <input
          name='password'
          type='password'
          value={regUser.password}
          onChange={handleInputChange}
          required
        /> 
      </div>
      <div className='register-content'>
        <label>Confirm PassWord:</label>
        <input
          name='confirm_password'
          type='password'
          value={regUser.confirm_password}
          onChange={handleInputChange}
          required
        /> 
      </div>
      <div className='register-content'>
        <label>Bio:</label>
        <textarea 
          name='bio'
          typeof='text'
          value={regUser.bio}
          onChange={handleInputChange}
        /> 
      </div>
      <div className='register-content'>
        <label>Phone Number:</label>
        <input
          name='phone_number'
          type='tel'
          placeholder='phone Number'
          value={regUser.phone_number}
          onChange={handleInputChange}
          required
        /> 
          {/* <PhoneInput
            country={'ng'}
            value={regUser.phone_number}
            onChange={(value: string) =>
              setRegUser((prev) => ({ ...prev, phone_number: value }))
            }
            inputStyle={{ width: 'max(25vw, 250px)', cursor: 'pointer' }}
          /> */}
      </div>
      <div className='register-content'>
        <label>Email:</label>
        <input 
          name='email'
          type='text'
          placeholder='whispr@gmail.com'
          value={regUser.email}
          onChange={handleInputChange}
          required
        /> 
      </div>
   
      <button type="submit" disabled={registerUser.isPending}>
        {registerUser.isPending ? 'loading...' : 'Register'}
      </button>
      </div>
    </form>
  )
}

export default Registration