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
  const { connectToSSE, disconnectSSE, orderUpdates, setOrderUpdates } = useStockStore();
  const { fetchOrders } = useOrderStore();
  const { fetchUserData, getUserHoldings } = useUserStore();

  useEffect(() => {
    connectToSSE();
    fetchOrders();
    fetchUserData();
    getUserHoldings();

    return () => {
      disconnectSSE();
    };
  }, []);


  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
  
      
    </>
  );
};

export default ProtectedRoute;
