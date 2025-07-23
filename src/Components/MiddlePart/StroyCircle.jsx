import React, { useEffect } from 'react'
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../Redux/Auth/auth.actiion';
import Render from './Render';

const StroyCircle = ({item}) => {
  const [open, setOpen] = React.useState(false);
  const {auth}=useSelector(store=>store)
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getUser(item.id))
  },[dispatch, item.id])
  const handleCloseRender = () =>setOpen(false);
    const handleOpenRender = () => {
        setOpen(true);
    };
  return (
    <div>
        <div className="flex flex-col mr-4 items-centre">
                    <Avatar
                    sx={{width:"5rem",height:"5rem",cursor:'pointer'}}
                    onClick={handleOpenRender}
                    >
                      {item?.profile && item?.profile}
                      </Avatar>
                      <p  className='flex items-center justify-center'>{item?.userName}</p>
                </div>
                <div>
                <Render items={auth.usStory} open={open} onClose={handleCloseRender}  />
                </div>
    </div>
  )
}

export default StroyCircle