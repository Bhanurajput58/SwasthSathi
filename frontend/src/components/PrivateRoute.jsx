import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  console.log('PrivateRoute - Current user:', user);
  console.log('PrivateRoute - Current location:', location);

  if (!user) {
    console.log('PrivateRoute - No user found, redirecting to login');
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute - User authenticated, rendering protected content');
  // Render the protected component if authenticated
  return children;
};

export default PrivateRoute; 