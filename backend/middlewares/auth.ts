import  jwt  from "jsonwebtoken";
import {catchAsyncError} from './catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import {userModel} from '../models/userModel.js'
import { Request,Response,NextFunction } from "express";


interface Decoded{
    _id:string;
}

export const isAuthenticated=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const {token} =req.cookies
    if(!token) return next(new ErrorHandler('Not Logged In',401))
        let decoded:Decoded;
    try{
    decoded=jwt.verify(token,process.env.JWT_SECRET as jwt.Secret ) as Decoded;
    }catch(error){
        return next(new ErrorHandler('Invalid Token', 401));
    };
    const user=await userModel.findById(decoded._id)
    if (!user) return next(new ErrorHandler('User Not Found',404))
    req.user=user    
    next()
})
