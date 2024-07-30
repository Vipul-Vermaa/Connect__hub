import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, allUser, followAndUnfollowUser } from '../../redux/action/userAction';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const Sidebar = () => {
  const { users, loading } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(allUser());
  }, [dispatch]);

  const logoutHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('logged out');
    dispatch(logout());
    navigate('/login');
  };

  const followUnfollowHandler = (id: string) => {
    console.log('followed');
    dispatch(followAndUnfollowUser(id));
  };

  const getUserAvatarUrl = (avatar: { url: string } | File | undefined): string => {
    if (!avatar) {
      return 'https://placebear.com/50/50';
    }
    if ('url' in avatar) {
      return avatar.url;
    }
    return 'https://placebear.com/50/50'; 
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!users || users.length === 0) {
    return <div>No users found</div>; 
  }

  const user = users[0];

  return (
    <div className='p-4 border-r border-blue-300 shadow-lg min-h-[90vh] max-h-[90vh]'>
      <>
        <Link to='/profile'>
          <h3 className='mb-2 text-center'><b>Name:</b> {user.name}</h3>
        </Link>
        <h3 className='mb-2 text-center'><b>Following:</b> {user.following?.length}</h3>
        <h3 className='mb-2 text-center'><b>Followers:</b> {user.followers?.length}</h3>
        <h6 className='text-center'>
          <button onClick={logoutHandler} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200'>Logout</button>
        </h6>
        <div>
          <h2>All Users</h2>
          <ul>
            {users && users.length > 0 ? (
              users.slice(0, 3).map((u) => (
                <li key={u._id} className='flex items-center p-2'>
                  <img src={getUserAvatarUrl(u.avatar)} alt={u.name} className='w-10 h-10 rounded-full mr-2' />
                  <span>{u.name}</span>
                  <button onClick={() => followUnfollowHandler(u._id)} className='bg-slate-500 text-white font-medium py-1 px-1 rounded'>
                    {u.following?.includes(user._id) ? 'Unfollow' : 'Follow'}
                  </button>
                </li>
              ))
            ) : (
              <p>No users found</p>
            )}
          </ul>
        </div>
      </>
    </div>
  );
};

export default Sidebar;
