import { Request,Response,NextFunction } from "express"


type PassedFunction=(
    req:Request,
    res:Response,
    next:NextFunction,
)=>Promise<any>

export const catchAsyncError=(passedFunction:PassedFunction)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(passedFunction(req,res,next)).catch(next)
    }
    