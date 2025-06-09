import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { collection, getDocs, query, doc, deleteDoc } from "firebase/firestore";
import { auth } from "../../firebase/firebase";
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

export const UsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AppUser[];

      setUsers(list);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: AppUser) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${user.email}?`)) return;

    try {
      // Eliminar de Firestore
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);

      // Eliminar de Firebase Auth (solo si tienes permisos)
      // NOTA: Esto solo funciona desde Cloud Functions o backend seguro
      // Por ahora lo mostramos como mensaje de aviso
      alert(
        "Usuario eliminado de Firestore. Para eliminarlo completamente del sistema, se recomienda usar Cloud Functions"
      );

      // Recargar lista localmente
      setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Hubo un problema al eliminar el usuario");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <Container>Loading Users...</Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>

      {users.length === 0 && (
        <Typography>No hay usuarios registrados</Typography>
      )}

      {users.map((user) => (
        <Paper
          key={user.uid}
          sx={{
            padding: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body1">
              <strong>
                {user.firstName} {user.lastName}
              </strong>{" "}
              - {user.email}
            </Typography>
            {user.isAdmin && (
              <Typography color="primary" component="span" sx={{ ml: 2 }}>
                (Administrador)
              </Typography>
            )}
          </Box>

          {!user.isAdmin && (
            <Button
              color="error"
              onClick={() => handleDelete(user)}
              variant="outlined"
              size="small"
            >
              Delete
            </Button>
          )}
        </Paper>
      ))}
    </Container>
  );
};

