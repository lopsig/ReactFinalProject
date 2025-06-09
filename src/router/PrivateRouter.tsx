import React, { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { Navigate } from "react-router-dom";


export const PrivateRouter = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to={"/auth/login"} />;
};
