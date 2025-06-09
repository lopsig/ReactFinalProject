import { Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { MyAppRouter } from "../App/routes/MyAppRouter";
import { AuthProvider } from "../auth/context/AuthContext";
import { PrivateRouter } from "./PrivateRouter";
import { PublicRouter } from "./PublicRouter";


export const AppRouter = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/auth/*"
          element={
            <PublicRouter>
              <AuthRoutes />
            </PublicRouter>
          }
        />

        <Route
          path="/*"
          element={
            <PrivateRouter>
              <MyAppRouter />
            </PrivateRouter>
          }
        />
      </Routes>
    </AuthProvider>
  );
};
