"use client"

import { Avatar, Box, useMediaQuery, useTheme } from "@mui/material"
import React, { useEffect, useState, useCallback, useMemo } from "react"
import AddIcon from "@mui/icons-material/Add"
import StoryCircle from "./StoryCircle"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import ArticleIcon from "@mui/icons-material/Article"
import PostCard from "../Post/PostCard"
import CreatePostModal from "../CreatePost"
import { useDispatch, useSelector } from "react-redux"
import { getAllPostAction } from "../../Redux/Post/post.action"
import CreateStoryModal from "../CreateSTory/CreateStoryModal"
import { authStory, users } from "../../Redux/Auth/auth.actiion"
import { useOptimizedDataFetch } from "../../hooks/useOptimizedDataFetch"
import Render from "./Render"

const MiddlePart = React.memo(() => {
  const { auth } = useSelector((store) => store)
  const dispatch = useDispatch()
  const { post } = useSelector((store) => store)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Optimized data fetching for stories
  const { refetch: refetchStories } = useOptimizedDataFetch({
    action: () => Promise.all([
      dispatch(authStory()),
      dispatch(users())
    ]),
    selector: (state) => ({ 
      myStory: state.auth.My_story, 
      users: state.auth.users 
    }),
    cacheKey: 'stories-data',
    cacheDuration: 3 * 60 * 1000, // 3 minutes for stories
    condition: (data) => !data.myStory?.length && !data.users?.length
  })

  // Optimized data fetching for posts
  const { refetch: refetchPosts } = useOptimizedDataFetch({
    action: getAllPostAction,
    selector: (state) => state.post.posts,
    cacheKey: 'home-posts',
    cacheDuration: 2 * 60 * 1000, // 2 minutes for posts
    condition: (posts) => !posts?.length
  })

  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)
  const handleCloseCreatePostModal = useCallback(() => {
    setOpenCreatePostModal(false)
  }, [])
  const handleOpenCreatePostModal = useCallback(() => {
    setOpenCreatePostModal(true)
  }, [])

  const [openCreateStoryModal, setOpenCreateStoryModal] = useState(false)
  const handleCloseCreateStoryModal = useCallback(() => {
    setOpenCreateStoryModal(false)
  }, [])
  const handleOpenCreateStoryModal = useCallback(() => {
    setOpenCreateStoryModal(true)
  }, [])

  const [open, setOpen] = useState(false)

  // REMOVED: Redundant useEffects - now handled by useOptimizedDataFetch hooks above
  const handleCloseRender = useCallback(() => {
    setOpen(false)
  }, [])
  const handleOpenRender = useCallback(() => {
    setOpen(true)
  }, [])

  const memoizedPosts = useMemo(() => {
    return post.posts?.map((item) => <PostCard key={item.postID || item.id} item={item} />)
  }, [post.posts])

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Stories Section */}
      <section className="mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            {/* Current User Story */}
            <div className="flex-shrink-0 relative">
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  sx={{
                    width: isMobile ? "4rem" : "5rem",
                    height: isMobile ? "4rem" : "5rem",
                    border: auth.My_story?.length > 0 ? "3px solid" : "2px solid",
                    borderColor: auth.My_story?.length > 0 ? "#f59e0b" : "#e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={handleOpenRender}
                >
                  {auth.user?.profile}
                </Avatar>
                <div
                  onClick={handleOpenCreateStoryModal}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 shadow-lg"
                >
                  <AddIcon sx={{ fontSize: "1rem", color: "white" }} />
                </div>
              </Box>
              <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400 font-medium">Your Story</p>
            </div>

            {/* Other Users Stories */}
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {auth.users?.map((item, index) => (
                <div key={index} className="flex-shrink-0">
                  <StoryCircle item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Create Post Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar
            sx={{
              bgcolor: "#f59e0b",
              width: isMobile ? 44 : 48,
              height: isMobile ? 44 : 48,
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            {auth.user?.name[0] ? auth.user?.name[0] : "O"}
          </Avatar>
          <div
            onClick={handleOpenCreatePostModal}
            className="flex-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-4 py-3 cursor-pointer transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              What's on your mind, {auth.user?.name?.split(" ")[0]}?
            </span>
          </div>
        </div>

        <div className="flex justify-around pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleOpenCreatePostModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
          >
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <ImageIcon className="text-red-500 text-lg" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Photo</span>
          </button>

          <button
            onClick={handleOpenCreatePostModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <VideocamIcon className="text-green-500 text-lg" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Video</span>
          </button>

          <button
            onClick={handleOpenCreatePostModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <ArticleIcon className="text-blue-500 text-lg" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Article</span>
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">{memoizedPosts}</div>

      {/* Modals */}
      <div>
        <CreatePostModal handleClose={handleCloseCreatePostModal} open={openCreatePostModal} />
      </div>
      <div>
        <CreateStoryModal handleClose={handleCloseCreateStoryModal} open={openCreateStoryModal} />
      </div>
      <Render items={auth.My_story} open={open} onClose={handleCloseRender} />
    </div>
  )
})

MiddlePart.displayName = "MiddlePart"

export default MiddlePart
