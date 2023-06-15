import ScrollableFeed  from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/chatLogic'
import { useUserContext } from '../../context/userContext'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {
  
const { user } = useUserContext()  
  
 return (
    <ScrollableFeed>
        {messages && messages.map((message, index) => (
            <div key={message._id} style={{display: 'flex'}}>
                {
                    (isSameSender(messages, message, index, user._id) || isLastMessage(messages, index, user._id)) && (/*si alguno de estos retorna true */
                        <Tooltip
                           placement='bottom-start'
                           label={message.sender?.name}
                           hasArrow 
                        >
                            <Avatar 
                                name={message.sender?.name}
                                src={message.sender.pic}
                                size='sm'
                                className='mt-[7px] mr-1 cursor-pointer'
                            />
                        </Tooltip>
                    )
                }

                <span 
                    className={`max-w-[75%] rounded-xl py-2 px-4 m-[2px]  ${message.sender._id === user._id ? "bg-[#BEE3F8]" : "bg-[#B9F5D0]"}`}
                    style={{marginLeft: isSameSenderMargin(messages, message, index, user._id), marginTop: isSameUser(messages, message, index, user._id) ? "3" : "10"}}    
                >
                    {message.content}
                </span>
                
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat