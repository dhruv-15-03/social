import { Avatar, Backdrop, CircularProgress, Grid, IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import WestIcon from "@mui/icons-material/West";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SearchUser2 from "../../Components/SearchUser2/SearchUser2";
import UserChatCard from "./UserChatCard";
import ChatMessage from "./ChatMessage";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getAllChats } from "../../Redux/Messages/Message.action";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { uploadToCloudinary } from "../../Components/utils/uploadToCloudinary";
import SockJS from "sockjs-client";
import Stomp from 'stompjs';
import { useNavigate } from "react-router-dom";

const Messages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message, auth } = useSelector(store => store);
    const [val, setVal] = React.useState('');
    const [currentChat, setCurrentChat] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [selectedImage, setSelectedImage] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const chatContainerRef = useRef(null);
    const [stompClient, setStompClient] = React.useState(null);

    useEffect(() => {
        dispatch(getAllChats());
    }, [dispatch]);

    useEffect(() => {
        const sock = new SockJS("https://social-backend-java-dhr.netlify.app/ws");
        const stomp = Stomp.over(sock);
        setStompClient(stomp);
        stomp.connect({}, onConnect, onErr);
    }, []);

    useEffect(() => {
        if (stompClient && currentChat) {
            const subscription = stompClient.subscribe(`/user/${currentChat.chatId}/private`, (message) => {
                onMessageReceive(message);
            });
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [stompClient, currentChat]);

    const handleNavigate = () => {
        navigate(-1);
    };

    const onConnect = () => {
        console.log("Connected to WebSocket");
    };

    const onErr = (error) => {
        console.error("Error connecting to WebSocket", error);
    };

    const handleSelectImage = async (e) => {
        setLoading(true);
        try {
            const imageUrl = await uploadToCloudinary(e.target.files[0], "image");
            setSelectedImage(imageUrl);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMessage = () => {
        const newMessage = {
            chatId: currentChat.chatId,
            message: val,
            image: selectedImage,
        };
        setVal('');
        setSelectedImage("");
        dispatch(createMessage({ message: newMessage, sendMessageToServer }));
    };

    const sendMessageToServer = (nmessage) => {
        if (stompClient && nmessage) {
            stompClient.send(`/app/chat/${currentChat.chatId}`, {}, JSON.stringify(nmessage));
        }
    };

    const onMessageReceive = (nmessage) => {
        const receivedMsg = JSON.parse(nmessage.body);
        setMessages(prevMessages => [...prevMessages, receivedMsg]);
    };

    useEffect(() => {
        if (currentChat) {
            setMessages(currentChat.message || []); 
        }
    }, [currentChat]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            <Grid container className="h-screen overflow-y-hidden">
                <Grid className="px-5" item xs={3}>
                    <div className="flex justify-between h-full space-x-2">
                        <div className="w-full">
                            <div className="flex items-center py-5 space-x-4">
                                <WestIcon onClick={handleNavigate} />
                                <h1 className="text-xl font-bold">Home</h1>
                            </div>
                            <div className="h-[83vh]">
                                <SearchUser2 />
                                <div className="h-full mt-5 space-y-4 overflow-y-scroll hideScrollBar">
                                    {message.chats.map((item) => (
                                        <div key={item.chatId} onClick={() => setCurrentChat(item)}>
                                            <UserChatCard chat={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className="h-full" item xs={9}>
                    {currentChat ? (
                        <div>
                            <div className="flex items-center justify-between p-5 border-l">
                                <div className="flex items-center space-x-3">
                                    <Avatar src={auth.user?.profile} />
                                    <p>{auth.user?.id === currentChat.admin.id ? currentChat.chats[0].name : currentChat.admin.name}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <IconButton>
                                        <AddIcCallIcon />
                                    </IconButton>
                                    <IconButton>
                                        <VideoCallIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div ref={chatContainerRef} className="hideScrollBar overflow-y-scroll h-[82vh] px-2 space-y-5 py-5">
                                {messages.length > 0 ? (
                                    messages.map((item) => <ChatMessage key={item.id} messages={item} />)
                                ) : (
                                    <p className="text-lg font-semibold text-center">No messages in this chat.....</p>
                                )}
                            </div>
                            <div className="sticky bottom-0 border-l">
                                {selectedImage && <img className="w-[5rem] h-[5rem] object-cover px-2" src={selectedImage} alt="Selected" />}
                                <div className="flex items-center justify-center py-5 space-x-5">
                                    <input
                                        className="bg-transparent border border-[#3b40544] rounded-full w-[90%] py-3 px-5"
                                        value={val}
                                        onChange={(e) => setVal(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter" && val) handleCreateMessage();
                                        }}
                                        placeholder="Type Message..."
                                        type="text"
                                    />
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleSelectImage}
                                            className="hidden"
                                            id="image-input"
                                        />
                                        <label htmlFor="image-input">
                                            <AddPhotoAlternateIcon />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full space-y-5">
                            <ChatBubbleOutlineIcon sx={{ fontSize: "15rem" }} />
                            <p className="text-xl font-semibold">No chat Selected</p>
                        </div>
                    )}
                </Grid>
            </Grid>
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default Messages;

