import  MoreHorizIcon  from '@mui/icons-material/MoreHoriz'
import { Avatar, Card, CardHeader, IconButton } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const UserChatCard = ({chat}) => {
  const {auth,message}=useSelector(store=>store)
  const navigate=useNavigate()
  const handleAvatarClick=()=>{
    navigate(`/profile/${chat?.chats[0]?.id}`)
  }
  return (
    <Card>
    <CardHeader avatar={
        <Avatar
        onClick={() => handleAvatarClick(chat?.chats[0]?.id)}
        sx={{width:"3.5rem",
            height:"3.5rem",
            fontSize:"1.5rem",
            bgcolor:"#191c29",
            color:"rgb(88,199,250)",
            cursor:'pointer'
        }} src={(chat?.chats.length<=2)?auth.user?.id===chat?.admin.id?chat.chats[0].profile:chat?.admin?.profile:<Avatar/>}/>
    } action={<IconButton>
        <MoreHorizIcon/>
    </IconButton>}
    title={(chat?.chats.length<=2)?auth.user?.id===chat?.admin.id?chat.chats[0].name:chat?.admin.name:"Group"}
    subheader="Message..."
    >
        
    </CardHeader>
    </Card>
  )
}

export default UserChatCard