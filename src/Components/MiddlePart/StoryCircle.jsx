import React, { useEffect, useCallback, useMemo } from 'react';
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../Redux/Auth/auth.actiion';
import Render from './Render';

const StoryCircle = React.memo(({ item }) => {
  const [open, setOpen] = React.useState(false);
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser(item.id));
  }, [dispatch, item.id]);

  const handleCloseRender = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenRender = useCallback(() => {
    setOpen(true);
  }, []);

  // Memoized avatar display
  const avatarContent = useMemo(() => {
    return item?.profile || item?.userName?.[0] || '';
  }, [item?.profile, item?.userName]);

  // Memoized username display
  const displayName = useMemo(() => {
    return item?.userName || 'Unknown';
  }, [item?.userName]);

  return (
    <div>
      <div className="flex flex-col mr-4 items-center">
        <Avatar
          sx={{ width: "5rem", height: "5rem", cursor: 'pointer' }}
          onClick={handleOpenRender}
        >
          {avatarContent}
        </Avatar>
        <p className='flex items-center justify-center'>{displayName}</p>
      </div>
      <div>
        <Render 
          items={auth.usStory} 
          open={open} 
          onClose={handleCloseRender}  
        />
      </div>
    </div>
  );
});

StoryCircle.displayName = 'StoryCircle';

export default StoryCircle;