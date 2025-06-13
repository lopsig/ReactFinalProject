// RemoveUser.tsx
// Carga los datos del usuario desde la colección users de Firestore.
// Muestra los datos personales (email, firstName, etc.).
// Incluye botón "Eliminar cuenta".
// Muestra una confirmación con window.confirm.
// Si el usuario acepta:
// Elimina el usuario autenticado de Firebase Authentication.
// Redirige al usuario a /auth/login.

import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { useAuthContext } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const RemoveUser: React.FC = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(docRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.warn("No se encontró el documento del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (!confirm) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Eliminar documento de Firestore
      await deleteDoc(doc(db, "users", user.uid));
      console.log("Documento de usuario eliminado.");

      // Eliminar cuenta de Firebase Authentication
      if (user) {
        await deleteUser(user);
        console.log("Cuenta de autenticación eliminada.");
        alert("Tu cuenta ha sido eliminada correctamente.");
        navigate("/auth/login");
      }
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("⚠️ Debes volver a iniciar sesión para poder eliminar tu cuenta.");
        navigate("/auth/login");
      } else {
        alert("❌ Hubo un error al eliminar la cuenta.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/auth/login");
  };

  if (!user?.uid) return <Typography>Debes iniciar sesión.</Typography>;
  if (loading) return <CircularProgress />;

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Perfil de Usuario
        </Typography>
        {userData ? (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>Email: {userData.email}</Typography>
            <Typography>Nombre: {userData.firstName}</Typography>
            <Typography>Apellido: {userData.lastName}</Typography>
            <Typography>Fecha de Nacimiento: {userData.birthDate}</Typography>
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleCancel}>
                Eliminar cuenta
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>No se encontraron datos del usuario.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

