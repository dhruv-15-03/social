import React from "react";
import {navigationMenu} from "./SidebarNavigation";
import { Avatar, Button, Card, Divider,Menu,MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../Redux/Auth/auth.actiion";
const Sidebar=()=>{
     const dispatch=useDispatch()
     const {auth}=useSelector(store=>store)
     const navigate=useNavigate();
     const handleNavigate=(item)=>{
          if(item.title==="Profile"){
               navigate(`/profile/${auth.user?.id}`)
          }
          else{
               navigate(item.path)
          }
     }
     const[anchorEl,setAnchorEl]=React.useState(null);
     const open=Boolean(anchorEl);
     const handleClick=(event)=>{
          setAnchorEl(event.currentTarget);
     };
     const handleClose=()=>{
          dispatch(logoutAction())
          setAnchorEl(null);
          navigate('/login')
          window.location.reload()   
     }
     return (
         <Card className='flex flex-col justify-between h-screen py-5 card '>
              <div className="pl-5 space-y-8">
                   <div className="flex justify-center pl-0">
                             <h1 className="text-xl italic text-[200%] font-bold logo ">Thoughts</h1>    
                   </div>
                  <div className="space-y-8">
                      {navigationMenu.map((item)=><div onClick={()=>handleNavigate(item)} className="flex items-center space-x-3 cursor-pointer">
                          {item.icon}
                          <p className="text-xl">{item.title}</p>
                      </div>)}
                  </div>
                  <div className="fixed w-[20%] bottom-0">
                   <Divider className="pl-0"/>
                    <div className="flex pt-5 pl-5 items-centre">
                         <div className="flex space-x-3 items-centre">
                              <Avatar src={auth.user?.profile}></Avatar>
                         </div>
                         <div className="pl-10">
                              <p className="font-bold">{auth.user?.name}</p>
                              <p className="opacity-70">{"@"+auth.user?.userName}</p>
                         </div>
                         <Button
                         id="basic-button"
                         aria-controls={open?'basic-menu':undefined}
                         aria-haspopup="true"
                         aria-expanded={open?'true':undefined}
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
                              'aria-labelledby':'basic-button'
                         }}
                         >
                              <MenuItem onClick={handleClose}>LogOut</MenuItem>

                         </Menu>
                         
                    </div>
                  </div>
              </div>
         </Card>
     )
}
export default Sidebar