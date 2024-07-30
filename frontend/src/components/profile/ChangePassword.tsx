import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadUser } from '../../redux/action/userAction'
import { changePassword } from '../../redux/action/profileAction'
import { useAppDispatch } from '../../redux/store'

interface PasswordState{
  oldPassword:string;
  newPassword:string;
}

const ChangePassword:React.FC = () => {
  const [passwordState,setPasswordState]=useState<PasswordState>({
    oldPassword:'',
    newPassword:''
  })
  
  const dispatch=useAppDispatch()
  const navigate=useNavigate()


  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('password changed')
    dispatch(changePassword(passwordState.oldPassword,passwordState.newPassword))
    dispatch(loadUser)
    navigate('/profile')  
  }

  const handleChange=(e:ChangeEvent<HTMLInputElement>):void=>{
    const {id,value}=e.target;
    setPasswordState((prevState)=>({
      ...prevState,
      [id]:value
    }))
  }

  return (
    <div className='flex items-center justify-center h-screen '>
      <div className='text-center w-94 p-4'>
        <h1 className='text-4xl font-bold mb-4' >Change Password</h1>
        <div className='m-4'>
          <form onSubmit={submitHandler} className='flex flex-col' >


            <input
              type="password"
              value={passwordState.oldPassword}

              placeholder='Enter your old password'
              onChange={handleChange}
              required
              className='mt-2 p-2 border rounded'
            />

            <input
              type="password"
              value={passwordState.newPassword}

              placeholder='Enter your New password'
              onChange={handleChange}
              required
              className='mt-2 p-2 border rounded'
            />

            <button type='submit' className='mt-4 bg-blue-500 hover:bg-black text-white font-bold py-2 px-2 rounded'>Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
