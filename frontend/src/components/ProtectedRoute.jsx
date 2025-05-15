import React ,{ useEffect } from 'react'
import useAuthStore from '../store/authStore'
import useStockStore from "../store/stockStore";
import { Navigate } from "react-router-dom";
import useOrderStore from '../store/orderStore';
import useUserStore from '../store/userStore';

const ProtectedRoute = ({children}) => {

    const {isLoggedIn} = useAuthStore((state) => state)
    const {connectToSSE,disconnectSSE} = useStockStore();
    const {fetchOrders} = useOrderStore();
    const {fetchUserData,getUserHoldings} = useUserStore();

    useEffect(() => {
        connectToSSE();
        fetchOrders();
        fetchUserData();
        getUserHoldings();
    
        return () => {
            disconnectSSE();
        };
    }, []);
    
  return (
    <>
      {isLoggedIn ? children : <Navigate to = '/login'/>}
    </>
  )
}

export default ProtectedRoute