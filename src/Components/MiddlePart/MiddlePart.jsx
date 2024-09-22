import { Avatar, Card, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import StroyCircle from "./StroyCircle";
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import ArticleIcon from "@mui/icons-material/Article";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../CreatePost/CreatePostModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../Redux/Post/post.action";
import { yellow } from "@mui/material/colors";
const story=[1,1,1,1,1]
const MiddlePart=()=>{
    const {auth}=useSelector(store=>store)
    console.log(auth.user)
    const dispatch=useDispatch();
    const {post}=useSelector(store=>store)
    const[openCreatePostModal,setOpenCreatePostModal]=React.useState(false);
    const handleCloseCreatePostModal=()=>setOpenCreatePostModal(false)
    const handleOpenCreatePostModal=()=>{
        setOpenCreatePostModal(true);
    };
    
    useEffect(()=>{
        dispatch(getAllPostAction())
    },[post.newComment]);
    return(
        <div className="px-20">
            <section>
            <div className="flex p-5 items-centre rounded-b-md">
                <div className="flex flex-col mr-4 cursor-pointer items-centre">
                    <Avatar sx={{width:"5rem",height:"5rem"}}
                    >
                        <AddIcon sx={{fontsize:"3rem"}}/>
                    </Avatar>
                    <p className="pl-6">New</p>

                </div>
                {story.map((item)=><StroyCircle/>)}
            </div>   
            </section>
            <Card className="p-5 mt-5">
                <div className="flex justify-between">
                    <Avatar sx={{bgcolor:yellow[600]}}>
                        {auth.user?.name[0]?auth.user?.name[0]:'O'}
                    </Avatar>
                    <input onClick={handleOpenCreatePostModal} readOnly className="outline-none w-[90%] rounded-full px-5 bg-transparent border-[#3b4054] border" type="text" placeholder="New Post"/>
                    
                </div>
                <div className="flex justify-center mt-5 space-x-9">
                    <div className="flex items-center">
                        <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                            <ImageIcon/>
                        </IconButton>
                        <span>media</span>
                    </div>
                    <div className="flex items-center">
                        <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                            <VideocamIcon/>
                        </IconButton>
                        <span>Video</span>
                    </div>
                    <div className="flex items-center">
                        <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                            <ArticleIcon/>
                        </IconButton>
                        <span>Write Thoughts...</span>
                    </div>
                </div>
            </Card>
            <div className="mt-5 space-y-5">
                {post.posts.map((item)=><PostCard item={item}/>)}
            </div>
            <div>
                <CreatePostModal handleClose={handleCloseCreatePostModal} open={openCreatePostModal}/>
            </div>
        </div>
    )
}
export default MiddlePart