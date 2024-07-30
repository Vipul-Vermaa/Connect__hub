import axios from 'axios'
import { AppDispatch } from '../store'

export const createPost=(image:string | File,description:string)=>async (dispatch:AppDispatch)=>{
    try {       
        dispatch({type:'createPostRequest'})
        const {data}=await axios.post(`http://localhost:4000/api/v1/createpost`,
        {image,description},{headers: {"Content-Type": "multipart/form-data",},}  
    )
        dispatch({type:'createPostSuccess',payload:data.message})
    } catch (error:any) {
        dispatch({type:'createPostFail',payload:error.response.data.message,})
    console.log('error',error)
    }
}


export const getFollowingPosts = () => async (dispatch:AppDispatch) => {
    try {
      dispatch({type: "postOfFollowingRequest",});
  
      const { data } = await axios.get("http://localhost:4000/api/v1/posts");
      dispatch({
        type: "postOfFollowingSuccess",
        payload: data.posts,
      });
    } catch (error:any) {
      dispatch({
        type: "postOfFollowingFailure",
        payload: error.response.data.message,
      });
    }
  };


export const deletePost=(id:string)=>async (dispatch:AppDispatch)=>{
    try {
        const config={withCredentials:true,};
        dispatch({type:'deletePostRequest'})
        const {data}=await axios.delete(`http://localhost:4000/api/v1/post/${id}`,config)

        dispatch({type:'deletePostSuccess',payload:data.message})
    } catch (error:any) {
        dispatch({
            type:'deletePostFail',
            payload:error.response.data.message,
        })
    }
}

export const likeAndUnlikePost=(id:string)=>async (dispatch:AppDispatch)=>{
    try {
        dispatch({type:'likeAndUnlikePostRequest',})
        const {data}=await axios.get(`http://localhost:4000/api/v1/post/${id}`)
        dispatch({
            type:'likeAndUnlikePostSuccess',
            payload:data.message,
        })
    } catch (error:any) {
        dispatch({
            type:'likeAndUnlikePostFail',
            payload:error.response.data.message
        })
    }
}


export const getAllPost=()=>async(dispatch:AppDispatch)=>{
try{
    dispatch({type:'getAllPostRequest',})
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const config={
        headers:{
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    const {data}=await axios.get(`http://localhost:4000/api/v1/allposts`,config)
    dispatch({
        type:'getAllPostSuccess',
        payload:data.posts,
    })
}
catch(error:any){
    dispatch({
        type:'getAllPostFail',
        payload:error.response.data.message
    })
}}


export const myPost=()=>async(dispatch:AppDispatch)=>{
    try{
        dispatch({type:'myPostRequest'})
        const {data}=await axios.get(`http://localhost:4000/api/v1/myposts`,)
        dispatch({
            type:'myPostSuccess',
            payload:data.post,
        })    
    }
    catch (error:any) {
        dispatch({type:'myPostFail',
    payload:error.response.data.message,
    })
    }
}


export const userPost=(id:string)=>async(dispatch:AppDispatch)=>{
    try{
        dispatch({type:'userPostRequest'})
        const {data}=await axios.get(`http://localhost:4000/api/v1/userposts${id}`,)
        dispatch({
            type:'userPostSuccess',
            payload:data.post,
        })    
    }
    catch (error:any) {
        dispatch({type:'userPostFail',
    payload:error.response.data.message,
    })
    }
}

