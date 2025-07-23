import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { blue, grey, red } from '@mui/material/colors';
import { useFollowState } from '../../hooks/useFollowState';

const FollowButton = React.memo(({ 
  userId, 
  size = 'small', 
  variant = 'auto',
  fullWidth = false,
  sx = {} 
}) => {
  const { isFollowing, isLoading, toggleFollow } = useFollowState(userId);

  const handleClick = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    await toggleFollow();
  };

  const buttonVariant = variant === 'auto' 
    ? (isFollowing ? 'outlined' : 'contained')
    : variant;

  const buttonStyles = {
    minWidth: size === 'small' ? '80px' : '100px',
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: size === 'small' ? '0.875rem' : '1rem',
    height: size === 'small' ? '32px' : '40px',
    transition: 'all 0.2s ease-in-out',
    ...(isFollowing 
      ? {
          backgroundColor: grey[100],
          color: grey[700],
          border: `1px solid ${grey[300]}`,
          '&:hover': {
            backgroundColor: red[50],
            color: red[600],
            border: `1px solid ${red[300]}`,
          }
        }
      : {
          backgroundColor: blue[600],
          color: 'white',
          '&:hover': {
            backgroundColor: blue[700],
          }
        }
    ),
    ...sx
  };

  if (isLoading) {
    return (
      <Button
        size={size}
        disabled
        sx={buttonStyles}
        variant={buttonVariant}
        fullWidth={fullWidth}
      >
        <CircularProgress size={16} />
      </Button>
    );
  }

  return (
    <Button
      size={size}
      onClick={handleClick}
      startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
      sx={buttonStyles}
      variant={buttonVariant}
      fullWidth={fullWidth}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
});

FollowButton.displayName = 'FollowButton';

export default FollowButton;
