import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
// import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthContext();
  return currentUser ? children : <Navigate to="/landing" />;
  // if (false) {
  //   return <Navigate to="/" />;
  // }
  // return children;
};
export default ProtectedRoute;
