import { Avatar, Box, Card, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import StroyCircle from "./StroyCircle";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../CreatePost/CreatePostModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../Redux/Post/post.action";
import { yellow } from "@mui/material/colors";
import CreateStoryModal from "../CreateSTory/CreateStoryModal";
import { authStory, users } from "../../Redux/Auth/auth.actiion";
import Render from "./Render";

const MiddlePart = () => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const { post } = useSelector(store => store);
    
    const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
    const handleCloseCreatePostModal = () => setOpenCreatePostModal(false);
    const handleOpenCreatePostModal = () => {
        setOpenCreatePostModal(true);
    };

    const [openCreateStoryModal, setOpenCreateStoryModal] = useState(false);
    const handleCloseCreateStoryModal = () => setOpenCreateStoryModal(false);
    const handleOpenCreateStoryModal = () => {
        setOpenCreateStoryModal(true);
    };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(authStory());
        dispatch(users());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllPostAction());
    }, [post.newComment,post.posts]);
    const handleCloseRender = () =>setOpen(false);
    const handleOpenRender = () => {
        setOpen(true);
    };
    return (
        <div className="px-20">
            <section>
                <div className="flex p-5 items-centre rounded-b-md">
                    <div className="flex flex-row mr-4 cursor-pointer items-centre">
                        <Box sx={{ position: "relative", display: "inline-block" }}>
                            <Avatar
                                sx={{
                                    width: "5rem",
                                    height: "5rem",
                                    borderStyle: 'groove',
                                    borderColor: "#f70776",
                                    borderWidth: auth.My_story?.length > 0 ? "4px" : "0",
                                    borderRadius: "50%",
                                    marginRight:'4px'
                                }}
                                onClick={handleOpenRender}
                            >
                                {auth.user?.profile && auth.user.profile}
                            </Avatar>
                            <AddIcon
                                onClick={handleOpenCreateStoryModal}
                                sx={{
                                    position: "absolute",
                                    bottom: "0",
                                    right: "0",
                                    fontSize: "2.2rem",
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                    padding: "0.2rem",
                                    color: "black",
                                }}
                            />
                        </Box>
                        <div
                            className="flex flex-col mr-4 space-x-4 overflow-x-auto hide-scrollbar"
                            style={{ maxWidth: '100%' }}
                        >
                        {auth.users?.map((item, index) => (
                        <StroyCircle item={item} key={index} />
                        ))}
                        </div>
                    </div>
                </div>
            </section>
            <Card className="w-[100%] p-5 mt-5">
                <div className="flex justify-between">
                    <Avatar sx={{ bgcolor: yellow[600] }}>
                        {auth.user?.name[0] ? auth.user?.name[0] : 'O'}
                    </Avatar>
                    <input 
                        onClick={handleOpenCreatePostModal} 
                        readOnly 
                        className="outline-none w-[100%] pl-2 rounded-full px-5 bg-transparent border-[#3b4054] border" 
                        type="text" 
                        placeholder="New Post" 
                    />
                </div>
                <div className="flex justify-center mt-5 space-x-9">
                    <div className="flex items-center">
                        <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                            <ImageIcon />
                        </IconButton>
                        <span>media</span>
                    </div>
                    <div className="flex items-center">
                        <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                            <VideocamIcon />
                        </IconButton>
                        <span>Video</span>
                    </div>
                    <div className="flex items-center">
                        <IconButton color="primary" onClick={handleOpenCreatePostModal}>
                            <ArticleIcon />
                        </IconButton>
                        <span>Write Thoughts...</span>
                    </div>
                </div>
            </Card>
            <div className="mt-5 space-y-5">
                {post.posts.map((item) => (
                    <PostCard key={item.id} item={item} />
                ))}
            </div>
            <div>
                <CreatePostModal handleClose={handleCloseCreatePostModal} open={openCreatePostModal} />
            </div>
            <div>
                <CreateStoryModal handleClose={handleCloseCreateStoryModal} open={openCreateStoryModal} />
            </div>
            <Render items={auth.My_story} open={open} onClose={handleCloseRender}  />
        </div>
    );
};

export default MiddlePart;
