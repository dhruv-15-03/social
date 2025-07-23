
import React, { useEffect, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress, Box } from "@mui/material";
import { getProfileAction } from "./Redux/Auth/auth.actiion";
import { useAuthUser } from "./hooks/useOptimizedSelector";
import AppErrorBoundary from "./Components/ErrorBoundary/AppErrorBoundary";

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
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !user) {
      dispatch(getProfileAction(jwt));
    }
  }, [dispatch, user]);

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route 
              path='/*' 
              element={user ? <HomePage /> : <Authentication />} 
            />
            <Route path='/messages' element={<Messages />} />
            <Route path='/auth' element={<Authentication />} />
          </Routes>
        </Suspense>
      </div>
    </AppErrorBoundary>
  );
}

export default React.memo(App);
