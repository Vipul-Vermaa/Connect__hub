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
import getDataUri from '../utils/dataUri.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { userModel } from '../models/userModel.js';
import { postModel } from '../models/postModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendToken } from '../utils/sendToken.js';
// register
export const register = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const file = req.file;
    if (!name || !email || !password)
        return next(new ErrorHandler('Enter all field', 400));
    let user = yield userModel.findOne({ email });
    if (user)
        return next(new ErrorHandler('User already exist', 409));
    if (!file) {
        return next(new ErrorHandler('Profile picture is required', 400));
    }
    const fileUri = getDataUri(file);
    if (!fileUri.content) {
        return next(new ErrorHandler('Failed to get file content', 500));
    }
    const mycloud = yield cloudinary.v2.uploader.upload(fileUri.content);
    user = yield userModel.create({
        name, email, password,
        avatar: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        },
    });
    sendToken(res, user, "Registered Successfully", 201);
}));
// login
export const login = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new ErrorHandler('Enter all fields', 400));
    const user = yield userModel.findOne({ email }).select('+password');
    if (!user)
        return next(new ErrorHandler('Incorrect email or password', 401));
    const isMatch = yield user.comparePassword(password);
    if (!isMatch)
        return next(new ErrorHandler('Incorrect email or password', 401));
    sendToken(res, user, "Login Successfully", 201);
}));
// logout
export const logout = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }).json({
        success: true,
        message: 'Logged out'
    });
}));
// getmyprofile
export const getMyProfile = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        return next(new ErrorHandler('Not Found', 404));
    }
    const user = yield userModel.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
    });
}));
// updateprofile
export const updateProfile = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!req.user || !req.user._id) {
        return next(new ErrorHandler('Not found', 404));
    }
    const userId = req.user._id;
    const user = yield userModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    if (name)
        user.name = name;
    if (email)
        user.email = email;
    yield user.save();
    res.status(200).json({
        success: true,
        message: 'Profile Updated'
    });
}));
// updateprofilepicture
export const updateProfilePicture = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        return next(new ErrorHandler('Profile picture is required', 400));
    }
    const userId = req.user._id;
    const user = yield userModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    const fileUri = getDataUri(file);
    if (!fileUri.content) {
        return next(new ErrorHandler('Failed to get file content', 500));
    }
    const mycloud = yield cloudinary.v2.uploader.upload(fileUri.content);
    if (user.avatar && user.avatar.public_id) {
        yield cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url
    };
    yield user.save();
    res.status(200).json({
        success: true,
        message: 'Profile Picture Updated'
    });
}));
// changepassword
export const changePassword = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        return next(new ErrorHandler('Enter all fields', 400));
    const userId = req.user._id;
    const user = yield userModel.findById(userId).select('+password');
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    const isMatch = yield user.comparePassword(oldPassword);
    if (!isMatch)
        return next(new ErrorHandler('Incorrect', 400));
    user.password = newPassword;
    yield user.save();
    res.status(200).json({
        success: true,
        message: 'Password changed'
    });
}));
// followunfollow
export const followUser = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const userToFollow = yield userModel.findById(req.params.id);
    const loggedInUser = yield userModel.findById(userId);
    if (!userToFollow)
        return next(new ErrorHandler('Not found', 404));
    if (!loggedInUser)
        return next(new ErrorHandler('Not Found', 404));
    const userToFollowId = userToFollow._id;
    const loggedInUserId = loggedInUser._id;
    if (loggedInUser.following.includes(userToFollowId)) {
        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== userToFollowId.toString());
        userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== loggedInUserId.toString());
        yield loggedInUser.save();
        yield userToFollow.save();
        res.status(200).json({
            success: true,
            message: 'Unfollowed'
        });
    }
    else {
        loggedInUser.following.push(userToFollowId);
        userToFollow.followers.push(loggedInUserId);
        yield loggedInUser.save();
        yield userToFollow.save();
        res.status(200).json({
            success: true,
            message: 'Followed',
        });
    }
}));
// userprofile
export const getUserProfile = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel.findById(req.params.id);
    if (!user)
        return next(new ErrorHandler('Not Found', 404));
    res.status(200).json({
        success: true,
        user,
    });
}));
// mypost
export const getMyPosts = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield userModel.findById(userId);
    if (!user)
        return next(new ErrorHandler('User not found', 404));
    const posts = yield postModel.find({ user: userId }).populate('likes user');
    res.status(200).json({
        success: true,
        posts,
    });
}));
// alluser
export const allUser = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel.find().sort();
    res.status(200).json({
        success: true,
        users,
    });
}));
// userpost
export const getUserPost = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel.findById(req.params.id);
    if (!user)
        return next(new ErrorHandler('User not found', 404));
    const posts = yield postModel.find({ user: user._id }).populate('likes user owner');
    res.status(200).json({
        success: true,
        posts,
    });
}));
