import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Switch, FormControlLabel, MenuItem, Select,
  Box, InputLabel, Typography, Stack, useTheme, useMediaQuery
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from "react-router";
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

const buttonStyle = {
  marginTop: '1.2rem',
  marginBottom: '1.2rem',
  fontFamily: 'Bungee, sans-serif',
  minWidth: 120,
  width: '100%',
  maxWidth: 220,
};

const initialCanchaState = {
  nombre: '',
  tipo: '',
  precioHora: '',
  disponibilidad: true,
  descripcion: '',
  deporte: 'FUTBOL',
};

const deporteOptions = {
  FUTBOL: ["FÚTBOL 5", "FÚTBOL 7", "FÚTBOL 11"],
  PADEL: ["DE CEMENTO", "DE ACRÍLICO"],
};

const AdminCanchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [canchaForm, setCanchaForm] = useState(initialCanchaState);
  const [originalValues, setOriginalValues] = useState(initialCanchaState);
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [canchaToDelete, setCanchaToDelete] = useState(null);
  const [tipoOptions, setTipoOptions] = useState(deporteOptions[initialCanchaState.deporte]);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchCanchas();
  }, []);

  useEffect(() => {
    setTipoOptions(deporteOptions[canchaForm.deporte] || []);
    setCanchaForm((prev) => ({ ...prev, tipo: '' }));
  }, [canchaForm.deporte]);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      } else if (error.response && error.response.status === 404) {
        setCanchas([]);
      }
    }
  };

  const handleAdd = () => {
    setSelectedCancha(null);
    setCanchaForm(initialCanchaState);
    setOriginalValues(initialCanchaState);
    setOpen(true);
  };

  const handleEdit = (cancha) => {
    setOriginalValues(cancha);
    setCanchaForm({ ...cancha });
    setSelectedCancha(cancha);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCanchaForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (JSON.stringify(originalValues) === JSON.stringify(canchaForm)) {
      setOpen(false);
      return;
    }
    try {
      if (selectedCancha) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/canchas/${selectedCancha.id}`, canchaForm, tokenConfig);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/canchas`, canchaForm, tokenConfig);
      }
      fetchCanchas();
    } finally {
      setOpen(false);
    }
  };

  const handleDeleteClick = (id) => {
    setCanchaToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/canchas/${canchaToDelete}`, tokenConfig);
    } catch (error) {
      if (error.response && error.response.status === 502) {
        console.error(error.response.data);
      }
    }
    fetchCanchas();
    setConfirmDialogOpen(false);
    setCanchaToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setCanchaToDelete(null);
  };

  return (
    <>
      <NavbarAdmin />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center" alignItems="center"> 
          <Button
            variant="contained"
            color="custom"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={buttonStyle}
          >
            Agregar Cancha
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
        }}
      >

        {!isMobile && (
          <TableContainer component={Paper}>
            {canchas.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                  No hay canchas aún
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Nombre</StyledTableCell>
                    <StyledTableCell align="center">Tipo</StyledTableCell>
                    <StyledTableCell align="center">Precio / Hora</StyledTableCell>
                    <StyledTableCell align="center">Disponibilidad</StyledTableCell>
                    <StyledTableCell align="center">Descripción</StyledTableCell>
                    <StyledTableCell align="center">Deporte</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {canchas.map(c => (
                    <TableRow key={c.id}>
                      <TableCell align="center">{c.nombre}</TableCell>
                      <TableCell align="center">{c.tipo}</TableCell>
                      <TableCell align="center">${c.precioHora}</TableCell>
                      <TableCell align="center">
                        <Typography sx={{ color: c.disponibilidad ? 'green' : 'red', fontFamily: 'Bungee, sans-serif' }}>
                          {c.disponibilidad ? 'Disponible' : 'No disponible'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{c.descripcion}</TableCell>
                      <TableCell align="center">{c.deporte}</TableCell>
                      <TableCell align="center">
                        <IconButton color="custom" onClick={() => handleEdit(c)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(c.id)}><Delete /></IconButton>
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
            {canchas.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif', color: 'white' }}>
                  No hay canchas aún
                </Typography>
              </Box>
            ) : (
              canchas.map(c => (
                <Paper key={c.id} sx={{ mb: 2, p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                    {c.nombre}
                  </Typography>
                  <hr />
                  <Typography variant="body1" sx={{ color: c.disponibilidad ? 'green' : 'red', fontFamily: 'Bungee, sans-serif' }}>
                    {c.disponibilidad ? 'Disponible' : 'No disponible'}
                  </Typography>
                  <hr />

                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Tipo:</strong> {c.tipo}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif', mt:1 }}><strong>Precio / Hora:</strong> ${c.precioHora}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif', mt:1 }}><strong>Deporte:</strong> {c.deporte}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif', mt:1 }}><strong>Descripción:</strong> {c.descripcion}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <IconButton color="custom" onClick={() => handleEdit(c)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(c.id)}><Delete /></IconButton>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>
            {selectedCancha ? 'Editar Cancha' : 'Agregar Cancha'}
          </DialogTitle>
          <DialogContent>
            <InputLabel>Deporte</InputLabel>
            <Select
              name="deporte"
              value={canchaForm.deporte}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="FUTBOL">FÚTBOL</MenuItem>
              <MenuItem value="PADEL">PADEL</MenuItem>
            </Select>
            <InputLabel>Tipo</InputLabel>
            <Select
              name="tipo"
              value={canchaForm.tipo}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              {tipoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
            <TextField
              label="Nombre de la Cancha"
              name="nombre"
              fullWidth
              value={canchaForm.nombre}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Precio por Hora"
              name="precioHora"
              type="number"
              fullWidth
              value={canchaForm.precioHora}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Switch name="disponibilidad" checked={canchaForm.disponibilidad} onChange={handleChange} />}
              label="Disponibilidad"
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              multiline
              rows={3}
              value={canchaForm.descripcion}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button onClick={handleSave} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>Guardar</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar esta cancha? Puede que haya turnos registrados en ella.</Typography>
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

export default AdminCanchas;