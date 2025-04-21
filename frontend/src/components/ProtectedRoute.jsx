import React ,{ useEffect } from 'react'
import useAuthStore from '../store/authStore'
import useStockStore from "../store/stockStore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {

    const {isLoggedIn} = useAuthStore((state) => state)
    const {connectToSSE,disconnectSSE} = useStockStore();

    useEffect(() => {
        connectToSSE();
    
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