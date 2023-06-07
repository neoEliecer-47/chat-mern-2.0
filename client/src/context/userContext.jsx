import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])

  const navigate = useNavigate()
  
  
  useEffect(() => {
    
    const token = JSON.parse(localStorage.getItem("token"))
    //console.log(token)
  /*  if(!user){
       axios.get("/chats", {
        headers: {
          "Authorization":`Bearer ${token}`
        }
      }).then(({ data }) => setUser(data))
        .catch(({ response }) => {
          const { data } = response
          if(data === "no bearer, no authorization") return navigate('/')
        }) 
    }*/
    if(!token) return navigate("/")
    if(!user){
      axios.get("/users/profile", {
        headers: {
          "Authorization":`Bearer ${token}`
        }
      }).then(({ data }) => {
        setUser(data)
        setReady(true)
      })
        .catch((err) => console.log(err.response))
    }

  
  }, [])


  return (
    <UserContext.Provider value={{ user, setUser, ready, selectedChat,setSelectedChat, chats, setChats }}>
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider
export const useUserContext = () => useContext(UserContext)