# Social Media Application - Environment Configuration Guide

## 🚀 Quick Setup

### 1. Environment Files Setup

Copy the environment template and configure for your environment:

```bash
# Copy template to create your environment file
cp .env.template .env

# Edit the .env file with your actual credentials
```

### 2. Required Environment Variables

The following environment variables are **required** for the application to work:

#### API Configuration
```env
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_WS_URL=https://your-backend-api.com/ws
```

#### Cloudinary Configuration
```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Get Your Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your **Cloud Name**
4. Create an **Upload Preset**:
   - Go to Settings > Upload
   - Add Upload Preset
   - Set to "Unsigned"
   - Copy the preset name

## 📋 Complete Environment Variables Reference

### Application Settings
```env
REACT_APP_NAME=Social Media App
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### API Configuration
```env
# Your backend API URL
REACT_APP_API_URL=https://thought-0hcs.onrender.com

# Request timeout in milliseconds
REACT_APP_API_TIMEOUT=30000

# WebSocket URL for real-time features
REACT_APP_WS_URL=https://thought-0hcs.onrender.com/ws

# API retry attempts
REACT_APP_API_RETRY_COUNT=3
```

### File Upload Configuration
```env
# Cloudinary settings
REACT_APP_CLOUDINARY_CLOUD_NAME=dbnn4rikb
REACT_APP_CLOUDINARY_UPLOAD_PRESET=ml_default

# File upload limits
REACT_APP_MAX_FILE_SIZE=10
REACT_APP_SUPPORTED_IMAGE_FORMATS=jpeg,jpg,png,gif,webp
REACT_APP_IMAGE_QUALITY=80
```

### Authentication
```env
# JWT token storage key
REACT_APP_JWT_STORAGE_KEY=jwt

# Session timeout (1 hour = 3600000 ms)
REACT_APP_SESSION_TIMEOUT=3600000
```

### Feature Flags
```env
# Performance monitoring
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true

# Error logging
REACT_APP_ENABLE_ERROR_LOGGING=true

# Analytics (set to true when you set up analytics)
REACT_APP_ENABLE_ANALYTICS=false

# Development tools
REACT_APP_ENABLE_DEV_TOOLS=true
```

### Social Features
```env
# Content limits
REACT_APP_MAX_POST_LENGTH=500
REACT_APP_MAX_STORY_DURATION=30
REACT_APP_POSTS_PER_PAGE=10

# Real-time update interval
REACT_APP_REALTIME_INTERVAL=5000
```

### UI/UX Settings
```env
# Theme configuration
REACT_APP_DEFAULT_THEME=light

# Performance settings
REACT_APP_LAZY_LOADING_THRESHOLD=100
```

## 🔒 Security Best Practices

### Environment Files
- ✅ **Never commit `.env` files** to version control
- ✅ Use `.env.template` for documentation
- ✅ Use different `.env` files for different environments
- ✅ Keep production credentials secure

### File Structure
```
your-project/
├── .env                 # Your local environment (gitignored)
├── .env.template        # Template for other developers
├── .env.local          # Local overrides (gitignored)
├── .env.development    # Development settings (gitignored)
├── .env.production     # Production settings (gitignored)
└── src/config/
    ├── environment.js   # Environment configuration utility
    └── api.js          # API configuration
```

## 🛠 Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy and edit environment file
cp .env.template .env
# Edit .env with your credentials
```

### 3. Start Development Server
```bash
npm start
```

### 4. Verify Configuration
Check the browser console for the configuration log:
```
🔧 Application Configuration
```

## 🌐 Deployment

### Vercel
Add environment variables in your Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add each variable from your `.env` file

### Netlify
Add environment variables in your Netlify dashboard:
- Go to Site settings > Build & deploy > Environment
- Add each variable from your `.env` file

### Other Platforms
Refer to your hosting platform's documentation for setting environment variables.

## 🔧 Configuration Features

### Professional API Setup
- ✅ Centralized configuration management
- ✅ Automatic request/response logging (development)
- ✅ Error handling with proper HTTP status codes
- ✅ Automatic token management
- ✅ Request retry logic with exponential backoff
- ✅ Network error handling

### Cloudinary Integration
- ✅ File validation (size, format)
- ✅ Image quality optimization
- ✅ Progress tracking for uploads
- ✅ Error handling
- ✅ Multiple file upload support

### Performance Optimizations
- ✅ Configurable timeouts
- ✅ Lazy loading thresholds
- ✅ Image quality settings
- ✅ Feature flags for conditional loading

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors
- Check that all required environment variables are set
- Verify `.env` file is in the project root
- Restart the development server

#### 2. API requests failing
- Verify `REACT_APP_API_URL` is correct
- Check network connectivity
- Verify backend server is running

#### 3. File uploads not working
- Verify Cloudinary credentials
- Check file size and format restrictions
- Verify upload preset is set to "unsigned"

#### 4. WebSocket connection issues
- Verify `REACT_APP_WS_URL` is correct
- Check if WebSocket endpoint is available
- Verify CORS settings on backend

### Debug Mode
Set these variables for verbose logging:
```env
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_ERROR_LOGGING=true
REACT_APP_ENABLE_DEV_TOOLS=true
```

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all required environment variables are set
3. Check network connectivity
4. Restart the development server

## 🔄 Updates

When updating the application:
1. Pull latest changes
2. Check `.env.template` for new variables
3. Update your `.env` file accordingly
4. Restart the development server
