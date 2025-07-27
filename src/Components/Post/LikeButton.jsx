import React, { useState, useCallback } from 'react';
import { IconButton, Typography, Tooltip, Zoom, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch } from 'react-redux';
import { likePostAction } from '../../Redux/Post/post.action';

const LikeButton = React.memo(({ postId, initialLiked, initialCount, currentUserId, size = 'medium', showCount = true }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLike = useCallback(async () => {
    if (isLoading) return;
    
    const newLikedState = !isLiked;
    const newCount = likeCount + (newLikedState ? 1 : -1);
    
    // Optimistic update
    setIsLiked(newLikedState);
    setLikeCount(newCount);
    setIsLoading(true);
    
    try {
      await dispatch(likePostAction(postId));
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
      // Handle error silently or show user notification
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, postId, isLiked, likeCount, isLoading]);

  const iconSize = {
    small: '20px',
    medium: '24px',
    large: '28px'
  }[size];

  return (
    <div className="flex items-center space-x-1">
      <Tooltip 
        title={isLiked ? 'Unlike' : 'Like'} 
        TransitionComponent={Zoom}
        arrow
      >
        <span>
          <IconButton 
            onClick={handleLike}
            disabled={isLoading}
            size={size}
            sx={{ 
              color: isLiked ? "#ef4444" : "#6b7280",
              backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              border: isLiked ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid transparent',
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { 
                backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.05)',
                color: "#ef4444",
                transform: "scale(1.1)",
                boxShadow: isLiked 
                  ? '0 4px 12px rgba(239, 68, 68, 0.25)' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
              },
              "&:active": {
                transform: "scale(0.95)"
              },
              "&:disabled": {
                color: "#d1d5db",
                opacity: 0.6
              }
            }}
          >
            {isLoading ? (
              <CircularProgress 
                size={iconSize} 
                sx={{ color: 'inherit' }}
              />
            ) : isLiked ? (
              <FavoriteIcon 
                sx={{ 
                  fontSize: iconSize,
                  filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
                }} 
              />
            ) : (
              <FavoriteBorderIcon 
                sx={{ 
                  fontSize: iconSize,
                  transition: 'all 0.2s ease',
                }} 
              />
            )}
          </IconButton>
        </span>
      </Tooltip>
      
      {showCount && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: isLiked ? '#ef4444' : '#6b7280',
            fontWeight: isLiked ? 600 : 400,
            transition: 'all 0.3s ease',
            minWidth: '20px',
          }}
        >
          {likeCount > 0 ? (
            likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount
          ) : ''}
        </Typography>
      )}
    </div>
  );
});

LikeButton.displayName = 'LikeButton';

export default LikeButton;
