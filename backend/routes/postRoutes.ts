import express from 'express'
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from '../middlewares/Multer.js'
import { createPost, getAllPost, likeAndUnlikePost, postOfFollowing, } from '../controllers/postController.js';


const router=express.Router()

router.route('/allposts').get(isAuthenticated,getAllPost)
router.route('/createpost').post(singleUpload,createPost)
router.route('/post/:id').delete(isAuthenticated).put(isAuthenticated,likeAndUnlikePost)
router.route('/postoffollowing').get(isAuthenticated,postOfFollowing)


export default router