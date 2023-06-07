import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { VStack } from "@chakra-ui/layout"
import { Button, Input, InputGroup, InputRightElement, useToast } from "@chakra-ui/react"
import { useState } from "react"
import axios from 'axios'
import { useUserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"



const Register = () => {
const { setUser } = useUserContext() 
    
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [pic, setPic] = useState(null)
const [show, setShow] = useState(false)
const [showC, setShowC] = useState(false)
const [loading, setLoading] = useState(false)

const toast = useToast()
const navigate = useNavigate()



const handleShow = () => {
    setShow(!show)
}


const handleProfilePhoto = (file) => {
    setLoading(true)
   // console.log(file)
    
        const data = new FormData()
        data.append("photo", file)

        axios.post("/photos", data, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
        })
            .then(({data: filename}) => {
                setPic(filename)
               /* toast({
                    title: '',
                    description: "foto guardada correctamente.",
                    status: 'info',
                    duration: 2000,
                    isClosable: true,
                  })*/
                  setLoading(false)
                })
                .catch(err => console.log(err.message))
        
        
          
    
    

}



const handleSubmit = async() => {
    setLoading(true)
    try {
        if(!name || !email || !password || !confirmPassword){
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

        if(password !== confirmPassword){
            toast({
                title: '',
                description: "las contraseñas no coinciden",
                status: 'warning',
                duration: 2000,
                isClosable: true,
              })
              setLoading(false)
              return;
        }

        const {data} = await axios.post("/users", {
            name,
            email,
            password,
            pic
        })
       // console.log(res)
        setLoading(false)
        toast({
            title: '',
            description: "registro exitoso",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          localStorage.setItem("token", JSON.stringify(data.token))
          setName('')
          setPassword('')
          setEmail('')
          setPic(null)
          setUser(data)
          navigate("/chat")
    } catch ({ response }) {
        //aqui se maneja cualquier excepcion, incluso las devueltas desde la api
        const { data } = response
        
        if(data === "user already exists") {
            toast({
                title: '',
                description: "correo ya registrado, registre otro o verifique",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        }
        setLoading(false)
    }
}

return (
    <VStack spacing={"5px"}>
        <FormControl id="name" isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input 
                placeholder="nombre"
                onChange={e => setName(e.target.value)}
                className="border"
            />
        </FormControl>

        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                type="email"
                placeholder="email"
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
                    onChange={e => setPassword(e.target.value)}
                    className="border"
                />
                <InputRightElement>
                    <Button size={"sm"} className="h-[1.75rem] mr-2" onClick={handleShow}>
                        {show ? "hide" : "show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Confirmar contraseña</FormLabel>
            <InputGroup>
                <Input 
                    type={showC ? "text" : "password"}
                    placeholder="confirmar contraseña"
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="border"
                />
                <InputRightElement>
                    <Button size={"sm"} className="h-[1.75rem] mr-2" onClick={() => setShowC(!showC)}>
                        {showC ? "hide" : "show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="pic">
            <FormLabel>Ingresa una foto de perfil (opcional)</FormLabel>
            <Input 
                type="file"
                placeholder="foto"
                accept="image/*"
                onChange={e => handleProfilePhoto(e.target.files[0])}
                
            />
        </FormControl>

        <Button
            colorScheme="blue"
            width={'100%'}
            style={{ marginTop: 15 }}
            onClick={handleSubmit}
            type="submit"
            isLoading={loading}
        >
            Registrarse
        </Button>
    </VStack>
  )
}

export default Register