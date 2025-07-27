import React, { useMemo } from 'react';
import {
    Avatar,
    Card,
    CardHeader,
    IconButton,
    Typography,
    Box,
    Badge,
    Chip,
    useTheme
} from '@mui/material';
import {
    MoreHoriz as MoreHorizIcon,
    Group as GroupIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserChatCard = React.memo(({ chat, unreadCount = 0, isSelected = false }) => {
    const { auth } = useSelector(store => store);
    const navigate = useNavigate();
    const theme = useTheme();
    // Memoized chat user data
    const chatUser = useMemo(() => {
        if (!chat) return null;
        
        const isGroupChat = chat.chats?.length > 2;
        if (isGroupChat) {
            return {
                name: chat.chatName || 'Group Chat',
                profile: null,
                isGroup: true,
                memberCount: chat.chats?.length || 0
            };
        }

        return auth.user?.id === chat.admin?.id 
            ? {
                name: chat.chats?.[0]?.name || 'Unknown User',
                profile: chat.chats?.[0]?.profile,
                id: chat.chats?.[0]?.id,
                isGroup: false
            }
            : {
                name: chat.admin?.name || 'Unknown User',
                profile: chat.admin?.profile,
                id: chat.admin?.id,
                isGroup: false
            };
    }, [chat, auth.user?.id]);

    // Last message info
    const lastMessage = useMemo(() => {
        const messages = chat?.message || [];
        if (messages.length === 0) return null;
        
        const lastMsg = messages[messages.length - 1];
        return {
            text: lastMsg.message || (lastMsg.image ? '📷 Photo' : ''),
            timestamp: lastMsg.timestamp,
            isOwn: lastMsg.user?.id === auth.user?.id,
            userName: lastMsg.user?.name
        };
    }, [chat?.message, auth.user?.id]);

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
            return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d`;
        }
    };

    const handleAvatarClick = (e) => {
        e.stopPropagation();
        if (!chatUser.isGroup && chatUser.id) {
            navigate(`/profile/${chatUser.id}`);
        }
    };

    if (!chatUser) return null;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                elevation={isSelected ? 3 : 0}
                sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    bgcolor: isSelected 
                        ? theme.palette.primary.main + '08'
                        : 'transparent',
                    borderLeft: isSelected 
                        ? `4px solid ${theme.palette.primary.main}`
                        : '4px solid transparent',
                    '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        transform: 'translateX(2px)'
                    },
                    mb: 0.5,
                    borderRadius: 2
                }}
            >
                <CardHeader
                    avatar={
                        <Badge
                            badgeContent={unreadCount}
                            color="error"
                            max={99}
                            invisible={unreadCount === 0}
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.7rem',
                                    minWidth: '16px',
                                    height: '16px'
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    onClick={handleAvatarClick}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: chatUser.isGroup 
                                            ? theme.palette.secondary.main
                                            : theme.palette.primary.main,
                                        color: 'white',
                                        cursor: chatUser.isGroup ? 'default' : 'pointer',
                                        border: `2px solid ${theme.palette.background.paper}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': !chatUser.isGroup && {
                                            transform: 'scale(1.1)',
                                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                                        }
                                    }}
                                    src={chatUser.profile}
                                >
                                    {chatUser.isGroup ? (
                                        <GroupIcon sx={{ fontSize: 28 }} />
                                    ) : (
                                        chatUser.name?.[0]?.toUpperCase() || '?'
                                    )}
                                </Avatar>
                                
                                {/* Online indicator */}
                                {!chatUser.isGroup && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 2,
                                            right: 2,
                                            width: 14,
                                            height: 14,
                                            bgcolor: 'success.main',
                                            borderRadius: '50%',
                                            border: `2px solid ${theme.palette.background.paper}`,
                                            // You can add online/offline logic here
                                            display: Math.random() > 0.5 ? 'block' : 'none'
                                        }}
                                    />
                                )}
                            </Box>
                        </Badge>
                    }
                    
                    action={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <IconButton size="small" sx={{ mb: 0.5 }}>
                                <MoreHorizIcon fontSize="small" />
                            </IconButton>
                            {lastMessage && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    {formatTime(lastMessage.timestamp)}
                                </Typography>
                            )}
                        </Box>
                    }
                    
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: unreadCount > 0 ? 700 : 600,
                                    color: unreadCount > 0 
                                        ? theme.palette.text.primary
                                        : theme.palette.text.primary,
                                    fontSize: '1rem'
                                }}
                                noWrap
                            >
                                {chatUser.name}
                            </Typography>
                            
                            {chatUser.isGroup && (
                                <Chip
                                    label={`${chatUser.memberCount}`}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.7rem',
                                        bgcolor: theme.palette.grey[200],
                                        color: theme.palette.text.secondary
                                    }}
                                />
                            )}
                            
                            {/* Verified badge */}
                            {!chatUser.isGroup && Math.random() > 0.7 && (
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: 16,
                                        color: theme.palette.primary.main
                                    }}
                                />
                            )}
                        </Box>
                    }
                    
                    subheader={
                        <Box sx={{ mt: 0.5 }}>
                            {lastMessage ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: unreadCount > 0 ? 500 : 400,
                                        fontSize: '0.85rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {chatUser.isGroup && !lastMessage.isOwn && (
                                        <span style={{ fontWeight: 600 }}>
                                            {lastMessage.userName}: 
                                        </span>
                                    )}
                                    {lastMessage.isOwn && '✓ '}
                                    {lastMessage.text || 'No messages yet'}
                                </Typography>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}
                                >
                                    Start a conversation
                                </Typography>
                            )}
                        </Box>
                    }
                    
                    sx={{
                        px: 2,
                        py: 1.5,
                        '& .MuiCardHeader-content': {
                            overflow: 'hidden',
                            minWidth: 0
                        },
                        '& .MuiCardHeader-action': {
                            alignSelf: 'flex-start',
                            mt: 0.5
                        }
                    }}
                />
            </Card>
        </motion.div>
    );
});

UserChatCard.displayName = 'UserChatCard';

export default UserChatCard