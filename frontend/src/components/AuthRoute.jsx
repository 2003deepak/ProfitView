import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore((state) => state);

  if (isLoggedIn) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default AuthRoute;