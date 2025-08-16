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
import { MoreVert as MoreVertIcon, Settings as SettingsIcon, ExpandMore } from "@mui/icons-material"
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
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: { delay: index * 0.08, duration: 0.3, ease: "easeOut" },
    }),
    hover: {
      x: 8,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  }

  const profileCardVariants = {
    hover: {
      scale: 1.03,
      y: -2,
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  if (isMobile) {
    return null // Hide sidebar on mobile, use bottom navigation instead
  }

  return (
    <motion.div variants={sidebarVariants} initial="hidden" animate="visible" className="h-screen sticky top-0">
      <div className="h-full w-72 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 backdrop-blur-sm border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col shadow-xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-100/80 dark:border-slate-800/80">
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <Typography
                variant="h5"
                className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Thoughts
              </Typography>
            </div>
          </motion.div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-3">
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
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-lg border border-indigo-100 dark:border-indigo-800/50"
                        : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-md"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-2xl"
                        layoutId="activeBackground"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                    <div
                      className={`relative p-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800/40 dark:to-purple-800/40 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:shadow-sm"
                      }`}
                    >
                      {React.cloneElement(item.icon, {
                        className: `w-5 h-5 transition-colors duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`,
                      })}
                    </div>
                    <span className="font-semibold text-base relative z-10">{item.title}</span>
                  </button>
                </motion.div>
              )
            })}

            {/* More Navigation Toggle */}
            {secondaryNavItems.length > 0 && (
              <div className="pt-6 border-t border-slate-100/80 dark:border-slate-800/80">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={toggleMoreNav}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
                        <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <span className="font-semibold text-base">More</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showMoreNav ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ExpandMore className="text-slate-500 dark:text-slate-400" />
                    </motion.div>
                  </button>
                </motion.div>

                <Collapse in={showMoreNav} timeout="auto" unmountOnExit>
                  <div className="mt-3 space-y-2">
                    {secondaryNavItems.map((item, index) => {
                      const isActive =
                        location.pathname === item.path ||
                        (item.title === "Profile" && location.pathname.includes("/profile"))

                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                          whileHover={{ x: 8, scale: 1.02 }}
                        >
                          <button
                            onClick={() => handleNavigate(item)}
                            className={`w-full flex items-center space-x-3 px-5 py-3 ml-6 rounded-xl text-left transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:shadow-sm"
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
        <div className="p-6 border-t border-slate-100/80 dark:border-slate-800/80">
          <motion.div variants={profileCardVariants} whileHover="hover">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar
                      src={userProfile.profileImage}
                      alt={userProfile.name}
                      sx={{
                        width: 48,
                        height: 48,
                        border: "3px solid",
                        borderColor: "rgba(99, 102, 241, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 border-3 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                      @{userProfile.userName}
                    </p>
                  </div>
                </div>

                <Tooltip title="Account options" arrow>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </motion.div>
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
                borderRadius: "16px",
                minWidth: 220,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                border: "1px solid",
                borderColor: "divider",
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(255,255,255,0.95)",
                ".dark &": {
                  backgroundColor: "rgba(30,41,59,0.95)",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => navigate(`/profile/${auth.user?.id}`)}
              className="flex items-center space-x-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <Avatar sx={{ width: 28, height: 28 }} />
              <span className="font-medium">My Profile</span>
            </MenuItem>
            <MenuItem
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <SettingsIcon fontSize="small" />
              <span className="font-medium">Settings</span>
            </MenuItem>
            <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
            <MenuItem
              onClick={handleLogout}
              className="flex items-center space-x-3 px-5 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <span className="font-medium">Logout</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </motion.div>
  )
})

Sidebar.displayName = "Sidebar"

export default Sidebar
