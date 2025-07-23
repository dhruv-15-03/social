
import React, { useEffect, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";
import { restoreSessionAction } from "./Redux/Auth/auth.actiion";
import { useAuthUser } from "./hooks/useOptimizedSelector";
import AppErrorBoundary from "./Components/ErrorBoundary/AppErrorBoundary";
import envConfig from "./config/environment";

const Authentication = lazy(() => import("./Pages/Files/Authentication"));
const HomePage = lazy(() => import("./Pages/Home/HomePage"));
const Messages = lazy(() => import("./Pages/Messages/Messages"));

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  const user = useAuthUser();
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only attempt to restore session once on app initialization
    if (!auth.jwt && !auth.loading && !user) {
      console.log('� App initialized, checking for stored session');
      dispatch(restoreSessionAction());
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<LoadingFallback />}>
          {/* Show loading while auth is being determined */}
          {auth.loading && !user ? (
            <LoadingFallback />
          ) : (
            <Routes>
              <Route 
                path='/*' 
                element={user ? <HomePage /> : <Authentication />} 
              />
              <Route path='/messages' element={<Messages />} />
              <Route path='/auth' element={<Authentication />} />
            </Routes>
          )}
        </Suspense>
      </div>
    </AppErrorBoundary>
  );
}

export default React.memo(App);
