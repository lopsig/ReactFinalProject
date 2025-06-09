import React, { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { Navigate } from "react-router-dom";

export const PublicRouter = ({ children }) => {
  const { user } = useContext(AuthContext);
  return !user ? children : <Navigate to={"/"} />;
};

