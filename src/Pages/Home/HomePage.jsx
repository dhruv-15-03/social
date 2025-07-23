import React, { useEffect, useMemo, Suspense, lazy } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileAction } from "../../Redux/Auth/auth.actiion";
import { useAuthUser } from "../../hooks/useOptimizedSelector";
import { SidebarSkeleton, PostCardSkeleton } from "../../Components/UI/Skeletons";

// Lazy load components
const MiddlePart = lazy(() => import("../../Components/MiddlePart/MiddlePart"));
const Reels = lazy(() => import("../../Components/MiddlePart/Reels/Reels"));
const CreateReels = lazy(() => import("../../Components/MiddlePart/Reels/CreateReels"));
const Profile = lazy(() => import("../Profile/Profile"));
const HomeRight = lazy(() => import("../../Components/HomeRight/HomeRight"));
const Sidebar = lazy(() => import("../../Components/SideBar/Sidebar"));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAuthUser();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !user) {
      dispatch(getProfileAction(jwt));
    }
  }, [dispatch, user]);

  const isHomePage = location.pathname === "/";
  
  const gridLayout = useMemo(() => {
    if (isMobile) {
      return { sidebar: 0, main: 12, right: 0 };
    }
    return isHomePage 
      ? { sidebar: 3, main: 6, right: 3 }
      : { sidebar: 3, main: 9, right: 0 };
  }, [isMobile, isHomePage]);

  return (
    <motion.div 
      className="px-2 sm:px-5 lg:px-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={2} sx={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        {!isMobile && (
          <Grid item lg={gridLayout.sidebar} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <div className="sticky top-0 h-screen overflow-y-auto">
              <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar />
              </Suspense>
            </div>
          </Grid>
        )}

        {/* Main Content */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={gridLayout.main}
          className="flex justify-center px-2 sm:px-5"
        >
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <Suspense fallback={<PostCardSkeleton />}>
                <Routes>
                  <Route path="/" element={<MiddlePart />} />
                  <Route path="/reels" element={<Reels />} />
                  <Route path="/create-reels" element={<CreateReels open={true} />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </div>
        </Grid>

        {/* Right Panel */}
        {isHomePage && !isMobile && (
          <Grid item lg={gridLayout.right} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <div className="sticky top-0 h-screen overflow-y-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <HomeRight />
              </Suspense>
            </div>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
};

export default React.memo(HomePage);