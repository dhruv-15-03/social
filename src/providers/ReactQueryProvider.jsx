

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false, // Disabled for faster development
      refetchOnReconnect: true,
      retry: 1, // Reduced retries for faster response
      retryDelay: 1000, // Fixed delay for faster response
      refetchInterval: false,
      refetchOnMount: false, // Disabled for faster initial load
      
      onError: (error) => {
        // Handle React Query Error
        
        if (error?.response?.status === 401) {
          localStorage.removeItem('jwt');
          window.location.href = '/auth';
        }
      },
    },
    mutations: {
      retry: 1, // Fixed retry count for development
      
      onError: (error) => {
        // Handle Mutation Error
        
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: error?.response?.data?.message || 'Something went wrong. Please try again.',
          });
        }
      },
    },
  },
});

export const queryKeys = {
  // Authentication
  auth: {
    user: () => ['auth', 'user'],
    profile: (userId) => ['auth', 'profile', userId],
  },
  
  // Posts
  posts: {
    all: () => ['posts'],
    list: (filters) => ['posts', 'list', filters],
    detail: (id) => ['posts', 'detail', id],
    comments: (postId) => ['posts', postId, 'comments'],
  },
  
  // Messages
  messages: {
    chats: () => ['messages', 'chats'],
    chat: (chatId) => ['messages', 'chat', chatId],
    messages: (chatId) => ['messages', 'chat', chatId, 'messages'],
  },
  
  // Stories
  stories: {
    all: () => ['stories'],
    user: (userId) => ['stories', 'user', userId],
  },
  
  // Search
  search: {
    users: (query) => ['search', 'users', query],
    posts: (query) => ['search', 'posts', query],
  },
};

const ReactQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          toggleButtonProps={{
            style: {
              marginLeft: '5px',
              transform: 'scale(0.8)',
              transformOrigin: 'bottom right',
            }
          }}
        />
      )}
    </QueryClientProvider>
  );
};

export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();
  
  const invalidateQueries = {
    posts: () => {
      queryClient.invalidateQueries(queryKeys.posts.all());
    },
    
    userProfile: (userId) => {
      queryClient.invalidateQueries(queryKeys.auth.profile(userId));
    },
    
    // Invalidate messages after sending/receiving
    messages: (chatId) => {
      queryClient.invalidateQueries(queryKeys.messages.chat(chatId));
    },
    
    // Invalidate stories after creating/viewing
    stories: () => {
      queryClient.invalidateQueries(queryKeys.stories.all());
    },
  };
  
  return invalidateQueries;
};

export { queryClient };
export default ReactQueryProvider;
