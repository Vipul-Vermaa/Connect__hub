import {Request,Response,NextFunction} from 'express'

interface CustomError{
    statusCode?:number
    message:string
}


const ErrorMiddleware=(err:CustomError,req:Request,res:Response,next:NextFunction)=>{

    err.statusCode=err.statusCode || 500
    err.message=err.message || 'Internal Servor Error'

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}
export default ErrorMiddleware