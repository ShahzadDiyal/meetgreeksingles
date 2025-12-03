/* jshint ignore:start */
import { Navigate, Outlet } from "react-router-dom";

const OnboardingProtection = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("token");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Get user data from localStorage
  const userStr = localStorage.getItem("Register_User");
  if (!userStr) {
    return <Navigate to="/image" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    const onboardingStatus = user.onboarding_status;
    
    // Check if onboarding is completed
    if (onboardingStatus === "completed" || onboardingStatus === "Completed") {
      return <Outlet />; // Allow access to protected routes
    } else {
      // Redirect to image upload page if onboarding is not completed
      return <Navigate to="/image" replace />;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/image" replace />;
  }
};

export default OnboardingProtection;
/* jshint ignore:end */