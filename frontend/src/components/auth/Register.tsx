import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {register} from '../../redux/action/userAction'
import { useAppDispatch } from '../../redux/store'

export const fileUploadStyle = {
  cursor: 'pointer',
  marginLeft: '-5%',
  width: '110%',
  height: '100%',
  border: 'none,'
}

interface RegisterState{
  name:string;
  email:string;
  password:string;
  imagePrev:string;
  image:string | File
}


const Register:React.FC = () => {
  const [registerState,setRegisterState]=useState<RegisterState>({
    name:'',
    email:'',
    password:'',
    imagePrev:'',
    image:'',
  })

  const dispatch=useAppDispatch()
  const navigate=useNavigate()

    const handleChange=(e:ChangeEvent<HTMLInputElement>):void=>{
      const {id,value}=e.target;
      setRegisterState((prevState)=>({
        ...prevState,
        [id]:value
      }))
    }


  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('registred')
    dispatch(register(registerState.name,registerState.email,registerState.password,registerState.image))
    navigate('/login')
  }

  const changeImageHandler = (e:ChangeEvent<HTMLInputElement>):void => {
    const file = e.target.files?.[0]
    if (file){
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if(reader.result){
        setRegisterState({
          ...registerState,
      imagePrev:reader.result as string,
      image:file
        })
    }
  }}}

  return (

    <div className='flex items-center justify-center h-screen'>
      <div className='text-center w-94 p-4' >
        <h1 className='text-4xl font-bold mb-4' >Register Here</h1>
        <div className='m-4'>
          <form onSubmit={submitHandler} className='flex flex-col' >

            <div className='flex justify-center'>
              <img src={registerState.imagePrev} alt='preview' className='w-32 h-32 rounded-full' />
            </div>

            <label htmlFor="name" className='text-start' >Name:</label>
            <input
              type="text"
              value={registerState.name}
              id='name'
              placeholder='Enter your name'
              onChange={handleChange}
              required
              autoComplete='on'
              className='mt-2 p-2 border rounded'
            />


            <label htmlFor="email" className='mt-4 text-start' >Email:</label>
            <input
              type="email"
              value={registerState.email}
              id='email'
              placeholder='Enter your email'
              onChange={handleChange}
              required
              autoComplete='on'
              className='mt-2 p-2 border rounded'
            />


            <label htmlFor="password" className='mt-4 text-start' >Password:</label>
            <input
              type="password"
              value={registerState.password}
              id='password'
              placeholder='Enter your password'
              onChange={handleChange}
              required
              className='mt-2 p-2 border rounded'

            />

            <input
              type='file'
              id='chooseAvatar'
              accept='image/*'
              style={fileUploadStyle}
              onChange={changeImageHandler}
            />

            <button className='mt-4 bg-blue-500 hover:bg-black text-white font-bold py-2 px-2 rounded' type='submit' >Sign Up</button>


            <span className='mt-4 text-start' >Already signup?
              <Link to='/login'>
                <button className='bg-slate-500 text-white font-medium py-1 px-1 rounded' >Login</button>
              </Link>
            </span>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
