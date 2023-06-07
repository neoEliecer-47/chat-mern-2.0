import { useEffect, useState } from "react"
import { ViewIcon } from "@chakra-ui/icons"
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import { useUserContext } from "../../context/userContext"
import UserBadgeItem from '../avatar/UserBadgeItem'
import axios from "axios"
import UserListItem from "../avatar/UserListItem"


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = useUserContext()
    
    
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [groupChatName, setGroupChatName] = useState('')
    const [renameLoading, setrenameLoading] = useState(false)
  
    const toast = useToast()
    

  

    
    
    
    
    const handleRemove = async (currentUserToLeaveGroup) => {
        if(selectedChat.groupAdmin._id !== user._id && currentUserToLeaveGroup._id !== user._id){
            toast({
                title: "solo administradores pueden eliminar usuarios!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              return;
        }

        
        try {
           setLoading(true)
           
           const { data } = await axios.put("/chats/groupremove", {
            chatId: selectedChat._id,
            userId: currentUserToLeaveGroup._id
           }, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
           })

           currentUserToLeaveGroup._id === user._id ? setSelectedChat() : setSelectedChat(data)//si el user que le estamos enviando seamos nostros u otro es igual al user que esta conectado, entonces ya no querremos ver ese chat. de lo contrario solo actualiza el chat y los usuarios sin el que eliminamos obviamente
           setFetchAgain(!fetchAgain)
           setLoading(false)

           toast({
            title: selectedChat.groupAdmin._id === currentUserToLeaveGroup._id ? `dejaste ${selectedChat.chatName}` : "usuario elimiado con exito",
            status: "success",
            duration: 3000,
            isClosable: true,
            position:  'bottom'
          })

        } catch (error) {
            toast({
                title: "falló en eliminar usuario",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
            setLoading(false)  
        }
    }


    const handleRename = async () => {
        if(!groupChatName){
            toast({
                title: "escribe el nuevo nombre del grupo",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:  'bottom-left'
              })
              return;
        }

        try {
            setrenameLoading(true)
            
            const { data } = await axios.put("/chats/rename", {
                chatName: groupChatName,
                chatId: selectedChat._id
            }, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setrenameLoading(false)
            toast({
                title:`nombre del grupo actualizado!`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
        } catch (error) {
            toast({
                title: "error al actualizar nombre del grupo",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              setrenameLoading(false)
              
              

        }
    }



    const handleSearch = async (query) => {
        setSearch(query)

        if(!query) return;

        try {
            setLoading(true)

            const { data } = await axios.get(`/users?search=${search}`, {
                headers: {
                    "Authorization":`Bearer ${user.token}`
                }
            })
            console.log(data)
            setSearchResult(data)
            setLoading(false)
        } catch (error) {
            toast({
                title: "error cargar users",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:  'bottom-left'
              })
        }
    }




    const handleAddUser = async (userResult) => {
        if(selectedChat.users.find(u => u._id === userResult._id)){
            toast({
                title: "este usuario ya se encuentra en el grupo",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "solo el administrador puede añadir usuarios",
                status: "info",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              return;
        }
        
        try {
            setLoading(true)

            const { data } = await axios.put("/chats/groupadd", {
                chatId: selectedChat._id,
                userId: userResult._id
            }, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })
            

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
            toast({
                title: `se añadió ${userResult.name} al grupo`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
        } catch (error) {
            toast({
                title: "error al añadir usuario al grupo",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              setLoading(false)
        }
    }

    return (
        <>
          <IconButton display={{base: "flex"}} icon={ <ViewIcon /> } onClick={onOpen} />
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="28px"
                className="flex justify-center"
              >{selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box className="flex flex-wrap w-full pb-3">
                    {selectedChat.users.map(u => (
                        <UserBadgeItem 
                            key={u._id}
                            user={u}
                            handleFunction={() => handleRemove(u)}
                        />
                    ))}
                </Box>

                <FormControl className="flex gap-1">
                    <Input 
                        placeholder="nombre del grupo"
                        value={groupChatName}
                        
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant={'solid'}
                        colorScheme="teal"
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
                    >
                        Actualizar
                    </Button>
                </FormControl>

                <FormControl>
                    <Input 
                        placeholder="añadir usuario al grupo"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {
                    loading ? (
                        <Spinner size="lg" />
                    ) : (
                        searchResult.slice(0,4).map(user => (
                            <UserListItem 
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )
                }
              </ModalBody>
    
              <ModalFooter>
                <Button onClick={() => handleRemove(user)} colorScheme="red">
                        Salir del grupo
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default UpdateGroupChatModal