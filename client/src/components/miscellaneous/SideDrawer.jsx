import { useState } from "react"
import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from "@chakra-ui/react"
import { ArrowForwardIcon, BellIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useUserContext } from "../../context/userContext"
import ProfileModal from "./ProfileModal"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ChatLoading from "../ChatLoading"
import UserListItem from "../avatar/UserListItem"



const SideDrawer = () => {
  
  const { user, setUser, selectedChat,setSelectedChat, chats, setChats } = useUserContext()

  
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const logoutHandler = async () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate('/')
}


const handleSearch = async () => {
  if(!search){
    toast({
      title: "por favor, ingresa nombre o email para buscar",
      status: "warning",
      duration: 3000,
      isClosable: true,
      position:  'top-left'
    })
  return;
  }

  try {
    setLoading(true)

    const { data } = await axios.get(`/users?search=${search}`, {
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    })

    setLoading(false)
    setSearchResult(data)
  } catch (error) {
    toast({
      title: "error !!",
      status: "error",
      duration: 3000,
      isClosable: true,
      position:  'bottom-left'
    })
  }
}



const accessChat = async(recipientId) => {
  try {
    setLoadingChat(true)

    const { data } = await axios.post("/chats", {recipientId}, {//en axios, la data va segunda y luego las opciones (headers y demas)
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Content-type": "application/json",
      },
      
    })
  if(!chats.find(u => u._id === data._id)) setChats([data, ...chats])//si algun chats traido de la api no se encuentra en la estado global chats, lo agregamos 
  setSelectedChat(data)
  setLoadingChat(false)
  onClose()

  } catch (error) {
    console.log(error)
    toast({
      title: "error accediendo a los chats",
      status: "error",
      duration: 3000,
      isClosable: true,
      position:  'bottom-left'
    })
  }
}
  
  return (
   
    <>
      <Box className="flex justify-between items-center bg-white w-full py-5 px-10 border-[5px]">
      
      <Tooltip label="Busca un usuario para chatear" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{ base: "none", md: "flex" }} className="p-4 ">
              Buscar usuario            
          </Text>
        </Button>
      </Tooltip>
    
      <Text className="text-2xl font-sans text-gray-600">
        E-chat-2.0
      </Text>

        <div>
          <Menu>
            <MenuButton className="p-1">
              <BellIcon className="m-1 text-2xl"/>
              
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={ <ChevronDownIcon /> } >
              <Avatar
                size={"sm"}
                className="cursor-pointer"
                name={user.name}
                src={user.pic}  
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Mi perfil</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    
    
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
           <DrawerHeader className="border-b text-center">Busqueda de usuarios</DrawerHeader>
        
           <DrawerBody>
          <Box className="flex py-2 gap-2">
            <Input 
              placeholder="nombre o email"
              className=""
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}><ArrowForwardIcon /></Button>
          </Box>
          {loading ? 
            <ChatLoading />
          : (
            searchResult?.map(user => (
              <UserListItem 
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner ml={"auto"} className="flex" />}
        </DrawerBody>
        </DrawerContent>
        
      </Drawer>
    </>
   
  )
}

export default SideDrawer