import React, { useMemo } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Box,
  useTheme,
  Fab,
  Avatar
} from '@mui/material';
import {
  Home,
  VideoLibrary,
  Add,
  Message,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { auth } = useSelector(store => store);
  
  // Get the current active tab based on pathname
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/reels') return 1;
    if (path === '/create-reels') return 2;
    if (path === '/messages') return 3;
    if (path.startsWith('/profile/')) return 4;
    return 0;
  }, [location.pathname]);

  const handleNavigation = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/reels');
        break;
      case 2:
        navigate('/create-reels');
        break;
      case 3:
        navigate('/messages');
        break;
      case 4:
        navigate(`/profile/${auth.user?.id}`);
        break;
      default:
        navigate('/');
    }
  };

  // Navigation items configuration
  const navItems = [
    {
      label: 'Home',
      icon: <Home />,
      value: 0,
      showBadge: false
    },
    {
      label: 'Reels',
      icon: <VideoLibrary />,
      value: 1,
      showBadge: false
    },
    {
      label: 'Create',
      icon: <Add />,
      value: 2,
      showBadge: false,
      isSpecial: true // This will be a FAB
    },
    {
      label: 'Messages',
      icon: <Message />,
      value: 3,
      showBadge: true,
      badgeCount: 3 // You can connect this to actual message count
    },
    {
      label: 'Profile',
      icon: auth.user?.profile ? (
        <Avatar
          src={auth.user.profile}
          sx={{ width: 28, height: 28 }}
        />
      ) : (
        <AccountCircle />
      ),
      value: 4,
      showBadge: false
    }
  ];

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid',
        borderTopColor: 'divider',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      elevation={8}
    >
      <BottomNavigation
        value={activeTab}
        onChange={handleNavigation}
        sx={{
          height: 65,
          position: 'relative',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              transform: 'translateY(-2px)',
            },
            '&:not(.Mui-selected)': {
              color: theme.palette.grey[600],
            }
          }
        }}
      >
        {navItems.map((item) => {
          if (item.isSpecial) {
            // Special handling for Create button as FAB
            return (
              <Box
                key={item.value}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  height: '100%'
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => handleNavigation(null, item.value)}
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    {item.icon}
                  </Fab>
                </motion.div>
              </Box>
            );
          }

          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              icon={
                item.showBadge ? (
                  <Badge
                    badgeContent={item.badgeCount}
                    color="error"
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 3,
                      }
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )
              }
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: activeTab === item.value ? 600 : 400,
                  '&.Mui-selected': {
                    fontSize: '0.75rem',
                  }
                }
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default React.memo(MobileBottomNav);
