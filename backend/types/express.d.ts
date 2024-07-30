import { userModel } from "../models/userModel";
import { IUser } from "../models/userModel";
import { Request,Response,NextFunction } from "express";

export const someMiddleware=(req:Request,res:Response,next:NextFunction)=>{
const user:IUser=req.user
} 

declare global{
    namespace Express{
        interface Request{
            user?:IUser;
        }
    }
}