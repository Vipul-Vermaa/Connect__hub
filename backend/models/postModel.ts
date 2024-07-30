import mongoose,{Document, Model, Schema} from "mongoose";

export interface IPost extends Document{
    description:string;
    postImage:{
        public_id:string;
        url:string;
    }
    owner:mongoose.Schema.Types.ObjectId;
    likes:mongoose.Schema.Types.ObjectId[];
    createdAt:Date;
}

const schema:Schema<IPost> = new mongoose.Schema({
    description: {
        type:String,
        default:'',
    },
    postImage: 
    {
        public_id: String,
        url: String,
    },
    owner: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel"
        },
    ],
    createdAt:{
        type:Date,
        default:Date.now,
    }, 
})

export const postModel:Model<IPost> = mongoose.model<IPost>('postmodel', schema)