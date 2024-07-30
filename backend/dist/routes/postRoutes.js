import express from 'express';
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from '../middlewares/Multer.js';
import { createPost, getAllPost, likeAndUnlikePost, postOfFollowing, } from '../controllers/postController.js';
const router = express.Router();
// getallpost
router.route('/allposts').get(isAuthenticated, getAllPost);
// creating a post
router.route('/createpost').post(singleUpload, createPost);
// deleting-updating
router.route('/post/:id')
    .delete(isAuthenticated)
    .put(isAuthenticated, likeAndUnlikePost);
// post of following
router.route('/postoffollowing').get(isAuthenticated, postOfFollowing);
export default router;
