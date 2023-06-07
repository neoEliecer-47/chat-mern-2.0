import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import UserProvider from './context/userContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
 
      <BrowserRouter>
        <UserProvider>
            <ChakraProvider>
              <App />
            </ChakraProvider>   
        </UserProvider>
      </BrowserRouter>
 ,
)
