import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import { useState } from "react"
import axios from 'axios'
import { useUserContext } from '../../context/userContext'
import { useNavigate } from "react-router-dom"


const Login = () => {
  
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [show, setShow] = useState(false)  
const [loading, setLoading] = useState(false)
const toast = useToast()
const { setUser } = useUserContext()
const navigate = useNavigate()

 
const handleSubmit = async() => {
    setLoading(true)
    try {
        if(!email || !password){
            toast({
                title: '',
                description: "por favor, llena todos los campos",
                status: 'warning',
                duration: 2000,
                isClosable: true,
              })
              setLoading(false)
              return;
        }



        const {data} = await axios.post("/users/login", {
            
            email,
            password,
            
        })
       // console.log(res)
        setLoading(false)
        toast({
            title: '',
            description: "Binvenido!",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          localStorage.setItem("token", JSON.stringify(data.token))
          setUser(data)
          setPassword('')
          setEmail('')
          navigate("/chat")
    } catch (error) {
        //aqui se maneja cualquier excepcion, incluso las devueltas desde la api
        console.log(error)
        //const { data } = response
        
       /* if(data === "no existe este usuario") {
            toast({
                title: '',
                description: "usuario no registrado",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        }
        if(data === "contraseña incorrecta") {
            toast({
                title: '',
                description: "contraseña incorrecta, verifique",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        }*/
        setLoading(false)
    }
}


return (
    <VStack spacing={"5px"}>
        
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                type="email"
                placeholder="email"
                value={email}
                name="email"
                onChange={e => setEmail(e.target.value)}
                className="border"
            />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
                <Input 
                    type={show ? "text" : "password"}
                    placeholder="contraseña"
                    value={password}
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    className="border"
                />
                <InputRightElement>
                    <Button size={"sm"} className="h-[1.75rem] mr-2" onClick={() => setShow(!show)}>
                        {show ? "hide" : "show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

    

        <Button
            colorScheme="blue"
            width={'100%'}
            style={{ marginTop: 15 }}
            onClick={handleSubmit}
            type="submit"
            isLoading={loading}
        >
            Iniciar sesión
        </Button>

        <Button
            variant={'solid'}
            colorScheme="red"
            width={'100%'}
            style={{ marginTop: 15 }}
            onClick={() => {
                setEmail('email')
                setPassword("123")
            }}
            type="submit"
        >
            Entrar como invitado
        </Button>
    </VStack>
  )
}

export default Login