import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from "@mui/material";

import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isAdmin?: boolean;
  flatCount?: number;
}

export const UsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estados para filtros
  const [filterType, setFilterType] = useState<"all" | "admin" | "normal">(
    "all"
  );
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);
  const [minFlats, setMinFlats] = useState<number | undefined>(undefined);
  const [maxFlats, setMaxFlats] = useState<number | undefined>(undefined);
  const [sortOption, setSortOption] = useState<
    "firstName" | "lastName" | "flatCount"
  >("firstName");

  // Cargar usuarios desde Firestore
  const loadUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);

      const list = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const userData = doc.data() as AppUser;
          const flatsQuery = query(
            collection(db, "flats"),
            where("userId", "==", doc.id)
          );
          const flatsSnapshot = await getDocs(flatsQuery);

          return {
            ...userData,
            uid: doc.id,
            flatCount: flatsSnapshot.size,
          };
        })
      );

      setUsers(list);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDelete = async (user: AppUser) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${user.email}?`)) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);

      alert("Usuario eliminado de Firestore");
      setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Hubo un problema al eliminar el usuario");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Aplicar filtros y ordenamiento
  const applyFiltersAndSorting = () => {
    return users
      .filter((user) => {
        if (filterType === "admin") return user.isAdmin === true;
        if (filterType === "normal") return user.isAdmin !== true;
        return true;
      })
      .filter((user) => {
        if (!user.birthDate) return false;
        const birthYear = new Date(user.birthDate).getFullYear();
        const age = new Date().getFullYear() - birthYear;
        if (minAge !== undefined && age < minAge) return false;
        if (maxAge !== undefined && age > maxAge) return false;
        return true;
      })
      .filter((user) => {
        if (minFlats !== undefined && user.flatCount < minFlats) return false;
        if (maxFlats !== undefined && user.flatCount > maxFlats) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "firstName":
            return a.firstName.localeCompare(b.firstName);
          case "lastName":
            return a.lastName.localeCompare(b.lastName);
          case "flatCount":
            return (b.flatCount || 0) - (a.flatCount || 0);
          default:
            return 0;
        }
      });
  };

  const filteredUsers = applyFiltersAndSorting();

  if (loading) {
    return <Container>Loading Users...</Container>;
  }

  return (
    <Container sx={{ py: 10 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 4 }}
      >
        Todos los usuarios registrados
      </Typography>

      {/* Filtros */}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Filtros de Usuarios
        </Typography>

        <Grid container spacing={2} justifyContent={"center"}>
          {/* Tipo de Usuario */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: 150 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Usuario</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                label="Tipo de Usuario"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="admin">Solo Administradores</MenuItem>
                <MenuItem value="normal">Solo Usuarios Normales</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Edad mínima y máxima */}
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Edad Mínima"
              type="number"
              size="small"
              fullWidth
              value={minAge || ""}
              onChange={(e) =>
                setMinAge(e.target.value ? parseInt(e.target.value) : undefined)
              }
              sx={{ width: 160 }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Edad Máxima"
              type="number"
              size="small"
              fullWidth
              value={maxAge || ""}
              onChange={(e) =>
                setMaxAge(e.target.value ? parseInt(e.target.value) : undefined)
              }
              sx={{ width: 160 }}
            />
          </Grid>

          {/* Min y Max Flats */}
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Min Flats"
              type="number"
              size="small"
              fullWidth
              value={minFlats || ""}
              onChange={(e) =>
                setMinFlats(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              sx={{ width: 160 }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Max Flats"
              type="number"
              size="small"
              fullWidth
              value={maxFlats || ""}
              onChange={(e) =>
                setMaxFlats(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              sx={{ width: 160 }}
            />
          </Grid>

          {/* Ordenar por */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: 150 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                label="Ordenar por"
              >
                <MenuItem value="firstName">Nombre</MenuItem>
                <MenuItem value="lastName">Apellido</MenuItem>
                <MenuItem value="flatCount">Número de Flats</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de usuarios */}
      {filteredUsers.length === 0 ? (
        <Typography>No hay usuarios que coincidan con los filtros</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="usuarios-table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Birth Date</TableCell>
                <TableCell>Flats Number</TableCell>
                <TableCell>Is Admin?</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => {
                const birthYear = new Date(user.birthDate).getFullYear();
                const age = new Date().getFullYear() - birthYear;

                return (
                  <TableRow key={user.uid}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.birthDate} ({age} años)
                    </TableCell>
                    <TableCell>{user.flatCount}</TableCell>
                    <TableCell>{user.isAdmin ? "✅ Sí" : "❌ No"}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => navigate(`/userprofile/${user.uid}`)}
                      >
                        ✏️ Editar
                      </Button>
                      {!user.isAdmin && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user)}
                        >
                          🗑️ Eliminar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};