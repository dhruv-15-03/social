import {Button, CardActions, CardContent, Divider, IconButton, Menu, MenuItem, Typography}  from '@mui/material'
import { orange, red } from '@mui/material/colors'
import React from 'react'
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
import TextDisplay from './TextDisplay';


const PostCard = ({ item }) => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [isLiked, setIsLiked] = React.useState(() =>
    isLikedBy(auth.user?.id, item)
  );
  const [isSaved, setIsSaved] = React.useState(() =>
    isSavedBy(auth.user?.id, item)
  );
  const [showComments, setShowComments] = React.useState(false);
  const [val, setVal] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLikePost = () => {
    dispatch(likePostAction(item.postID));
    setIsLiked((prevLiked) => !prevLiked); 
  };

  const handleSavePost = () => {
    dispatch(savePostAction(item.postID));
    setIsSaved((prevSaved) => !prevSaved); 
  };

  const handleCreateComment = (comment) => {
    const reqData = {
      postId: item.postID,
      data: {
        comment,
      },
    };
    setVal('');
    dispatch(createCommentAction(reqData));
  };

  const handleDeletePost = () => {
    dispatch(deletePostAction(item.postID));
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card className=''>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {item.user?.profile?item.user.profile:item.user?.name[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
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
        title={item.user.name}
        subheader={'@' + item.user.userName}
      />
      {item.image?<img
        className='w-full max-h-[30rem] object-cover object-top'
        src={item.image}
        alt=''
      />:item.video?<video controls loop src={item.video} className='w-full h-full'></video>:<div className=''><TextDisplay item={item.post}/></div>}
      <CardContent>
        <Typography variant='body2' color='text.secondary'>
          {item.caption}
        </Typography>
      </CardContent>
      <CardActions className='flex justify-between' disableSpacing>
        <div>
          <IconButton onClick={handleLikePost}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={() => setShowComments((prev) => !prev)}>
            <ChatBubbleIcon />
          </IconButton>
        </div>
        <div>
          <IconButton onClick={handleSavePost}>
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </div>
      </CardActions>
      {showComments && (
        <section>
          <div className='flex items-center mx-3 my-5 space-x-5'>
            <Avatar sx={{}}>{}</Avatar>
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && val.trim()) {
                  handleCreateComment(val);
                }
              }}
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
};


export default PostCard