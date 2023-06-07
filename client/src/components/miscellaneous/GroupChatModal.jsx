import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, 
        ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import { useUserContext } from "../../context/userContext"
import { useState } from "react"
import axios from "axios"
import UserListItem from '../avatar/UserListItem'
import UserBadgeItem from "../avatar/UserBadgeItem"


const GroupChatModal = ({ children }) => {
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    
    const { user, chats, setChats } = useUserContext()
    const toast = useToast()
  
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


    const handleGroup = (userToAdd) => {
        console.log(userToAdd._id)
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: `${userToAdd.name} ya ha sido agregado`,
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:  'bottom-left'
              })
              return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }



    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
    }

    
    
    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: "por favor, llena todos los campos",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              return;
        }
        
        if(selectedUsers.length < 2) {
            toast({
                title: 'el chat grupal debe contener al menos dos usuarios!',
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:  'bottom'
              })
              return;
        }
        
        try {
          const { data } = await axios.post("/chats/group", {
            name:groupChatName, users:selectedUsers.map(user => user._id)
          }, 
          {
            headers: {
              "Authorization": `Bearer ${user.token}`
            }
          })

          setChats([data, ...chats])
          onClose()
          
          toast({
            title: 'chat grupal creado!',
            status: "success",
            duration: 3000,
            isClosable: true,
            position:  'bottom'
          })
        } catch (error) {
          toast({
            title: 'error creando el vhat grupal',
            status: "warning",
            duration: 3000,
            isClosable: true,
            position:  'bottom'
          })
        }
    }

    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="28px" className="flex justify-center">Crear chat grupal</ModalHeader>
              <ModalCloseButton />
              <ModalBody className="flex gap-2 flex-col">
                <FormControl>
                    <Input placeholder="nombre del grupo" onChange={e => setGroupChatName(e.target.value)} />
                </FormControl>

                <FormControl>
                    <Input placeholder="agregar usuarios, ejem: Santiago, Maria, etc" onChange={e => handleSearch(e.target.value)}/>
                </FormControl>
              
            <Box className="flex">
              {selectedUsers.length > 0 && selectedUsers.map(user => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)}/>
              ))}
            </Box>
                {loading ? <Spinner /> : (
                    searchResult?.slice(0,4).map(user => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
                    ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Crear
                </Button>
                
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal