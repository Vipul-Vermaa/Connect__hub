import cloudinary from 'cloudinary'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import getDataUri from '../utils/dataUri.js'
import ErrorHandler from '../utils/errorHandler.js'
import { postModel } from '../models/postModel.js'
import { userModel } from '../models/userModel.js'
import { Request,Response,NextFunction } from 'express'
import { IUser } from '../models/userModel.js'
import mongoose from 'mongoose'

export const getAllPost = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    const posts = await postModel.find()
    .populate('owner')
    .sort({createdAt:-1})
    res.status(200).json({
        success: true,
        posts
    })
})

export const createPost = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    const { description ,user} = req.body
    const file = req.file
    if (!description || !file) {
        return next(new ErrorHandler('Description and image file are required', 400));
    }
    const fileUri = getDataUri(file)
    if (!fileUri.content) {
        return next(new ErrorHandler('Failed to get file content', 500));
    }
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content)
    const post = await postModel.create({
        description,
        postImage: {
            type: file.mimetype.split('/')[0],
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        },
        user,     
    })
    res.status(201).json({
        success: true,
        message: 'Post Created',
        post,
    })
})


export const likeAndUnlikePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const post = await postModel.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler('Post not found', 404));
    }

    if (!req.user || !(req.user as IUser)._id) {
        return next(new ErrorHandler('User not authenticated', 401));
    }

    const userId = (req.user as IUser)._id;
    const userObjectId = new mongoose.Schema.Types.ObjectId(userId as string) as mongoose.Schema.Types.ObjectId;

    if (post.likes.some(id => id.toString() === userObjectId.toString())) {
        post.likes = post.likes.filter(id => id.toString() !== userObjectId.toString());
        await post.save();
        res.status(200).json({
            success: true,
            message: 'Unliked',
        });
    } else {
        post.likes.push(userObjectId);
        await post.save();
        res.status(200).json({
            success: true,
            message: 'Liked',
        });
    }
});


export const postOfFollowing = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    if (!req.user || !(req.user as IUser)._id) {
        return next(new ErrorHandler('User not authenticated', 401));
    }
    const user = await userModel.findById(req.user._id).populate('following', 'name')
    if(!user)return next(new ErrorHandler('Not found',404))

    const posts = await postModel.find({
        owner: {
            $in: user.following.map(follow=>follow._id)
        },
    }).populate('owner likes.user').populate('likes.user', 'name avatar')
    res.status(200).json({
        success: true,
        posts: posts.reverse()
    })
})


export const deletePost=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const post=await postModel.findById(req.params.id)
    if(!post) return next(new ErrorHandler('Not Found',404))
    await cloudinary.v2.uploader.destroy(post.postImage.public_id)
    await postModel.deleteOne({_id:post._id})
    res.status(200).json({
        success:true,
        message:'Post Deleted'
    })    
})