import { useEffect } from "react";

const LOGOUT_TIME = 60 * 60 * 1000; // 60 minutos en milisegundos

export const useAutoLogout = (onUserInactive: () => void) => {
  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(onUserInactive, LOGOUT_TIME);
    };

    // Eventos que indican actividad del usuario
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Inicia el temporizador al cargar el hook
    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [onUserInactive]);
};
