"use client"

import React, { useState, useCallback, useMemo } from "react"
import { navigationMenu } from "./SidebarNavigation"
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material"
import { MoreVert as MoreVertIcon, Settings as SettingsIcon, ExpandLess, ExpandMore } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { logoutAction } from "../../Redux/Auth/auth.actiion"
import { motion } from "framer-motion"

const Sidebar = React.memo(() => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [anchorEl, setAnchorEl] = useState(null)
  const [showMoreNav, setShowMoreNav] = useState(false)

  const { auth } = useSelector((store) => store)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const open = Boolean(anchorEl)

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleLogout = useCallback(() => {
    dispatch(logoutAction())
    handleClose()
    navigate("/login")
    window.location.reload()
  }, [dispatch, navigate, handleClose])

  const handleNavigate = useCallback(
    (item) => {
      if (item.title === "Profile") {
        navigate(`/profile/${auth.user?.id}`)
      } else {
        navigate(item.path)
      }
    },
    [navigate, auth.user?.id],
  )

  const toggleMoreNav = useCallback(() => {
    setShowMoreNav((prev) => !prev)
  }, [])

  // Split navigation items for better organization
  const primaryNavItems = useMemo(() => navigationMenu.slice(0, 5), []) // First 5 items
  const secondaryNavItems = useMemo(() => navigationMenu.slice(5), []) // Rest of the items

  // Memoized user profile data
  const userProfile = useMemo(
    () => ({
      name: auth.user?.name || "",
      userName: auth.user?.userName || "",
      profileImage: auth.user?.profile || "",
    }),
    [auth.user?.name, auth.user?.userName, auth.user?.profile],
  )

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: { delay: index * 0.1, duration: 0.3 },
    }),
    hover: {
      x: 5,
      transition: { duration: 0.2 },
    },
  }

  const profileCardVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      transition: { duration: 0.2 },
    },
  }

  if (isMobile) {
    return null // Hide sidebar on mobile, use bottom navigation instead
  }

  return (
    <motion.div variants={sidebarVariants} initial="hidden" animate="visible" className="h-screen sticky top-0">
      <div className="h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <Typography
                variant="h5"
                className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Thoughts
              </Typography>
            </div>
          </motion.div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-2">
            {/* Primary Navigation */}
            {primaryNavItems.map((item, index) => {
              const isActive =
                location.pathname === item.path || (item.title === "Profile" && location.pathname.includes("/profile"))

              return (
                <motion.div
                  key={item.title}
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <button
                    onClick={() => handleNavigate(item)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 dark:bg-blue-800/30"
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                      }`}
                    >
                      {React.cloneElement(item.icon, {
                        className: `w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`,
                      })}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </button>
                </motion.div>
              )
            })}

            {/* More Navigation Toggle */}
            {secondaryNavItems.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <button
                    onClick={toggleMoreNav}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="font-medium">More</span>
                    </div>
                    {showMoreNav ? <ExpandLess /> : <ExpandMore />}
                  </button>
                </motion.div>

                <Collapse in={showMoreNav} timeout="auto" unmountOnExit>
                  <div className="mt-2 space-y-1">
                    {secondaryNavItems.map((item, index) => {
                      const isActive =
                        location.pathname === item.path ||
                        (item.title === "Profile" && location.pathname.includes("/profile"))

                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <button
                            onClick={() => handleNavigate(item)}
                            className={`w-full flex items-center space-x-3 px-4 py-2 ml-4 rounded-lg text-left transition-all duration-200 ${
                              isActive
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                            <span className="text-sm font-medium">{item.title}</span>
                          </button>
                        </motion.div>
                      )
                    })}
                  </div>
                </Collapse>
              </div>
            )}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <motion.div variants={profileCardVariants} whileHover="hover">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar src={userProfile.profileImage} alt={userProfile.name} sx={{ width: 44, height: 44 }} />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userProfile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{userProfile.userName}</p>
                  </div>
                </div>

                <Tooltip title="Account options">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </motion.div>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                minWidth: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid",
                borderColor: "divider",
              },
            }}
          >
            <MenuItem
              onClick={() => navigate(`/profile/${auth.user?.id}`)}
              className="flex items-center space-x-3 px-4 py-3"
            >
              <Avatar sx={{ width: 24, height: 24 }} />
              <span>My Profile</span>
            </MenuItem>
            <MenuItem onClick={() => navigate("/settings")} className="flex items-center space-x-3 px-4 py-3">
              <SettingsIcon fontSize="small" />
              <span>Settings</span>
            </MenuItem>
            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <MenuItem
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <span>Logout</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </motion.div>
  )
})

Sidebar.displayName = "Sidebar"

export default Sidebar
