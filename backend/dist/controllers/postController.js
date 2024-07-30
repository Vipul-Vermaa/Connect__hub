var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cloudinary from 'cloudinary';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import getDataUri from '../utils/dataUri.js';
import ErrorHandler from '../utils/errorHandler.js';
import { postModel } from '../models/postModel.js';
import { userModel } from '../models/userModel.js';
import mongoose from 'mongoose';
// getallpost
export const getAllPost = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield postModel.find()
        .populate('owner')
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        posts
    });
}));
// createpost
export const createPost = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, user } = req.body;
    const file = req.file;
    if (!description || !file) {
        return next(new ErrorHandler('Description and image file are required', 400));
    }
    const fileUri = getDataUri(file);
    if (!fileUri.content) {
        return next(new ErrorHandler('Failed to get file content', 500));
    }
    const mycloud = yield cloudinary.v2.uploader.upload(fileUri.content);
    const post = yield postModel.create({
        description,
        postImage: {
            type: file.mimetype.split('/')[0],
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        },
        user,
    });
    res.status(201).json({
        success: true,
        message: 'Post Created',
        post,
    });
}));
// likeunlike
export const likeAndUnlikePost = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postModel.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler('Post not found', 404));
    }
    if (!req.user || !req.user._id) {
        return next(new ErrorHandler('User not authenticated', 401));
    }
    const userId = req.user._id;
    const userObjectId = new mongoose.Schema.Types.ObjectId(userId);
    if (post.likes.some(id => id.toString() === userObjectId.toString())) {
        post.likes = post.likes.filter(id => id.toString() !== userObjectId.toString());
        yield post.save();
        res.status(200).json({
            success: true,
            message: 'Unliked',
        });
    }
    else {
        post.likes.push(userObjectId);
        yield post.save();
        res.status(200).json({
            success: true,
            message: 'Liked',
        });
    }
}));
// postof following
export const postOfFollowing = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        return next(new ErrorHandler('User not authenticated', 401));
    }
    const user = yield userModel.findById(req.user._id).populate('following', 'name');
    if (!user)
        return next(new ErrorHandler('Not found', 404));
    const posts = yield postModel.find({
        owner: {
            $in: user.following.map(follow => follow._id)
        },
    }).populate('owner likes.user').populate('likes.user', 'name avatar');
    res.status(200).json({
        success: true,
        posts: posts.reverse()
    });
}));
// deleting a post
export const deletePost = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postModel.findById(req.params.id);
    if (!post)
        return next(new ErrorHandler('Not Found', 404));
    yield cloudinary.v2.uploader.destroy(post.postImage.public_id);
    yield postModel.deleteOne({ _id: post._id });
    res.status(200).json({
        success: true,
        message: 'Post Deleted'
    });
}));
