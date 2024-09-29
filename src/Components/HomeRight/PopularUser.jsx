import React, { useEffect } from 'react'
import {Avatar, Button} from '@mui/material';
import {CardHeader} from '@mui/material';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { isFollowBy } from '../../Pages/Util2/isFollow';
import { useDispatch, useSelector } from 'react-redux';
import { follow,getFollowers } from '../../Redux/Profile/profileaction';

const PopularUser = ({item}) => {
  const {auth,profile}=useSelector(store=>store)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleAvatarClick=()=>{
    navigate(`/profile/${item.id}`)
  }
  const [isLiked, setIsLiked] = React.useState(false );
  useEffect(() => {
    if (item) {
      dispatch(getFollowers(item.id)); 
    }
  }, [dispatch, item,isLiked]);

  useEffect(() => {
    if (item && profile) {
      const userIsFollowed = isFollowBy(profile.followers, auth?.user?.id); 
      setIsLiked(userIsFollowed);
    }
  }, [profile, auth?.user?.id, item]);

  const handleClick=async()=>{
    await dispatch(follow(item.id))
    setIsLiked((prevLiked) => !prevLiked);
  }

  return (
    <div>
        <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500],cursor:'pointer' }} aria-label="recipe" onClick={() => handleAvatarClick(item.id)}>
          {item.profile?item.profile:item.name[0]}
          </Avatar>
        }
        action={
          <Button size='small' onClick={handleClick}>
            {isLiked?'UnFollow':'Follow'}
          </Button>
        }
        title={item.name}
        subheader={item.userName}
      />
    </div>
  )
}

export default PopularUser