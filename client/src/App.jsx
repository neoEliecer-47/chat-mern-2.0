import { Button } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import axios from 'axios'

const App = () => {
  
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'
  
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
