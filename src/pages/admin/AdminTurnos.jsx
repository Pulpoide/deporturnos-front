import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import NavbarAdmin from '../../components/NavbarAdmin';

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
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [estado, setEstado] = useState('');
  const [canchaId, setCanchaId] = useState('');
  const [canchas, setCanchas] = useState([]);
  const [initialValues, setInitialValues] = useState({});


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
      if (response && response.data) {
        setTurnos(response.data);
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

  const handleAdd = () => {
    setSelectedTurno('');
    setFecha('');
    setHoraInicio('');
    setHoraFin('');
    setEstado('DISPONIBLE');
    setCanchaId('');
    setOpen(true);
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

  const buttonStyle = { width: '33%', marginTop: '19px', marginBottom: '19px' };

  return (
    <>
      <NavbarAdmin />
      <TableContainer component={Paper}>
        <Box justifyContent={'center'} display={'flex'}>
          <Button
            variant="contained"
            color="custom"
            startIcon={<Add />}
            onClick={handleAdd}
            style={buttonStyle}
          >
            Agregar Turno
          </Button>
        </Box>
        {turnos.length === 0 ? (
          <Box justifyContent={'center'} display={'flex'} padding={2}>
            <Typography variant="h5" sx={{ fontFamily: "Bungee, sans-serif" }}>Aún no hay turnos</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">ID</StyledTableCell>
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
                  <TableCell align='right'>{turno.id}</TableCell>
                  <TableCell align='right'>{turno.fecha}</TableCell>
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
            <Button onClick={handleSave} color="custom">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
};

export default AdminTurnos;
