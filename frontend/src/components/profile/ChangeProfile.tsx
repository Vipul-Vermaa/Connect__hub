import React, { ChangeEvent, FormEvent, useState } from 'react'
import { updateProfile } from '../../redux/action/profileAction'
import { loadUser } from '../../redux/action/userAction'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'

interface ProfileState{
  name:string;
  email:string;

}
const ChangeProfile = () => {
  const [profileState,setProfileState]=useState<ProfileState>({
    name:'',
    email:'',
  })

  const dispatch=useAppDispatch()
  const navigate=useNavigate()
 

  const submitHandler = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('profile changed')
    dispatch(updateProfile(profileState.name,profileState.email))
    dispatch(loadUser)
    navigate('/profile')
  }

  const handleChange=(e:ChangeEvent<HTMLInputElement>):void=>{
    const {id,value}=e.target;
    setProfileState((prevState)=>({
      ...prevState,
      [id]:value
    }))
  }


  return (
    <div className='flex items-center justify-center h-screen '>
      <div className='text-center w-94 p-4' >
        <h1 className='text-4xl font-bold mb-4'>
          Update Profile
        </h1>
        <div className='m-4'>

          <form onSubmit={submitHandler} className='flex flex-col' >
            <input
              type="text"
              value={profileState.name}
              placeholder='Enter your name'
              onChange={handleChange}
              className='mt-2 p-2 border rounded'
            />

            <input
              type="email"
              value={profileState.email}
              placeholder='Enter your email'
              onChange={handleChange}
              className='mt-2 p-2 border rounded'
            />

            <button type='submit' className='mt-4 bg-blue-500 hover:bg-black text-white font-bold py-2 px-2 rounded' >Update Profile</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default ChangeProfile
