"use client"

import React, { useState, useMemo } from "react"
import { Box, Typography, Avatar, Paper, IconButton, Tooltip, useTheme, Skeleton, Chip } from "@mui/material"
import {
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Download as DownloadIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"

const ChatMessage = React.memo(({ messages }) => {
  const { auth } = useSelector((store) => store)
  const theme = useTheme()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [isLiked, setIsLiked] = useState(messages.isLiked || false)
  const [likeCount, setLikeCount] = useState(messages.likeCount || 0)

  const isReqUserMessage = auth.user?.id === messages.user?.id

  const messageColors = {
    sent: {
  primary: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  secondary: "#3b82f6",
  text: "#ffffff",
    },
    received: {
  primary: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
  secondary: "#f59e0b",
  text: "#ffffff",
    },
  }

  const formatTime = useMemo(() => {
    if (!messages.timestamp) return ""

    const date = new Date(messages.timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }, [messages.timestamp])

  const getStatusIcon = () => {
    if (!isReqUserMessage) return null

    const isDelivered = true
    const isRead = Math.random() > 0.5

    if (isRead) {
      return <DoneAllIcon sx={{ fontSize: 14, color: "#4ade80" }} />
    } else if (isDelivered) {
      return <DoneAllIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
    } else {
      return <DoneIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: { opacity: 0, y: -10, scale: 0.9 },
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isReqUserMessage ? "flex-end" : "flex-start",
          mb: 2,
          position: "relative",
          px: 1,
        }}
      >
        {/* Avatar for received messages */}
        {!isReqUserMessage && (
          <Avatar
            src={messages.user?.profile}
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              mt: "auto",
              background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
              border: "3px solid #ffffff",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.18)",
            }}
          >
            {messages.user?.name?.[0]?.toUpperCase()}
          </Avatar>
        )}

        {/* Message content */}
        <Box
          sx={{
            maxWidth: "75%",
            display: "flex",
            flexDirection: "column",
            alignItems: isReqUserMessage ? "flex-end" : "flex-start",
          }}
        >
          {/* User name for received messages */}
          {!isReqUserMessage && (
            <Typography
              variant="caption"
              sx={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                mb: 1,
                ml: 1,
                fontSize: "0.8rem",
              }}
            >
              {messages.user?.name}
            </Typography>
          )}

          {/* Message bubble */}
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              background: isReqUserMessage ? messageColors.sent.primary : messageColors.received.primary,
              color: isReqUserMessage ? messageColors.sent.text : messageColors.received.text,
              borderRadius: "20px",
              overflow: "hidden",
              maxWidth: "100%",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: isReqUserMessage
                ? "0 8px 32px rgba(102, 126, 234, 0.3)"
                : "0 8px 32px rgba(240, 147, 251, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: showActions ? "scale(1.02) translateY(-2px)" : "scale(1)",
              "&::before": !messages.image && {
                content: '""',
                position: "absolute",
                bottom: -8,
                [isReqUserMessage ? "right" : "left"]: 20,
                width: 0,
                height: 0,
                borderLeft: isReqUserMessage ? "12px solid transparent" : "none",
                borderRight: !isReqUserMessage ? "12px solid transparent" : "none",
                borderTop: `12px solid ${isReqUserMessage ? messageColors.sent.secondary : messageColors.received.secondary}`,
              },
            }}
          >
            {/* Image content */}
            {messages.image && (
              <Box sx={{ position: "relative" }}>
                {!imageLoaded && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    animation="wave"
                    sx={{ borderRadius: "16px" }}
                  />
                )}
                <img
                  src={messages.image || "/placeholder.svg"}
                  alt="Message attachment"
                  onLoad={handleImageLoad}
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    height: "auto",
                    maxHeight: 400,
                    objectFit: "cover",
                    borderRadius: "16px",
                    display: imageLoaded ? "block" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open(messages.image, "_blank")
                  }}
                />

                <AnimatePresence>
                  {showActions && imageLoaded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.8)",
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            )}

            {/* Text content */}
            {messages.message && (
              <Box
                sx={{
                  p: messages.image ? 3 : "16px 20px",
                  pt: messages.image ? 2 : "16px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.5,
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {messages.message}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: messages.image ? 3 : 3,
                pb: messages.image ? 2 : 2,
                pt: messages.message ? 1 : messages.image ? 2 : 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {(isLiked || likeCount > 0) && (
                  <Chip
                    icon={<FavoriteIcon sx={{ fontSize: 14, color: "#ff6b6b" }} />}
                    label={likeCount}
                    size="small"
                    sx={{
                      height: 20,
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontSize: "0.7rem",
                      "& .MuiChip-icon": { ml: 0.5 },
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.8 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {formatTime}
                </Typography>
                {getStatusIcon()}
              </Box>
            </Box>
          </Paper>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.2, type: "spring" }}
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Tooltip title="Reply" arrow>
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#6366f1",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 1)",
                        transform: "scale(1.1) translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)",
                      },
                    }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={isLiked ? "Unlike" : "Like"} arrow>
                  <IconButton
                    size="small"
                    onClick={handleLike}
                    sx={{
                      bgcolor: isLiked ? "rgba(255, 107, 107, 0.1)" : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: isLiked ? "#ff6b6b" : "#6b7280",
                      "&:hover": {
                        bgcolor: "rgba(255, 107, 107, 0.2)",
                        color: "#ff6b6b",
                        transform: "scale(1.1) translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(255, 107, 107, 0.3)",
                      },
                    }}
                  >
                    {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="More" arrow>
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#6b7280",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 1)",
                        transform: "scale(1.1) translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(107, 114, 128, 0.3)",
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Avatar for sent messages */}
        {isReqUserMessage && (
          <Avatar
            src={messages.user?.profile}
            sx={{
              width: 40,
              height: 40,
              ml: 2,
              mt: "auto",
              // match sent (blue) tone
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              border: "3px solid #ffffff",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
            }}
          >
            {messages.user?.name?.[0]?.toUpperCase()}
          </Avatar>
        )}
      </Box>
    </motion.div>
  )
})

ChatMessage.displayName = "ChatMessage"

export default ChatMessage
