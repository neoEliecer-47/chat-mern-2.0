import { Button } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import axios from 'axios'

const App = () => {
  
  axios.defaults.baseURL = 'https://api-mern-chat-2-0.onrender.com/api/v1'//'http://localhost:8080/api/v1'
  axios.defaults.withCredentials = true;
  
  return (
    
      <div className='min-h-[100vh] flex bg-[url("./assets/saitama-background.jpg")] bg-cover bg-center'>
        <Routes>
          <Route path="/" element={ <HomePage /> }/>
          <Route path='/chat' element={ <ChatPage /> } />
        </Routes>
      </div>
    
  )
}

export default App
