import app from "./app.js";
import { connectDB } from './config/Database.js';
import cloudinary from 'cloudinary';
connectDB();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is connected on ${PORT}`);
});
