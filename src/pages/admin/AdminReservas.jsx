import { useState, useEffect } from "react";
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, Select, Box, InputLabel, FormControl, Typography, TextField,
  useTheme, useMediaQuery, Stack
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import NavbarAdmin from '../../components/NavbarAdmin';
import backgroundImage from '../../assets/images/imagen_background_club.png';
import { useNavigate } from "react-router";
import dayjs from "dayjs";

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

const buttonStyle = {
  marginTop: '1.2rem',
  marginBottom: '1.2rem',
  fontFamily: 'Bungee, sans-serif',
  minWidth: 120,
  width: '100%',
  maxWidth: 220,
};

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [usuarioId, setUsuarioId] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [estado, setEstado] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [fechaDesdeInput, setFechaDesdeInput] = useState('');
  const [fechaHastaInput, setFechaHastaInput] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchReservas();
    fetchUsuarios();
    fetchTurnos();
  }, []);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const fetchReservas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservas`, tokenConfig);
      setReservas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/login');
      } else if (error.response && error.response.status === 404) {
        setReservas([]);
      } else {
        console.error('Error fetchReservas:', error);
      }
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, tokenConfig);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetchUsuarios:', error);
    }
  };

  const fetchTurnos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/turnos`, tokenConfig);
      if (response.data && response.data.length > 0) {
        const sortedReservas = response.data
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .filter(reserva => new Date(reserva.fecha) >= new Date());
        setTurnos(sortedReservas);
      } else {
        setTurnos([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTurnos([]);
      } else {
        console.error('Error fetchTurnos:', error);
      }
    }
  };

  const fetchReservasByFecha = async (fechaDesde, fechaHasta) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservas/filtrar`, {
        params: { fechaDesde, fechaHasta },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas by fecha:', error.response?.data || error.message);
    }
  };

  const handleSearch = () => {
    const fechaDesde = dayjs(fechaDesdeInput).format('YYYY-MM-DD');
    const fechaHasta = dayjs(fechaHastaInput).format('YYYY-MM-DD');
    if (fechaDesde && fechaHasta) {
      fetchReservasByFecha(fechaDesde, fechaHasta);
    } else {
      console.error('Por favor, asegúrate de que ambas fechas están seleccionadas.');
    }
  };

  const handleAdd = () => {
    setSelectedReserva('');
    setUsuarioId('');
    setTurnoId('');
    setEstado('CONFIRMADA');
    setOpen(true);
  };

  const handleEdit = (reserva) => {
    setSelectedReserva(reserva);
    setUsuarioId(reserva.usuario.id);
    setTurnoId(reserva.turno.id);
    setEstado(reserva.estado);
    setInitialValues(reserva);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/reservas/${id}`, tokenConfig);
    fetchReservas();
  };

  const handleDeleteClick = (id) => {
    setReservaToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(reservaToDelete);
    setConfirmDialogOpen(false);
    setReservaToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setReservaToDelete(null);
  };

  const handleSave = async () => {
    const oldReservaData = initialValues && initialValues.usuario && initialValues.turno ? {
      usuarioId: initialValues.usuario.id,
      turnoId: initialValues.turno.id,
      estado: initialValues.estado,
    } : null;
    const reservaData = {};
    if (oldReservaData) {
      if (JSON.stringify(oldReservaData) === JSON.stringify(reservaData)) {
        return;
      }
    }
    if (usuarioId && (!oldReservaData || usuarioId !== oldReservaData.usuarioId)) {
      reservaData.usuarioId = usuarioId;
    }
    if (turnoId && (!oldReservaData || turnoId !== oldReservaData.turnoId)) {
      reservaData.turnoId = turnoId;
    }
    if (estado && (!oldReservaData || estado !== oldReservaData.estado)) {
      reservaData.estado = estado;
    }
    if (Object.keys(reservaData).length > 0) {
      try {
        if (selectedReserva) {
          await axios.put(`${import.meta.env.VITE_API_URL}/api/reservas/${selectedReserva.id}`, reservaData, tokenConfig);
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/reservas`, reservaData, tokenConfig);
        }
      } catch (error) {
        console.log(error.response.data.message);
        console.error(error.response);
      }
    }
    fetchReservas();
    setOpen(false);
  };

  return (
    <>
      <NavbarAdmin />
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          justifyContent="center"
          alignItems={'center'}
        >
          <Button
            variant="contained"
            color="custom"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={buttonStyle}
          >
            Agregar Reserva
          </Button>

          <TextField
            label="Fecha Desde"
            type="date"
            onChange={e => setFechaDesdeInput(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Fecha Hasta"
            type="date"
            onChange={e => setFechaHastaInput(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            color="custom"
            onClick={handleSearch}
            sx={buttonStyle}
          >
            Buscar
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          py: 4
        }}>

        {!isMobile && (
          <TableContainer component={Paper}>
            {reservas.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                  No hay reservas aún
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Fecha Reserva</StyledTableCell>
                    <StyledTableCell align="center">Fecha Turno</StyledTableCell>
                    <StyledTableCell align="center">Hora Inicio</StyledTableCell>
                    <StyledTableCell align="center">Hora Fin</StyledTableCell>
                    <StyledTableCell align="center">Usuario</StyledTableCell>
                    <StyledTableCell align="center">Turno ID</StyledTableCell>
                    <StyledTableCell align="center">Cancha</StyledTableCell>
                    <StyledTableCell align="center">Estado</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservas.map(r => (
                    <TableRow key={r.id}>
                      <TableCell align="center">{dayjs(r.fecha).format('DD/MM/YYYY')}</TableCell>
                      <TableCell align="center">{dayjs(r.turno.fecha).format('DD/MM/YYYY')}</TableCell>
                      <TableCell align="center">{r.turno.horaInicio}</TableCell>
                      <TableCell align="center">{r.turno.horaFin}</TableCell>
                      <TableCell align="center">{r.usuario.nombre}</TableCell>
                      <TableCell align="center">{r.turno.id}</TableCell>
                      <TableCell align="center">{r.turno.cancha.nombre}</TableCell>
                      <TableCell align="center">
                        <Typography style={{color: r.estado === "CONFIRMADA" ? 'green' : r.estado === "CANCELADA" ? 'red' : 'orange' , fontFamily: 'Bungee, sans-serif' }}>{r.estado}</Typography></TableCell>
                      <TableCell align="center">
                        <IconButton color="custom" onClick={() => handleEdit(r)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(r.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        )}

        {isMobile && (
          <Box sx={{ px: 2 }}>
            {reservas.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif', color:'white' }}>
                  No hay reservas aún
                </Typography>
              </Box>
            ) : (
              reservas.map(r => (
                <Paper key={r.id} sx={{ mb: 2, p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif', color: r.estado === "CONFIRMADA" ? 'green' : r.estado === "CANCELADA" ? 'red' : 'orange' }}>{r.estado}</Typography>
                  <hr />
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Fecha de Reserva:</strong> {dayjs(r.fecha).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Nombre de Usuario:</strong> {r.usuario.nombre}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Turno ID:</strong> {r.turno.id}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Fecha de Turno:</strong> {dayjs(r.turno.fecha).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Hora: </strong>{r.turno.horaInicio} <strong>a</strong> {r.turno.horaFin}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Cancha:</strong> {r.turno.cancha.nombre}</Typography>
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <IconButton color="custom" onClick={() => handleEdit(r)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(r.id)}><Delete /></IconButton>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>{selectedReserva ? 'Editar Reserva' : 'Agregar Reserva'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense" color="custom">
              <InputLabel>Usuario</InputLabel>
              <Select value={usuarioId} onChange={e => setUsuarioId(e.target.value)}>
                {usuarios.map(u => <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" color="custom">
              <InputLabel>Turno</InputLabel>
              <Select value={turnoId} onChange={e => setTurnoId(e.target.value)}>
                {turnos.map(t => <MenuItem key={t.id} value={t.id}>{`${t.id} - ${dayjs(t.fecha).format('DD/MM/YYYY')} ${t.horaInicio}-${t.horaFin}`}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" color="custom">
              <InputLabel>Estado</InputLabel>
              <Select value={estado} onChange={e => setEstado(e.target.value)}>
                {['CONFIRMADA', 'MODIFICADA', 'CANCELADA', 'COMPLETADA', 'EN_PROCESO'].map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button color="black" onClick={() => setOpen(false)} sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button color="custom" onClick={handleSave} sx={{ fontFamily: 'Bungee, sans-serif' }}>Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button onClick={handleConfirmDelete} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>Eliminar</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </>
  );
};

export default AdminReservas;