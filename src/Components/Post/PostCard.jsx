import {Button, CardActions, CardContent, Divider, IconButton, Menu, MenuItem, Typography, Box}  from '@mui/material'
import { orange, red } from '@mui/material/colors'
import React, { useCallback, useMemo } from 'react'
import {Avatar} from '@mui/material';
import {Card} from '@mui/material';
import {CardHeader} from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert"
import  FavoriteIcon  from '@mui/icons-material/Favorite';
import FavoriteBorderIcon  from '@mui/icons-material/FavoriteBorder';
import ShareIcon from "@mui/icons-material/Share"
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { useDispatch, useSelector } from 'react-redux';
import { createCommentAction, deletePostAction, likePostAction, savePostAction } from '../../Redux/Post/post.action';
import { isLikedBy } from '../utils/isLiked';
import { isSavedBy } from '../utils/isSaved';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import TextDisplay from './TextDisplay';
import LazyImage from '../UI/LazyImage';


const PostCard = React.memo(({ item }) => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const { isMobile } = useResponsiveLayout();

  // Memoized initial states to avoid expensive calculations on every render
  const initialIsLiked = useMemo(() => isLikedBy(auth.user?.id, item), [auth.user?.id, item]);
  const initialIsSaved = useMemo(() => isSavedBy(auth.user?.id, item), [auth.user?.id, item]);

  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [isSaved, setIsSaved] = React.useState(initialIsSaved);
  const [showComments, setShowComments] = React.useState(false);
  const [val, setVal] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const open = Boolean(anchorEl);

  // Memoized handlers to prevent unnecessary re-renders
  const handleLikePost = useCallback(() => {
    dispatch(likePostAction(item.postID));
    setIsLiked((prevLiked) => !prevLiked); 
  }, [dispatch, item.postID]);

  const handleSavePost = useCallback(() => {
    dispatch(savePostAction(item.postID));
    setIsSaved((prevSaved) => !prevSaved); 
  }, [dispatch, item.postID]);

  const handleCreateComment = useCallback((comment) => {
    const reqData = {
      postId: item.postID,
      data: {
        comment,
      },
    };
    setVal('');
    dispatch(createCommentAction(reqData));
  }, [dispatch, item.postID]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeletePost = useCallback(() => {
    dispatch(deletePostAction(item.postID));
    handleClose();
  }, [dispatch, item.postID, handleClose]);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((e) => {
    setVal(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && val.trim()) {
      handleCreateComment(val);
    }
  }, [val, handleCreateComment]);

  // Memoized avatar display name
  const avatarDisplayName = useMemo(() => {
    return item.user?.profile || item.user?.name?.[0] || '';
  }, [item.user?.profile, item.user?.name]);

  // Memoized media content with lazy loading
  const mediaContent = useMemo(() => {
    if (item.image) {
      return (
        <LazyImage
          src={item.image}
          alt={`Post by ${item.user?.name || 'User'}`}
          className='w-full max-h-[30rem] object-cover object-top'
          errorFallback={
            <div className='w-full h-64 bg-gray-200 flex items-center justify-center'>
              <span className='text-gray-500'>Image failed to load</span>
            </div>
          }
        />
      );
    }
    if (item.video) {
      return (
        <video 
          controls 
          loop 
          src={item.video} 
          className='w-full h-full'
          preload='metadata'
        />
      );
    }
    return (
      <div className=''>
        <TextDisplay item={item.post} />
      </div>
    );
  }, [item.image, item.video, item.post, item.user?.name]);

  return (
    <Card 
      sx={{ 
        mb: isMobile ? 1 : 2,
        borderRadius: isMobile ? 2 : 3,
        boxShadow: isMobile ? 1 : 3,
        overflow: 'hidden'
      }}
    >
      <CardHeader
        avatar={
          <Avatar 
            sx={{ 
              bgcolor: red[500],
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40
            }} 
            aria-label="recipe"
          >
            {avatarDisplayName}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" size={isMobile ? "small" : "medium"}>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              size={isMobile ? "small" : "medium"}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
            </Menu>
          </IconButton>
        }
        title={
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            fontWeight={600}
          >
            {item.user.name}
          </Typography>
        }
        subheader={
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="text.secondary"
          >
            {'@' + item.user.userName}
          </Typography>
        }
        sx={{ 
          pb: isMobile ? 1 : 2,
          '& .MuiCardHeader-content': {
            overflow: 'hidden'
          }
        }}
      />
      
      {/* Media Content */}
      <Box sx={{ 
        position: 'relative',
        '& img, & video': {
          width: '100%',
          display: 'block'
        }
      }}>
        {mediaContent}
      </Box>
      
      {/* Caption */}
      {item.caption && (
        <CardContent sx={{ py: isMobile ? 1 : 2, px: isMobile ? 2 : 3 }}>
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            color='text.secondary'
            sx={{
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}
          >
            {item.caption}
          </Typography>
        </CardContent>
      )}
      
      {/* Actions */}
      <CardActions 
        sx={{ 
          justifyContent: 'space-between',
          px: isMobile ? 2 : 3,
          py: isMobile ? 1 : 2
        }} 
        disableSpacing
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleLikePost}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: isLiked ? red[500] : 'inherit',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton size={isMobile ? "small" : "medium"}>
            <ShareIcon />
          </IconButton>
          <IconButton 
            onClick={handleToggleComments}
            size={isMobile ? "small" : "medium"}
          >
            <ChatBubbleIcon />
          </IconButton>
        </Box>
        <IconButton 
          onClick={handleSavePost}
          size={isMobile ? "small" : "medium"}
          sx={{ 
            color: isSaved ? orange[500] : 'inherit',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
      {showComments && (
        <section>
          <div className='flex items-center mx-3 my-5 space-x-5'>
            <Avatar sx={{}}>{}</Avatar>
            <input
              value={val}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className='w-full outline-none bg-transparent border border-[#3b4050] rounded-full px-5 py-2'
              type='text'
              placeholder='Write your comment'
            />
          </div>
          <Divider />
          <div className='mx-3 my-5 space-y-2 text-xs'>
            {item.comments?.map((comment, index) => (
              <div key={index} className='flex items-center space-x-5'>
                <Avatar
                  sx={{
                    height: '2rem',
                    width: '2rem',
                    fontSize: '0.8rem',
                    bgcolor: orange[400],
                  }}
                >
                  {comment.user}
                </Avatar>
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard