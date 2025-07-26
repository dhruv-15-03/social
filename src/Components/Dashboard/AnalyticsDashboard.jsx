import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  People,
  ChatBubble,
  Favorite,
  Visibility,
  Share,
  Analytics,
  CalendarToday
} from '@mui/icons-material';
import { useSelector } from 'react-redux';


const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary',
  trend = 'up',
  subtitle 
}) => {
  const trendColor = trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'warning.main';
  
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${color}.light, ${color}.main)`,
              color: 'white'
            }}
          >
            {icon}
          </Box>
          <Chip
            label={`${change > 0 ? '+' : ''}${change}%`}
            size="small"
            sx={{
              bgcolor: trendColor,
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        </Box>
        
        <Typography variant="h4" component="div" fontWeight={700} color="text.primary" mb={1}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Activity Chart Component (simplified)
const ActivityChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Analytics sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 200 }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: `${(item.value / maxValue) * 160}px`,
                  background: `linear-gradient(to top, primary.main, primary.light)`,
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scaleY(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" textAlign="center">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Recent Activity
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activities.map((activity, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: activity.color,
                  fontSize: '1rem'
                }}
              >
                {activity.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {activity.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {activity.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Top Performers Component
const TopPerformers = ({ posts }) => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Top Performing Posts
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map((post, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                #{index + 1}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {post.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Favorite sx={{ fontSize: 16, color: 'error.main' }} />
                    <Typography variant="caption">{post.likes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ChatBubble sx={{ fontSize: 16, color: 'info.main' }} />
                    <Typography variant="caption">{post.comments}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Share sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption">{post.shares}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const AnalyticsDashboard = () => {
  const { auth, post } = useSelector(store => store);
  const user = auth.user;

  // Mock data - in real app, this would come from your API
  const metrics = [
    {
      title: 'Total Posts',
      value: post.posts?.length || 0,
      change: 12,
      icon: <ChatBubble />,
      color: 'primary',
      subtitle: 'Published this month'
    },
    {
      title: 'Profile Views',
      value: 1247,
      change: 8,
      icon: <Visibility />,
      color: 'info',
      subtitle: 'Last 30 days'
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: -2,
      icon: <TrendingUp />,
      color: 'success',
      subtitle: 'Average engagement',
      trend: 'down'
    },
    {
      title: 'Followers',
      value: 892,
      change: 15,
      icon: <People />,
      color: 'warning',
      subtitle: 'New followers this week'
    }
  ];

  const activityData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 19 },
    { label: 'Wed', value: 8 },
    { label: 'Thu', value: 15 },
    { label: 'Fri', value: 22 },
    { label: 'Sat', value: 18 },
    { label: 'Sun', value: 25 }
  ];

  const recentActivities = [
    {
      title: 'New post published',
      time: '2 hours ago',
      value: '+15 likes',
      icon: '📝',
      color: 'primary.main'
    },
    {
      title: 'Profile updated',
      time: '5 hours ago',
      value: '+3 views',
      icon: '👤',
      color: 'info.main'
    },
    {
      title: 'Comment replied',
      time: '1 day ago',
      value: '+1 engagement',
      icon: '💬',
      color: 'success.main'
    }
  ];

  const topPosts = [
    {
      title: 'My journey into web development',
      likes: 45,
      comments: 12,
      shares: 8
    },
    {
      title: 'Tips for better code organization',
      likes: 38,
      comments: 15,
      shares: 5
    },
    {
      title: 'React best practices guide',
      likes: 32,
      comments: 9,
      shares: 12
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Here's how your content is performing.
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Charts and Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ActivityChart data={activityData} title="Weekly Activity" />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RecentActivity activities={recentActivities} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TopPerformers posts={topPosts} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
