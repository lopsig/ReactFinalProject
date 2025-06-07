// AppHeader.tsx
import { AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth/context/AuthContext";

export const AppHeader = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login', {replace: true})

    } catch (error) {
      console.error('Error al cerrar la sesion: ', error);
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#f5f5f5",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: 0 }}>🌐 My FlatFinder</h3>

      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/auth/update">Update</Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <AccountCircle />

        {user ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/auth/login">Login</Link>
        )}
      </div>
    </header>
  );
};