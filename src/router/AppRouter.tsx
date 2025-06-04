import { Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { MyAppRouter } from "../App/routes/MyAppRouter";
import { AuthProvider } from "../auth/context/AuthContext";

export const AppRouter = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />

        <Route path="/*" element={<MyAppRouter />} />
      </Routes>
    </AuthProvider>
  );
};
