import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Box,
  Typography, Stack, Alert, useTheme,
  useMediaQuery
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import NavbarAdmin from '../../components/NavbarAdmin';
import backgroundImage from '../../assets/images/imagen_background_club.png';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

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

const AdminTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [open, setOpen] = useState(false);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [estado, setEstado] = useState('');
  const [canchaId, setCanchaId] = useState('');
  const [canchas, setCanchas] = useState([]);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [duracionEnMinutos, setDuracionEnMinutos] = useState('');
  const [fechaDesdeInput, setFechaDesdeInput] = useState('');
  const [fechaHastaInput, setFechaHastaInput] = useState('');
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [fecha, setFecha] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [openMassiveChargeDialog, setOpenMassiveChargeDialog] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [turnoToDelete, setTurnoToDelete] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTurnos();
    fetchCanchas();
  }, []);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const fetchTurnos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/turnos`, tokenConfig);
      if (response.data && response.data.length > 0) {
        const sortedReservas = response.data
          .sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA - dateB;
            }
            return new Date(a.hora) - new Date(b.hora);
          })
          .filter(reserva => new Date(reserva.fecha) >= new Date());
        setTurnos(sortedReservas);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/login');
      } else if (error.response && error.response.status === 404) {
        setTurnos([]);
      } else {
        console.error('Error fetching turnos:', error);
      }
    }
  };

  const fetchTurnosByFecha = async (fechaDesde, fechaHasta) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/turnos/filtrar`, {
        params: { fechaDesde, fechaHasta },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTurnos(response.data);
      if (response.data.length === 0) {
        setError('No se encontraron turnos en el rango de fechas especificado.');
      } else {
        setError('');
      }
    } catch (error) {
      setError('Error al buscar turnos: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSearch = () => {

    if (!fechaDesdeInput || !fechaHastaInput) {
      setError('Por favor, asegúrate de que ambas fechas están seleccionadas.');
      return;
    }

    const fechaDesde = dayjs(fechaDesdeInput);
    const fechaHasta = dayjs(fechaHastaInput);

    if (!fechaDesde.isValid() || !fechaHasta.isValid()) {
      setError('Alguna de las fechas no es válida.');
      return;
    }

    if (dayjs(fechaDesde).isAfter(fechaHasta)) {
      setError('La fecha "Desde" no puede ser mayor que la fecha "Hasta".');
      return;
    }

    setError('');
    fetchTurnosByFecha(
      fechaDesde.format('YYYY-MM-DD'),
      fechaHasta.format('YYYY-MM-DD')
    );
  };

  const fetchCanchas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/canchas`, tokenConfig);
      if (response && response.data) {
        setCanchas(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
      console.error('Error fetching canchas:', error);
    }
  };

  const handleEdit = (turno) => {
    setSelectedTurno(turno);
    setFecha(turno.fecha);
    setHoraInicio(turno.horaInicio);
    setHoraFin(turno.horaFin);
    setEstado(turno.estado);
    setCanchaId(turno.cancha.id);
    setInitialValues(turno);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/turnos/${id}`, tokenConfig);
    fetchTurnos();
  };

  const handleSave = async () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      setError("Por favor, selecciona un rango de fechas.");
      return;
    }
    if (!horaInicio || !horaFin) {
      setError("Por favor, selecciona las horas de inicio y fin.");
      return;
    }
    const turnoData = {
      fechaDesde: dayjs(selectedDates[0]).format('YYYY-MM-DD'),
      fechaHasta: dayjs(selectedDates[1]).format('YYYY-MM-DD'),
      horaDesde: `${horaInicio}:00`,
      horaHasta: `${horaFin}:00`,
      duracionEnMinutos: parseInt(duracionEnMinutos, 10),
      canchaId: canchaId,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/turnos/massive-charge`,
        turnoData,
        tokenConfig
      );
      fetchTurnos();
      setOpenMassiveChargeDialog(false);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Error al guardar los turnos.");
    }
  };

  const handleSaveEdit = async () => {
    const turnoData = {};
    if (canchaId !== initialValues.canchaId) turnoData.canchaId = canchaId;
    if (fecha !== initialValues.fecha) turnoData.fecha = fecha;
    if (horaInicio !== initialValues.horaInicio) turnoData.horaInicio = horaInicio;
    if (horaFin !== initialValues.horaFin) turnoData.horaFin = horaFin;
    if (estado !== initialValues.estado) turnoData.estado = estado;
    if (Object.keys(turnoData).length > 0) {
      if (selectedTurno) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/turnos/${selectedTurno.id}`, turnoData, tokenConfig);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/turnos`, turnoData, tokenConfig);
      }
    }
    fetchTurnos();
    setOpen(false);
  };

  const handleDeleteClick = (id) => {
    setTurnoToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(turnoToDelete);
    setConfirmDialogOpen(false);
    setTurnoToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setTurnoToDelete(null);
  };

  const sortedCanchas = canchas.sort((a, b) => a.deporte.localeCompare(b.deporte));

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NavbarAdmin />

        <Box sx={{ textAlign: 'center', padding: 4 }}>

          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center" alignItems={'center'}>
            <Button
              variant="contained"
              color="custom"
              startIcon={<Add />}
              onClick={() => setOpenMassiveChargeDialog(true)}
              sx={buttonStyle}
            >
              Cargar Turnos
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

        {error && (
          <Stack spacing={2} sx={{ width: '100%', px: 2, mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}

        <Box
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            py: 4
          }}>

          {!isMobile && (
            <TableContainer component={Paper} >
              {turnos.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                    No hay turnos aún
                  </Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Fecha</StyledTableCell>
                      <StyledTableCell align="center">Hora Inicio</StyledTableCell>
                      <StyledTableCell align="center">Hora Fin</StyledTableCell>
                      <StyledTableCell align="center">Estado</StyledTableCell>
                      <StyledTableCell align="center">Cancha</StyledTableCell>
                      <StyledTableCell align="center">Acciones</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {turnos.map(turno => (
                      <TableRow key={turno.id}>
                        <TableCell align="center">{dayjs(turno.fecha).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="center">{turno.horaInicio}</TableCell>
                        <TableCell align="center">{turno.horaFin}</TableCell>
                        <TableCell align="center">
                          <Typography
                            style={{
                              color: turno.estado === 'DISPONIBLE' ? 'green' : turno.estado === 'RESERVADO' ? 'orange' : 'red',
                              fontFamily: 'Bungee, sans-serif'
                            }}>
                            {turno.estado}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{turno.cancha.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton color='custom' onClick={() => handleEdit(turno)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteClick(turno.id)}>
                            <Delete />
                          </IconButton>
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
              {turnos.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif', color: 'white' }}>
                    No hay turnos aún
                  </Typography>
                </Box>
              ) : (
                turnos.map(turno => (
                  <Paper key={turno.id} sx={{ mb: 2, p: 2, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif', color: turno.estado === "DISPONIBLE" ? 'green' : turno.estado === "RESERVADO" ? 'orange' : 'red' }}> {turno.estado}</Typography>
                    <hr />
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Fecha:</strong> {dayjs(turno.fecha).format('DD/MM/YYYY')}</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Hora:</strong> {turno.horaInicio} <strong>a</strong> {turno.horaFin}</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Cancha:</strong> {turno.cancha.nombre}</Typography>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <IconButton color="custom" onClick={() => handleEdit(turno)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(turno.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          )}

          <Dialog open={openMassiveChargeDialog} onClose={() => setOpenMassiveChargeDialog(false)} disableScrollLock>
            <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Cargar Turnos Masivamente</DialogTitle>
            <DialogContent>
              <DateRangePicker
                startText="Inicio"
                endText="Fin"
                value={selectedDates}
                onChange={setSelectedDates}
                minDate={dayjs()}
              />
              <TextField
                color="custom"
                margin="dense"
                label="Hora de Inicio"
                fullWidth
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
              <TextField
                color="custom"
                margin="dense"
                label="Hora de Fin"
                fullWidth
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
              <TextField
                color="custom"
                margin="dense"
                label="Duración en Minutos"
                fullWidth
                type="number"
                value={duracionEnMinutos}
                onChange={(e) => setDuracionEnMinutos(e.target.value)}
                required
              />
              <FormControl fullWidth margin="dense" color="custom">
                <InputLabel>Cancha</InputLabel>
                <Select
                  value={canchaId}
                  onChange={(e) => setCanchaId(e.target.value)}
                  required
                >
                  {sortedCanchas.map((cancha) => (
                    <MenuItem key={cancha.id} value={cancha.id}>
                      {cancha.deporte} - {cancha.nombre} - ({cancha.tipo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense" color="custom">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                  <MenuItem value="RESERVADO">RESERVADO</MenuItem>
                  <MenuItem value="BORRADO">BORRADO</MenuItem>
                </Select>
              </FormControl>
              {error && (
                <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
                  <Alert severity="error">{error}</Alert>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMassiveChargeDialog(false)} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Cancelar
              </Button>
              <Button onClick={handleSave} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
            <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }} >Editar Turno</DialogTitle>
            <DialogContent>
              <TextField
                color="custom"
                autoFocus
                margin="dense"
                fullWidth
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                focused
              />
              <TextField
                color="custom"
                margin="dense"
                label="Hora de Inicio"
                focused
                fullWidth
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
              <TextField
                color="custom"
                margin="dense"
                label="Hora de Fin"
                fullWidth
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
                focused
              />
              <FormControl fullWidth margin="dense" color="custom">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                  <MenuItem value="RESERVADO">RESERVADO</MenuItem>
                  <MenuItem value="BORRADO">BORRADO</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense" color="custom">
                <InputLabel>Cancha</InputLabel>
                <Select
                  value={canchaId}
                  onChange={(e) => setCanchaId(e.target.value)}
                >
                  {canchas.map((cancha) => (
                    <MenuItem key={cancha.id} value={cancha.id}>
                      {cancha.nombre} - ({cancha.tipo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
            <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
              <Button onClick={handleConfirmDelete} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>Eliminar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AdminTurnos;

