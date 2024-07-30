import axios from "axios";
import { AppDispatch } from "../store";

export const updateProfile=(name:string,email:string)=>async (dispatch:AppDispatch)=>{
    try {
        dispatch({type:'changeProfileRequest'})
        const {data}=await axios.put(`http://localhost:4000/api/v1/changeprofile`,{name,email},{headers:{"Content-Type":"application/json",},withCredentials:true,})
        dispatch({type:'changeProfileSuccess',
    payload:data.message})
    } catch (error:any) {
        dispatch({
            type:'changeProfileFail',
            payload:error.response.data.message,
        })
    }
}


export const changePassword=(oldPassword:string,newPassword:string)=>async (dispatch:AppDispatch)=>{
    try {
        dispatch({type:'changePasswordRequest'})
        const {data}=await axios.put(`http://localhost:4000/api/v1/changepassword`,
        {oldPassword,newPassword,},{headers:{'Content-Type':'application/json',},withCredentials:true,})
        dispatch({type:'changePasswordSuccess',
        payload:data.message
    })
    } catch (error:any) {
        dispatch({type:'changePasswordFail',
    payload:error.response.data.message,
    })
    }
}


export const getMyProfile=()=>async(dispatch:AppDispatch)=>{
    try{
        dispatch({type:'getMyProfileRequest'})
        const {data}=await axios.get(`http://localhost:4000/api/v1/me`,{headers:{'Content-Type':'application/json',}})
        dispatch({
            type:'getMyProfileSuccess',
            payload:data.message,
        })    
    }
    catch (error:any) {
        dispatch({type:'changePasswordFail',
    payload:error.response.data.message,
    })
    }
}


export const userProfile=(id:string)=>async(dispatch:AppDispatch)=>{
    try{
        dispatch({type:'userProfileRequest'})
        const {data}=await axios.get(`http://localhost:4000/api/v1/user${id}`,)
        dispatch({
            type:'userProfileSuccess',
            payload:data.message,
        })    
    }
    catch (error:any) {
        dispatch({type:'userProfileFail',
    payload:error.response.data.message,
    })
    }
}