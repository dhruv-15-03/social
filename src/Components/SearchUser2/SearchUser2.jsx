import React, { useState, useCallback, useMemo } from 'react';
import { 
    Avatar, 
    Card, 
    Box, 
    TextField, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText,
    Typography,
    InputAdornment,
    Fade,
    CircularProgress
} from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../../Redux/Auth/auth.actiion';
import { createChat } from '../../Redux/Messages/Message.action';

const SearchUser2 = React.memo(() => {
    const [userName, setUserName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);

    const handleSearchUser = useCallback(async (e) => {
        const value = e.target.value;
        setUserName(value);
        
        if (value.trim()) {
            setIsSearching(true);
            try {
                await dispatch(searchUser(value));
            } finally {
                setIsSearching(false);
            }
        }
    }, [dispatch]);

    const handleUserClick = useCallback((userId) => {
        dispatch(createChat(userId));
        setUserName("");
    }, [dispatch]);

    const searchResults = useMemo(() => {
        return userName.trim() ? auth.searchUser || [] : [];
    }, [userName, auth.searchUser]);

    const showResults = userName.trim() && searchResults.length > 0;
    const showNoResults = userName.trim() && !isSearching && searchResults.length === 0;

    return (
        <Box sx={{ position: 'relative', mb: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
                value={userName}
                onChange={handleSearchUser}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '25px',
                        backgroundColor: 'background.paper',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                            },
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                            },
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: isSearching && (
                        <InputAdornment position="end">
                            <CircularProgress size={20} />
                        </InputAdornment>
                    ),
                }}
            />

            {(showResults || showNoResults) && (
                <Fade in={true} timeout={300}>
                    <Card
                        elevation={8}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            mt: 1,
                            maxHeight: '300px',
                            overflow: 'auto',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        {showResults ? (
                            <List disablePadding>
                                {searchResults.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        button
                                        onClick={() => handleUserClick(user.id)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                            borderBottom: '1px solid',
                                            borderBottomColor: 'divider',
                                            '&:last-child': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={user.profilePicture || user.profile}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                {user.name?.[0]?.toUpperCase() || <Person />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {user.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                    @{user.userName}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Person color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    No users found
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Fade>
            )}
        </Box>
    );
});

SearchUser2.displayName = 'SearchUser2';

export default SearchUser2;