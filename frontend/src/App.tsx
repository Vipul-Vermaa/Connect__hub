import React, { useEffect } from "react"
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './components/home/Home.jsx'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import CreatePost from "./components/post/CreatePost.js"
import Profile from './components/profile/Profile.jsx'
import ChangePassword from "./components/profile/ChangePassword.jsx"
import ChangeProfile from "./components/profile/ChangeProfile.jsx"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { useAppSelector } from "./redux/store.js"
import {ProtectedRoute} from 'protected-route-react'

function App() {
  window.addEventListener('contextmenu',e=>{
    e.preventDefault()
  })

  const {isAuthenticated,message,error}=useAppSelector(state=>state.user)

  const dispatch=useDispatch()
  useEffect(() => {
    if(error){
      toast.error(error)
      dispatch({type:'clearError'})
    }
    if(message){
      toast.success(message)
      dispatch({type:'clearMessage'})
    }
  }, [dispatch,error,message])


  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<ProtectedRoute isAuthenticated={!isAuthenticated} redirect='/login' ><Register/></ProtectedRoute>}/>
      <Route path="/login" element={<ProtectedRoute isAuthenticated={!isAuthenticated} redirect='/profile' ><Login/></ProtectedRoute>}/>

      <Route path="/createpost" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CreatePost/></ProtectedRoute>}/>

      <Route path="/updateprofile" element={<ProtectedRoute isAuthenticated={isAuthenticated} ><ChangeProfile/></ProtectedRoute>}/>
      <Route path="/changepassword" element={<ProtectedRoute isAuthenticated={isAuthenticated} ><ChangePassword/></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} ><Profile/></ProtectedRoute>}/>
    </Routes>
   </Router>
  )
}

export default App
