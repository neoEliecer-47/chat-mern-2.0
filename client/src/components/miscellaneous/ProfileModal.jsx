import { ViewIcon } from "@chakra-ui/icons"
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"


const ProfileModal = ({ user, children }) => {
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    


    
    
return (
    <>
        {
            children ? <span onClick={onOpen}>{children}</span> : (
                <IconButton 
                    display={{base: "flex"}}
                    icon={ <ViewIcon /> }
                    onClick={onOpen}
                />
            )
        }
        <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'30px'} className=" font-mono flex justify-center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center justify-between">
            <Image 
                boxSize={'200px'}
                className="rounded-full"
                src={user.pic}
                alt={user.name}
            />
            <Text fontSize={{base: '14px', md: '20px' }} className="text-gray-600 mt-2">
                {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal