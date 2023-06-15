import { useEffect, useState } from "react"
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react"
import { useUserContext } from "../context/userContext"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender, getSenderFull } from '../config/chatLogic'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
import axios from "axios"
import ScrollableChat from "./messages/ScrollableChat"
import { io }  from 'socket.io-client'
import Lottie  from 'react-lottie'
import animationData from '../animations/107605-typing.json'


const ENDPOINT = ''
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  
    const { user, selectedChat, setSelectedChat, notifications, setNotifications } = useUserContext()
    const toast = useToast()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    
    

    const fetchMessages = async () => {
        if(!selectedChat) return

        try {
            
            setLoading(true)
            
            const { data } = await axios.get("/messages/"+selectedChat._id, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })

            //console.log(data)
            setMessages(data)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)//con el id del chat creamos una nueva room
        } catch (error) {
            toast({
                title: "error al cargar mensajes",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:  'bottom-right'
              })
        }
    }
    
    const sendMessage  = async (e) => {
        if(e.key === 'Enter' && newMessage){//si damos click en enter y existe el newMessage
            socket.emit("stop typing", selectedChat._id)
            try {
                
                setNewMessage("")
                
                const { data } = await axios.post("/messages", {
                    content: newMessage,
                    chatId: selectedChat._id

                }, {
                    "Content-type": "application/json",
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                socket.emit("new message", data)
                //console.log(data)
                setMessages([...messages, data])

            } catch (error) {
                toast({
                    title: "error al enviar mensaje",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position:  'bottom-right'
                  })
            }


        }
    }
    

    useEffect(() => {
        socket = io("ws://api-mern-chat-2-0.onrender.com", {
            withCredentials: true
        })
        socket.emit("setup", user)//emit (socket) es como el metodo 'send' en la libreria ws
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])
    
    
    
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])
    //console.log(notifications)

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notifications.includes(newMessageRecieved)){
                    setNotifications([newMessageRecieved, ...notifications])
                    setFetchAgain(!fetchAgain)
                    
                }
            }else {
                
                setMessages([...messages, newMessageRecieved])
            }
        })
    })


    



    
    
    const typinghandler  =  (e) => {
        setNewMessage(e.target.value)
        //console.log(typing)

        if(!socketConnected) return

        if(!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)//enviamos el id del room (chat seleccionado)
            
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiffrence = timeNow - lastTypingTime

            if(timeDiffrence >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id)
                
                setTyping(false)
            }
        }, timerLength);

    }


    //if(!isTyping) console.log('no llega nunca...')

    
 return (
   <>
   {
        selectedChat ? (
            <>
                <Text fontSize={{base: "28px", md: "30px"}} display="flex" alignContent="center"  justifyContent={{base: "space-between"}} className="pb-3 px-2 w-full" >
                    <IconButton 
                        display={{base: "flex", md: "none"}}
                        icon={ <ArrowBackIcon /> }
                        onClick={() => setSelectedChat("")}
                    />
                    {
                        !selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                {<ProfileModal user={getSenderFull(user, selectedChat.users)}/>}
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {<UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                            </>
                        )
                    }
                </Text>
                <Box className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-y-hidden">
                    {loading ? (
                        <Spinner 
                            size='xl'
                            className="h-20 w-20 m-auto"
                            alignSelf='center'
                        />
                    ): (
                        <div className="messages">
                            <ScrollableChat messages={messages} />
                        </div>
                    )}

                    <FormControl onKeyDown={sendMessage} isRequired mt='3'>
                        {isTyping ? <div>
                            <Lottie
                                options={defaultOptions}
                                width={70}
                                style={{marginBottom: 5, marginLeft: 0}}

                            />
                        </div> : <></>}
                        <Input 
                            bg='#E0E0E0'
                            variant='filled'
                            placeholder="mensaje"
                            value={newMessage}
                            onChange={typinghandler}
                        />
                    </FormControl>
                </Box>
                
            </>
        ): (
            <>
                <Box className="flex items-center justify-center h-full w-full">
                    <Text fontSize="xl" className="pb-3 text-center text-gray-500">
                        Click en un usuario para empezar a chatear
                    </Text>
                </Box>
            </>
        )
   }
   </>
  )
}

export default SingleChat