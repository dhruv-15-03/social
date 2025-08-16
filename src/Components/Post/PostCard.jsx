"use client"

import { Button, CardActions, CardContent, Divider, IconButton, Menu, MenuItem, Typography, Box } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { Avatar } from "@mui/material"
import { Card } from "@mui/material"
import { CardHeader } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import ShareIcon from "@mui/icons-material/Share"
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { useDispatch, useSelector } from "react-redux"
import { createCommentAction, deletePostAction, likePostAction, savePostAction } from "../../Redux/Post/post.action"
import { isLikedBy } from "../utils/isLiked"
import { isSavedBy } from "../utils/isSaved"
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout"
import TextDisplay from "./TextDisplay"
import LazyImage from "../UI/LazyImage"

const PostCard = React.memo(({ item }) => {
  const { auth } = useSelector((store) => store)
  const dispatch = useDispatch()
  const { isMobile } = useResponsiveLayout()

  // Memoized initial states to avoid expensive calculations on every render
  const initialIsLiked = useMemo(() => isLikedBy(auth.user?.id, item), [auth.user?.id, item])
  const initialIsSaved = useMemo(() => isSavedBy(auth.user?.id, item), [auth.user?.id, item])

  const [isLiked, setIsLiked] = React.useState(initialIsLiked)
  const [isSaved, setIsSaved] = React.useState(initialIsSaved)
  const [showComments, setShowComments] = React.useState(false)
  const [val, setVal] = React.useState("")
  const [anchorEl, setAnchorEl] = React.useState(null)
  
  // Add loading states to prevent spam
  const [isLiking, setIsLiking] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const open = Boolean(anchorEl)

  // Optimized like handler with debouncing and request deduplication
  const handleLikePost = useCallback(async () => {
    if (isLiking) return // Prevent spam clicks
    
    setIsLiking(true)
    setIsLiked((prevLiked) => !prevLiked) // Optimistic update
    
    try {
      await dispatch(likePostAction(item.postID))
    } catch (error) {
      setIsLiked((prevLiked) => !prevLiked)
    } finally {
      setIsLiking(false)
    }
  }, [dispatch, item.postID, isLiking])

  const handleSavePost = useCallback(async () => {
    if (isSaving) return // Prevent spam clicks
    
    setIsSaving(true)
    setIsSaved((prevSaved) => !prevSaved) // Optimistic update
    
    try {
      await dispatch(savePostAction(item.postID))
    } catch (error) {
      // Revert optimistic update on error
      setIsSaved((prevSaved) => !prevSaved)
    } finally {
      setIsSaving(false)
    }
  }, [dispatch, item.postID, isSaving])

  const handleCreateComment = useCallback(
    (comment) => {
      const reqData = {
        postId: item.postID,
        data: {
          comment,
        },
      }
      setVal("")
      dispatch(createCommentAction(reqData))
    },
    [dispatch, item.postID],
  )

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleDeletePost = useCallback(() => {
    dispatch(deletePostAction(item.postID))
    handleClose()
  }, [dispatch, item.postID, handleClose])

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => !prev)
  }, [])

  const handleInputChange = useCallback((e) => {
    setVal(e.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && val.trim()) {
        handleCreateComment(val)
      }
    },
    [val, handleCreateComment],
  )

  // Memoized avatar display name
  const avatarDisplayName = useMemo(() => {
    return item.user?.profile || item.user?.name?.[0] || ""
  }, [item.user?.profile, item.user?.name])

  // Memoized media content with lazy loading
  const mediaContent = useMemo(() => {
    if (item.image) {
      return (
        <LazyImage
          src={item.image}
          alt={`Post by ${item.user?.name || "User"}`}
          className="w-full max-h-[30rem] object-cover object-top"
          errorFallback={
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image failed to load</span>
            </div>
          }
        />
      )
    }
    if (item.video) {
      return <video controls loop src={item.video} className="w-full h-full" preload="metadata" />
    }
    return (
      <div className="">
        <TextDisplay item={item.post} />
      </div>
    )
  }, [item.image, item.video, item.post, item.user?.name])

  return (
    <Card
      sx={{
        mb: isMobile ? 1 : 2,
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: isMobile ? 40 : 44,
              height: isMobile ? 40 : 44,
              fontSize: isMobile ? "1rem" : "1.1rem",
              fontWeight: 600,
              border: "2px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            aria-label="user avatar"
          >
            {avatarDisplayName}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" size={isMobile ? "small" : "medium"}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              size={isMobile ? "small" : "medium"}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
            </Menu>
          </IconButton>
        }
        title={
          <Typography
            variant={isMobile ? "subtitle2" : "subtitle1"}
            fontWeight={700}
            sx={{
              color: "#1a1a1a",
              fontSize: isMobile ? "0.95rem" : "1.1rem",
            }}
          >
            {item.user.name}
          </Typography>
        }
        subheader={
          <Typography
            variant={isMobile ? "caption" : "body2"}
            sx={{
              color: "#666",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              fontWeight: 500,
            }}
          >
            {"@" + item.user.userName}
          </Typography>
        }
        sx={{
          pb: isMobile ? 1.5 : 2,
          px: isMobile ? 2 : 3,
          "& .MuiCardHeader-content": {
            overflow: "hidden",
          },
        }}
      />

      {/* Media Content */}
      <Box
        sx={{
          position: "relative",
          "& img, & video": {
            width: "100%",
            display: "block",
          },
        }}
      >
        {mediaContent}
      </Box>

      {/* Caption */}
      {item.caption && (
        <CardContent sx={{ py: isMobile ? 1.5 : 2, px: isMobile ? 2 : 3 }}>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            sx={{
              color: "#2c2c2c",
              lineHeight: 1.6,
              wordBreak: "break-word",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            {item.caption}
          </Typography>
        </CardContent>
      )}

      {/* Actions */}
      <CardActions
        sx={{
          justifyContent: "space-between",
          px: isMobile ? 2 : 3,
          py: isMobile ? 1.5 : 2,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          backgroundColor: "rgba(0,0,0,0.01)",
        }}
        disableSpacing
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={handleLikePost}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: isLiked ? "#e91e63" : "#666",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
                color: isLiked ? "#c2185b" : "#e91e63",
                backgroundColor: "rgba(233, 30, 99, 0.08)",
              },
            }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{
              color: "#666",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
                color: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            onClick={handleToggleComments}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: "#666",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
                color: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            <ChatBubbleIcon />
          </IconButton>
        </Box>
        <IconButton
          onClick={handleSavePost}
          size={isMobile ? "small" : "medium"}
          sx={{
            color: isSaved ? "#ff9800" : "#666",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.15)",
              color: isSaved ? "#f57c00" : "#ff9800",
              backgroundColor: "rgba(255, 152, 0, 0.08)",
            },
          }}
        >
          {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
      {showComments && (
        <section style={{ backgroundColor: "#fafafa", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center mx-3 my-4 space-x-3">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>{}</Avatar>
            <input
              value={val}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full outline-none bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              type="text"
              placeholder="Write your comment..."
            />
          </div>
          <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />
          <div className="mx-3 my-4 space-y-3">
            {item.comments?.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                <Avatar
                  sx={{
                    height: 28,
                    width: 28,
                    fontSize: "0.75rem",
                    bgcolor: "#ff9800",
                    fontWeight: 600,
                  }}
                >
                  {comment.user}
                </Avatar>
                <div className="flex-1">
                  <Typography variant="body2" sx={{ color: "#2c2c2c", lineHeight: 1.5 }}>
                    {comment.comment}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  )
})

PostCard.displayName = "PostCard"

export default PostCard
