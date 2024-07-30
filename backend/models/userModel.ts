import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import {z,ZodError,ZodSchema} from 'zod'
import {Request,Response,NextFunction} from 'express'

export const signUpSchema = z.object({
    name: z
    .string({required_error:'Naam is required'})
    .trim()
    .min(3,{message:'atleast 3'}),

    email: z
    .string({ message: 'Enter Your Email' })
    .email({ message: 'Invalid email format' }),

    password: z
    .string()
    .min(6, { message: 'must be six letter or more' }),

    posts: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/)
    .optional())
    .default([]),

    followers: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([]),

    following: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([]),
});

export const validate=(schema:ZodSchema)=>async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const parseBody=await schema.parseAsync(req.body)
        req.body=parseBody
        next()
    } catch (error) {
        if(error instanceof ZodError){
        const message=error.errors[0].message;
        res.status(400).json({msg:message})
    }else{
        next(error)
    }
  }
}

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    posts:mongoose.Types.ObjectId[];
    avatar?:{
        public_id:string;
        url:string;
    }
    followers:mongoose.Types.ObjectId[];
    following:mongoose.Types.ObjectId[];
    getJWTToken:()=>string;
    comparePassword:(password:string)=>Promise<boolean>
}

const schema:Schema<IUser> =new mongoose.Schema({

name:{
    type:String,
    required:[true,'Enter name'],
},

email:{
    type:String,
    required:[true,'Enter email'],
    unique:true,
    validate: [validator.isEmail, 'Invalid email format'],
},

password:{
    type:String,
    required:[true,'Enter password'],
    select:false,
},

posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"postModel",
}],

avatar:{
    public_id:String,
    url:String,
},

followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel",
}],

following:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'userModel',
}],
})

schema.pre<IUser>('save',async function(next){
    if(!this.isModified('password'))return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

schema.methods.getJWTToken=function (){
    return jwt.sign
    (
        {_id:this._id},
        process.env.JWT_SECRET as string,
        {expiresIn:'10d',}
    )
}

schema.methods.comparePassword=async function(password:string){
    return await bcrypt.compare(password,this.password)
}

export const userModel:Model<IUser>=mongoose.model<IUser>('userModel',schema)