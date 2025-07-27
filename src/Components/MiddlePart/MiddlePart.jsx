import { Avatar, Box, Card, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import AddIcon from '@mui/icons-material/Add';
import StoryCircle from "./StoryCircle";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../Redux/Post/post.action";
import { yellow } from "@mui/material/colors";
import CreateStoryModal from "../CreateSTory/CreateStoryModal";
import { authStory, users } from "../../Redux/Auth/auth.actiion";
import Render from "./Render";

const MiddlePart = React.memo(() => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const { post } = useSelector(store => store);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
    const handleCloseCreatePostModal = useCallback(() => {
        setOpenCreatePostModal(false);
    }, []);
    const handleOpenCreatePostModal = useCallback(() => {
        setOpenCreatePostModal(true);
    }, []);

    const [openCreateStoryModal, setOpenCreateStoryModal] = useState(false);
    const handleCloseCreateStoryModal = useCallback(() => {
        setOpenCreateStoryModal(false);
    }, []);
    const handleOpenCreateStoryModal = useCallback(() => {
        setOpenCreateStoryModal(true);
    }, []);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(authStory());
        dispatch(users());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllPostAction());
    }, [dispatch]);
    const handleCloseRender = useCallback(() => {
        setOpen(false);
    }, []);
    const handleOpenRender = useCallback(() => {
        setOpen(true);
    }, []);
    
    const memoizedPosts = useMemo(() => {
        return post.posts?.map((item) => (
            <PostCard key={item.postID || item.id} item={item} />
        ));
    }, [post.posts]);

    return (
        <div className="px-4 sm:px-8 lg:px-20">
            <section>
                <div className="flex p-2 sm:p-5 items-centre rounded-b-md">
                    <div className="flex flex-row mr-4 cursor-pointer items-centre">
                        <Box sx={{ position: "relative", display: "inline-block" }}>
                            <Avatar
                                sx={{
                                    width: isMobile ? "4rem" : "5rem",
                                    height: isMobile ? "4rem" : "5rem",
                                    borderStyle: 'groove',
                                    borderColor: "#f70776",
                                    borderWidth: auth.My_story?.length > 0 ? "4px" : "0",
                                    borderRadius: "50%",
                                    marginRight:'4px'
                                }}
                                onClick={handleOpenRender}
                            >
                                {auth.user?.profile}
                            </Avatar>
                            <AddIcon
                                onClick={handleOpenCreateStoryModal}
                                sx={{
                                    position: "absolute",
                                    bottom: "0",
                                    right: "0",
                                    fontSize: isMobile ? "1.8rem" : "2.2rem",
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
                        <StoryCircle item={item} key={index} />
                        ))}
                        </div>
                    </div>
                </div>
            </section>
            <Card className="w-full p-3 sm:p-5 mt-3 sm:mt-5">
                <div className="flex justify-between">
                    <Avatar sx={{ 
                        bgcolor: yellow[600],
                        width: isMobile ? 40 : 48,
                        height: isMobile ? 40 : 48
                    }}>
                        {auth.user?.name[0] ? auth.user?.name[0] : 'O'}
                    </Avatar>
                    <input 
                        onClick={handleOpenCreatePostModal} 
                        readOnly 
                        className="outline-none w-full ml-2 sm:ml-3 rounded-full px-3 sm:px-5 py-2 bg-transparent border-[#3b4054] border" 
                        type="text" 
                        placeholder="New Post" 
                        style={{ fontSize: isMobile ? '14px' : '16px' }}
                    />
                </div>
                <div className="flex justify-center mt-3 sm:mt-5 space-x-4 sm:space-x-9">
                    <div className="flex items-center">
                        <IconButton 
                            color="primary" 
                            onClick={handleOpenCreatePostModal}
                            size={isMobile ? "small" : "medium"}
                        >
                            <ImageIcon />
                        </IconButton>
                        <span style={{ fontSize: isMobile ? '12px' : '14px' }}>media</span>
                    </div>
                    <div className="flex items-center">
                        <IconButton 
                            color="primary" 
                            onClick={handleOpenCreatePostModal}
                            size={isMobile ? "small" : "medium"}
                        >
                            <VideocamIcon />
                        </IconButton>
                        <span style={{ fontSize: isMobile ? '12px' : '14px' }}>Video</span>
                    </div>
                    <div className="flex items-center">
                        <IconButton 
                            color="primary" 
                            onClick={handleOpenCreatePostModal}
                            size={isMobile ? "small" : "medium"}
                        >
                            <ArticleIcon />
                        </IconButton>
                        <span style={{ fontSize: isMobile ? '12px' : '14px' }}>Thoughts</span>
                    </div>
                </div>
            </Card>
            <div className="mt-3 sm:mt-5 space-y-3 sm:space-y-5">
                {memoizedPosts}
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
});

MiddlePart.displayName = 'MiddlePart';

export default MiddlePart;
