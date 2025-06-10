import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, updatePassword } from "firebase/auth";
import { db } from "../../firebase/firebase"; // Asegúrate de exportar correctamente auth y db
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export const EditarUsuario: React.FC = () => {
  const { user } = useAuthContext();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    rol: "user",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const cargarUsuario = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("data del usuario guardada: ", data);  // data del usuario guardada en context
          console.log("user.uid del usuario guardado", user.uid);

          const loadedData = {
            email: data.email || "",
            password: "",
            confirmPassword: "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            birthDate: data.birthDate || "",
            rol: data.rol || "user",
          };
          setFormData(loadedData);
          setOriginalData(loadedData);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(originalData);
    navigate('/', { replace: true })
  }


  const handleUpdateUser = async () => {
    const { password, confirmPassword, email, rol, ...updateData } = formData;

    if (password && password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Actualizar datos en Firestore (excepto email y rol)
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, updateData);
      console.log("Datos actualizados en Firestore.");

      // Cambiar contraseña si se ingresó una nueva
      if (password.trim() && auth.currentUser?.uid === user.uid) {
        console.log("Intentando cambiar contraseña...");
        await updatePassword(auth.currentUser, password);
        console.log("Contraseña actualizada con éxito.");
      }

      alert("Perfil actualizado correctamente.");
      setOriginalData({ ...formData, password: "", confirmPassword: "" });
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("⚠️ Por seguridad, debes volver a iniciar sesión para cambiar tu contraseña.");
      } else {
        alert("❌ Error al actualizar: " + error.message);
      }
      navigate('/', { replace: true })
    }
  };

  if (!user) return <Typography>Debes iniciar sesión para ver tu perfil.</Typography>;
  if (loading) return <Typography>Cargando datos del usuario...</Typography>;

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Editar Perfil
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Email" value={formData.email} disabled fullWidth />
          <TextField
            label="Nueva contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField label="Rol" value={formData.rol} disabled fullWidth />
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>

            <Button variant="contained" color="primary" onClick={handleUpdateUser}>
              UPDATE
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

