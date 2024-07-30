import React, { ChangeEvent, FormEvent, useState } from 'react'
import { fileUploadStyle } from '../auth/Register'
import { createPost } from '../../redux/action/postAction'
import Navbar from '../navbar/Navbar'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'


interface PostState {
  description: string
  image: string | File
  imagePrev: string
}
const CreatePost:React.FC = () => {

  const [postState,setPostState]=useState<PostState>({
    description:'',
    imagePrev:'',
    image:'',
  })
  const dispatch=useAppDispatch()

  const navigate=useNavigate()



  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('upload')
    dispatch((createPost(postState.image,postState.description)))
    navigate('/')
  }

  const changeImageHandler = (e:ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file){
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPostState({
        ...postState,
      imagePrev:reader.result as string,
      image:file
    })
    console.log('imageHandler')
  }
    }}

    const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
      setPostState({
        ...postState,
        description:e.target.value
      })
    }
  

  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center h-screen'>
      
      <div className='text-center w-94 p-4' >
        <h1 className='text-4xl font-bold mb-4' >Create Post</h1>
        <div className='m-4' >

          <form onSubmit={submitHandler} className='flex flex-col'>

            <div className='flex justify-center  '>
              <img src={postState.imagePrev} className='w-40 h-40  border-2 border-black' />
            </div>


            <input
              type="text"
              value={postState.description}
              onChange={handleChange}
              placeholder='Enter Description'
              className='mt-2 p-2 border rounded'
            />

            <input
              type="file"
              id='chooseImage'
              accept='image/*'
              required
              onChange={changeImageHandler}
              style={
                fileUploadStyle
              }

              className='mt-2 p-2 border rounded'
            />
            <button className='mt-4 bg-blue-500 hover:bg-black text-white font-bold py-2 px-2 rounded' type='submit' >upload</button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default CreatePost
