export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser?._id ? users[1].name : users[0].name;
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}


export const isSameSender = (messages, message, index, userId) => {//esta logica nos hara saber si un mensaje es de un sender en especifico
   return (
    index < messages.length - 1 && (
        messages[index + 1].sender._id !== message.sender._id || 
        messages[index + 1].sender._id === undefined) && messages[index].sender._id !== userId
   )
}

//userId -> usuario loggeado
export const isLastMessage = (messages, index, userId) => {//esto es para renderizar la foto de perfil en el ultimo mensaje

return (
    index === messages.length - 1 && messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id 
)

}//retornan true o false


export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };


  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };