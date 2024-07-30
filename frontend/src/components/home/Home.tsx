import React, { useEffect, useState } from 'react'
import PostModal from '../post/PostModal'
import Navbar from '../navbar/Navbar'
import { getFollowingPosts } from '../../redux/action/postAction'
import {allUser} from '../../redux/action/userAction'
import Sidebar from '../sidebar/Sidebar'
import { useAppDispatch, useAppSelector } from '../../redux/store'

const Home = () => {


  const dispatch=useAppDispatch()
  const {posts,loading,error}=useAppSelector(state=>state.post)


  useEffect(()=>{
    dispatch(getFollowingPosts())
    dispatch(allUser())
  },[dispatch])

  useEffect(()=>{
  },[posts])
  return (
    <>
    <Navbar/>
    <div className='flex'>
    <div className='w-1/4 h-screen sticky top-0'>
    <Sidebar/>
    </div>
    <div className='w-3/4 flex flex-col items-center'>
      
      {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
        posts && posts.length>0?(
          posts.map((post)=>(
            <PostModal 
            key={post._id}
            id={post._id} 
            description={post.description}
            postImage={post.postImage}
            userImage={post.userImage}
            owner={post.owner}
            />
          ))
        ):(
          <h1>No Post yet</h1>
        )
      )}
    
    </div>
    </div>
    </>
  )
}

export default Home
