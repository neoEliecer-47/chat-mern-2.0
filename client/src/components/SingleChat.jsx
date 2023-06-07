import { Box, IconButton, Text } from "@chakra-ui/react"
import { useUserContext } from "../context/userContext"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender, getSenderFull } from '../config/chatLogic'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  
    const { user, selectedChat, setSelectedChat } = useUserContext()
    
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
                                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                            </>
                        )
                    }
                </Text>
                <Box className="flex justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-y-hidden">
                    messages here
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