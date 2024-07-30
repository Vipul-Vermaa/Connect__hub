import React, { useState } from 'react'
import { AiOutlineHeart, AiFillHeart, AiFillDelete } from 'react-icons/ai'
import { likeAndUnlikePost } from '../../redux/action/postAction'
import { useAppDispatch} from '../../redux/store';

interface ModalPost {
  id: string;
  description?: string;
  postImage?: string;
  userImage?: string;
  owner?: string;
}

const PostModal:React.FC<ModalPost> = ({ id, description, postImage, userImage, owner }) => {

  const[isLiked,setIsLiked]=useState(false)
  const dispatch=useAppDispatch()

  const likedHandler=()=>{
    setIsLiked(!isLiked)
    dispatch(likeAndUnlikePost(id))
  }

  return (
    <div className='flex items-center justify-center h-screen  bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden  w-96 max-h-[80vh] '>

        <div className='flex items-center p-4 border-b'>
          <img src={userImage || 'https://placekitten.com/40/40'} alt='User Avatar' className='w-10 h-10 rounded-full mr-4' />
          <span className='font-semibold'>{owner || 'Anonymous'}</span>
        </div>


        <div className='w-full' >
          <img src={postImage  || 'https://placekitten.com/400/300'} alt='Post' className='w-full max-h-60 object-contain' />
          </div>

        <div className='flex justify-around p-4 border-t' >
          {isLiked?(
          <AiFillHeart size={24} className='cursor-pointer text-red-500' onClick={likedHandler} />
          ):(
            <AiOutlineHeart size={24} className='cursor-pointer text-red-500' onClick={likedHandler} />
          )}
          
        </div>

        <div className='p-4'> <p>{description || 'No description available.'}</p> </div>
      </div>
    </div>
  )
}

export default PostModal
