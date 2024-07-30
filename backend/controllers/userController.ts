import cloudinary from 'cloudinary'
import getDataUri from '../utils/dataUri.js'
import mongoose from 'mongoose'
import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import {userModel,IUser} from '../models/userModel.js'
import {postModel} from '../models/postModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import {sendToken} from '../utils/sendToken.js'
import { Request,Response,NextFunction } from 'express'


export const register=catchAsyncError(async (req:Request, res:Response, next:NextFunction)=>{
    const {name,email,password}=req.body
    const file=req.file
    if (!name || !email || !password)return next(new ErrorHandler('Enter all field',400))
    let user=await userModel.findOne({email})
    if (user)return next(new ErrorHandler('User already exist',409))
        if (!file) {
            return next(new ErrorHandler('Profile picture is required', 400));
        }
    const fileUri=getDataUri(file)
    if (!fileUri.content) {
        return next(new ErrorHandler('Failed to get file content', 500));
    }
    const mycloud=await cloudinary.v2.uploader.upload(fileUri.content)
    user=await userModel.create({
        name,email,password,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url
        },
    })
    sendToken(res, user, "Registered Successfully", 201);
})

export const login=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const {email,password}=req.body
    if(!email || !password)return next(new ErrorHandler('Enter all fields',400))
    const user=await userModel.findOne({email}).select('+password')
    if(!user)return next(new ErrorHandler('Incorrect email or password',401))
    const isMatch=await user.comparePassword(password)
    if(!isMatch)return next(new ErrorHandler('Incorrect email or password',401))
    sendToken(res, user, "Login Successfully", 201);
})

export const logout=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    res.status(200).cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true,
        secure:true,
        sameSite:'none',
    }).json({
        success:true,
        message:'Logged out'
    })
})

export const getMyProfile=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    if (!req.user || !(req.user as IUser)._id) {
        return next(new ErrorHandler('Not Found', 404));
    }
    const user=await userModel.findById(req.user._id)
    res.status(200).json({
        success:true,
        user,
    })
})

export const updateProfile=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const {name,email}=req.body
    if (!req.user || !(req.user as IUser)._id) {
        return next(new ErrorHandler('Not found', 404));
    }
    const userId=(req.user as IUser)._id
    const user=await userModel.findById(userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    if (name) user.name=name
    if (email) user.email=email
    await user.save()
    res.status(200).json({
        success:true,
        message:'Profile Updated'
    })
})

export const updateProfilePicture=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const file=req.file
    if (!file) {
        return next(new ErrorHandler('Profile picture is required', 400));
    }
    const userId=(req.user as IUser)._id
    const user=await userModel.findById(userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const fileUri=getDataUri(file)
    if (!fileUri.content) {
        return next(new ErrorHandler('Failed to get file content', 500));
    }
    const mycloud=await cloudinary.v2.uploader.upload(fileUri.content)
    if (user.avatar && user.avatar.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    }
    user.avatar={
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    }
    await user.save()
    res.status(200).json({
        success:true,
        message:'Profile Picture Updated'
    })
})

export const changePassword=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const {oldPassword,newPassword}=req.body
    if(!oldPassword || !newPassword) return next(new ErrorHandler('Enter all fields',400))
        const userId=(req.user as IUser)._id
    const user=await userModel.findById(userId).select('+password')
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    const isMatch=await user.comparePassword(oldPassword)
    if (!isMatch) return next(new ErrorHandler('Incorrect',400))
    user.password=newPassword
    await user.save()
    res.status(200).json({
        success:true,
        message:'Password changed'
    }) 
})

export const followUser=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{

    
    const userId=(req.user as IUser)._id
    const userToFollow=await userModel.findById(req.params.id)
    const loggedInUser=await userModel.findById(userId)

    if(!userToFollow) return next(new ErrorHandler('Not found',404))
    if(!loggedInUser) return next(new ErrorHandler('Not Found',404))

    const userToFollowId=userToFollow._id as unknown as mongoose.Types.ObjectId  
    const loggedInUserId=loggedInUser._id as unknown as mongoose.Types.ObjectId

    if(loggedInUser.following.includes(userToFollowId)){
        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userToFollowId.toString())
        userToFollow.followers=userToFollow.followers.filter(id=>id.toString()!==loggedInUserId.toString())
        await loggedInUser.save()
        await userToFollow.save()

        res.status(200).json({
            success:true,
            message:'Unfollowed'
        })
}else{
    loggedInUser.following.push(userToFollowId)
    userToFollow.followers.push(loggedInUserId)
    await loggedInUser.save()
    await userToFollow.save()
    res.status(200).json({
        success: true,
        message: 'Followed',
    });
}
})

export const getUserProfile=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const user=await userModel.findById(req.params.id)
    if(!user) return next (new ErrorHandler('Not Found',404))
    res.status(200).json({
    success:true,
    user,    
    })
})


export const getMyPosts=catchAsyncError(async(req,res,next)=>{
    const userId=(req.user as IUser)._id
    const user=await userModel.findById(userId)
    if (!user) return next(new ErrorHandler('User not found',404))
    const posts=await postModel.find({user:userId}).populate('likes user')
    
    res.status(200).json({
        success:true,
        posts,
    })
})

export const allUser=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const users=await userModel.find().sort()
    res.status(200).json({
        success:true,
        users,
    })
})


export const getUserPost=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const user=await userModel.findById(req.params.id)
    if (!user) return next(new ErrorHandler('User not found', 404));
    
    const posts = await postModel.find({user:user._id}).populate('likes user owner')
        res.status(200).json({
            success:true,
            posts,
        })
})

