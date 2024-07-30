import axios from 'axios'
import { AppDispatch } from '../store'

export const login=(email:string,password:string)=>async(dispatch:AppDispatch)=>{
try {
    dispatch({type:'loginRequest'})
    const {data}=await axios.post(`http://localhost:4000/api/v1/login`,{email,password},
        {
            headers:
            {
                'Content-Type':'application/json'
            },
            withCredentials:true,
        }
    )
    dispatch({type:'loginSuccess',
    payload:data,
})
} catch (error:any) {
    dispatch({type:'loginFail',payload:error.response.data.message})
}
}

export const register=(name:string,email:string,password:string,image:string | File)=>async (dispatch:AppDispatch)=>{
    try { 
        dispatch({type:'registerRequest'})
        const{data}=await axios.post(
            `http://localhost:4000/api/v1/register`,
            {name,email,password,image},
            {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            withCredentials: true,
            })

        dispatch({
            type:'registerSuccess',
            payload:data
        })
    } catch (error:any) {
        dispatch({
        type:'registerFail',
        payload:error.response.data.message
    })
    }
}

export const loadUser=()=>async (dispatch:AppDispatch)=>{
    try {
        dispatch({type:'loadUserRequest'})
    const {data}=await axios.get(`http://localhost:4000/api/v1/me`,
        {
            withCredentials:true,
        }
    )
    dispatch({type:'loadUserSuccess',
        payload:data.user
})
    } catch (error:any) {
        dispatch({type:'loadUserFail',
    payload:error.response.data.message})
}}


export const logout=()=>async (dispatch:AppDispatch)=>{
    try {
        dispatch({type:'logoutRequest'});
        const {data}=await axios.get(`http://localhost:4000/api/v1/logout`,{withCredentials:true,})
        dispatch({type:'logoutSuccess',payload:data.message})
    } catch (error:any) {
        dispatch({type:'logoutFail',
    payload:error.response.data.message})
    }
}

export const allUser = () => async (dispatch:AppDispatch) => {
    try {
      const config = {withCredentials: true,};
      dispatch({ type: 'allUserRequest' }); 
      const { data } = await axios.get(`http://localhost:4000/api/v1/users`, config);
      dispatch({ type: 'allUserSuccess', payload: data.user });
    } catch (error:any) {
      dispatch({
        type: 'allUserFail',
        payload: error.response.data.message,
      });
    }
  };



export const followAndUnfollowUser=(id:string)=>async(dispatch:AppDispatch)=>{
    try{
        const config = {withCredentials: true,};
        dispatch({
            type:'followUserRequest'
        })
        const {data}=await axios.put(`http://localhost:4000/api/v1/follow/${id}`,config)
        dispatch({
            type:'followUserSuccess',
            payload:data.message,
        })    
    }
    catch (error:any) {
        dispatch({type:'followUserFail',
    payload:error.response.data.message,
    })
    }
}



