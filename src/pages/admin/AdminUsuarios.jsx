import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel,
  Box, Typography, Stack, useTheme, useMediaQuery
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete, Lock, LockOpen } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontFamily: 'Fjalla One, sans-serif',
    fontSize: 18,
  },
  [`.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const buttonStyle = {
  marginTop: '1.2rem',
  marginBottom: '1.2rem',
  fontFamily: 'Bungee, sans-serif',
  minWidth: 120,
  width: '100%',
  maxWidth: 220,
};

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notificaciones, setNotificaciones] = useState(false);
  const [rol, setRol] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/usuarios', tokenConfig);
      if (response && response.data) {
        setUsuarios(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleAdd = () => {
    setSelectedUsuario(null);
    setNombre('');
    setEmail('');
    setPassword('');
    setTelefono('');
    setNotificaciones(false);
    setRol('');
    setOpen(true);
    setInitialValues({});
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setNombre(usuario.nombre || '');
    setEmail(usuario.email || '');
    setPassword('');
    setTelefono(usuario.telefono || '');
    setNotificaciones(usuario.notificaciones || false);
    setRol(usuario.rol || '');
    setOpen(true);
    setInitialValues(usuario);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/usuarios/${id}`, tokenConfig);
    } catch (err) { }
    fetchUsuarios();
  };

  const handleDeleteClick = (id) => {
    setUsuarioToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(usuarioToDelete);
    setConfirmDialogOpen(false);
    setUsuarioToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setUsuarioToDelete(null);
  };

  const handleSave = async () => {
    const updatedFields = {};
    if (nombre !== initialValues.nombre) updatedFields.nombre = nombre;
    if (email !== initialValues.email) updatedFields.email = email;
    if (password !== '') updatedFields.password = password;
    if (telefono !== initialValues.telefono) updatedFields.telefono = telefono;
    if (notificaciones !== initialValues.notificaciones) updatedFields.notificaciones = notificaciones;
    if (rol !== initialValues.rol) updatedFields.rol = rol;
    if (Object.keys(updatedFields).length > 0) {
      if (selectedUsuario) {
        await axios.put(`http://localhost:8080/api/usuarios/${selectedUsuario.id}`, updatedFields, tokenConfig);
      } else {
        await axios.post('http://localhost:8080/api/auth/register', updatedFields, tokenConfig);
      }
    }
    fetchUsuarios();
    setOpen(false);
  };

  const handleRoleChange = async (id, newRole) => {
    await axios.put(`http://localhost:8080/api/usuarios/${id}/role`, { rol: newRole }, tokenConfig);
    fetchUsuarios();
  };

  const handleAccountStatusChange = async (id, status) => {
    await axios.put(`http://localhost:8080/api/usuarios/${id}/account`, { enabled: status }, tokenConfig);
    fetchUsuarios();
  };

  return (
    <>
      <NavbarAdmin />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center" alignItems="center">
          <Button variant="contained" color="custom" startIcon={<Add />} onClick={handleAdd} sx={buttonStyle}>Agregar Usuario</Button>
        </Stack>
      </Box>

      {!isMobile && (
        <TableContainer component={Paper} sx={{ mx: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID', 'Nombre', 'Email', 'Teléfono', 'Notifs', 'Rol', 'Activa', 'Acciones'].map(h => <StyledTableCell key={h} align="center">{h}</StyledTableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map(u => (
                <TableRow key={u.id}>
                  <TableCell align="center">{u.id}</TableCell>
                  <TableCell align="center">{u.nombre}</TableCell>
                  <TableCell align="center">{u.email}</TableCell>
                  <TableCell align="center">{u.telefono}</TableCell>
                  <TableCell align="center">{u.notificaciones ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="center">{u.rol}</TableCell>
                  <TableCell align="center">{u.activada ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(u)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(u.id)}><Delete /></IconButton>
                    <IconButton onClick={() => handleRoleChange(u.id, u.rol === 'ADMIN' ? 'CLIENTE' : 'ADMIN')}>
                      {u.rol === 'ADMIN' ? <VerifiedIcon color='primary' /> : <PersonIcon />}
                    </IconButton>
                    <IconButton onClick={() => handleAccountStatus(u.id, !u.enabled)}>
                      {u.activada ? <LockOpen /> : <Lock />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isMobile && (
        <Box sx={{ px: 2 }}>
          {usuarios.map(u => (
            <Paper key={u.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif'}}>#{u.id} {u.nombre}</Typography>
              <Typography variant="body1">Email: {u.email}</Typography>
              <Typography variant="body1">Tel: {u.telefono}</Typography>
              <Typography variant="body1">Notifs: {u.notificaciones ? 'Sí' : 'No'}</Typography>
              <Typography variant="body1">Rol: {u.rol}</Typography>
              <Typography variant="body1">Activa: {u.activada ? 'Sí' : 'No'}</Typography>
              <Box sx={{ mt: 1, textAlign: 'right' }}>
                <IconButton onClick={() => handleEdit(u)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDeleteClick(u.id)}><Delete /></IconButton>
                <IconButton onClick={() => handleRoleChange(u.id, u.rol === 'ADMIN' ? 'CLIENTE' : 'ADMIN')}>
                  {u.rol === 'ADMIN' ? <VerifiedIcon color='primary' /> : <PersonIcon />}
                </IconButton>
                <IconButton onClick={() => handleAccountStatus(u.id, !u.enabled)}>
                  {u.activada ? <LockOpen /> : <Lock />}
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>{selectedUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Email" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} sx={{ mb: 2 }} />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select value={rol} onChange={e => setRol(e.target.value)}>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="CLIENTE">Cliente</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel control={<Switch checked={notificaciones} onChange={e => setNotificaciones(e.target.checked)} color="primary" />} label="Recibe notificaciones" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
          <Button onClick={handleSave} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
        <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminUsuarios;
