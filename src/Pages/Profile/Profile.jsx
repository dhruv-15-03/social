import React, { useEffect } from "react";
import { Avatar, Box, Button, Card, Tab, Tabs } from "@mui/material";
import PostCard from "../../Components/Post/PostCard";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { likedPostAction, savedPostAction } from "../../Redux/Post/post.action";
import { useParams } from "react-router-dom";
import { follow, getFollowers, getFollowing, getPost, userPro, userReels } from "../../Redux/Profile/profileaction";
import { isFollowBy } from "../Util2/isFollow.js";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
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
    const { isMobile } = useResponsiveLayout();

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

      const isOwnProfile = () => {
        if (!auth.user?.id || !userId) return false;
        return String(auth.user.id) === String(userId);
      }
      
      
    return(
        <div style={{ 
            padding: isMobile ? '8px' : '24px',
            maxWidth: isMobile ? '100%' : '800px',
            margin: '0 auto'
        }}>
            <Card 
                sx={{ 
                    borderRadius: isMobile ? 2 : 3,
                    boxShadow: isMobile ? 1 : 3,
                    mb: isMobile ? 2 : 0
                }}
            >
                {/* Cover Image */}
                <Box sx={{ 
                    height: isMobile ? '180px' : '240px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <img 
                        className="w-full h-full object-cover"
                        src={profile.user?.profile || "https://via.placeholder.com/800x300?text=No+Cover+Image"}
                        alt="Profile Cover"
                        style={{ filter: 'brightness(0.9)' }}
                    />
                </Box>

                {/* Profile Header */}
                <Box sx={{ px: isMobile ? 2 : 4, pt: 1, pb: 2 }}>
                    {/* Avatar and Action Button */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                        transform: `translateY(${isMobile ? '-40px' : '-60px'})`
                    }}>
                        <Avatar
                            sx={{
                                width: isMobile ? "80px" : "120px",
                                height: isMobile ? "80px" : "120px",
                                fontSize: isMobile ? '28px' : '42px',
                                backgroundColor: '#1976d2',
                                border: '4px solid white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        >
                            {profile.user?.name?.[0] || 'U'}
                        </Avatar>
                        
                        <Box sx={{ mt: isMobile ? 1 : 2 }}>
                            {isOwnProfile() ? (
                                <Button 
                                    onClick={handleOpenProfileModal} 
                                    variant="outlined"
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                        borderRadius: "25px",
                                        px: isMobile ? 2 : 3,
                                        fontWeight: 600,
                                        textTransform: 'none'
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Button 
                                    variant={isLiked ? "outlined" : "contained"}
                                    size={isMobile ? "small" : "medium"}
                                    onClick={handleClick}
                                    sx={{
                                        borderRadius: "25px",
                                        px: isMobile ? 2 : 3,
                                        fontWeight: 600,
                                        textTransform: 'none'
                                    }}
                                >
                                    {isLiked ? 'Unfollow' : 'Follow'}
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* User Info */}
                    <Box sx={{ mb: 3, mt: isMobile ? -2 : -3 }}>
                        <h1 style={{ 
                            fontSize: isMobile ? '1.5rem' : '2rem',
                            fontWeight: 700,
                            margin: '0 0 4px 0'
                        }}>
                            {profile.user?.name || 'User Name'}
                        </h1>
                        <p style={{
                            fontSize: isMobile ? '0.875rem' : '1rem',
                            color: '#666',
                            margin: '0 0 16px 0'
                        }}>
                            @{profile.user?.userName || 'username'}
                        </p>
                        
                        {/* Stats */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: isMobile ? 3 : 4,
                            my: 2
                        }}>
                            <Box>
                                <Box sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                                    {profile.posts?.length || 0}
                                </Box>
                                <Box sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#666' }}>
                                    Posts
                                </Box>
                            </Box>
                            <Box>
                                <Box sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                                    {profile.followers?.length || 0}
                                </Box>
                                <Box sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#666' }}>
                                    Followers
                                </Box>
                            </Box>
                            <Box>
                                <Box sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                                    {profile.following?.length || 0}
                                </Box>
                                <Box sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#666' }}>
                                    Following
                                </Box>
                            </Box>
                        </Box>
                        
                        {/* Bio */}
                        {profile.user?.bio && (
                            <p style={{
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                margin: '16px 0 0 0'
                            }}>
                                {profile.user.bio}
                            </p>
                        )}
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons={isMobile ? "auto" : false}
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                        }}
                    >
                        {tabs.map((item) => (
                            <Tab 
                                key={item.value}
                                value={item.value} 
                                label={item.name}
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Content */}
                <Box sx={{ p: isMobile ? 1 : 2 }}>
                    {value === "post" && (
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? 1 : 2,
                            maxWidth: '100%'
                        }}>
                            {profile.posts?.map((item) => (
                                <PostCard key={item.id || Math.random()} item={item} />
                            ))}
                        </Box>
                    )}
                    
                    {value === "reels" && (
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: isMobile 
                                ? 'repeat(auto-fit, minmax(150px, 1fr))'
                                : 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: isMobile ? 1 : 2
                        }}>
                            {profile.userReel?.map((item) => (
                                <PostCard key={item.id || Math.random()} item={item} />
                            ))}
                        </Box>
                    )}
                    
                    {value === "liked" && (
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? 1 : 2
                        }}>
                            {post.liked?.map((item) => (
                                <PostCard key={item.id || Math.random()} item={item} />
                            ))}
                        </Box>
                    )}
                    
                    {value === "saved" && (
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? 1 : 2
                        }}>
                            {post.saved?.map((item) => (
                                <PostCard key={item.id || Math.random()} item={item} />
                            ))}
                        </Box>
                    )}
                    
                    {value === "repost" && (
                        <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                            <p>Reposted items will be shown here...</p>
                        </Box>
                    )}
                </Box>
            </Card>

            {/* Profile Modal */}
            <ProfileModal open={open} handleClose={handleClose}/>
        </div>
    )
}
export default Profile