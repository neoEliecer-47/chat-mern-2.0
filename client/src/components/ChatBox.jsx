import { useUserContext } from "../context/userContext"
import { Box } from '@chakra-ui/react'
import SingleChat from "./SingleChat"


const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  
  const { selectedChat } = useUserContext()
  
  return (
   <Box 
      display={{base: selectedChat ? "flex" : "none", md: "flex"}}
      
      alignItems="center"
      w={{base: "100%", md: "68%"}}
      className="flex flex-col"
      p={3}
      bg={"white"}
      borderRadius="lg"
      borderWidth="1px"
      
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
   </Box>
  )
}

export default ChatBox