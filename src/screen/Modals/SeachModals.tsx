import React,{useState, useEffect} from 'react'
import { useGetUsers } from '../../domain/User/hooks'
import './SearchModals.css'
import { Online } from '../../Components/Online/Online'
import AddUser from '../../Components/AddUser/AddUser'
import { useAuth } from '../../contexts/Auth/interface'
import defaults from '../../assets/images/default_user_dark.jpg'
import { useOnlineStore } from '../../store/online.store'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const SeachModals = () => {
  const [userSearch, setUserSearch] = useState<string>('');
  const {auth} = useAuth();
  const isOnline = useOnlineStore().isOnline;
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  console.log('auth.user:', auth?.user);
  console.log('isOnline result:', isOnline(auth?.user?.user_id || ''));


  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, error, status } = useGetUsers({
    search: userSearch,
  });

  useEffect(() => {
    if (auth?.user?.user_id) {
      queryClient.invalidateQueries({queryKey:['getUserChats', auth?.user?.user_id]});
    }
  }, [auth?.user?.user_id, queryClient]);

  const usersData: Auth['user'][] =
  (data?.pages|| [])
    ?.flatMap((page) => page?.data || [])
    ?.flatMap((item) => item?.items || []) || [];

  
  return (
      <div className='searchmodal'>
          <div className='searchmodal-content'>
            <div className='searchmodal-head'>
              <input 
                type='text'
                placeholder='search users... '
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <p onClick={() => { navigate('/') }}>x</p>
            </div>
              {status === 'pending' ? (
                <p>Loading...</p>
              ) : status === 'error' && error instanceof Error ? (
                <p>Error: {error.message}</p>
              ) : (
                <>
                  {usersData.map((user) => (
                    
                    <div  key={user?.user_id} className='userdata'>
                      <div className='userdata-component'>
                        <div className='user-data'>
                          <img alt='' src={user?.profile_picture? user?.profile_picture : defaults}  className='userdata-img' />
                          <Online 
                            online={isOnline(user?.user_id || '')}
                              rightOffset={-3}
                          />
                          
                        </div>
                        <div className='userdata-content'>
                          <span className='user'>{user?.full_name || ''}</span>
                          <span className='userp'>@{user?.user_name || ''}</span>
                          <span className='userp' style={{fontStyle:"italic"}}>{user?.bio}</span>
                        </div>
                      </div>
                      <AddUser
                        user={user}
                        currentUser={auth}
                      />
                    </div>
                  ))}
                  <div>
                    <button
                      className='search-button'
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}
                    >
                      {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                          ? 'Load More'
                          : 'Nothing more to load'}
                    </button>
                  </div>
                  <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
                </>
              )}
          </div>
      </div>
  )
}

export default SeachModals