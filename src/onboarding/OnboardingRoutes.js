/* jshint ignore:start */
import { Navigate, Outlet } from "react-router-dom";

const OnboardingRoutes = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("token");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Get user data from localStorage
  const userStr = localStorage.getItem("Register_User");
  if (!userStr) {
    return <Outlet />; // Allow access to onboarding routes
  }
  
  try {
    const user = JSON.parse(userStr);
    const onboardingStatus = user.onboarding_status;
    
    // If onboarding is already completed, redirect to dashboard
    if (onboardingStatus === "completed" || onboardingStatus === "Completed") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Outlet />; // Allow access to onboarding routes
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Outlet />; // Allow access to onboarding routes on error
  }
};

export default OnboardingRoutes;
/* jshint ignore:end */