import express from 'express'
import { createServer } from 'http'
import cors from "cors";
import 'dotenv/config'
import './db/mongoDB.js'//database import siempre denajo de dotenv, porque aqui es donde se inicializan
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";

import chatRoute from './routes/chatRoute.js'
import userRoute from './routes/userRoute.js'
import photoRoute from './routes/photoRoute.js'
import messageRoute from './routes/messageRoute.js'


import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

const app = express()
app.use(
    cors({
        credentials: true,
        origin: "https://chat-mern-2.netlify.app",
        
    })
);
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
const server = app.listen(PORT, () => console.log('conectado server http://localhost:'+PORT))
//const httpServer = createServer()
const io = new Server(server, {
    pingTimeout: 600000,//el tiempo que esperará (estando inactivo) antes de cerrar la conexion para ahorrar banda ancha de internet
    cors: {
        origin: ["https://chat-mern-2.netlify.app"],
        credentials: true,
    }
})

io.on("connection", (socket) => {//callback funtion cuando esa conexion sea llamada
    console.log('connected to socket io')

    socket.on("setup", (userData) => {//esto tomará la data del usuario desde el frontend
        socket.join(userData._id)//creamos una 'room' exclusiva para el usuario
        //console.log(userData)
        socket.emit("connected")
    })


    socket.on("join chat", (room)=> {

        socket.join("room")
        console.log('user joined room: '+room)
    })



    socket.on("typing", (room) => socket.to('room', room).emit("typing"));//recibimos el typing y lo devolvemos al cliente);
    socket.on("stop typing", (room) => socket.to('room', room).emit("stop typing"));//room en el emit ???


    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log('chat.users not defined')

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })


    socket.off("setup", (userData) => {
        console.log('usuario desconectado');
        socket.leave(userData._id)
    })



})

io.listen(server)


