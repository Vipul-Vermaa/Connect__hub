import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store';
import { login } from '../../redux/action/userAction';

interface LoginState{
  email:string;
  password:string;
}
const Login:React.FC = () => {
  const [loginState,setLoginState]=useState<LoginState>({email:'',password:''})
  
  const dispatch=useAppDispatch()
  const navigate=useNavigate()

  const handleChange=(e:ChangeEvent<HTMLInputElement>):void=>{
    const {id,value}=e.target
    setLoginState((prevState)=>({...prevState,[id]:value}))
  }

  const submitHandler = (e:FormEvent<HTMLFormElement>):void => {
    e.preventDefault()
    console.log('logged in')
    dispatch(login(loginState.email,loginState.password))
    navigate('/profile')
  }

  return (

    <div className='flex items-center justify-center h-screen' >
      <div className='text-center w-94 p-4' >
        <h1 className='text-4xl font-bold mb-4' >Login</h1>

        <div>
          <form onSubmit={submitHandler} className='flex flex-col w-80 '>
            <label htmlFor="email" className='text-start'>Email:</label>
            <input
              type="email"
              id='email'
              value={loginState.email}
              onChange={handleChange}
              placeholder='Enter your email'
              autoComplete='on'
              required
              className='mt-2 p-2 border rounded'
            />

            <label htmlFor="password" className='mt-4 text-start'>Password:</label>
            <input
              type="password"
              id='password'
              value={loginState.password}
              onChange={handleChange}
              placeholder='Enter your password'
              required
              className='mt-2 p-2 border rounded'
            />

            <button type='submit' className='mt-4 bg-blue-500 hover:bg-black text-white font-bold py-2 px-2 rounder' >Login</button>

            <span className='mt-4 text-start'>New User?
              <Link to='/register'>
                <button className='bg-slate-500 text-white font-medium py-1 px-1 rounded' >
                  Sign Up
                </button>
              </Link>
            </span>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
