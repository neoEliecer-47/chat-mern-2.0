import { useEffect, useState } from 'react'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { useUserContext } from '../context/userContext'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../config/chatLogic'
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChats = ({ fetchAgain }) => {
  
  const { user, setUser, selectedChat,setSelectedChat, chats, setChats } = useUserContext()
  const toast = useToast()
  
  const [loggedUser, setLoggedUser] = useState(null)


  async function fetchChats () {
    
    try {
      const {data} = await axios.get("/chats", {
        headers: {
          "Authorization":`Bearer ${user.token}`
        }
      }) 
      console.log(data)
      setChats(data)
    } catch (error) {
      console.log('entró en error myChats')
      toast({
        title: "error al cargar los chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position:  'bottom-left'
      })
    }
  }  
  
  useEffect(() => {
    setLoggedUser(user)
    fetchChats()
  }, [fetchAgain])
  

  
  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Box 
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        className='flex justify-between'
        w="100%"
        
        alignItems="center"
      >
        Mis chats
        <GroupChatModal>
          <Button display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={ <AddIcon /> }>
            Nuevo chat grupal
          </Button>
        </GroupChatModal>
      </Box>

      <Box 
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack className='overflow-y-scroll'>
            {chats?.map(chat => (
              <Box
                className='cursor-pointer px-3 py-2 rounded-lg'
                color={selectedChat === chat ? "white" : "black"}
                bg={ selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                onClick={() => setSelectedChat(chat)}
                key={chat?._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}{/*!chat.isGroupChat es como decir === false, si se cumple hace lo del ? */}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats