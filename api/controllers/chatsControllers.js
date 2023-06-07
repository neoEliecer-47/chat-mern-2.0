import { json } from "express"
import { chats } from "../data/data.js"
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js"

export const oneChat = (req,res) => {
    res.send(chats)
}

export const createOrAccessOneChat = async (req, res) => {
    //const chat = chats.find(chat => chat._id === id)
    const { recipientId } = req.body //id del destinatario

    if(!recipientId){
        console.log('user id param not sent with request')
        return res.sendStatus(400)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [//para que cumpla con el and, ambos campos deben ser true
            {users: {$elemMatch: {$eq: req.uid}}},
            {users: {$elemMatch: {$eq: recipientId}}}
        ]
    }).populate("users", "-password").populate("latestMessage")//populate, mediante la referencia en el modelo (campo users), traerá todos los elementos de los usuarios encontrados (en el User model) excepto la contraseña
    //dependiendo del id, tambien tráete los ultimos mensajes
    //'latestMessage' y se trae los ultimos mensajes de los usuarios encontrados 
    //POPULATE se usa unicamente cuando hay referencias a otros schemas en los modelos
    isChat = await User.populate(isChat, {//con la informacion encontrada arriba, hacemos esto
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if(isChat.length > 0){//si existe lo retornamos, y como es un array lo especificamos, obviamente sera un solo chat y por eso tambien el index 0
        res.send(isChat[0])
    }else {//si finalmente el chat no existe, loc creamos
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.uid, recipientId]
        }
        
        try {
            const createdChat = await Chat.create(chatData)//esto retorna el documento

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password")

            res.status(201).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    
    
    }

    
}



export const accessAllChats = async (req, res) => {
    try {
        await Chat.find({users: {$elemMatch: {$eq: req.uid}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt: -1})//sort accede al indice de los documentos y con el -1 nos traemos automaticamente el ultimo doc
                .then(async (results) => {
                    results = await User.populate(results, {
                        path: "latestMessage.sender",
                        select: "name pic email"
                    })

                    res.status(200).send(results)
                })
    } catch (error) {
        res.status(400).json(error.message)
    }
}



export const createGroupChat = async(req, res) => {
    try {
        
        const { name, users } = req.body//nombre del grupo de chat y usuarios

        if(!users || !name){
            return res.status(400).json('por favor, llena todos los campos')
        }    

        if(users.length < 2){
            return res.status(400).json('mas de dos usuarios son necesarios para crear un chat grupal')
        }

        users.push(req.uid)

        const groupChat = await Chat.create({
            chatName: name,
            users,
            isGroupChat: true,
            groupAdmin: req.uid
        })


        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
                                        .populate("users", "-password")
                                        .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)

    } catch (error) {
        res.status(500).json(error.message)
    }
}



export const renameGroup = async (req, res) => {
    try {
       
        const { chatName,  chatId} = req.body

        const renamedGroup = await Chat.findByIdAndUpdate(chatId, {
            chatName
        },
        {
            new: true//el new:true te retorna el documento luego de actualizarlo
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        if(!renamedGroup){
            res.status(404)
            throw new Error('chat grupal no encontrado')
        }else{
            res.status(200).send(renamedGroup)
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
}



export const addUserToGroup = async (req, res) => {
    
    const { chatId, userId } = req.body

    try {
                                                     //filtro
        const addedUser = await Chat.findByIdAndUpdate(chatId, {$push: {users: userId}}, {new: true})//nos devuelve el documento actualizado porque por defecto findOneAndUpdate nos retorna el documento tal cual era antes de actualizarlo
                                                        .populate("users", "-password")
                                                        .populate("groupAdmin", "-password")//hay que usar populated en las ref de los documentos cuando se actualicen

        if(!addedUser) return res.status(404).json('chat grupal no encontrado')
        res.status(200).send(addedUser)
                                                        

    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
}



export const removeUserFromGroup = async (req, res) => {
    const { chatId, userId } = req.body

    try {
                                                     //filtro
        const removedUser = await Chat.findByIdAndUpdate(chatId, {$pull: {users: userId}}, {new: true})//nos devuelve el documento actualizado porque por defecto findOneAndUpdate nos retorna el documento tal cual era antes de actualizarlo
                                                        .populate("users", "-password")
                                                        .populate("groupAdmin", "-password")//hay que usar populated en las ref de los documentos cuando se actualicen

        if(!removedUser) return res.status(404).json('chat grupal no encontrado')
        res.status(200).send(removedUser)
                                                        

    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
}