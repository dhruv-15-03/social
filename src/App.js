
import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AuthenticationWrapper from "./Components/Auth/AuthenticationWrapper";
import { AppLoader } from "./Components/UI/LoadingComponents";
import ProductionErrorBoundary from "./Components/ErrorBoundary/ProductionErrorBoundary";
import SEOHead from "./Components/SEO/SEOHead";

const Authentication = lazy(() => import("./Pages/Files/Authentication"));
const HomePage = lazy(() => import("./Pages/Home/HomePage"));
const Messages = lazy(() => import("./Pages/Messages/Messages"));

const LoadingFallback = () => <AppLoader />;

function App() {
  const location = useLocation();
  
  // Dynamic SEO based on current route
  const getSEOProps = () => {
    const path = location.pathname;
    
    switch (true) {
      case path === '/':
        return {
          title: 'Thoughts - Connect and Share Your Ideas',
          description: 'Join Thoughts, the modern social media platform where you can connect with friends, share your thoughts, and discover amazing content.',
          keywords: 'social media, thoughts, connect, share, friends, posts, stories, feed',
        };
      
      case path === '/messages':
        return {
          title: 'Messages - Thoughts',
          description: 'Stay connected with your friends through instant messaging on Thoughts.',
          keywords: 'messages, chat, communication, instant messaging',
        };
      
      case path.startsWith('/profile/'):
        return {
          title: 'Profile - Thoughts',
          description: 'View and manage your profile on Thoughts social media platform.',
          keywords: 'profile, user, account, social media',
        };
      
      case path === '/auth' || path === '/login' || path === '/register':
        return {
          title: 'Login - Thoughts',
          description: 'Login or create an account to join the Thoughts community and start sharing your ideas.',
          keywords: 'login, register, sign up, authentication, account',
          noIndex: true, // Don't index auth pages
        };
      
      default:
        return {
          title: 'Thoughts - Social Media Platform',
          description: 'A space for your thoughts and opinions. Connect, share, and discover on Thoughts.',
          keywords: 'social media, thoughts, platform, connect, share',
        };
    }
  };

  return (
    <ProductionErrorBoundary>
      <SEOHead {...getSEOProps()} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<LoadingFallback />}>
          <AuthenticationWrapper 
            loginComponent={Authentication}
            loadingComponent={AppLoader}
          >
            <Routes>
              <Route path='/*' element={<HomePage />} />
              <Route path='/messages' element={<Messages />} />
            </Routes>
          </AuthenticationWrapper>
        </Suspense>
      </div>
    </ProductionErrorBoundary>
  );
}

export default App;
