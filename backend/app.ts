import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import ErrorMiddleware from './middlewares/Error.js'

config({
    path:'../backend/config.env'
})

const app=express()

const corsOptions={
    origin:process.env.FRONTEND_URL,
    credentials:true,
}

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb",
    extended:true
}))
app.use(cors(corsOptions))
app.use(cookieParser())

import user from './routes/userRoutes.js'
import post from './routes/postRoutes.js'

app.use('/api/v1',user)
app.use('/api/v1',post)

export default app

app.get("/", (req, res) =>
    res.send(
      `<h1> click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
    )
  );

app.use(ErrorMiddleware)