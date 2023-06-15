import Message from "../models/messageModel.js"
import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'


export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body

    if(!content || !chatId){
        console.log('datos inválidos, campos vacios')
        return res.status(400)

    }

    let newMessage = {
        sender: req.uid,
        content: content,
        chat: chatId
    }

    try {
        //'message' instancia de mongoose o de la clase mongoose
        let message = await Message.create(newMessage)//el segundo parametro, y sin separar por comas, es para esecificar que queremos rellenar o poblar
        message = await message.populate("sender", "name pic")//se ejecuta cuando los datos esten disponibles, por ser una instancia de mongoose
        message = await message.populate("chat")//hacemos lo mismo pero con todos los datos de ese chatId en el modelo chat 
           //chat -> todo lo del chat, en sender name y pic                                             //lo poblamos con estos datos (name pic) tomando en cuenta los ref de los modelos

                                                 //en la nueva version de mongoose, execPopulate está deprecado           
        message = await User.populate(message, {
            path: 'chat.users',//ese chat, es ya el id del rellenado (populate) de arriba
            select: 'name pic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {//actualizando el latestMessage en el documento chat
            latestMessage: message
        })

        res.status(201).json(message)
    } catch (error) {                   
    res.status(500).json(error.message)
        
    }
}


export const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
                    .populate("sender", "name pic email")//'sender' el id del usuario que envia el mensaje, por el cual guiandose por el ref del modelo, nos traemos ciertos fields, en este caso 'name pic email'
                    .populate("chat")

        res.status(200).json(messages)

    } catch (error) {
        res.status(500).json(error.message)
    }
}



/*
let message = await Message.create({ sender: user._id, content, chat: chatId });



  message = await (

    await message.populate("sender", "name profilePicture")

  ).populate({

    path: "chat",

    select: "chatName isGroupChat users",

    model: "Chat",

    populate: { path: "users", select: "name email profilePicture", model: "User" },

  });
*/