"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Avatar } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { follow } from "../../Redux/Profile/profileaction"
import { PersonAdd, PersonRemove } from "@mui/icons-material"

const PopularUser = React.memo(({ item }) => {
  const { auth, profile } = useSelector((store) => store)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if current user follows this user - more reliable method
  useEffect(() => {
    if (profile.following && auth?.user?.id) {
      const isUserFollowed = profile.following.some((user) => user.id === item.id)
      setIsFollowing(isUserFollowed)
    }
  }, [profile.following, auth?.user?.id, item.id])

  const handleAvatarClick = useCallback(() => {
    navigate(`/profile/${item.id}`)
  }, [navigate, item.id])

  const handleFollowClick = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await dispatch(follow(item.id))
      // Toggle follow state locally for immediate UI feedback
      setIsFollowing((prev) => !prev)
    } catch (error) {
      console.error("Follow action failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, item.id, isLoading])

  const getAvatarContent = () => {
    const avatarStyles = {
      width: 48,
      height: 48,
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      border: "2px solid transparent",
      "&:hover": {
        transform: "scale(1.05)",
        border: "2px solid",
        borderColor: "primary.main",
      },
    }

    if (item.profilePicture || item.profile) {
      return (
        <Avatar
          src={item.profilePicture || item.profile}
          sx={avatarStyles}
          onClick={handleAvatarClick}
          alt={item.name}
        />
      )
    }

    return (
      <Avatar
        sx={{
          ...avatarStyles,
          fontSize: "1.2rem",
          fontWeight: 600,
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "white",
        }}
        onClick={handleAvatarClick}
      >
        {item.name?.[0]?.toUpperCase() || "U"}
      </Avatar>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 group">
      {/* Avatar Section */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {getAvatarContent()}

        <div className="flex-1 min-w-0">
          <h4
            onClick={handleAvatarClick}
            className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            title={item.name}
          >
            {item.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={`@${item.userName}`}>
            @{item.userName}
          </p>
          {item.mutualFollowers && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {item.mutualFollowers} mutual {item.mutualFollowers === 1 ? "follower" : "followers"}
            </p>
          )}
        </div>
      </div>

      {/* Follow Button */}
      <div className="flex-shrink-0 ml-3">
        <button
          onClick={handleFollowClick}
          disabled={isLoading}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-w-[80px] ${
            isFollowing
              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            <span className="flex items-center space-x-1">
              {isFollowing ? <PersonRemove className="w-4 h-4" /> : <PersonAdd className="w-4 h-4" />}
              <span>{isFollowing ? "Unfollow" : "Follow"}</span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
})

PopularUser.displayName = "PopularUser"

export default PopularUser
