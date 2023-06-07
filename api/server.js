import express from 'express'
import 'dotenv/config'
import './db/mongoDB.js'//database import siempre denajo de dotenv, porque aqui es donde se inicializan
import cookieParser from "cookie-parser";

import chatRoute from './routes/chatRoute.js'
import userRoute from './routes/userRoute.js'
import photoRoute from './routes/photoRoute.js'
import messageRoute from './routes/messageRoute.js'


import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

const app = express()
app.use(express.json())
app.use(cookieParser())


app.use("/api/v1/chats", chatRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/photos", photoRoute)
app.use("/api/v1/messages", messageRoute)


app.use(notFound)
app.use(errorHandler)


app.get("/", (req, res) => {
    res.send('hola desde nodejs')
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log('conectado server http://localhost:'+PORT))