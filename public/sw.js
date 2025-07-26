/**
 * Professional PWA Service Worker
 * Provides caching strategies, offline support, and background sync
 */

const CACHE_NAME = 'thoughts-app-v1';
const RUNTIME_CACHE = 'thoughts-runtime-v1';
const IMAGE_CACHE = 'thoughts-images-v1';
const API_CACHE = 'thoughts-api-v1';

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  // Add other critical resources
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/posts',
  '/api/profile',
  '/api/users',
];

// Images and media cache patterns
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Precaching resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('📦 Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old caches
              return cacheName.startsWith('thoughts-') && 
                     cacheName !== CACHE_NAME &&
                     cacheName !== RUNTIME_CACHE &&
                     cacheName !== IMAGE_CACHE &&
                     cacheName !== API_CACHE;
            })
            .map((cacheName) => {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('🔄 Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    // API requests - Network First with fallback
    if (CACHEABLE_APIS.some(api => url.pathname.startsWith(api))) {
      event.respondWith(networkFirstStrategy(request, API_CACHE));
    }
    // Images - Cache First
    else if (IMAGE_EXTENSIONS.some(ext => url.pathname.includes(ext))) {
      event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    }
    // Navigation requests - Network First with offline fallback
    else if (request.mode === 'navigate') {
      event.respondWith(navigationStrategy(request));
    }
    // Static assets - Cache First
    else if (url.pathname.startsWith('/static/')) {
      event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    }
    // Other requests - Stale While Revalidate
    else {
      event.respondWith(staleWhileRevalidateStrategy(request, RUNTIME_CACHE));
    }
  }
});

// Network First Strategy - for API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request.clone());
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request.clone(), networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Service Worker: Network failed, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator to cached API responses
      const responseClone = cachedResponse.clone();
      const responseBody = await responseClone.json();
      
      return new Response(JSON.stringify({
        ...responseBody,
        _offline: true,
        _cachedAt: new Date().toISOString()
      }), {
        headers: cachedResponse.headers,
        status: cachedResponse.status,
        statusText: cachedResponse.statusText
      });
    }
    
    // Return offline response if no cache
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache First Strategy - for images and static assets
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request.clone(), networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Service Worker: Failed to fetch:', request.url);
    
    // Return placeholder for failed images
    if (IMAGE_EXTENSIONS.some(ext => request.url.includes(ext))) {
      return new Response('', {
        status: 404,
        statusText: 'Image not found'
      });
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy - for dynamic content
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then(c => c.put(request.clone(), networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('🌐 Service Worker: Network failed:', request.url);
      return null;
    });
  
  // Return cached response immediately, update cache in background
  return cachedResponse || networkResponsePromise;
}

// Navigation Strategy - for page requests
async function navigationStrategy(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request.clone(), networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Service Worker: Navigation failed, trying cache:', request.url);
    
    // Try cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlineResponse = await caches.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Background Sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-post-sync') {
    event.waitUntil(syncFailedPosts());
  } else if (event.tag === 'background-like-sync') {
    event.waitUntil(syncFailedLikes());
  }
});

// Sync failed posts
async function syncFailedPosts() {
  const failedPosts = await getFailedRequests('posts');
  
  for (const post of failedPosts) {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post.data)
      });
      
      // Remove from failed requests
      await removeFailedRequest('posts', post.id);
      
      // Notify client of successful sync
      await notifyClients({
        type: 'sync-success',
        action: 'post-created',
        data: post.data
      });
    } catch (error) {
      console.log('🔄 Service Worker: Failed to sync post:', error);
    }
  }
}

// Sync failed likes
async function syncFailedLikes() {
  const failedLikes = await getFailedRequests('likes');
  
  for (const like of failedLikes) {
    try {
      await fetch(`/api/posts/${like.postId}/like`, {
        method: 'PUT'
      });
      
      await removeFailedRequest('likes', like.id);
      
      await notifyClients({
        type: 'sync-success',
        action: 'post-liked',
        data: { postId: like.postId }
      });
    } catch (error) {
      console.log('🔄 Service Worker: Failed to sync like:', error);
    }
  }
}

// Helper functions for IndexDB operations
async function getFailedRequests(type) {
  // In a real implementation, use IndexedDB
  return [];
}

async function removeFailedRequest(type, id) {
  // In a real implementation, remove from IndexedDB
}

async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage(message);
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push notification received');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    image: data.image,
    tag: data.tag || 'general',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    vibrate: data.vibrate || [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');
  
  event.notification.close();
  
  const { action, data } = event;
  
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'notification-click',
            action,
            data
          });
          return;
        }
      }
      
      // Otherwise, open new window
      if (clients.openWindow) {
        const url = data?.url || '/';
        return clients.openWindow(url);
      }
    })
  );
});

console.log('🚀 Service Worker: Loaded and ready!');
