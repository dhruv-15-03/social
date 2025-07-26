

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { queryKeys, useQueryInvalidation } from '../../providers/ReactQueryProvider';
import { api } from '../../config/api';

export const usePosts = (options = {}) => {
  const {
    page = 0,
    limit = 10,
    enabled = true,
    refetchInterval,
  } = options;

  return useQuery({
    queryKey: queryKeys.posts.list({ page, limit }),
    queryFn: async () => {
      const response = await api.get(`/api/posts?page=${page}&limit=${limit}`);
      return response.data;
    },
    enabled,
    refetchInterval,
    staleTime: 2 * 60 * 1000, // 2 minutes for fresh posts
    select: (data) => ({
      posts: data.posts || [],
      hasMore: data.hasMore || false,
      total: data.total || 0,
    }),
  });
};

// Infinite posts query for feed scrolling
export const useInfinitePosts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(`/api/posts`, {
        params: { page: pageParam, limit: 10, ...filters }
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

// Get single post
export const usePost = (postId, options = {}) => {
  const { enabled = !!postId } = options;

  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: async () => {
      const response = await api.get(`/api/posts/${postId}`);
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual posts
  });
};

// Create post mutation
export const useCreatePost = () => {
  const invalidateQueries = useQueryInvalidation();

  return useMutation({
    mutationFn: async (postData) => {
      const response = await api.post('/api/posts', postData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate posts list to show new post
      invalidateQueries.posts();
      
      // Show success notification
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Post created successfully!',
        });
      }
    },
    onError: (error) => {
      console.error('Create post error:', error);
    },
  });
};

// Like post mutation
export const useLikePost = () => {
  const invalidateQueries = useQueryInvalidation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      const response = await api.put(`/api/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      // Update the specific post in cache
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData) => oldData ? { ...oldData, ...data } : data
      );
      
      // Invalidate posts list for updated like counts
      invalidateQueries.posts();
    },
    onError: (error) => {
      console.error('Like post error:', error);
    },
  });
};

// Save post mutation
export const useSavePost = () => {
  const invalidateQueries = useQueryInvalidation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      const response = await api.put(`/api/posts/${postId}/save`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      // Update the specific post in cache
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData) => oldData ? { ...oldData, ...data } : data
      );
    },
    onError: (error) => {
      console.error('Save post error:', error);
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const invalidateQueries = useQueryInvalidation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      await api.delete(`/api/posts/${postId}`);
      return postId;
    },
    onSuccess: (postId) => {
      // Remove from cache
      queryClient.removeQueries(queryKeys.posts.detail(postId));
      
      // Invalidate posts list
      invalidateQueries.posts();
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Post deleted successfully',
        });
      }
    },
    onError: (error) => {
      console.error('Delete post error:', error);
    },
  });
};

// Get post comments
export const usePostComments = (postId, options = {}) => {
  const { enabled = !!postId } = options;

  return useQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: async () => {
      const response = await api.get(`/api/posts/${postId}/comments`);
      return response.data;
    },
    enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes for comments
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, comment }) => {
      const response = await api.post(`/api/posts/${postId}/comments`, { comment });
      return response.data;
    },
    onSuccess: (data, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries(queryKeys.posts.comments(postId));
      
      // Update post comment count if available
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              commentCount: (oldData.commentCount || 0) + 1
            };
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error('Create comment error:', error);
    },
  });
};

// Custom hook for optimistic updates
export const useOptimisticPostUpdate = () => {
  const queryClient = useQueryClient();
  
  return {
    likePost: (postId) => {
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData) => {
          if (!oldData) return oldData;
          
          const isLiked = oldData.isLiked;
          return {
            ...oldData,
            isLiked: !isLiked,
            likeCount: isLiked 
              ? (oldData.likeCount || 1) - 1 
              : (oldData.likeCount || 0) + 1
          };
        }
      );
    },
    
    savePost: (postId) => {
      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            isSaved: !oldData.isSaved
          };
        }
      );
    }
  };
};
