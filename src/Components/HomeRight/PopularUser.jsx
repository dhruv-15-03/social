import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { CardHeader } from '@mui/material';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { isFollowBy } from '../../Pages/Util2/isFollow';
import { useDispatch, useSelector } from 'react-redux';
import { follow, getFollowers } from '../../Redux/Profile/profileaction';

const PopularUser = ({ item }) => {
  const { auth, profile } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    if (item) {
      setLoading(true); 
      dispatch(getFollowers(item.id)).then(() => {
        setLoading(false);
        const userIsFollowed = isFollowBy(profile.followers, auth?.user?.id);
        setIsLiked(userIsFollowed);
      });
    }
  }, [dispatch, item.id]);
  const handleAvatarClick = () => {
    navigate(`/profile/${item.id}`);
  };

  const handleClick = async () => {
    await dispatch(follow(item.id));
    setIsLiked((prevLiked) => !prevLiked);
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500], cursor: 'pointer' }} aria-label="recipe" onClick={handleAvatarClick}>
            {item.profile ? item.profile : item.name[0]}
          </Avatar>
        }
        action={
          <Button size="small" onClick={handleClick} disabled={loading}>
            { isLiked ? 'Unfollow' : 'Follow'}
          </Button>
        }
        title={item.name}
        subheader={item.userName}
      />
    </div>
  );
};

export default PopularUser;

