
// UsersListChk.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grid,
} from '@mui/material';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from '@mui/material';

import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';


import {
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';

// import { admin } from "firebase-admin";

// const admin = require('firebase-admin');

//admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "/url/to/your/database"
// });

export const UsersListChk = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    rol: '', // 'user' | 'admin' | ''
    minAge: '',
    maxAge: '',
    minFlats: '',
    maxFlats: '',
  });

  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // or 'desc'


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("usersData:", usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  };
  const handleDelete = async (id, email) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas eliminar a "${email}"?`);
    if (confirm) {
       try {
        await deleteDoc(doc(db, "users", id));
        setUsers(prev => prev.filter(user => user.id !== id));
        } catch (error) {
          console.error("Error al eliminar:", error);
        };
      //  try {
      //   // Eliminar datos de Firestore
      //   await admin.firestore().doc(`users/${id}`).delete();

      //   //Eliminar del servicio de autenticación
      //   // await admin.auth().deleteUser(id);

      //   console.log(`Usuario ${id} eliminado completamente`);
      // } catch (error) {
      //   console.error("Error al eliminar el usuario:", error.message);
      // }
    };
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, "users", selectedUser.id);
      const { id, ...dataToUpdate } = selectedUser; // omitimos el ID
      await updateDoc(userRef, dataToUpdate);
      setOpenEdit(false);
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
    <Grid>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          All Users
        </Typography>

        <TableContainer component={Paper}>
          <Table>

            <TableHead sx={{ height: '36px', '& th': { fontSize: '0.85rem', py: 0.5 } }}>
              <TableRow sx={{ borderBottom: '2px solid #1976d2', height: '32px' }}>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Apellido</strong></TableCell>
                <TableCell><strong>Fec. Nacimiento</strong></TableCell>
                <TableCell><strong>Rol</strong></TableCell>
                <TableCell><strong># Flats</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} sx={{
                  borderBottom: '2px solid #1976d2',
                  height: '32px',
                  '& td': { fontSize: '0.85rem', py: 0.5 },
                }}>
                  <TableCell>{user.email || '—'}</TableCell>
                  <TableCell>{user.firstName || '—'}</TableCell>
                  <TableCell>{user.lastName || '—'}</TableCell>
                  <TableCell>{user.birthDate || '—'}</TableCell>
                  <TableCell>{user.rol || '—'}</TableCell>
                  <TableCell>{user.numberFlats || '—'}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id, user.email)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
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
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={handleUpdateUser} variant="contained">Guardar</Button>
          </DialogActions>

        </Dialog>
      </Container>
    </Grid >
  );
};






