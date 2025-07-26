import React, { useState, useCallback, useMemo } from "react";
import { navigationMenu } from "./SidebarNavigation";
import { Avatar, Button, Card, Divider, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../Redux/Auth/auth.actiion";

const Sidebar = React.memo(() => {
     const dispatch = useDispatch();
     const { auth } = useSelector(store => store);
     const navigate = useNavigate();
     
     const [anchorEl, setAnchorEl] = useState(null);
     const open = Boolean(anchorEl);

     // Memoized handlers for stable references
     const handleNavigate = useCallback((item) => {
          if (item.title === "Profile") {
               navigate(`/profile/${auth.user?.id}`);
          } else {
               navigate(item.path);
          }
     }, [navigate, auth.user?.id]);

     const handleClick = useCallback((event) => {
          setAnchorEl(event.currentTarget);
     }, []);

     const handleClose = useCallback(() => {
          dispatch(logoutAction());
          setAnchorEl(null);
          navigate('/login');
          window.location.reload();
     }, [dispatch, navigate]);

     // Memoized user profile data
     const userProfile = useMemo(() => ({
          name: auth.user?.name || '',
          userName: auth.user?.userName || '',
          profileImage: auth.user?.profile || ''
     }), [auth.user?.name, auth.user?.userName, auth.user?.profile]);

     // Memoized navigation items
     const navigationItems = useMemo(() => 
          navigationMenu.map((item) => (
               <div 
                    key={item.title}
                    onClick={() => handleNavigate(item)} 
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
               >
                    {item.icon}
                    <p className="text-xl">{item.title}</p>
               </div>
          ))
     , [handleNavigate]);
     return (
         <Card className='flex flex-col justify-between h-screen py-5 card'>
              <div className="pl-5 space-y-8">
                   <div className="flex justify-center pl-0">
                        <h1 className="text-xl italic text-[200%] font-bold logo">Thoughts</h1>    
                   </div>
                   <div className="space-y-8">
                        {navigationItems}
                   </div>
                   <div className="fixed w-[20%] bottom-0">
                        <Divider className="pl-0"/>
                        <div className="flex pt-5 pl-5 items-center">
                             <div className="flex space-x-3 items-center">
                                  <Avatar 
                                       src={userProfile.profileImage}
                                       alt={userProfile.name}
                                  />
                             </div>
                             <div className="pl-10">
                                  <p className="font-bold">{userProfile.name}</p>
                                  <p className="opacity-70">{"@" + userProfile.userName}</p>
                             </div>
                             <Button
                                  id="basic-button"
                                  aria-controls={open ? 'basic-menu' : undefined}
                                  aria-haspopup="true"
                                  aria-expanded={open ? 'true' : undefined}
                                  onClick={handleClick}
                             >
                                  <MoreVertIcon/>
                             </Button>
                             <Menu
                                  id="basic-menu"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  MenuListProps={{
                                       'aria-labelledby': 'basic-button'
                                  }}
                             >
                                  <MenuItem onClick={handleClose}>LogOut</MenuItem>
                             </Menu>
                        </div>
                   </div>
              </div>
         </Card>
     );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;