import { CloseIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"


const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <Box className="px-2 py-1 rounded-lg m-1 mb-2 border-solid cursor-pointer bg-purple-500 text-white" fontSize="12px" onClick={handleFunction}>
        {user.name}
        <CloseIcon className="pl-2"/>
    </Box>
  )
}

export default UserBadgeItem