import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorMiddleware from './middlewares/Error.js';
config({
    path: '../backend/config.env'
});
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb",
    extended: true
}));
app.use(cors(corsOptions));
app.use(cookieParser());
import user from './routes/userRoutes.js';
import post from './routes/postRoutes.js';
app.use('/api/v1', user);
app.use('/api/v1', post);
export default app;
app.use(ErrorMiddleware);
