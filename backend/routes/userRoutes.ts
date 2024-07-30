import express from 'express'
import singleUpload from '../middlewares/Multer.js'
import {isAuthenticated} from '../middlewares/auth.js'
import { validate } from '../models/userModel.js'
import { signUpSchema } from '../models/userModel.js'
import {allUser, changePassword, followUser, getMyPosts, getMyProfile, getUserPost, getUserProfile, login, logout, register, updateProfile, updateProfilePicture} from '../controllers/userController.js'

const router=express.Router()

router.route('/register').post(singleUpload,validate(signUpSchema),register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/changepassword').put(isAuthenticated,changePassword)
router.route('/updateprofile').put(isAuthenticated,updateProfile)
router.route('/updateprofilepicture').put(isAuthenticated,updateProfilePicture)
router.route('/me').get(isAuthenticated,getMyProfile)
router.route('/follow/:id').put(isAuthenticated,followUser)
router.route('/users').get(isAuthenticated,allUser)
router.route('/userprofile').get(isAuthenticated,getUserProfile)
router.route('/myposts').get(isAuthenticated,getMyPosts)
router.route('/userposts').get(isAuthenticated,getUserPost)

export default router