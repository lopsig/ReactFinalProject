import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
} from "@mui/material";

import { type AppUser } from "../../auth/interfaces/AppUser";

import { getUserData, updateUserData } from "../services/UserRepository";

export const ProfilePage = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
  });

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
        setFormValues({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
        });
      }
    };

    loadUser();
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await updateUserData(user.uid, formValues);
      setUser({ ...user, ...formValues });
      setEditing(false);
    } catch (error) {
      alert("Hubo un error al actualizar el perfil");
    }
  };

  if (!user) {
    return <Container>Cargando perfil...</Container>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Perfil de Usuario
        </Typography>

        <Box component="div" mb={2}>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
        </Box>

        {!editing ? (
          <>
            <Box component="div" mb={2}>
              <Typography variant="body1">
                <strong>Nombre:</strong> {user.firstName}
              </Typography>
            </Box>
            <Box component="div" mb={2}>
              <Typography variant="body1">
                <strong>Apellido:</strong> {user.lastName}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Editar Perfil
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Nombre"
              name="firstName"
              defaultValue={formValues.firstName}
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              label="Apellido"
              name="lastName"
              defaultValue={formValues.lastName}
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <Box mt={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ mr: 2 }}
              >
                Guardar Cambios
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};
