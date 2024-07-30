import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { loadUser } from '../../redux/action/userAction'
import Navbar from '../navbar/Navbar'
import { useAppDispatch, useAppSelector } from '../../redux/store'



const Profile:React.FC = () => {
  const dispatch=useAppDispatch()

  const {users}=useAppSelector(state=>state.user)
  

  useEffect(()=>{
    dispatch(loadUser())
  },[dispatch])

  if (!users || users.length === 0) {
    return <div>Loading...</div> 
  }

  const user = users[0];

  return (
    <>
    <Navbar/>
    <div className='flex flex-row' >
      
      <div className="flex flex-col justify-center   w-96 h-96 m-4">
        <span><span className='font-bold'>Name:</span> <span>{user.name}</span> </span>
        <span><span className='font-bold'>Email:</span> <span>{user.email}</span> </span>
        <span><span className='font-bold'>Following:</span> <span>{user.following}</span> </span>
        <span><span className='font-bold'>Followers:</span> <span>{user.followers}</span> </span>


        <div className='flex flex-row'>
          <Link to='/updateprofile'><button className='bg-purple-500 text-white font-medium py-1 px-1 rounded m-2' >Update Profile</button></Link>
          <Link to='/changepassword'><button className='bg-purple-500 text-white font-medium py-1 px-1 rounded m-2' >Update Password</button></Link>
        </div>

      </div>
    </div>
    </>
  )
}

export default Profile
