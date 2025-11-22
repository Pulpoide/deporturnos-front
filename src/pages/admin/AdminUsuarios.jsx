import { useState, useEffect, useRef } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel,
  Box, Typography, useTheme, useMediaQuery, Pagination, Stack
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Edit, Delete, Lock, LockOpen } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import backgroundImage from '../../assets/images/imagen_background_club.png';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontFamily: 'Fjalla One, sans-serif',
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const AdminUsuarios = () => {
  const [usuariosPage, setUsuariosPage] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0, size: 10 });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchDebounceRef = useRef(null);

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
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [confirmAccountStatusDialogOpen, setConfirmAccountStatusDialogOpen] = useState(false);
  const [usuarioToUpdate, setUsuarioToUpdate] = useState(null);
  const [newAccountStatus, setNewAccountStatus] = useState(true);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, debouncedSearch]);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0); 
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  const fetchUsuarios = async () => {
    try {
      const params = {
        page,
        size,
      };
      if (debouncedSearch && debouncedSearch.length > 0) {
        params.search = debouncedSearch;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/usuarios`,
        {
          ...tokenConfig,
          params,
        }
      );

      if (response && response.data) {
        const pageData = response.data;
        setUsuariosPage({
          content: pageData.content || [],
          totalPages: pageData.totalPages ?? 0,
          totalElements: pageData.totalElements ?? 0,
          number: pageData.number ?? page,
          size: pageData.size ?? size,
        });
      } else {
        setUsuariosPage({ content: [], totalPages: 0, totalElements: 0, number: 0, size });
      }
    } catch (error) {
      console.error('Error fetchUsuarios:', error);
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
    }
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, tokenConfig);
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);
    }
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

  const handleRoleChange = async (id, newRole) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/role`, { rol: newRole }, tokenConfig);
    fetchUsuarios();
  };

  const handleRoleChangeClick = (usuario) => {
    setUsuarioToUpdate(usuario);
    setConfirmRoleDialogOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!usuarioToUpdate) return;
    const newRole = usuarioToUpdate.rol === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
    await handleRoleChange(usuarioToUpdate.id, newRole);
    setConfirmRoleDialogOpen(false);
    setUsuarioToUpdate(null);
  };

  const handleCancelRoleChange = () => {
    setConfirmRoleDialogOpen(false);
    setUsuarioToUpdate(null);
  };

  const handleAccountStatusChange = async (id, status) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/account`, { enabled: status }, tokenConfig);
    fetchUsuarios();
  };

  const handleAccountStatusChangeClick = (usuario, status) => {
    setUsuarioToUpdate(usuario);
    setNewAccountStatus(status);
    setConfirmAccountStatusDialogOpen(true);
  };

  const handleConfirmAccountStatusChange = async () => {
    if (!usuarioToUpdate) return;
    await handleAccountStatusChange(usuarioToUpdate.id, newAccountStatus);
    setConfirmAccountStatusDialogOpen(false);
    setUsuarioToUpdate(null);
  };

  const handleCancelAccountStatusChange = () => {
    setConfirmAccountStatusDialogOpen(false);
    setUsuarioToUpdate(null);
  };

  const handleSave = async () => {
    const updatedFields = {};
    if (nombre !== initialValues.nombre) updatedFields.nombre = nombre;
    if (email !== initialValues.email) updatedFields.email = email;
    if (telefono !== initialValues.telefono) updatedFields.telefono = telefono;
    if (notificaciones !== initialValues.notificaciones) updatedFields.notificaciones = notificaciones;
    if (rol !== initialValues.rol) updatedFields.rol = rol;
    if (password !== '') updatedFields.password = password;

    if (Object.keys(updatedFields).length > 0) {
      if (selectedUsuario) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${selectedUsuario.id}`, updatedFields, tokenConfig);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios`, updatedFields, tokenConfig);
      }
    }

    fetchUsuarios();
    setOpen(false);
    setSelectedUsuario(null);
  };

  const onChangePage = (event, value) => {
    setPage(value - 1);
  };

  const onChangeSize = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);
    setPage(0);
  };

  const totalPages = usuariosPage.totalPages ?? 0;
  const usuarios = usuariosPage.content ?? [];
  const totalElements = usuariosPage.totalElements ?? 0;
  const currentPage = usuariosPage.number ?? 0;
  const pageSize = usuariosPage.size ?? size;
  const startIndex = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min(totalElements, (currentPage + 1) * pageSize);

  return (
    <>
      <NavbarAdmin />

      <Box
        sx={{ textAlign: 'center', padding: 4 }}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >

          <TextField
            label="Buscar por nombre o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            placeholder="Escribe nombre o email..."
          />

          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 120 }}>
            <InputLabel id="select-size-label">Mostrar</InputLabel>
            <Select
              labelId="select-size-label"
              value={size}
              label="Mostrar"
              onChange={onChangeSize}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          {!isMobile && (
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {usuariosPage.totalElements ?? 0} usuarios
            </Typography>
          )}

        </Stack>

        {isMobile && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            {usuariosPage.totalElements ?? 0} usuarios
          </Typography>
        )}
      </Box>



      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        {/* Desktop table */}
        {!isMobile && (
          <TableContainer component={Paper} sx={{ width: '95%', maxWidth: 1200, margin: '0 auto 24px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['ID', 'Nombre', 'Email', 'Teléfono', 'Notifs', 'Rol', 'Activa', 'Acciones'].map(h => (
                    <StyledTableCell key={h} align="center">{h}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="textSecondary">No hay usuarios</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map(u => (
                    <TableRow key={u.id}>
                      <TableCell align="center">{u.id}</TableCell>
                      <TableCell align="center">{u.nombre}</TableCell>
                      <TableCell align="center">{u.email}</TableCell>
                      <TableCell align="center">{u.telefono}</TableCell>
                      <TableCell align="center">{u.notificaciones ? 'Sí' : 'No'}</TableCell>
                      <TableCell align="center">{u.rol}</TableCell>
                      <TableCell align="center">{u.activada ? 'Sí' : 'No'}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton color='black' onClick={() => handleEdit(u)}><Edit /></IconButton>
                          {u.id !== 1 && (
                            <IconButton color="error" onClick={() => handleDeleteClick(u.id)}>
                              <Delete />
                            </IconButton>
                          )}
                          {u.id !== 1 && (
                            <IconButton color='black' onClick={() => handleRoleChangeClick(u)}>
                              {u.rol === 'ADMIN' ? <VerifiedIcon color='primary' /> : <PersonIcon />}
                            </IconButton>
                          )}
                          {u.id !== 1 && (
                            <IconButton onClick={() => handleAccountStatusChangeClick(u, !u.activada)}>
                              {u.activada ? <LockOpen color="action" /> : <Lock color="action" />}
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'Fjalla One, sans-serif' }}
                >
                  {totalElements === 0
                    ? 'Mostrando 0'
                    : `Mostrando ${startIndex} - ${endIndex} de ${totalElements}`}
                </Typography>

                <Pagination
                  count={Math.max(1, totalPages)}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  size="small"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontFamily: "Fjalla One, sans-serif",
                    }
                  }}
                />
              </Box>
            )}
          </TableContainer>
        )}

        {/* Mobile list */}
        {isMobile && (
          <Box sx={{ px: 2 }}>
            {usuarios.map(u => (
              <Paper key={u.id} sx={{ mb: 2, p: 2 }}>
                <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif' }}>#{u.id} {u.nombre}</Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Bungee, sans-serif',
                    color: u.rol === 'ADMIN' ? 'green' : 'orange'
                  }}
                >
                  {u.rol}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>{u.email}</Typography>
                <Typography variant="body1">Tel: {u.telefono}</Typography>
                <Typography variant="body1">Activa: {u.activada ? 'Sí' : 'No'}</Typography>
                <Typography variant="body1">Notificaciones {u.notificaciones ? 'activadas' : 'desactivadas'}</Typography>
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <IconButton color='black' onClick={() => handleEdit(u)}><Edit /></IconButton>
                  {u.id !== 1 && (
                    <IconButton color="error" onClick={() => handleDeleteClick(u.id)}>
                      <Delete />
                    </IconButton>
                  )}
                  {u.id !== 1 && (
                    <IconButton color='black' onClick={() => handleRoleChangeClick(u)}>
                      {u.rol === 'ADMIN' ? <VerifiedIcon color='primary' /> : <PersonIcon color='black' />}
                    </IconButton>
                  )}
                  {u.id !== 1 && (
                    <IconButton onClick={() => handleAccountStatusChangeClick(u, !u.activada)}>
                      {u.activada ? <LockOpen color="action" /> : <Lock color="action" />}
                    </IconButton>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* DIALOGS */}
        <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
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
            <Button onClick={() => setOpen(false)} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button onClick={handleSave} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmRoleDialogOpen} onClose={handleCancelRoleChange} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar cambio de rol</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>
              ¿Estás seguro de cambiar el rol de este usuario a {usuarioToUpdate?.rol === 'ADMIN' ? 'Cliente' : 'Administrador'}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelRoleChange} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button onClick={handleConfirmRoleChange} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>Confirmar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmAccountStatusDialogOpen} onClose={handleCancelAccountStatusChange} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar cambio de estado de cuenta</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>
              ¿Estás seguro de {newAccountStatus ? 'activar' : 'desactivar'} esta cuenta?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelAccountStatusChange} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button onClick={handleConfirmAccountStatusChange} color={newAccountStatus ? "custom" : "error"} sx={{ fontFamily: 'Bungee, sans-serif' }}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button onClick={handleConfirmDelete} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default AdminUsuarios;
