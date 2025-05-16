import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import './Home.css'
import Log from '../Log/Log';

const Home = () => {

   const Auth = useAuthStore().auth;
  return (
    <div>
      {Auth ? (
        <p>Welcome back, {Auth.user?.user_name || 'User'}!</p>
      ) : (
        <Log />
      )}
    </div>
  )
}

export default Home


// const [searchChat, setSearchChat] = useState<string>('');
// const filteredChats =
//   userChats.filter(
//     chat =>
//       chat?.recipient_info?.full_name?.includes(searchChat) ||
//       chat.recipient_info?.user_name?.includes(searchChat),
//   ) || [];