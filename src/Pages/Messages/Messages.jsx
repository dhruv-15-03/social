"use client"

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"
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
  Button,
  Badge,
  Chip,
} from "@mui/material"
import {
  West as WestIcon,
  AddIcCall as AddIcCallIcon,
  VideoCall as VideoCallIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Send as SendIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

// Components
import SearchUser2 from "../../Components/SearchUser2/SearchUser2"
import UserChatCard from "./UserChatCard"
import ChatMessage from "./ChatMessage"
import { createMessage, getAllChats } from "../../Redux/Messages/Message.action"
import { uploadToCloudinary } from "../../Components/utils/uploadToCloudinary"

const Messages = React.memo(() => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { message, auth } = useSelector((store) => store)

  // State management
  const [val, setVal] = useState("")
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [selectedImage, setSelectedImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showChatList, setShowChatList] = useState(!isMobile || !currentChat)
  const [connectionStatus, setConnectionStatus] = useState("connected")
  const [unreadMessages, setUnreadMessages] = useState({})
  const [isTyping, setIsTyping] = useState(false)

  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Memoized values
  const sortedChats = useMemo(() => {
    return [...(message.chats || [])].sort((a, b) => {
      const aLastMessage = a.message?.[a.message.length - 1]
      const bLastMessage = b.message?.[b.message.length - 1]
      const aTime = aLastMessage?.timestamp || 0
      const bTime = bLastMessage?.timestamp || 0
      return bTime - aTime
    })
  }, [message.chats])

  const currentChatUser = useMemo(() => {
    if (!currentChat) return null
    return auth.user?.id === currentChat.admin.id ? currentChat.chats[0] : currentChat.admin
  }, [currentChat, auth.user?.id])

  // WebSocket connection management (simplified for now)
  useEffect(() => {
    // TODO: Implement WebSocket connection
    setConnectionStatus("connected")
  }, [])

  useEffect(() => {
    if (currentChat) {
    }
  }, [currentChat])

  // Load initial data - only if not already loaded
  useEffect(() => {
    if (!message.chats?.length) {
      dispatch(getAllChats())
    }
  }, [dispatch, message.chats?.length])

  useEffect(() => {
    if (currentChat) {
      const updatedChat = message.chats.find((chat) => chat.chatId === currentChat.chatId)

      if (updatedChat) {
        setMessages(updatedChat.message || [])
        setCurrentChat(updatedChat) // Update current chat with latest data
      } else {
        setMessages(currentChat.message || [])
      }
      // Clear unread count for current chat
      setUnreadMessages((prev) => ({ ...prev, [currentChat.chatId]: 0 }))
    }
  }, [currentChat, message.chats])

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1

      if (isScrolledToBottom) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight
        }, 100)
      }
    }
  }, [messages])

  // Mobile responsiveness - show/hide chat list
  useEffect(() => {
    if (!isMobile) {
      setShowChatList(true)
    } else {
      setShowChatList(!currentChat)
    }
  }, [isMobile, currentChat])

  // Handlers
  const handleNavigate = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSelectImage = useCallback(async (e) => {
    setLoading(true)
    try {
      const imageUrl = await uploadToCloudinary(e.target.files[0], "image")
      setSelectedImage(imageUrl)
    } catch (error) {
      // Handle upload error gracefully
      setSelectedImage("")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreateMessage = useCallback(async () => {
    if (!val.trim() && !selectedImage) return

    const newMessage = {
      chatId: currentChat.chatId,
      message: val.trim(),
      image: selectedImage,
    }

    setVal("")
    setSelectedImage("")

    // Dispatch the message creation
    try {
      const result = await dispatch(createMessage({ message: newMessage }))
    } catch (error) {
      console.error("❌ Error sending message:", error)
    }

    // Auto-scroll to bottom after sending
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, 100)
  }, [val, selectedImage, currentChat?.chatId, dispatch, message])

  const handleChatSelect = useCallback(
    (chat) => {
      setCurrentChat(chat)
      if (isMobile) {
        setShowChatList(false)
      }
    },
    [isMobile],
  )

  const handleBackToChats = useCallback(() => {
    if (isMobile) {
      setCurrentChat(null)
      setShowChatList(true)
    }
  }, [isMobile])

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && (val.trim() || selectedImage)) {
        e.preventDefault()
        handleCreateMessage()
      }
    },
    [val, selectedImage, handleCreateMessage],
  )

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
                    `,
            zIndex: 0,
          }}
        />

        <Grid container sx={{ height: "100%", position: "relative", zIndex: 1 }}>
          {/* Chat List Sidebar */}
          {(!isMobile || showChatList) && (
            <Grid item xs={12} md={4} lg={3}>
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 0,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      p: 3,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton
                          onClick={handleNavigate}
                          sx={{
                            mr: 2,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <WestIcon />
                        </IconButton>
                      </motion.div>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        Messages
                      </Typography>
                    </Box>
                    <SearchUser2 />
                  </Box>

                  {/* Chat List */}
                  <Box
                    sx={{
                      flex: 1,
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "transparent",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    <AnimatePresence>
                      {sortedChats.map((chat, index) => (
                        <motion.div
                          key={chat.chatId}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{
                            delay: index * 0.1,
                            duration: 0.4,
                            ease: "easeOut",
                          }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                          onClick={() => handleChatSelect(chat)}
                          style={{
                            cursor: "pointer",
                            margin: "8px 12px",
                            borderRadius: "16px",
                            overflow: "hidden",
                          }}
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
              </motion.div>
            </Grid>
          )}

          {/* Chat Area */}
          {(!isMobile || currentChat) && (
            <Grid item xs={12} md={showChatList ? 8 : 12} lg={showChatList ? 9 : 12}>
              {currentChat ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ height: "100vh" }}
                >
                  <Box
                    sx={{
                      height: "100vh",
                      display: "flex",
                      flexDirection: "column",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(20px)",
                      borderRadius: { md: "24px 0 0 0" },
                      overflow: "hidden",
                    }}
                  >
                    {/* Chat Header */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                        {isMobile && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                              onClick={handleBackToChats}
                              sx={{
                                mr: 2,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                },
                              }}
                            >
                              <ArrowBackIcon />
                            </IconButton>
                          </motion.div>
                        )}

                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  background:
                                    connectionStatus === "connected"
                                      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                                      : "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)",
                                  border: "2px solid white",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                }}
                              />
                            }
                          >
                            <Avatar
                              src={currentChatUser?.profile}
                              sx={{
                                mr: 2,
                                width: 48,
                                height: 48,
                                border: "3px solid rgba(255,255,255,0.8)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            >
                              {currentChatUser?.name?.[0]}
                            </Avatar>
                          </Badge>
                        </motion.div>

                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#2c3e50",
                              letterSpacing: "-0.3px",
                            }}
                          >
                            {currentChatUser?.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={connectionStatus === "connected" ? "Online" : "Connecting..."}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "11px",
                                fontWeight: 500,
                                background:
                                  connectionStatus === "connected"
                                    ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                                    : "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)",
                                color: "white",
                                border: "none",
                              }}
                            />
                            {isTyping && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#667eea",
                                    fontStyle: "italic",
                                    fontWeight: 500,
                                  }}
                                >
                                  typing...
                                </Typography>
                              </motion.div>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        {[AddIcCallIcon, VideoCallIcon, MoreVertIcon].map((Icon, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                              sx={{
                                background:
                                  "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                                color: "#667eea",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  color: "white",
                                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                                },
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Icon />
                            </IconButton>
                          </motion.div>
                        ))}
                      </Box>
                    </Paper>

                    {/* Messages Area */}
                    <Box
                      ref={chatContainerRef}
                      sx={{
                        flex: 1,
                        overflow: "auto",
                        p: 3,
                        background: `
                                                    linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%),
                                                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23667eea' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                                                `,
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "10px",
                        },
                      }}
                    >
                      <AnimatePresence initial={false}>
                        {messages.length > 0 ? (
                          messages.map((msg, index) => (
                            <motion.div
                              key={msg.id || index}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -20, scale: 0.95 }}
                              transition={{
                                duration: 0.4,
                                ease: "easeOut",
                                delay: index * 0.05,
                              }}
                              style={{ marginBottom: 16 }}
                            >
                              <ChatMessage messages={msg} chatId={currentChat?.chatId} />
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                textAlign: "center",
                                py: 8,
                              }}
                            >
                              <motion.div
                                animate={{
                                  rotate: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatDelay: 3,
                                }}
                              >
                                <ChatBubbleOutlineIcon
                                  sx={{
                                    fontSize: 120,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 3,
                                    filter: "drop-shadow(0 4px 20px rgba(102, 126, 234, 0.2))",
                                  }}
                                />
                              </motion.div>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  mb: 1,
                                }}
                              >
                                Start a conversation
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "rgba(44, 62, 80, 0.7)",
                                  fontWeight: 400,
                                }}
                              >
                                Send your first message to {currentChatUser?.name}
                              </Typography>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>

                    {/* Message Input */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                        borderTop: "1px solid rgba(0,0,0,0.05)",
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      {selectedImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Box sx={{ mb: 2, position: "relative", display: "inline-block" }}>
                            <img
                              src={selectedImage || "/placeholder.svg"}
                              alt="Selected"
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 16,
                                border: "3px solid rgba(255,255,255,0.8)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                              }}
                            />
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                size="small"
                                onClick={() => setSelectedImage("")}
                                sx={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                                  color: "white",
                                  width: 28,
                                  height: 28,
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                                    boxShadow: "0 4px 20px rgba(231, 76, 60, 0.4)",
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                ×
                              </IconButton>
                            </motion.div>
                          </Box>
                        </motion.div>
                      )}

                      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                        <Box sx={{ flex: 1, position: "relative" }}>
                          <Box
                            component="input"
                            ref={inputRef}
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            style={{
                              width: "100%",
                              border: "none",
                              borderRadius: "24px",
                              padding: "16px 24px",
                              fontSize: "15px",
                              fontFamily: "inherit",
                              outline: "none",
                              background: "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(10px)",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              border: "2px solid transparent",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.2)"
                              e.target.style.borderColor = "rgba(102, 126, 234, 0.3)"
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
                              e.target.style.borderColor = "transparent"
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelectImage}
                            style={{ display: "none" }}
                            id="image-input"
                          />
                          <label htmlFor="image-input">
                            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                component="span"
                                sx={{
                                  background:
                                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                                  color: "#667eea",
                                  width: 48,
                                  height: 48,
                                  "&:hover": {
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <AddPhotoAlternateIcon />
                              </IconButton>
                            </motion.div>
                          </label>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={val.trim() || selectedImage ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Fab
                              size="medium"
                              onClick={handleCreateMessage}
                              disabled={!val.trim() && !selectedImage}
                              sx={{
                                width: 52,
                                height: 52,
                                background:
                                  val.trim() || selectedImage
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    : "linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)",
                                color: "white",
                                boxShadow:
                                  val.trim() || selectedImage
                                    ? "0 8px 32px rgba(102, 126, 234, 0.4)"
                                    : "0 4px 16px rgba(0,0,0,0.1)",
                                "&:hover": {
                                  background:
                                    val.trim() || selectedImage
                                      ? "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                                      : "linear-gradient(135deg, #95a5a6 0%, #bdc3c7 100%)",
                                  transform: "translateY(-2px)",
                                  boxShadow:
                                    val.trim() || selectedImage
                                      ? "0 12px 40px rgba(102, 126, 234, 0.5)"
                                      : "0 6px 20px rgba(0,0,0,0.15)",
                                },
                                transition: "all 0.3s ease",
                                "&:disabled": {
                                  background: "linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)",
                                  color: "#95a5a6",
                                },
                              }}
                            >
                              <SendIcon sx={{ fontSize: 22 }} />
                            </Fab>
                          </motion.div>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box
                    sx={{
                      height: "100vh",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(20px)",
                      borderRadius: { md: "24px 0 0 0" },
                      p: 4,
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                    >
                      <ChatBubbleOutlineIcon
                        sx={{
                          fontSize: 160,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 4,
                          filter: "drop-shadow(0 8px 32px rgba(102, 126, 234, 0.3))",
                        }}
                      />
                    </motion.div>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2,
                        letterSpacing: "-1px",
                      }}
                    >
                      Your Messages
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(44, 62, 80, 0.7)",
                        fontWeight: 400,
                        mb: 4,
                        maxWidth: 400,
                      }}
                    >
                      Send private messages to friends and colleagues
                    </Typography>
                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setShowChatList(true)}
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          px: 4,
                          py: 1.5,
                          borderRadius: "50px",
                          fontSize: "16px",
                          fontWeight: 600,
                          textTransform: "none",
                          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            boxShadow: "0 12px 40px rgba(102, 126, 234, 0.5)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Start Messaging
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              )}
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
          background: "rgba(102, 126, 234, 0.8)",
          backdropFilter: "blur(10px)",
        }}
        open={loading}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <CircularProgress color="inherit" size={60} thickness={4} />
        </motion.div>
      </Backdrop>
    </>
  )
})

Messages.displayName = "Messages"

export default Messages
