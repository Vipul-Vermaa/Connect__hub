var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { catchAsyncError } from './catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { userModel } from '../models/userModel.js';
export const isAuthenticated = catchAsyncError((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token)
        return next(new ErrorHandler('Not Logged In', 401));
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return next(new ErrorHandler('Invalid Token', 401));
    }
    ;
    const user = yield userModel.findById(decoded._id);
    if (!user)
        return next(new ErrorHandler('User Not Found', 404));
    req.user = user;
    next();
}));
