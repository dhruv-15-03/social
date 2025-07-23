import React, { useEffect } from "react";
import { Avatar, Box, Button, Card, Tab, Tabs } from "@mui/material";
import PostCard from "../../Components/Post/PostCard";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { likedPostAction, savedPostAction } from "../../Redux/Post/post.action";
import { useParams } from "react-router-dom";
import { follow, getFollowers, getFollowing, getPost, userPro, userReels } from "../../Redux/Profile/profileaction";
import { isFollowBy } from "../Util2/isFollow.js";
const tabs=[
    {value:"post",name:"Post"},
    {value:"reels",name:"Reels"},
    {value:"liked",name:"Liked"},
    {value:"saved",name:"Saved"},
    {value:"repost",name:"Repost"},
    
]

const Profile=()=>{
    const {userId}=useParams();
    const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(userPro(userId))
      },[dispatch,userId])
    const [value, setValue] = React.useState('post');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      const {auth,post,profile}=useSelector(store=>store)
      
      
      useEffect(() => {
        if (value === "liked") {
            dispatch(likedPostAction())
        }
        else if (value === "post") {
            dispatch((getFollowing(userId)))
            dispatch((getFollowers(userId)))
            dispatch((getPost(userId)))
        }
        else if (value === "saved") {
            dispatch((savedPostAction()))
        }
        else if(value==="reels"){
            dispatch(userReels(userId))
        }
      }, [value,dispatch,userId]);

      
      const [isLiked, setIsLiked] = React.useState(false );
      useEffect(() => {
        if (profile?.user?.followers) {
            const userIsFollowed = isFollowBy(profile.user.followers, auth?.user?.id);
            setIsLiked(userIsFollowed);
        }
      }, [profile, auth?.user?.id]);

      const handleClick=()=>{
        dispatch(follow(userId))
        setIsLiked((prevLiked) => !prevLiked);
        dispatch(userPro(userId));
      }
      const [open, setOpen] = React.useState(false);
      const handleOpenProfileModal= () => setOpen(true);
      const handleClose = () => {
        setOpen(false);
        window.location.reload()
    }
      
      
    return(
        <Card className="my-10 w-[70%]">
            <div className="rounded-md">
                <div className="h-[15rem]">
                    <img 
                    className="w-full h-full rounded-md"
                    src={profile.user?.profile}
                    alt="No Profile Selected Till Yet"
                    />
                </div>
                <div className="px-5 flex justify-between items-start mt-5 h-[5rem]">
                    <Avatar
                    className="transform -translate-y-24"
                    sx={{width:"10rem",height:"10rem",fontSize:'55px',backgroundColor:'#8dc6ff'}}
                    >
                        {profile.user?.name[0]}
                    </Avatar>
                    {(userId===auth.user?.id)?<Button onClick={handleOpenProfileModal} sx={{borderRadius:"20px"}} variant="outlined">Edit Profile</Button>:<Button sx={{borderRadius:"20px",cursor:'pointer'}} variant="outlined" onClick={handleClick}>{isLiked?'UnFollow':'Follow'}</Button>}
                    
                </div>
                <div className="p-5">
                    <div>
                        <h1 className="py-1 text-xl font-bold">{profile.user?.name}</h1>
                        <p>{"@"+ profile.user?.userName}</p>
                    </div>
                    <div className="flex items-center gap-5 py-3">
                        <span>{profile.posts.length+" Post"}</span>
                        <span> {profile.followers?.length +" Followers"}</span>
                        <span>{profile.following?.length +" Following"}</span>
                    </div>
                    <div>
                        <p>{profile.user?.bio}</p>
                    </div>

                </div>
                <section>
                <Box sx={{ width: '100%' ,borderBottom:1,borderColor:"divider" }}>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    >
                    {tabs.map((item)=><Tab value={item.value} label={item.name} />)}
                    </Tabs>
                    </Box>
                    <div className="flex justify-center">
                        {value==="post"?(<div className="space-y-5 w-[70%] my-10 " >
                            {true&&profile.posts.map((item)=><div  className="border rounded-md border-slate-100">
                                <PostCard item={item}/>
                                </div>)}
                        </div>)
                        :value==="reels"?(<div className="flex-wrap justify-center gap-2 my-10 bg bg-blackflex ">
                            {profile.userReel.map((item)=><div  className="border rounded-md border-slate-100">
                                <PostCard item={item}/>
                                </div>)}
                        </div>):value==="liked"?(<div className="space-y-5 w-[70%] my-10 " >
                            {true&&post.liked.map((item)=><div  className="border rounded-md border-slate-100">
                                <PostCard item={item}/>
                                </div>)}
                        </div>) :value==="saved"?(<div className="space-y-5 w-[70%] my-10 ">
                            {post.saved.map((item)=><div className="border rounded-md border-slate-100">
                                <PostCard item={item}/>
                                </div>)}
                        </div>) :(
                            <div>Reposted Items will be shown here..</div>
                        )}
                    </div>
                </section>

            </div>
            <section>
                <ProfileModal open={open} handleClose={handleClose}/>
            </section>
        </Card>
    )
}
export default Profile