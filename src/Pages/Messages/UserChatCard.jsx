"use client"

import React, { useMemo } from "react"
import { Avatar, Card, CardHeader, IconButton, Typography, Box, Badge, Chip, useTheme } from "@mui/material"
import {
  MoreHoriz as MoreHorizIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  VolumeOff as MuteIcon,
  PushPin as PinIcon,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const UserChatCard = React.memo(({ chat, unreadCount = 0, isSelected = false, isPinned = false, isMuted = false }) => {
  const { auth } = useSelector((store) => store)
  const navigate = useNavigate()
  const theme = useTheme()
  const chatUser = useMemo(() => {
    if (!chat) return null

    const isGroupChat = chat.chats?.length > 2
    if (isGroupChat) {
      return {
        name: chat.chatName || "Group Chat",
        profile: null,
        isGroup: true,
        memberCount: chat.chats?.length || 0,
      }
    }

    return auth.user?.id === chat.admin?.id
      ? {
          name: chat.chats?.[0]?.name || "Unknown User",
          profile: chat.chats?.[0]?.profile,
          id: chat.chats?.[0]?.id,
          isGroup: false,
        }
      : {
          name: chat.admin?.name || "Unknown User",
          profile: chat.admin?.profile,
          id: chat.admin?.id,
          isGroup: false,
        }
  }, [chat, auth.user?.id])

  const lastMessage = useMemo(() => {
    const messages = chat?.message || []
    if (messages.length === 0) return null

    const lastMsg = messages[messages.length - 1]
    return {
      text: lastMsg.message || (lastMsg.image ? "📷 Photo" : ""),
      timestamp: lastMsg.timestamp,
      isOwn: lastMsg.user?.id === auth.user?.id,
      userName: lastMsg.user?.name,
    }
  }, [chat?.message, auth.user?.id])

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return ""

    const now = new Date()
    const messageDate = new Date(timestamp)
    const diffInHours = (now - messageDate) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60))
      return diffInMinutes < 1 ? "now" : `${diffInMinutes}m`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d`
    }
  }

  const handleAvatarClick = (e) => {
    e.stopPropagation()
    if (!chatUser.isGroup && chatUser.id) {
      navigate(`/profile/${chatUser.id}`)
    }
  }

  if (!chatUser) return null

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ position: "relative" }}
    >
      <Card
        elevation={0}
        sx={{
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background: isSelected
            ? "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: isSelected ? "2px solid rgba(147, 51, 234, 0.3)" : "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: isSelected ? "linear-gradient(90deg, #9333ea, #a855f7, #c084fc)" : "transparent",
            transition: "all 0.3s ease",
          },
          "&:hover": {
            background: "linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)",
            transform: "translateY(-4px)",
            boxShadow: "0 20px 40px rgba(147, 51, 234, 0.15), 0 0 0 1px rgba(147, 51, 234, 0.1)",
            "&::before": {
              background: "linear-gradient(90deg, #9333ea, #a855f7, #c084fc)",
            },
          },
          mb: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(168, 85, 247, 0.05))",
            borderRadius: "50%",
            filter: "blur(15px)",
            opacity: isSelected ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        <CardHeader
          avatar={
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                max={99}
                invisible={unreadCount === 0}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
                    animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.1)" },
                      "100%": { transform: "scale(1)" },
                    },
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    onClick={handleAvatarClick}
                    sx={{
                      width: 60,
                      height: 60,
                      background: chatUser.isGroup
                        ? "linear-gradient(135deg, #9333ea, #a855f7)"
                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "white",
                      cursor: chatUser.isGroup ? "default" : "pointer",
                      border: "3px solid rgba(255, 255, 255, 0.8)",
                      boxShadow: "0 8px 32px rgba(147, 51, 234, 0.3)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      "&:hover": !chatUser.isGroup && {
                        transform: "scale(1.1) rotate(-5deg)",
                        boxShadow: "0 12px 40px rgba(147, 51, 234, 0.4)",
                        border: "3px solid rgba(147, 51, 234, 0.5)",
                      },
                    }}
                    src={chatUser.profile}
                  >
                    {chatUser.isGroup ? <GroupIcon sx={{ fontSize: 30 }} /> : chatUser.name?.[0]?.toUpperCase() || "?"}
                  </Avatar>

                  {!chatUser.isGroup && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          width: 16,
                          height: 16,
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          borderRadius: "50%",
                          border: "3px solid white",
                          boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)",
                          display: Math.random() > 0.5 ? "block" : "none",
                          animation: "onlinePulse 2s infinite",
                          "@keyframes onlinePulse": {
                            "0%": { boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)" },
                            "50%": { boxShadow: "0 0 0 6px rgba(16, 185, 129, 0.1)" },
                            "100%": { boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)" },
                          },
                        }}
                      />
                    </motion.div>
                  )}
                </Box>
              </Badge>
            </motion.div>
          }
          action={
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {isPinned && (
                  <motion.div initial={{ rotate: 0 }} animate={{ rotate: 15 }} transition={{ duration: 0.3 }}>
                    <PinIcon
                      sx={{
                        fontSize: 14,
                        color: "#9333ea",
                        filter: "drop-shadow(0 2px 4px rgba(147, 51, 234, 0.3))",
                      }}
                    />
                  </motion.div>
                )}
                {isMuted && (
                  <MuteIcon
                    sx={{
                      fontSize: 14,
                      color: "#6b7280",
                      opacity: 0.7,
                    }}
                  />
                )}
                <motion.div whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#9333ea",
                      "&:hover": {
                        background: "rgba(147, 51, 234, 0.1)",
                      },
                    }}
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </motion.div>
              </Box>

              {lastMessage && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      color: unreadCount > 0 ? "#9333ea" : "#6b7280",
                      fontWeight: unreadCount > 0 ? 600 : 400,
                      background: unreadCount > 0 ? "linear-gradient(135deg, #9333ea, #a855f7)" : "transparent",
                      WebkitBackgroundClip: unreadCount > 0 ? "text" : "initial",
                      WebkitTextFillColor: unreadCount > 0 ? "transparent" : "inherit",
                    }}
                  >
                    {formatTime(lastMessage.timestamp)}
                  </Typography>
                </motion.div>
              )}
            </Box>
          }
          title={
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: unreadCount > 0 ? 700 : 600,
                    fontSize: "1.1rem",
                    background:
                      unreadCount > 0
                        ? "linear-gradient(135deg, #1f2937, #374151)"
                        : "linear-gradient(135deg, #4b5563, #6b7280)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.01em",
                  }}
                  noWrap
                >
                  {chatUser.name}
                </Typography>

                {chatUser.isGroup && (
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Chip
                      label={`${chatUser.memberCount}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        background: "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(168, 85, 247, 0.05))",
                        color: "#9333ea",
                        border: "1px solid rgba(147, 51, 234, 0.2)",
                        fontWeight: 600,
                      }}
                    />
                  </motion.div>
                )}

                {!chatUser.isGroup && Math.random() > 0.7 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    <CheckCircleIcon
                      sx={{
                        fontSize: 18,
                        color: "#9333ea",
                        filter: "drop-shadow(0 2px 4px rgba(147, 51, 234, 0.3))",
                      }}
                    />
                  </motion.div>
                )}
              </Box>
            </motion.div>
          }
          subheader={
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ mt: 0.5 }}>
                {lastMessage ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: unreadCount > 0 ? 500 : 400,
                      fontSize: "0.9rem",
                      color: unreadCount > 0 ? "#374151" : "#6b7280",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.4,
                    }}
                  >
                    {chatUser.isGroup && !lastMessage.isOwn && (
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#9333ea",
                        }}
                      >
                        {lastMessage.userName}:
                      </span>
                    )}
                    {lastMessage.isOwn && <span style={{ color: "#9333ea", marginRight: 4 }}>✓</span>}
                    {lastMessage.text || "No messages yet"}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                      color: "#9ca3af",
                      opacity: 0.8,
                    }}
                  >
                    Start a conversation
                  </Typography>
                )}
              </Box>
            </motion.div>
          }
          sx={{
            px: 3,
            py: 2,
            "& .MuiCardHeader-content": {
              overflow: "hidden",
              minWidth: 0,
            },
            "& .MuiCardHeader-action": {
              alignSelf: "flex-start",
              mt: 0.5,
            },
          }}
        />
      </Card>
    </motion.div>
  )
})

UserChatCard.displayName = "UserChatCard"

export default UserChatCard
