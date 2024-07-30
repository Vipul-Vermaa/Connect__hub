import mongoose from "mongoose";
const schema = new mongoose.Schema({
    description: {
        type: String,
        default: '',
    },
    postImage: {
        public_id: String,
        url: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel"
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const postModel = mongoose.model('postmodel', schema);
