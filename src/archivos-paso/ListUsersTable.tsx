//  components/ListUsersTable.tsx
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, FormControl, InputLabel, Button, Typography, Box, Slider,
  IconButton,
  TablePagination,
  RadioGroup,
  FormControlLabel,
  DialogActions,
  DialogContent,
  TextField,
  Dialog,
  DialogTitle,
  Radio,
  Container
} from '@mui/material';
import { db } from "../../firebase/firebase"; // Asegúrate de tener tu config Firebase
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { Delete, Edit } from '@mui/icons-material';
import { doc, deleteDoc } from "firebase/firestore";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  rol: 'user' | 'admin';
  flats: number;
};

const calculateAge = (birthDate: string): number => {
  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const ListUsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [ageRange, setAgeRange] = useState<number[]>([0, 100]);
  const [flatsRange, setFlatsRange] = useState<number[]>([0, 50]);

  const [sortField, setSortField] = useState<'firstName' | 'lastName'>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);


  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>),
      }));
      console.log(users);
      setUsers(usersData);
      setFilteredUsers(applySorting(usersData));
    };
    fetchUsers();
  }, []);

  // Este efecto escucha los cambios en el campo de ordenamiento, dirección o el filtro de rol 
  // y re-aplica el ordenamiento cada vez que cambien.
  useEffect(() => {
    const base = roleFilter === 'all' ? users : users.filter(u => u.rol === roleFilter);
    setFilteredUsers(applySorting(base));
  }, [sortField, sortDirection, roleFilter]);

  const applySorting = (data: User[]) => {
    return [...data].sort((a, b) => {
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSortChange = (value: 'firstName' | 'lastName') => {
    setSortField(value);
  };

  const handleDirectionChange = (value: 'asc' | 'desc') => {
    setSortDirection(value);
  };

  const handleRoleChange = (value: 'all' | 'user' | 'admin') => {
    setRoleFilter(value);

    let updatedList = [...users];

    // Aplica filtro de rol si es necesario
    if (value !== 'all') {
      updatedList = updatedList.filter(user => user.rol === value);
    }
    // Reaplicar ordenamiento actual
    updatedList = applySorting(updatedList);
    // Mostrar resultado final
    setFilteredUsers(updatedList);
  };

  const applyAgeFilter = () => {
    const filtered = users.filter(user => {
      const age = calculateAge(user.birthDate);
      return age >= ageRange[0] && age <= ageRange[1];
    });
    setFilteredUsers(applySorting(filtered));
  };

  const applyFlatsFilter = () => {
    const filtered = users.filter(user => {
      return user.flats >= flatsRange[0] && user.flats <= flatsRange[1];
    });
    setFilteredUsers(applySorting(filtered));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    console.log("Pasa por handleOpenEdit: ", user)
    setEditOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteUserId) {
      await deleteDoc(doc(db, "users", deleteUserId));
      const updated = users.filter((user) => user.id !== deleteUserId);
      setUsers(updated);
      setFilteredUsers(applySorting(updated));
      setDeleteUserId(null);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, "users", selectedUser.id);
      const { id, ...dataToUpdate } = selectedUser; // omitimos el ID
      await updateDoc(userRef, dataToUpdate);
      setEditOpen(false);
      // Refrescar lista
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const updated = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(updated);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };


  return (
    <Container>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        All Users
      </Typography>

      {/* Ordenamientos y Filtros */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 2 }}>
        {/* Filtro por rol */}
        <FormControl sx={{ minWidth: 100 }} size="small">
          <InputLabel>Rol</InputLabel>
          <Select
            value={roleFilter}
            label="Rol"
            onChange={(e) => handleRoleChange(e.target.value as 'all' | 'user' | 'admin')}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        {/* Ordenamiento por Nombre, Apellido */}
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortField}
            label="Ordenar por"
            onChange={(e) => handleSortChange(e.target.value as 'firstName' | 'lastName')}
          >
            <MenuItem value="firstName">Nombre</MenuItem>
            <MenuItem value="lastName">Apellido</MenuItem>
          </Select>
        </FormControl>

        {/* Ordenamiento por Dirección: Ascendente, Descendente */}
        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Dirección</InputLabel>
          <Select
            value={sortDirection}
            label="Dirección"
            onChange={(e) => handleDirectionChange(e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">Ascendente</MenuItem>
            <MenuItem value="desc">Descendente</MenuItem>
          </Select>
        </FormControl>

          {/* <Box display="flex" gap={4} mb={2} flexWrap="wrap"> */}
          <Box>
            <Typography variant="body1" sx={{ textAlign: 'center'}}>Edad</Typography>
            <Slider
              value={ageRange}
              onChange={(_, newValue) => setAgeRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Button variant="contained" onClick={applyAgeFilter}>Aplicar Filtro Edad</Button>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ textAlign: 'center'}}>Flats</Typography>
            <Slider
              value={flatsRange}
              onChange={(_, newValue) => setFlatsRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={50}
            />
            <Button variant="contained" onClick={applyFlatsFilter}>Aplicar Filtro Flats</Button>
          </Box>
        {/* </Box> */}
      </Box>
      
      {/* Tabla encabezado - titulo*/}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ height: '36px', '& th': { fontSize: '0.85rem', py: 0.5 } }}>
            <TableRow sx={{ borderBottom: '2px solid #1976d2', height: '32px' }}>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Apellido</strong></TableCell>
              <TableCell><strong>Fecha Nacimiento</strong></TableCell>
              <TableCell><strong>Edad</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell><strong>Flats</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          {/* Tabla carga del contenido */}
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow
                key={user.id}
                sx={{
                  borderBottom: '2px solid #1976d2',
                  height: '32px',
                  '& td': { fontSize: '0.85rem', py: 0.5 }
                }}
              >
                <TableCell>{user.email || '—'}</TableCell>
                <TableCell>{user.firstName || '—'}</TableCell>
                <TableCell>{user.lastName || '—'}</TableCell>
                <TableCell>{user.birthDate || '—'}</TableCell>
                <TableCell>{calculateAge(user.birthDate) || '—'}</TableCell>
                <TableCell>{user.rol || '—'}</TableCell>
                <TableCell>{user.flats || '0'}</TableCell>
                <TableCell>
                  {/* Se agrega íconos de editar/eliminar */}
                  <IconButton size="small" color="primary" onClick={() => handleOpenEdit(user)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  {/* <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}> */}
                  <IconButton size="small" color="error" onClick={() => setDeleteUserId(user.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página"
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Diálogo de edición (editar)*/}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={selectedUser?.email || ''}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="firstName"
            value={selectedUser?.firstName || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Apellido"
            name="lastName"
            value={selectedUser?.lastName || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Fecha de Nacimiento"
            name="birthDate"
            value={selectedUser?.birthDate || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={selectedUser?.password || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Rol:
          </Typography>
          <RadioGroup
            row
            name="rol"
            value={selectedUser?.rol || 'user'}
            onChange={handleEditChange}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateUser}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de borrar (delete) usuario */}
      <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)}>
        <DialogTitle>¿Confirmar eliminación?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};


