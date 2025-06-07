import React,{useState} from 'react'
import { useGetUsers } from '../../domain/User/hooks'
import './SearchModals.css'
import { Online } from '../../Components/Online/Online'
import AddUser from '../../Components/AddUser/AddUser'
import { useAuth } from '../../contexts/Auth/interface'
import { useOnlineStore } from '../../store/online.store'

interface props{
  setAllUser :  React.Dispatch<React.SetStateAction<boolean>>
}
const SeachModals = ({setAllUser}: props) => {
  const [userSearch, setUserSearch] = useState<string>('');
  const {auth} = useAuth();
  const isOnline = useOnlineStore().isOnline

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, error, status } = useGetUsers({
    search: userSearch,
  });

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
          <p onClick={() => setAllUser(false)}>x</p>
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
                      <img alt='' src={user?.profile_picture}  className='userdata-img'  style={{ width: '5rem', height: '5rem', borderRadius: '50%' }}/>
                      <Online 
                        online={isOnline(auth?.user?.user_id || '')}
                      />
                    </div>
                    <div className='userdata-content' style={{gap:'0'}}>
                      <p className='user'>{user?.full_name || ''}</p>
                      <p className='userp'>@{user?.user_name || ''}</p>
                      <p className='userp' style={{fontStyle:"italic"}}>{user?.bio}</p>
                    </div>
                  </div>
                  <AddUser
                    user={user}
                    currentUser={auth}
                    setAllUser={setAllUser}
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