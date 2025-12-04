import { Navigate } from "react-router-dom";

export const OnboardingRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("Register_User"));
  const isOnboardingCompleted = user?.onboarding_status?.toLowerCase() === "completed";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isOnboardingCompleted) {
    // Redirect to dashboard if onboarding already completed
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated AND onboarding not completed
  return children;
};
