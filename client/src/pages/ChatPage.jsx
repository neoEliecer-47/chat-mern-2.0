import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUserContext } from '../context/userContext'
import { Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage = () => {
  const [chats, setChats] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const { user, ready } = useUserContext()
  
  
  async function fetchChats () {
    try {
      const {data} = await axios.get("/chats", {
        "Authorization":`Bearer ${user?.token}`
      }) 
      setChats(data)
    } catch (error) {
      //console.log(error?.response)
    }
  }  
  
  useEffect(() => {
    fetchChats()
  }, [user])
  if(!ready && !user) return <div>cargando...</div>
  //console.log(user)

  return (
    <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
      <Box display={'flex'} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage