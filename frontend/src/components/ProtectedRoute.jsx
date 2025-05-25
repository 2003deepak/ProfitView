import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAuthStore from '../store/authStore';
import useStockStore from "../store/stockStore";
import useOrderStore from '../store/orderStore';
import useUserStore from '../store/userStore';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore((state) => state);
  const { connectToSSE, disconnectSSE } = useStockStore();
  const { fetchOrders } = useOrderStore();
  const { fetchUserData, getUserHoldings } = useUserStore();

  useEffect(() => {
    if (isLoggedIn) {
      connectToSSE();
      fetchOrders();
      fetchUserData();
      getUserHoldings();
    }

    return () => {
      disconnectSSE();
    };
  }, [isLoggedIn]); // Add isLoggedIn as dependency

  if (!isLoggedIn) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default ProtectedRoute;