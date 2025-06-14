
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Alert,
  Avatar,
  Divider
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

import { logoutUser } from "../../auth/services/AuthServices";

interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario desde Firestore
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = getAuth().currentUser;

      if (!currentUser) {
        navigate("/auth/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser?.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as AppUser;
          setUser(userData);
          setFormValues((prev) => ({
            ...prev,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            birthDate: userData.birthDate || "",
          }));
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setError(null);

    try {
      const userRef = doc(db, "users", user.uid);
      const updates: Partial<AppUser> = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        birthDate: formValues.birthDate,
      };
      await updateDoc(userRef, updates);
      setUser({ ...user, ...updates });
      

      // Si hay nueva contraseña, actualízala
      if (
        formValues.newPassword &&
        formValues.confirmNewPassword
      ) {


        if (formValues.newPassword !== formValues.confirmNewPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }

        if (formValues.newPassword.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          return;
        }

        if (!formValues.currentPassword) {
          setError("Por favor ingresa tu contraseña actual");
          return;
        }

        // Reautenticar antes de cambiar la contraseña
        const credential = EmailAuthProvider.credential(
          user.email,
          formValues.currentPassword
        );

        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          setError("Debes estar logueado para cambiar tu contraseña");
          return;
        }

        // Reautenticar
        await reauthenticateWithCredential(firebaseUser, credential);

        // Actualizar contraseña en Firebase Auth
        await updatePassword(firebaseUser, formValues.newPassword);

        alert("Contraseña actualizada. Por favor vuelve a iniciar sesión.");
        logoutUser();
        navigate("/auth/login");
      }

      setEditing(false);
    } catch (err: any) {
      console.error("Error al guardar cambios:", err);

      if (err.code === "auth/requires-recent-login") {
        setError("Debes haber iniciado sesión recientemente para cambiar tu contraseña");
      } else if (err.code === "auth/invalid-credential") {
        setError(
          "Contraseña actual incorrecta"
        );

      } else {
        setError(err.message || "Hubo un problema al guardar los cambios");
      }
    }
  };

  if (loading) {
    return <Container>Cargando perfil...</Container>;
  }

  if (!user) {
    return <Container>Usuario no encontrado</Container>;
  }

  return (
    // <Container maxWidth="sm" sx={{ py: 10 }}>
    //         <Typography variant="h4" fontWeight={600} gutterBottom textAlign="center">
    //           Mi Perfil
    //   </Typography>

    //   <Paper elevation={3} sx={{ padding: 3 }}>

    //     {/* Datos actuales */}
    //     {!editing ? (
    //       <>
    //         <Box mb={2}>
    //           <Typography variant="body1">
    //             <strong>Email:</strong> {user.email}
    //           </Typography>
    //         </Box>
    //         <Box mb={2}>
    //           <Typography variant="body1">
    //             <strong>Nombre:</strong> {user.firstName}
    //           </Typography>
    //         </Box>
    //         <Box mb={2}>
    //           <Typography variant="body1">
    //             <strong>Apellido:</strong> {user.lastName}
    //           </Typography>
    //         </Box>
    //         <Box mb={2}>
    //           <Typography variant="body1">
    //             <strong>Fecha de Nacimiento:</strong> {user.birthDate}
    //           </Typography>
    //         </Box>
    //         <Button
    //           variant="contained"
    //           color="primary"
    //           onClick={handleEditClick}
    //         >
    //           Editar Perfil
    //         </Button>
    //       </>
    //     ) : (
    //       <>
    //         <TextField
    //           label="Nombre"
    //           name="firstName"
    //           value={formValues.firstName}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //         />

    //         <TextField
    //           label="Apellido"
    //           name="lastName"
    //           value={formValues.lastName}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //         />

    //         <TextField
    //           label="Fecha de Nacimiento"
    //           name="birthDate"
    //           type="date"
    //           inputProps={{
    //             min: "1905-01-01",
    //             max: "2007-12-31",
    //           }}
    //           value={formValues.birthDate}
    //           onChange={handleChange}
    //           fullWidth
    //           margin="normal"
    //         />

    //         <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
    //           Cambiar Contraseña (opcional)
    //         </Typography>

    //         <TextField
    //           label="Contraseña actual"
    //           name="currentPassword"
    //           type="password"
    //           fullWidth
    //           margin="normal"
    //           onChange={handleChange}
    //         />

    //         <TextField
    //           label="Nueva Contraseña"
    //           name="newPassword"
    //           type="password"
    //           placeholder="Contraseña (opcional)"
    //           fullWidth
    //           margin="normal"
    //           onChange={handleChange}
    //         />

    //         <TextField
    //           label="Confirmar nueva contraseña"
    //           name="confirmNewPassword"
    //           type="password"
    //           fullWidth
    //           margin="normal"
    //           onChange={handleChange}
    //         />

    //         {error && (
    //           <Alert severity="error" sx={{ mt: 2 }}>
    //             {error}
    //           </Alert>
    //         )}

    //         <Box mt={2} display="flex" gap={2}>
    //           <Button
    //             variant="contained"
    //             color="success"
    //             onClick={handleSubmit}
    //           >
    //             Guardar Cambios
    //           </Button>
    //           <Button
    //             variant="outlined"
    //             color="secondary"
    //             onClick={() => setEditing(false)}
    //           >
    //             Cancelar
    //           </Button>
    //         </Box>
    //       </>
    //     )}
    //   </Paper>
    // </Container>

    <Container maxWidth="sm" sx={{ py: 10, px: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 4 }}
      >
        Mi Perfil
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "primary.main",
            fontSize: 28,
          }}
          src="src/assets/images/foto.jpg"
        >
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </Avatar>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#fefefe",
        }}
      >
        {/* Vista solo lectura */}
        {!editing ? (
          <>
            {[
              ["Email", user.email],
              ["Nombre", user.firstName],
              ["Apellido", user.lastName],
              ["Fecha de Nacimiento", user.birthDate],
            ].map(([label, value], index) => (
              <Box key={index} mb={2} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {value}
                </Typography>
              </Box>
            ))}
            <Box mt={3} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ transition: "all 0.3s ease" }}
              >
                Editar Perfil
              </Button>
            </Box>
          </>
        ) : (
          <>
            {/* Campos de edición */}
            <TextField
              label="Nombre"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Apellido"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              inputProps={{ min: "1905-01-01", max: "2007-12-31" }}
              value={formValues.birthDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Cambiar Contraseña (opcional)
            </Typography>

            <TextField
              label="Contraseña actual"
              name="currentPassword"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Nueva Contraseña"
              name="newPassword"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Confirmar nueva contraseña"
              name="confirmNewPassword"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
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