import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Box, Typography } from '@mui/material';
import { red, blue, grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { follow } from '../../Redux/Profile/profileaction';
import { PersonAdd, PersonRemove } from '@mui/icons-material';

const PopularUser = React.memo(({ item }) => {
  const { auth, profile } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user follows this user - more reliable method
  useEffect(() => {
    if (profile.following && auth?.user?.id) {
      const isUserFollowed = profile.following.some(user => user.id === item.id);
      setIsFollowing(isUserFollowed);
    }
  }, [profile.following, auth?.user?.id, item.id]);

  const handleAvatarClick = useCallback(() => {
    navigate(`/profile/${item.id}`);
  }, [navigate, item.id]);

  const handleFollowClick = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await dispatch(follow(item.id));
      // Toggle follow state locally for immediate UI feedback
      setIsFollowing(prev => !prev);
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, item.id, isLoading]);

  const getAvatarContent = () => {
    const avatarStyles = {
      bgcolor: red[500], 
      cursor: 'pointer',
      width: 48,
      height: 48,
      border: '2px solid',
      borderColor: 'primary.main',
      flexShrink: 0, // Prevent avatar from shrinking
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    };

    if (item.profilePicture || item.profile) {
      return (
        <Avatar 
          src={item.profilePicture || item.profile} 
          sx={avatarStyles}
          onClick={handleAvatarClick}
          alt={item.name}
        />
      );
    }
    
    return (
      <Avatar 
        sx={{ 
          ...avatarStyles,
          fontSize: '1.2rem',
          fontWeight: 600,
          background: `linear-gradient(135deg, ${red[400]} 0%, ${red[600]} 100%)`
        }} 
        onClick={handleAvatarClick}
      >
        {item.name?.[0]?.toUpperCase() || 'U'}
      </Avatar>
    );
  };

  const buttonStyles = {
    minWidth: '90px',
    maxWidth: '90px',
    width: '90px',
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    height: '34px',
    padding: '0 8px',
    transition: 'all 0.2s ease-in-out',
    flexShrink: 0, // Prevent button from shrinking
    '& .MuiButton-startIcon': {
      marginRight: '4px',
      marginLeft: 0,
      '& > svg': {
        fontSize: '16px'
      }
    },
    ...(isFollowing 
      ? {
          backgroundColor: grey[100],
          color: grey[700],
          border: `1px solid ${grey[300]}`,
          '&:hover': {
            backgroundColor: red[50],
            color: red[600],
            border: `1px solid ${red[300]}`,
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          },
          '&:disabled': {
            backgroundColor: grey[50],
            color: grey[400],
            border: `1px solid ${grey[200]}`
          }
        }
      : {
          backgroundColor: blue[600],
          color: 'white',
          border: `1px solid ${blue[600]}`,
          '&:hover': {
            backgroundColor: blue[700],
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
          },
          '&:disabled': {
            backgroundColor: grey[300],
            color: grey[500],
            border: `1px solid ${grey[300]}`
          }
        }
    )
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        padding: '16px 0',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        minHeight: '80px', // Ensure consistent height
        '&:last-child': {
          borderBottom: 'none'
        },
        '&:hover': {
          backgroundColor: 'action.hover',
          borderRadius: 1,
          mx: -1,
          px: 1,
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      {/* Avatar Section - Fixed Width */}
      <Box sx={{ flexShrink: 0 }}>
        {getAvatarContent()}
      </Box>

      {/* User Info Section - Flexible Width with Constraints */}
      <Box sx={{ 
        flex: 1, 
        minWidth: 0, // Allow shrinking below content size
        maxWidth: 'calc(100% - 170px)', // Reserve space for button + gaps
        overflow: 'hidden'
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            cursor: 'pointer',
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            display: 'block',
            lineHeight: 1.3,
            '&:hover': { 
              color: 'primary.main',
              transition: 'color 0.2s ease-in-out'
            }
          }}
          onClick={handleAvatarClick}
          title={item.name} // Show full name on hover
        >
          {item.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.875rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            display: 'block',
            lineHeight: 1.2,
            mt: 0.25
          }}
          title={`@${item.userName}`} // Show full username on hover
        >
          @{item.userName}
        </Typography>
        
        {item.mutualFollowers && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.75rem', 
              mt: 0.5,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              lineHeight: 1.1
            }}
          >
            {item.mutualFollowers} mutual {item.mutualFollowers === 1 ? 'follower' : 'followers'}
          </Typography>
        )}
      </Box>
      
      {/* Follow Button Section - Fixed Width */}
      <Box sx={{ flexShrink: 0 }}>
        <Button
          size="small"
          onClick={handleFollowClick}
          disabled={isLoading}
          startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
          sx={buttonStyles}
          variant={isFollowing ? 'outlined' : 'contained'}
        >
          {isLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      </Box>
    </Box>
  );
});

PopularUser.displayName = 'PopularUser';

export default PopularUser;

