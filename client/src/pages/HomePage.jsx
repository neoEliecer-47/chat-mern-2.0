import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Register from "../components/authentication/Register";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";

const HomePage = () => {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const location = useLocation()


  useEffect(() => {
    
    const token = JSON.parse(localStorage.getItem("token"))
    
    if(token) return navigate("/chat")
  }, [])
  
  if(user) return
  
  return (
    <Container maxW={"xl"} centerContent>
      <Box className="flex justify-center bg-white w-full mt-4 mb-15 rounded-lg border-2 p-3">
        <Text className="text-gray-800 text-4xl">E-chat 2.0</Text>
      </Box>
      <Box className="bg-white w-full p-4 rounded-lg border-2 mt-3 text-gray-800">
        
        <Tabs variant="soft-rounded">
          <TabList className="mb-2">
            <Tab className="w-[50%]">Iniciar sesión</Tab>
            <Tab className="w-[50%]">Registrarse</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      
      </Box>
    </Container>
  );
};

export default HomePage;
