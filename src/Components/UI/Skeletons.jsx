import React from 'react';
import { Box, Skeleton, Card } from '@mui/material';

export const PostCardSkeleton = () => (
  <Card sx={{ mb: 2, borderRadius: 2 }}>
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={16} />
        </Box>
        <Skeleton variant="rectangular" width={24} height={24} />
      </Box>
      
      {/* Content */}
      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      
      {/* Image */}
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1, mb: 2 }} />
      
      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
      
      {/* Likes and Comments */}
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="25%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="15%" height={16} />
      </Box>
    </Box>
  </Card>
);

export const SidebarSkeleton = () => (
  <Card sx={{ height: '100vh', borderRadius: 3 }}>
    <Box sx={{ p: 3 }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Skeleton variant="text" width={120} height={40} />
      </Box>
      
      {/* Navigation items */}
      {[...Array(8)].map((_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={100} height={20} sx={{ ml: 2 }} />
        </Box>
      ))}
      
      {/* User profile at bottom */}
      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="50%" height={16} />
          </Box>
        </Box>
      </Box>
    </Box>
  </Card>
);

export const StorySkeleton = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
    <Skeleton variant="circular" width={80} height={80} />
    <Skeleton variant="text" width={60} height={16} sx={{ mt: 1 }} />
  </Box>
);

export const CommentSkeleton = () => (
  <Box sx={{ display: 'flex', mb: 2 }}>
    <Skeleton variant="circular" width={32} height={32} />
    <Box sx={{ ml: 2, flex: 1 }}>
      <Skeleton variant="text" width="20%" height={16} sx={{ mb: 0.5 }} />
    </Box>
  </Box>
);

// Default export for easier importing
const SkeletonComponents = {
  PostCardSkeleton,
  SidebarSkeleton,
  StorySkeleton,
  CommentSkeleton
};

export default SkeletonComponents;
