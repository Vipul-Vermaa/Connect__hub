import mongoose from 'mongoose'

export const connectDB=async()=>{
    const mongoURI=process.env.MONGO_URI ?? ''
    if(!mongoURI){
        throw new Error('not defined')
    }
    const {connection}=await mongoose.connect(mongoURI)
    console.log(`Connected to ${connection.host}`)
}