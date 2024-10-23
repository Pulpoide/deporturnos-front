import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Box,
  Typography, Stack, Alert, Grid
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
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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


  const navigate = useNavigate();

  useEffect(() => {
    fetchTurnos();
    fetchCanchas();
  }, []);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchTurnos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/turnos', tokenConfig);
      
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
      const response = await axios.get('http://localhost:8080/api/turnos/filtrar', {
        params: { fechaDesde, fechaHasta },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTurnos(response.data);

      if (response.data.length === 0) {
        setError('No se encontraron turnos en el rango de fechas especificado.');
      } else {
        setError(''); // Limpiar error si la búsqueda es exitosa
      }
    } catch (error) {
      setError('Error al buscar turnos: ' + (error.response?.data?.message || error.message));
    }
  };


  const handleSearch = () => {
    const fechaDesde = dayjs(fechaDesdeInput).format('YYYY-MM-DD');
    const fechaHasta = dayjs(fechaHastaInput).format('YYYY-MM-DD');

    // Verificación si las fechas están seleccionadas y son válidas
    if (!fechaDesde || !fechaHasta) {
      setError('Por favor, asegúrate de que ambas fechas están seleccionadas.');
      return;
    }

    // Verificación adicional de que "fechaDesde" no sea mayor que "fechaHasta"
    if (dayjs(fechaDesde).isAfter(fechaHasta)) {
      setError('La fecha "Desde" no puede ser mayor que la fecha "Hasta".');
      return;
    }

    fetchTurnosByFecha(fechaDesde, fechaHasta);
  };



  const fetchCanchas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/canchas', tokenConfig);
      if (response && response.data) {
        setCanchas(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status == 403) {
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
    await axios.delete(`http://localhost:8080/api/turnos/${id}`, tokenConfig);
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
      const response = await axios.post(
        'http://localhost:8080/api/turnos/massive-charge',
        turnoData, // Aquí pasamos un solo objeto
        tokenConfig
      );

      console.log(response.data);
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
      console.log(turnoData)
      if (selectedTurno) {
        const res = await axios.put(`http://localhost:8080/api/turnos/${selectedTurno.id}`, turnoData, tokenConfig);
        console.log(res)
      } else {
        const res = await axios.post('http://localhost:8080/api/turnos', turnoData, tokenConfig);
        console.log(res)
      }
    }
    fetchTurnos();
    setOpen(false);
  };

  const sortedCanchas = canchas.sort((a, b) => a.deporte.localeCompare(b.deporte));

  const buttonStyle = { width: '33%', marginTop: '19px', marginBottom: '19px' };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NavbarAdmin />
        <Box
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'center'
          }}>
          <TableContainer component={Paper}>
            <Box justifyContent={'center'} display={'flex'}>
              <Button
                variant="contained"
                color="custom"
                startIcon={<Add />}
                onClick={() => setOpenMassiveChargeDialog(true)} // Abre el diálogo para cargar masivamente
                style={buttonStyle}
              >
                Cargar Turnos Masivamente
              </Button>
            </Box>
            <Box justifyContent={'center'} display={'flex'} marginBottom={2}>
              <TextField
                label="Fecha Desde"
                type="date"
                onChange={(e) => setFechaDesdeInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fecha Hasta"
                type="date"
                onChange={(e) => setFechaHastaInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                color="custom"
                onClick={handleSearch}
              >
                Buscar
              </Button>

            </Box>
            {error && (
              <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                <Alert severity="error">{error}</Alert>
              </Stack>
            )}
            {turnos.length === 0 ? (
              <Box justifyContent={'center'} display={'flex'} padding={2}>
                <Typography variant="h5" sx={{ fontFamily: "Bungee, sans-serif" }}>Aún no hay turnos</Typography>
              </Box>
            ) : (

              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="right">Fecha</StyledTableCell>
                    <StyledTableCell align="right">Hora de Inicio</StyledTableCell>
                    <StyledTableCell align="right">Hora de Fin</StyledTableCell>
                    <StyledTableCell align="right">Estado</StyledTableCell>
                    <StyledTableCell align="right">Cancha</StyledTableCell>
                    <StyledTableCell align="right">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {turnos.map((turno) => (
                    <TableRow key={turno.id}>
                      <TableCell align='right'>{dayjs(turno.fecha).format('DD/MM/YYYY')}</TableCell>
                      <TableCell align='right'>{turno.horaInicio}</TableCell>
                      <TableCell align='right'>{turno.horaFin}</TableCell>
                      <TableCell align='right'>{turno.estado}</TableCell>
                      <TableCell align='right'>{turno.cancha.nombre}</TableCell>
                      <TableCell align='right'>
                        <IconButton color="custom" onClick={() => handleEdit(turno)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(turno.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Dialog open={openMassiveChargeDialog} onClose={() => setOpenMassiveChargeDialog(false)}>
              <DialogTitle>Cargar Turnos Masivamente</DialogTitle>
              <DialogContent>
                <DateRangePicker
                  startText="Inicio"
                  endText="Fin"
                  value={selectedDates}
                  onChange={(newValue) => setSelectedDates(newValue)}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <TextField {...endProps} />
                    </>
                  )}
                  minDate={dayjs()}
                />
                <TextField
                  color='custom'
                  margin="dense"
                  label="Hora de Inicio"
                  fullWidth
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
                <TextField
                  color='custom'
                  margin="dense"
                  label="Hora de Fin"
                  fullWidth
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                />
                <TextField
                  color='custom'
                  margin="dense"
                  label="Duración en Minutos"
                  fullWidth
                  type="number"
                  value={duracionEnMinutos}
                  onChange={(e) => setDuracionEnMinutos(e.target.value)}
                  required
                />
                <FormControl fullWidth margin="dense" color='custom'>
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
                <FormControl fullWidth margin="dense" color='custom'>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required // Asegúrate de que el usuario seleccione un estado
                  >
                    <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                    <MenuItem value="RESERVADO">RESERVADO</MenuItem>
                    <MenuItem value="BORRADO">BORRADO</MenuItem>
                    {/* Agrega más estados si es necesario */}
                  </Select>
                </FormControl>

                {/* Manejo de errores */}
                {error && (
                  <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                    <Alert severity="error">{error}</Alert>
                  </Stack>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpen(false)} color="custom">
                  Cancelar
                </Button>
                <Button onClick={handleSave} color="custom">
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>{selectedTurno ? 'Editar Turno' : 'Agregar Turno'}</DialogTitle>
              <DialogContent>
                <TextField
                  color='custom'
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
                  color='custom'
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
                  color='custom'
                  margin="dense"
                  label="Hora de Fin"
                  fullWidth
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                  focused
                />
                <FormControl fullWidth margin="dense" color='custom'>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}

                  >
                    <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                    <MenuItem value="RESERVADO">RESERVADO</MenuItem>
                    <MenuItem value="BORRADO">BORRADO</MenuItem>
                    {/* Agrega más estados si es necesario */}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense" color='custom'>
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
                <Button onClick={() => setOpen(false)} color="custom">
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} color="custom">
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>

          </TableContainer>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AdminTurnos;

