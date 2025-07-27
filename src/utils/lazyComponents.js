import { lazy } from 'react';

// Preload critical components for better performance
const preloadComponent = (componentImport) => {
  const component = lazy(componentImport);
  componentImport(); // Preload the component
  return component;
};

// Critical components loaded immediately
export const Authentication = lazy(() => import("../Pages/Files/Authentication"));
export const HomePage = lazy(() => import("../Pages/Home/HomePage"));

// Secondary components loaded on demand
export const Messages = lazy(() => 
  import("../Pages/Messages/Messages").then(module => ({ default: module.default }))
);

export const Profile = lazy(() => 
  import("../Pages/Profile/Profile").then(module => ({ default: module.default }))
);

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload HomePage since it's the main route
  import("../Pages/Home/HomePage");
  
  // Preload Messages since it's frequently accessed
  setTimeout(() => {
    import("../Pages/Messages/Messages");
  }, 1000);
};

export default {
  Authentication,
  HomePage,
  Messages,
  Profile,
  preloadCriticalComponents
};
