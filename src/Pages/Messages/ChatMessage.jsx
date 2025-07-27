import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Paper,
    IconButton,
    Tooltip,
    useTheme,
    Skeleton
} from '@mui/material';
import {
    Done as DoneIcon,
    DoneAll as DoneAllIcon,
    MoreVert as MoreVertIcon,
    Reply as ReplyIcon,
    Favorite as FavoriteIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const ChatMessage = React.memo(({ messages }) => {
    const { auth } = useSelector(store => store);
    const theme = useTheme();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const isReqUserMessage = auth.user?.id === messages.user?.id;
    // Format timestamp
    const formatTime = useMemo(() => {
        if (!messages.timestamp) return '';
        
        const date = new Date(messages.timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }, [messages.timestamp]);

    // Message status icon
    const getStatusIcon = () => {
        if (!isReqUserMessage) return null;
        
        // You can add real message status logic here
        const isDelivered = true;
        const isRead = Math.random() > 0.5;
        
        if (isRead) {
            return <DoneAllIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />;
        } else if (isDelivered) {
            return <DoneAllIcon sx={{ fontSize: 14, color: theme.palette.grey[400] }} />;
        } else {
            return <DoneIcon sx={{ fontSize: 14, color: theme.palette.grey[400] }} />;
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const messageVariants = {
        initial: { opacity: 0, y: 20, scale: 0.8 },
        animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
            }
        },
        exit: { opacity: 0, y: -10, scale: 0.9 }
    };

    return (
        <motion.div
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onHoverStart={() => setShowActions(true)}
            onHoverEnd={() => setShowActions(false)}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: isReqUserMessage ? 'flex-end' : 'flex-start',
                    mb: 1,
                    position: 'relative'
                }}
            >
                {/* Avatar for received messages */}
                {!isReqUserMessage && (
                    <Avatar
                        src={messages.user?.profile}
                        sx={{
                            width: 32,
                            height: 32,
                            mr: 1,
                            mt: 'auto',
                            bgcolor: theme.palette.secondary.main
                        }}
                    >
                        {messages.user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                )}

                {/* Message content */}
                <Box
                    sx={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isReqUserMessage ? 'flex-end' : 'flex-start'
                    }}
                >
                    {/* User name for received messages */}
                    {!isReqUserMessage && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                mb: 0.5,
                                ml: 1
                            }}
                        >
                            {messages.user?.name}
                        </Typography>
                    )}

                    {/* Message bubble */}
                    <Paper
                        elevation={1}
                        sx={{
                            position: 'relative',
                            bgcolor: isReqUserMessage 
                                ? theme.palette.primary.main
                                : theme.palette.background.paper,
                            color: isReqUserMessage 
                                ? theme.palette.primary.contrastText
                                : theme.palette.text.primary,
                            borderRadius: messages.image ? 2 : 3,
                            overflow: 'hidden',
                            maxWidth: '100%',
                            '&::before': !messages.image && {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                [isReqUserMessage ? 'right' : 'left']: -8,
                                width: 0,
                                height: 0,
                                borderLeft: isReqUserMessage ? '8px solid transparent' : 'none',
                                borderRight: !isReqUserMessage ? '8px solid transparent' : 'none',
                                borderTop: `8px solid ${
                                    isReqUserMessage 
                                        ? theme.palette.primary.main
                                        : theme.palette.background.paper
                                }`,
                                borderBottom: '8px solid transparent'
                            },
                            transition: 'all 0.3s ease',
                            transform: showActions ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: showActions 
                                ? `0 4px 20px ${theme.palette.primary.main}20`
                                : 1
                        }}
                    >
                        {/* Image content */}
                        {messages.image && (
                            <Box sx={{ position: 'relative' }}>
                                {!imageLoaded && (
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={200}
                                        animation="wave"
                                    />
                                )}
                                <img
                                    src={messages.image}
                                    alt="Message attachment"
                                    onLoad={handleImageLoad}
                                    style={{
                                        width: '100%',
                                        maxWidth: 300,
                                        height: 'auto',
                                        maxHeight: 400,
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        display: imageLoaded ? 'block' : 'none',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        // Open image in full screen
                                        window.open(messages.image, '_blank');
                                    }}
                                />
                                
                                {/* Image overlay actions */}
                                <AnimatePresence>
                                    {showActions && imageLoaded && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                display: 'flex',
                                                gap: 4
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Download image logic
                                                }}
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>
                        )}

                        {/* Text content */}
                        {messages.message && (
                            <Box sx={{ 
                                p: messages.image ? 2 : '12px 16px',
                                pt: messages.image ? 1 : '12px'
                            }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.4,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {messages.message}
                                </Typography>
                            </Box>
                        )}

                        {/* Message metadata */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 0.5,
                                px: messages.image ? 2 : 2,
                                pb: messages.image ? 1 : 1,
                                pt: messages.message ? 0.5 : (messages.image ? 1 : 1),
                                opacity: 0.7
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '0.7rem',
                                    color: isReqUserMessage 
                                        ? theme.palette.primary.contrastText
                                        : theme.palette.text.secondary
                                }}
                            >
                                {formatTime}
                            </Typography>
                            {getStatusIcon()}
                        </Box>
                    </Paper>

                    {/* Message actions */}
                    <AnimatePresence>
                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    marginTop: 4,
                                    display: 'flex',
                                    gap: 4,
                                    alignItems: 'center'
                                }}
                            >
                                <Tooltip title="Reply" arrow>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: theme.palette.background.paper,
                                            boxShadow: 1,
                                            '&:hover': { 
                                                bgcolor: theme.palette.action.hover,
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <ReplyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="React" arrow>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: theme.palette.background.paper,
                                            boxShadow: 1,
                                            '&:hover': { 
                                                bgcolor: theme.palette.action.hover,
                                                color: theme.palette.error.main,
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <FavoriteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="More" arrow>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: theme.palette.background.paper,
                                            boxShadow: 1,
                                            '&:hover': { 
                                                bgcolor: theme.palette.action.hover,
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                {/* Avatar for sent messages */}
                {isReqUserMessage && (
                    <Avatar
                        src={messages.user?.profile}
                        sx={{
                            width: 32,
                            height: 32,
                            ml: 1,
                            mt: 'auto',
                            bgcolor: theme.palette.primary.main
                        }}
                    >
                        {messages.user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                )}
            </Box>
        </motion.div>
    );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage