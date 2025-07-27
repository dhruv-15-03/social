import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
    Avatar,
    Backdrop,
    CircularProgress,
    Grid,
    IconButton,
    Box,
    Typography,
    Paper,
    useMediaQuery,
    useTheme,
    Fab,
    Button
} from "@mui/material";
import {
    West as WestIcon,
    AddIcCall as AddIcCallIcon,
    VideoCall as VideoCallIcon,
    AddPhotoAlternate as AddPhotoAlternateIcon,
    Send as SendIcon,
    ChatBubbleOutline as ChatBubbleOutlineIcon,
    ArrowBack as ArrowBackIcon,
    MoreVert as MoreVertIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Components
import SearchUser2 from "../../Components/SearchUser2/SearchUser2";
import UserChatCard from "./UserChatCard";
import ChatMessage from "./ChatMessage";
import { createMessage, getAllChats } from "../../Redux/Messages/Message.action";
import { uploadToCloudinary } from "../../Components/utils/uploadToCloudinary";

const Messages = React.memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { message, auth } = useSelector(store => store);

    // State management
    const [val, setVal] = useState('');
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showChatList, setShowChatList] = useState(!isMobile || !currentChat);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const [unreadMessages, setUnreadMessages] = useState({});

    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Memoized values
    const sortedChats = useMemo(() => {
        return [...(message.chats || [])].sort((a, b) => {
            const aLastMessage = a.message?.[a.message.length - 1];
            const bLastMessage = b.message?.[b.message.length - 1];
            const aTime = aLastMessage?.timestamp || 0;
            const bTime = bLastMessage?.timestamp || 0;
            return bTime - aTime;
        });
    }, [message.chats]);

    const currentChatUser = useMemo(() => {
        if (!currentChat) return null;
        return auth.user?.id === currentChat.admin.id 
            ? currentChat.chats[0] 
            : currentChat.admin;
    }, [currentChat, auth.user?.id]);

    // WebSocket connection management (simplified for now)
    useEffect(() => {
        // TODO: Implement WebSocket connection
        setConnectionStatus('connected');
    }, []);

    // Chat subscription management
    useEffect(() => {
        if (currentChat) {
            // TODO: Subscribe to chat messages
        }
    }, [currentChat]);

    // Load initial data
    useEffect(() => {
        dispatch(getAllChats());
    }, [dispatch]);

    // Update messages when chat changes
    useEffect(() => {
        if (currentChat) {
            setMessages(currentChat.message || []);
            // Clear unread count for current chat
            setUnreadMessages(prev => ({ ...prev, [currentChat.chatId]: 0 }));
        }
    }, [currentChat]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
            
            if (isScrolledToBottom) {
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight;
                }, 100);
            }
        }
    }, [messages]);

    // Mobile responsiveness - show/hide chat list
    useEffect(() => {
        if (!isMobile) {
            setShowChatList(true);
        } else {
            setShowChatList(!currentChat);
        }
    }, [isMobile, currentChat]);

    // Handlers
    const handleNavigate = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleSelectImage = useCallback(async (e) => {
        setLoading(true);
        try {
            const imageUrl = await uploadToCloudinary(e.target.files[0], "image");
            setSelectedImage(imageUrl);
        } catch (error) {
            // Handle upload error gracefully
            setSelectedImage("");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreateMessage = useCallback(() => {
        if (!val.trim() && !selectedImage) return;

        const newMessage = {
            chatId: currentChat.chatId,
            message: val.trim(),
            image: selectedImage,
        };
        
        setVal('');
        setSelectedImage("");
        dispatch(createMessage({ message: newMessage }));
    }, [val, selectedImage, currentChat?.chatId, dispatch]);

    // WebSocket message receiver - currently unused but ready for implementation
    // const onMessageReceive = useCallback((nmessage) => {
    //     // TODO: Implement WebSocket message receiving
    //     // Handle incoming messages from WebSocket connection
    // }, []);

    const handleChatSelect = useCallback((chat) => {
        setCurrentChat(chat);
        if (isMobile) {
            setShowChatList(false);
        }
    }, [isMobile]);

    const handleBackToChats = useCallback(() => {
        if (isMobile) {
            setCurrentChat(null);
            setShowChatList(true);
        }
    }, [isMobile]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey && (val.trim() || selectedImage)) {
            e.preventDefault();
            handleCreateMessage();
        }
    }, [val, selectedImage, handleCreateMessage]);

    return (
        <>
            <Box sx={{ height: '100vh', overflow: 'hidden' }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Desktop: Always show sidebar, Mobile: Conditional */}
                    {(!isMobile || showChatList) && !currentChat && (
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                elevation={1}
                                sx={{
                                    height: '100vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 0,
                                    borderRight: 1,
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <IconButton onClick={handleNavigate} sx={{ mr: 1 }}>
                                            <WestIcon />
                                        </IconButton>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Messages
                                        </Typography>
                                    </Box>
                                    <SearchUser2 />
                                </Box>
                                
                                <Box sx={{ flex: 1, overflow: 'auto' }}>
                                    <AnimatePresence>
                                        {sortedChats.map((chat, index) => (
                                            <motion.div
                                                key={chat.chatId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => handleChatSelect(chat)}
                                            >
                                                <UserChatCard 
                                                    chat={chat} 
                                                    unreadCount={unreadMessages[chat.chatId] || 0}
                                                    isSelected={currentChat?.chatId === chat.chatId}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                    
                    {/* Chat area - full width on mobile when chat is selected */}
                    {(!isMobile || currentChat) && (
                        <Grid item xs={12} md={8} lg={9}>
                            {currentChat ? (
                                <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                                    {/* Chat header */}
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {isMobile && (
                                                <IconButton onClick={handleBackToChats} sx={{ mr: 1 }}>
                                                    <ArrowBackIcon />
                                                </IconButton>
                                            )}
                                            <Avatar
                                                src={currentChatUser?.profile}
                                                sx={{ mr: 2, width: 40, height: 40 }}
                                            >
                                                {currentChatUser?.name?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {currentChatUser?.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {connectionStatus === 'connected' ? 'Online' : 'Connecting...'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex' }}>
                                            <IconButton>
                                                <AddIcCallIcon />
                                            </IconButton>
                                            <IconButton>
                                                <VideoCallIcon />
                                            </IconButton>
                                            <IconButton>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                    </Paper>

                                    {/* Messages area */}
                                    <Box
                                        ref={chatContainerRef}
                                        sx={{
                                            flex: 1,
                                            overflow: 'auto',
                                            p: 2,
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        <AnimatePresence initial={false}>
                                            {messages.length > 0 ? (
                                                messages.map((msg, index) => (
                                                    <motion.div
                                                        key={msg.id || index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.3 }}
                                                        style={{ marginBottom: 16 }}
                                                    >
                                                        <ChatMessage 
                                                            messages={msg} 
                                                        />
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '100%',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <ChatBubbleOutlineIcon 
                                                        sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} 
                                                    />
                                                    <Typography variant="h6" color="text.secondary">
                                                        Start a conversation
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Send your first message to {currentChatUser?.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </AnimatePresence>
                                    </Box>

                                    {/* Message input */}
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderTop: 1,
                                            borderColor: 'divider'
                                        }}
                                    >
                                        {selectedImage && (
                                            <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        objectFit: 'cover',
                                                        borderRadius: 8
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setSelectedImage("")}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        bgcolor: 'error.main',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'error.dark' }
                                                    }}
                                                >
                                                    ×
                                                </IconButton>
                                            </Box>
                                        )}
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Box
                                                    component="input"
                                                    ref={inputRef}
                                                    value={val}
                                                    onChange={(e) => setVal(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Type a message..."
                                                    style={{
                                                        width: '100%',
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '20px',
                                                        padding: '12px 16px',
                                                        fontSize: '14px',
                                                        fontFamily: 'inherit',
                                                        outline: 'none',
                                                        backgroundColor: 'transparent'
                                                    }}
                                                />
                                            </Box>
                                            
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleSelectImage}
                                                style={{ display: 'none' }}
                                                id="image-input"
                                            />
                                            <label htmlFor="image-input">
                                                <IconButton component="span" color="primary">
                                                    <AddPhotoAlternateIcon />
                                                </IconButton>
                                            </label>
                                            
                                            <Fab
                                                size="small"
                                                color="primary"
                                                onClick={handleCreateMessage}
                                                disabled={!val.trim() && !selectedImage}
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    boxShadow: 2
                                                }}
                                            >
                                                <SendIcon sx={{ fontSize: 20 }} />
                                            </Fab>
                                        </Box>
                                    </Paper>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        height: '100vh',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        bgcolor: 'grey.50'
                                    }}
                                >
                                    <ChatBubbleOutlineIcon sx={{ fontSize: 120, color: 'grey.300', mb: 3 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                        Your Messages
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Send private messages to friends and colleagues
                                    </Typography>
                                    <Button variant="contained" onClick={() => setShowChatList(true)}>
                                        Start Messaging
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Loading backdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
});

Messages.displayName = 'Messages';

export default Messages;

