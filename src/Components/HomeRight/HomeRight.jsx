import React, { useEffect, useState, useMemo, useCallback } from "react";
import PopularUser from "./PopularUser";
import { Card, Box, Typography, Button, Skeleton, Fade } from "@mui/material";
import SearchUser2 from "../SearchUser2/SearchUser2";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, getFollowing } from "../../Redux/Profile/profileaction";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const HomeRight = React.memo(() => {
    const dispatch = useDispatch();
    const [showAll, setShowAll] = useState(false);
    const { profile, auth } = useSelector(store => store);

    // Memoized users to show
    const usersToShow = useMemo(() => {
        if (!profile.users) return [];
        return showAll ? profile.users : profile.users.slice(0, 5);
    }, [profile.users, showAll]);

    // Get users on component mount
    useEffect(() => {
        if (!profile.users?.length) {
            dispatch(getUsers());
        }
    }, [dispatch, profile.users?.length]);

    // Get following list for current user
    useEffect(() => {
        if (auth?.user?.id && !profile.following?.length) {
            dispatch(getFollowing(auth.user.id));
        }
    }, [dispatch, auth?.user?.id, profile.following?.length]);

    const handleViewAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    const isLoading = profile.loading;
    const hasUsers = profile.users?.length > 0;
    const showViewAllButton = profile.users?.length > 5;

    return (
        <Box sx={{ pr: 2 }}>
            <SearchUser2 />
            
            <Card 
                elevation={2}
                sx={{ 
                    p: 3, 
                    mt: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    mb: 3 
                }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '1.1rem'
                        }}
                    >
                        Suggestions For You
                    </Typography>
                    
                    {showViewAllButton && (
                        <Button
                            size="small"
                            onClick={handleViewAll}
                            startIcon={showAll ? <VisibilityOff /> : <Visibility />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.50'
                                }
                            }}
                        >
                            {showAll ? 'Show Less' : 'View All'}
                        </Button>
                    )}
                </Box>

                <Box sx={{ minHeight: '200px' }}>
                    {isLoading ? (
                        // Loading skeletons
                        Array.from({ length: 5 }).map((_, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="60%" height={20} />
                                        <Skeleton variant="text" width="40%" height={16} />
                                    </Box>
                                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                                </Box>
                            </Box>
                        ))
                    ) : hasUsers ? (
                        <Fade in={true} timeout={500}>
                            <Box>
                                {usersToShow.map((item) => (
                                    <PopularUser key={item.id} item={item} />
                                ))}
                            </Box>
                        </Fade>
                    ) : (
                        <Box 
                            sx={{ 
                                textAlign: 'center', 
                                py: 4,
                                color: 'text.secondary'
                            }}
                        >
                            <Typography variant="body2">
                                No suggestions available at the moment
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Card>
        </Box>
    );
});

HomeRight.displayName = 'HomeRight';

export default HomeRight;