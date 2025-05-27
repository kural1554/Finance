import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const Authmiddleware = ({ children }) => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(undefined); // undefined, true, or false

  useEffect(() => {
    // This effect runs when location.pathname changes, or on initial mount
    console.log(`AUTH_DEBUG (Effect): Evaluating access for ${location.pathname}`);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log(`AUTH_DEBUG (Effect): Access Blocked for ${location.pathname}`);
      setIsAuthorized(false);
    } else {
      console.log(`AUTH_DEBUG (Effect): Access Granted for ${location.pathname}`);
      setIsAuthorized(true);
    }
  }, [location.pathname]); // Dependency: only re-run if pathname changes

  if (isAuthorized === undefined) {
    // Optional: show a loading state while auth is being checked for the first time
    // or if you prefer to avoid rendering children until useEffect runs.
    return null; // Or a loading spinner specifically for auth check
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default Authmiddleware;