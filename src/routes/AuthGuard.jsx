import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = Boolean(user);
  const location = useLocation();

  // Redirect to login if user is not authenticated
  if (!isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if logged-in user tries to access login or register routes
  if (isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/" replace />;
  }

  // Redirect to unauthorized if user's role is not "1"
  if (isLoggedIn && user.role !== "1") {
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default AuthGuard;
