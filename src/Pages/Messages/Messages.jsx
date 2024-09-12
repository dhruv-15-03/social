import { Avatar, Backdrop, CircularProgress, Grid, IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import WestIcon from "@mui/icons-material/West"
import AddIcCallIcon from "@mui/icons-material/AddIcCall"
import VideoCallIcon from "@mui/icons-material/VideoCall"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import SearchUser2 from "../../Components/SearchUser2/SearchUser2";
import UserChatCard from "./UserChatCard";
import ChatMessage from "./ChatMessage";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getAllChats } from "../../Redux/Messages/Message.action";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import { uploadToCloudinary } from "../../Components/utils/uploadToCloudinary";
import SockJS from "sockjs-client";
import Stom from 'stompjs';
import { useNavigate } from "react-router-dom";

const Messages=()=>{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleNavigate=()=>{
        navigate(-1);
    }
    const{message,auth}=useSelector(store=>store);
    useEffect(()=>{
        dispatch(getAllChats())
    },[])
    const [val,setVal]=React.useState('')
    const [currentChat,setCurrentChat]=React.useState()
    const [messages,setMessages]=React.useState([])
    const [selectedImage,setSelectedImage]=React.useState("")
    const [loading,setLoading]=React.useState(false)
    const chatContainerRef=useRef(null)
    const handleSelectImage=async(e)=>{
        setLoading(true)
        const imageUrl=await uploadToCloudinary(e.target.files[0],"image")
        setSelectedImage(imageUrl);
        setLoading(false);
    }
    const handleCreateMessage=(value)=>{
        const message={
            chatId:currentChat.chatId,
            message:value,
            image:selectedImage
        };
        setVal('')
        dispatch(createMessage({message,sendMessageToServer}))
    }
    const[stompClient,setStompClient]=React.useState(null);
    useEffect(()=>{
        const sock=new SockJS("https://social-app-backend.up.railway.app/ws");
        const stomp=Stom.over(sock);
        setStompClient(stomp);
        stomp.connect({},onConnect,onErr)
    },[])
    const onConnect=()=>{
        console.log("connected web")
    }
    const onErr=(error)=>{
        console.log("Error web...",error)
    }

    useEffect(()=>{
        if(stompClient && auth.user && currentChat){
            const subscription=stompClient.subscribe(`/user/${currentChat.chatId}/private`,(message)=>{
                onMessageReice(message);
            });
            return () => {
                if (subscription) subscription.unsubscribe();
            };
        }
    },[stompClient, auth.user, currentChat])
    const sendMessageToServer=(nmessage)=>{
        if(stompClient&&nmessage){
            stompClient.send(`/app/chat/${currentChat.chatId.toString()}`,{},JSON.stringify(nmessage))
        }
    }
    const onMessageReice=(nmessage)=>{
        const reciveMsg=JSON.parse(nmessage.body)
        console.log("Message receive from webSock",reciveMsg)
        setMessages((messages)=>[...messages,reciveMsg])
    }
    useEffect(()=>{
        if(chatContainerRef.current){
            chatContainerRef.current.scrollTop=chatContainerRef.current.scrollHeight;
        }
    },[messages])
    return(
        <div>
            <Grid container className="h-screen overflow-y-hidden">
                <Grid className="px-5 " item xs={3}>
                    <div className="flex justify-between h-full space-x-2">
                        <div className="w-full">
                        <div className="flex items-center py-5 space-x-4">
                            <WestIcon onClick={()=>handleNavigate()} />
                            <h1 className="text-xl font-bold">
                                Home
                            </h1>
                        </div>
                        <div className="h-[83vh]">
                            <div className="">
                            <SearchUser2/>
                            </div>
                            <div className="h-full mt-5 space-y-4 overflow-y-scroll hideScrollBar">
                                {
                                    message.chats.map((item)=>{
                                        return <div onClick={()=>{
                                            setCurrentChat(item)
                                            setMessages(item.message)
                                        }}>
                                            <UserChatCard chat={item}/>
                                        </div>
                                        
                                    })
                                }
                            </div>
                        </div>
                        </div>
                    </div>
                </Grid>
                <Grid className="h-full " item xs={9}>
                    {currentChat?<div>
                        <div className="flex items-center justify-between p-5 border-l">
                            <div className="flex items-center space-x-3">
                                <Avatar src={auth.user?.profile} />
                                <p>{auth.user?.id===currentChat.admin.id?currentChat.chats[0].name:currentChat.admin.name}</p>
                            </div>
                            <div className="flex space-x-3">
                                <IconButton>
                                    <AddIcCallIcon/>
                                </IconButton>
                                <IconButton>
                                    <VideoCallIcon/>
                                </IconButton>

                            </div>
                        </div>
                        <div ref={chatContainerRef} className="hideScrollBar overflow-y-scroll h-[82vh] px-2 space-y-5 py-5">
                            {messages.map((item)=><ChatMessage messages={item} />)}
                        </div>
                        <div className="sticky bottom-0 border-l">
                        {selectedImage&&<img className="w-[5rem] h-[5rem] object-cover px-2" src={selectedImage} alt="No Image"/>}
                        <div className="flex items-center justify-center py-5 space-x-5">
                            
                            <input className="bg-transparent border border-[#3b40544] rounded-full w-[90%] py-3 px-5" value={val} onChange={(e)=>setVal(e.target.value)} onKeyPress={(e)=>{
                                if(e.key==="Enter"&&val){
                                    handleCreateMessage(val);
                                    setSelectedImage("")
                                }
                            }} placeholder="Type Message..." type="text"/>
                            <div>
                                <input type="file"  accept="image/*" onChange={handleSelectImage} className="hidden" id="image-input"/>
                                <label htmlFor="image-input">
                                    <AddPhotoAlternateIcon/>
                                </label>
                            </div>
                        </div>
                    </div>
                    </div>:<div className="flex flex-col items-center justify-center h-full space-y-5">
                        <ChatBubbleOutlineIcon sx={{fontSize:"15rem"}}/>
                        <p className="text-xl font-semibold">
                            No chat Selected
                        </p>
                        </div>}
                    
                </Grid>
            </Grid>
            <Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
  open={loading}
>
  <CircularProgress color="inherit" />
</Backdrop>
        </div>
    )
}
export default Messages