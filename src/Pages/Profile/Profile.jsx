"use client"

import React, { useEffect, useCallback } from "react"
import { Avatar, Box, Button, Card, Tab, Tabs } from "@mui/material"
import PostCard from "../../Components/Post/PostCard"
import { useDispatch, useSelector } from "react-redux"
import ProfileModal from "./ProfileModal"
import { likedPostAction, savedPostAction } from "../../Redux/Post/post.action"
import { useNavigate, useParams } from "react-router-dom"
import { follow, getFollowers, getFollowing, getPost, userPro, userReels } from "../../Redux/Profile/profileaction"
import { isFollowBy } from "../Util2/isFollow.js"
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout"
import { logoutAction } from "../../Redux/Auth/auth.actiion"
const tabs = [
  { value: "post", name: "Post" },
  { value: "reels", name: "Reels" },
  { value: "liked", name: "Liked" },
  { value: "saved", name: "Saved" },
  { value: "repost", name: "Repost" },
]

const Profile = () => {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isMobile } = useResponsiveLayout()

  useEffect(() => {
    dispatch(userPro(userId))
  }, [dispatch, userId])
  const [value, setValue] = React.useState("post")
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const { auth, post, profile } = useSelector((store) => store)

  useEffect(() => {
    if (value === "liked" && !post.likedPosts?.length) {
      dispatch(likedPostAction())
    } else if (value === "post") {
      // Only fetch if we don't have the data already
      if (!profile.following?.length) {
        dispatch(getFollowing(userId))
      }
      if (!profile.followers?.length) {
        dispatch(getFollowers(userId))
      }
      if (!profile.posts?.length) {
        dispatch(getPost(userId))
      }
    } else if (value === "saved" && !post.savedPosts?.length) {
      dispatch(savedPostAction())
    } else if (value === "reels" && !profile.reels?.length) {
      dispatch(userReels(userId))
    }
  }, [value, dispatch, userId, post.likedPosts?.length, post.savedPosts?.length, profile.following?.length, profile.followers?.length, profile.posts?.length, profile.reels?.length])

  const [isLiked, setIsLiked] = React.useState(false)
  useEffect(() => {
    if (profile?.user?.followers) {
      const userIsFollowed = isFollowBy(profile.user.followers, auth?.user?.id)
      setIsLiked(userIsFollowed)
    }
  }, [profile, auth?.user?.id])

  const handleClick = useCallback(() => {
    dispatch(follow(userId))
    setIsLiked((prevLiked) => !prevLiked)
    // REMOVED: Redundant API call - follow action should update Redux state automatically
    // dispatch(userPro(userId))
  }, [dispatch, userId])
  const [open, setOpen] = React.useState(false)
  const handleOpenProfileModal = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    window.location.reload()
  }

  const handleLogout = useCallback(() => {
    dispatch(logoutAction())
    navigate("/login")
    window.location.reload()
  }, [dispatch, navigate])

  const isOwnProfile = () => {
    if (!auth.user?.id || !userId) return false
    return String(auth.user.id) === String(userId)
  }

  return (
    <div
      style={{
        padding: isMobile ? "12px" : "24px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
          mb: isMobile ? 2 : 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box
          sx={{
            height: isMobile ? "200px" : "280px",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <img
            className="w-full h-full object-cover"
            src={profile.user?.profile || "https://via.placeholder.com/800x300?text=No+Cover+Image"}
            alt="Profile Cover"
            style={{
              filter: "brightness(0.85)",
              transition: "transform 0.3s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
            }}
          />
        </Box>

        <Box sx={{ px: isMobile ? 3 : 5, pt: 1, pb: 3 }}>
          {/* Avatar and Action Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
              transform: `translateY(${isMobile ? "-50px" : "-70px"})`,
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? "100px" : "140px",
                height: isMobile ? "100px" : "140px",
                fontSize: isMobile ? "36px" : "48px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "5px solid white",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {profile.user?.name?.[0] || "U"}
            </Avatar>
            <Box sx={{ mt: isMobile ? 5.3 : 0.5 }}>
              {isOwnProfile() ? (
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    onClick={handleOpenProfileModal}
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderRadius: "30px",
                      px: isMobile ? 3 : 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      border: "2px solid #667eea",
                      color: "#667eea",
                      background: "rgba(102, 126, 234, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderRadius: "30px",
                      px: isMobile ? 3 : 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      border: "2px solid #ef4444",
                      color: "#ef4444",
                      background: "rgba(239, 68, 68, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "#ef4444",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
                      },
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant={isLiked ? "outlined" : "contained"}
                  size={isMobile ? "medium" : "large"}
                  onClick={handleClick}
                  sx={{
                    borderRadius: "30px",
                    px: isMobile ? 3 : 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    ...(isLiked
                      ? {
                          border: "2px solid #ef4444",
                          color: "#ef4444",
                          background: "rgba(239, 68, 68, 0.05)",
                          "&:hover": {
                            background: "#ef4444",
                            color: "white",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
                          },
                        }
                      : {
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                          },
                        }),
                    transition: "all 0.3s ease",
                  }}
                >
                  {isLiked ? "Unfollow" : "Follow"}
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 4, mt: isMobile ? -3 : -4 }}>
            <h1
              style={{
                fontSize: isMobile ? "1.75rem" : "2.25rem",
                fontWeight: 800,
                margin: "0 0 8px 0",
                background: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {profile.user?.name || "User Name"}
            </h1>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "1.125rem",
                color: "#6b7280",
                margin: "0 0 20px 0",
                fontWeight: 500,
              }}
            >
              @{profile.user?.userName || "username"}
            </p>

            <Box
              sx={{
                display: "flex",
                gap: isMobile ? 2 : 3,
                my: 3,
              }}
            >
              {[
                { label: "Posts", value: profile.posts?.length || 0 },
                { label: "Followers", value: profile.followers?.length || 0 },
                { label: "Following", value: profile.following?.length || 0 },
              ].map((stat, index) => (
                <Box
                  key={stat.label}
                  sx={{
                    background: "rgba(102, 126, 234, 0.05)",
                    borderRadius: 3,
                    p: isMobile ? 2 : 2.5,
                    textAlign: "center",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      background: "rgba(102, 126, 234, 0.1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: 800,
                      fontSize: isMobile ? "1.25rem" : "1.5rem",
                      color: "#667eea",
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Box>
                  <Box
                    sx={{
                      fontSize: isMobile ? "0.875rem" : "1rem",
                      color: "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    {stat.label}
                  </Box>
                </Box>
              ))}
            </Box>

            {profile.user?.bio && (
              <Box
                sx={{
                  background: "rgba(248, 250, 252, 0.8)",
                  borderRadius: 3,
                  p: 3,
                  mt: 3,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    margin: 0,
                    color: "#374151",
                  }}
                >
                  {profile.user.bio}
                </p>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            borderBottom: "2px solid #f1f5f9",
            background: "rgba(248, 250, 252, 0.5)",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: isMobile ? "0.875rem" : "1rem",
                py: 2.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(102, 126, 234, 0.05)",
                  color: "#667eea",
                },
              },
              "& .Mui-selected": {
                color: "#667eea !important",
                background: "rgba(102, 126, 234, 0.1)",
              },
              "& .MuiTabs-indicator": {
                height: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "2px 2px 0 0",
              },
            }}
          >
            {tabs.map((item) => (
              <Tab key={item.value} value={item.value} label={item.name} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: isMobile ? 2 : 3, background: "#fafbfc" }}>
          {value === "post" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 2 : 3,
                maxWidth: "100%",
              }}
            >
              {profile.posts?.map((item) => (
                <PostCard key={item.id || Math.random()} item={item} />
              ))}
            </Box>
          )}

          {value === "reels" && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(auto-fit, minmax(160px, 1fr))"
                  : "repeat(auto-fit, minmax(220px, 1fr))",
                gap: isMobile ? 2 : 3,
              }}
            >
              {profile.userReel?.map((item) => (
                <PostCard key={item.id || Math.random()} item={item} />
              ))}
            </Box>
          )}

          {value === "liked" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 2 : 3,
              }}
            >
              {post.liked?.map((item) => (
                <PostCard key={item.id || Math.random()} item={item} />
              ))}
            </Box>
          )}

          {value === "saved" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 2 : 3,
              }}
            >
              {post.saved?.map((item) => (
                <PostCard key={item.id || Math.random()} item={item} />
              ))}
            </Box>
          )}

          {value === "repost" && (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "#6b7280",
                background: "white",
                borderRadius: 3,
                border: "2px dashed #e5e7eb",
              }}
            >
              <p style={{ fontSize: "1.125rem", fontWeight: 500 }}>Reposted items will be shown here...</p>
            </Box>
          )}
        </Box>
      </Card>

      {/* Profile Modal */}
      <ProfileModal open={open} handleClose={handleClose} />
    </div>
  )
}
export default Profile
