import React from 'react'
import useAuthStore from '../store/authStore'
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {

    const {isLoggedIn} = useAuthStore((state) => state)
    
  return (
    <>
      {isLoggedIn ? children : <Navigate to = '/login'/>}
    </>
  )
}

export default ProtectedRoute