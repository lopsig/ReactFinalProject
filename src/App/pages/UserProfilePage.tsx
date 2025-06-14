import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
// import { getAuth, updatePassword } from "firebase/auth";

// import { EmailAuthProvider } from "firebase/auth/cordova";

// import { reauthenticateWithCredential } from "firebase/auth";






interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isAdmin?: boolean;
  flatCount?: number;
}

export const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [passwordChanged, setPasswordChanged] = useState(false);

  const { userId } = useParams<{ userId: string }>();

  // Cargar datos del usuario y cantidad de flats
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as AppUser;

          // Contar cuántos flats tiene este usuario
          const flatsQuery = query(
            collection(db, "flats"),
            where("userId", "==", userId)
          );
          const flatsSnapshot = await getDocs(flatsQuery);
          const flatCount = flatsSnapshot.size;

          setUser({ ...userData, uid: userId, flatCount });
          setFormValues({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            birthDate: userData.birthDate || "",
            newPassword: "",
            confirmNewPassword: "",
          });
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => (prev ? { ...prev, isAdmin: e.target.checked } : null));
  };

  const handleSave = async () => {
    if (!userId || !user) return;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        birthDate: formValues.birthDate,
        isAdmin: user.isAdmin,
      });

      alert("Perfil actualizado");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un problema al guardar los cambios");
    }
  };

  // const handleChangePassword = async () => {
  //   if (!userId) {
  //     alert("No se puede cambiar la contraseña sin ID");
  //     return;
  //   }

  //   if (formValues.newPassword !== formValues.confirmNewPassword) {
  //     setError("Las contraseñas no coinciden");
  //     return;
  //   }

  //   if (formValues.newPassword.length < 6) {
  //     setError("La contraseña debe tener al menos 6 caracteres");
  //     return;
  //   }

  //   // Requerimos la contraseña actual del administrador
  //   const currentPassword = prompt("Ingresa tu contraseña actual:");

  //   if (!currentPassword) {
  //     alert("Se requiere tu contraseña actual");
  //     return;
  //   }

  //   try {
  //     const authInstance = getAuth();
  //     const user = auth.currentUser;

  //     if (!user) {
  //       alert("Debes estar logueado para realizar esta acción");
  //       navigate("/auth/login");
  //       return;
  //     }

  //     // Reautenticar al usuario actual (admin)
  //     const credential = EmailAuthProvider.credential(
  //       user.email!,
  //       currentPassword
  //     );
  //     await reauthenticateWithCredential(user, credential);

  //     // Ahora sí, cambiar contraseña del usuario seleccionado
  //     const targetUser = auth.currentUser; // Puedes usar otro método si cambias otro usuario

  //     if (!targetUser) {
  //       alert("Usuario objetivo no encontrado");
  //       return;
  //     }

  //     await updatePassword(targetUser, formValues.newPassword);
  //     setPasswordChanged(true);
  //     setFormValues((prev) => ({
  //       ...prev,
  //       newPassword: "",
  //       confirmNewPassword: "",
  //     }));

  //     alert("Contraseña actualizada correctamente");
  //     navigate("/auth/login"); // Redirigir para iniciar sesión con nueva contraseña
  //   } catch (err: any) {
  //     console.error("Error al cambiar contraseña:", err.code || err.message);

  //     if (err.code === "auth/requires-recent-login") {
  //       alert(
  //         "Debes haber iniciado sesión recientemente para cambiar tu contraseña."
  //       );
  //       navigate("/auth/login");
  //     } else {
  //       alert("Hubo un problema al actualizar la contraseña");
  //     }
  //   }
  // };

 

  if (loading) {
    return <Container>Cargando...</Container>;
  }

  if (!user) {
    return <Container>Usuario no encontrado</Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Perfil - {user.firstName} {user.lastName}
        </Typography>

        {/* Email */}
        <Box component="div" mb={2}>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
        </Box>

        {/* Número de Flats */}
        <Box component="div" mb={2}>
          <Typography variant="body1">
            <strong>Número de Flats:</strong> {user.flatCount || 0}
          </Typography>
        </Box>

        {/* Nombre */}
        <TextField
          label="Nombre"
          name="firstName"
          fullWidth
          value={formValues.firstName}
          onChange={handleChange}
          margin="normal"
        />

        {/* Apellido */}
        <TextField
          label="Apellido"
          name="lastName"
          fullWidth
          value={formValues.lastName}
          onChange={handleChange}
          margin="normal"
        />

        {/* Fecha de nacimiento */}
        <TextField
          label="Fecha de Nacimiento"
          name="birthDate"
          type="date"
          fullWidth
          value={formValues.birthDate}
          onChange={handleChange}
          margin="normal"
        />

        {/* //////////////////////////// */}

        {/* Campo nueva contraseña */}
        {/* <TextField
          label="Nueva Contraseña"
          name="newPassword"
          type="password"
          placeholder="Contraseña nueva"
          fullWidth
          value={formValues.newPassword}
          onChange={handleChange}
          margin="normal"
        /> */}

        {/* Confirmar nueva contraseña */}
        {/* <TextField
          label="Confirmar Contraseña"
          name="confirmNewPassword"
          type="password"
          placeholder="Repetir contraseña"
          fullWidth
          value={formValues.confirmNewPassword}
          onChange={handleChange}
          margin="normal"
        /> */}

        {/* Mensaje de éxito */}
        {/* {passwordChanged && (
          <Typography color="success.main" variant="body2">
            Contraseña cambiada exitosamente
          </Typography>
        )} */}

        {/* Mensaje de error */}
        {/* {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )} */}

        {/* /////////////////////////////// */}

        {/* Checkbox Admin */}
        <Box component="div" mt={2}>
          <label>
            <input
              type="checkbox"
              checked={user.isAdmin === true}
              onChange={handleAdminChange}
            />{" "}
            Es Administrador
          </label>
        </Box>

        {/* Botones de acción */}
        <Box component="div" mt={3} display="flex" gap={2}>

          <NavLink
            to="/users"
            style={{ textDecoration: "none", alignSelf: "center" }}
          >
            <Button variant="contained" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </NavLink>

          {/* <Button
            variant="outlined"
            color="primary"
            onClick={handleChangePassword}
          >
            Cambiar Contraseña
          </Button> */}

          <NavLink
            to="/users"
            style={{ textDecoration: "none", alignSelf: "center" }}
          >
            <Button variant="outlined">Cancelar</Button>
          </NavLink>
        </Box>
      </Paper>
    </Container>
  );
};