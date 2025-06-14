import { AppRouter } from "./router/AppRouter";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoLogout } from "../src/auth/hooks/useAutoLogout";
import { logoutUser } from "./auth/services/AuthServices";

export const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Ajusta según tu autenticación

  const handleLogout = async () => {
    await logoutUser(); // Función que cierra sesión en Firebase
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  useAutoLogout(handleLogout);

  if (!isLoggedIn) {
    return null; // O redirigir directamente
  }


  return <AppRouter />;
};
