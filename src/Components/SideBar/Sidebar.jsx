import React, { useState, useCallback, useMemo } from "react";
import { navigationMenu } from "./SidebarNavigation";
import {
    Avatar,
    Card,
    Divider,
    Menu,
    MenuItem,
    Typography,
    Box,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Badge
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    Settings as SettingsIcon,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAction } from "../../Redux/Auth/auth.actiion";
import { motion } from "framer-motion";

const Sidebar = React.memo(() => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [showMoreNav, setShowMoreNav] = useState(false);
    
    const { auth } = useSelector((store) => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const open = Boolean(anchorEl);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logoutAction());
        handleClose();
        navigate('/login');
        window.location.reload();
    }, [dispatch, navigate, handleClose]);

    const handleNavigate = useCallback((item) => {
        if (item.title === "Profile") {
            navigate(`/profile/${auth.user?.id}`);
        } else {
            navigate(item.path);
        }
    }, [navigate, auth.user?.id]);

    const toggleMoreNav = useCallback(() => {
        setShowMoreNav(prev => !prev);
    }, []);

    // Split navigation items for better organization
    const primaryNavItems = useMemo(() => navigationMenu.slice(0, 5), []); // First 5 items
    const secondaryNavItems = useMemo(() => navigationMenu.slice(5), []); // Rest of the items

    // Memoized user profile data
    const userProfile = useMemo(() => ({
        name: auth.user?.name || '',
        userName: auth.user?.userName || '',
        profileImage: auth.user?.profile || ''
    }), [auth.user?.name, auth.user?.userName, auth.user?.profile]);

    const sidebarVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const menuItemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: (index) => ({
            x: 0,
            opacity: 1,
            transition: { delay: index * 0.1, duration: 0.3 }
        }),
        hover: {
            x: 5,
            transition: { duration: 0.2 }
        }
    };

    const profileCardVariants = {
        hover: {
            scale: 1.02,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            transition: { duration: 0.2 }
        }
    };

    if (isMobile) {
        return null; // Hide sidebar on mobile, use bottom navigation instead
    }

    return (
        <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="h-screen"
        >
            <Card 
                className='flex flex-col justify-between h-screen py-6 card'
                sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                }}
            >
                <div className="px-6 space-y-8">
                    {/* Logo Section */}
                    <motion.div 
                        className="flex justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Typography
                            variant="h4"
                            className="font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                            sx={{ fontFamily: 'serif', fontStyle: 'italic' }}
                        >
                            Thoughts
                        </Typography>
                    </motion.div>

                    {/* Navigation Section */}
                    <div className="space-y-4">
                        {/* Primary Navigation */}
                        <List component="nav" disablePadding>
                            {primaryNavItems.map((item, index) => {
                                const isActive = location.pathname === item.path || 
                                    (item.title === "Profile" && location.pathname.includes('/profile'));
                                
                                return (
                                    <motion.div
                                        key={item.title}
                                        custom={index}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                    >
                                        <ListItem
                                            button
                                            onClick={() => handleNavigate(item)}
                                            sx={{
                                                borderRadius: '12px',
                                                mb: 1,
                                                backgroundColor: isActive ? 'action.selected' : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                    transform: 'translateX(8px)',
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            <ListItemIcon 
                                                sx={{ 
                                                    color: isActive ? 'primary.main' : 'text.secondary',
                                                    minWidth: '40px'
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={item.title}
                                                primaryTypographyProps={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: isActive ? 600 : 400,
                                                    color: isActive ? 'primary.main' : 'text.primary'
                                                }}
                                            />
                                        </ListItem>
                                    </motion.div>
                                );
                            })}
                        </List>

                        {/* More Navigation Toggle */}
                        {secondaryNavItems.length > 0 && (
                            <>
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <ListItem
                                        button
                                        onClick={toggleMoreNav}
                                        sx={{
                                            borderRadius: '12px',
                                            '&:hover': { backgroundColor: 'action.hover' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: '40px' }}>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="More" 
                                            primaryTypographyProps={{
                                                fontSize: '1.1rem',
                                                fontWeight: 400
                                            }}
                                        />
                                        {showMoreNav ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                </motion.div>

                                <Collapse in={showMoreNav} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {secondaryNavItems.map((item, index) => {
                                            const isActive = location.pathname === item.path || 
                                                (item.title === "Profile" && location.pathname.includes('/profile'));
                                            
                                            return (
                                                <motion.div
                                                    key={item.title}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <ListItem
                                                        button
                                                        onClick={() => handleNavigate(item)}
                                                        sx={{
                                                            pl: 4,
                                                            borderRadius: '12px',
                                                            mb: 0.5,
                                                            backgroundColor: isActive ? 'action.selected' : 'transparent',
                                                            '&:hover': { 
                                                                backgroundColor: 'action.hover',
                                                                transform: 'translateX(8px)',
                                                            },
                                                            transition: 'all 0.2s ease-in-out'
                                                        }}
                                                    >
                                                        <ListItemIcon 
                                                            sx={{ 
                                                                color: isActive ? 'primary.main' : 'text.secondary',
                                                                minWidth: '40px'
                                                            }}
                                                        >
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={item.title}
                                                            primaryTypographyProps={{
                                                                fontSize: '1rem',
                                                                fontWeight: isActive ? 600 : 400,
                                                                color: isActive ? 'primary.main' : 'text.primary'
                                                            }}
                                                        />
                                                    </ListItem>
                                                </motion.div>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            </>
                        )}
                    </div>
                </div>

                {/* User Profile Section */}
                <Box className="px-6 pb-4">
                    <Divider sx={{ mb: 3, opacity: 0.7 }} />

                    {/* User Profile Card */}
                    <motion.div
                        variants={profileCardVariants}
                        whileHover="hover"
                    >
                        <Card
                            sx={{
                                p: 2,
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '16px'
                            }}
                        >
                            <Box className="flex items-center justify-between">
                                <Box className="flex items-center space-x-3">
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'success.main',
                                                    border: '2px solid white'
                                                }}
                                            />
                                        }
                                    >
                                        <Avatar 
                                            src={userProfile.profileImage}
                                            alt={userProfile.name}
                                            sx={{ width: 48, height: 48 }}
                                        />
                                    </Badge>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {userProfile.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{userProfile.userName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Tooltip title="Account options">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{
                                            '&:hover': { backgroundColor: 'action.hover' }
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Card>
                    </motion.div>

                    {/* Profile Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                minWidth: 200,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                            }
                        }}
                    >
                        <MenuItem onClick={() => navigate(`/profile/${auth.user?.id}`)}>
                            <ListItemIcon>
                                <Avatar sx={{ width: 24, height: 24 }} />
                            </ListItemIcon>
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/settings')}>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                            onClick={handleLogout}
                            sx={{ color: 'error.main' }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Card>
        </motion.div>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;