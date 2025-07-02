import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Switch, FormControlLabel, MenuItem, Select,
  Box, InputLabel, Typography
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
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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
      const response = await axios.get('http://localhost:8080/api/canchas', tokenConfig);
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
        await axios.put(`http://localhost:8080/api/canchas/${selectedCancha.id}`, canchaForm, tokenConfig);
      } else {
        await axios.post('http://localhost:8080/api/canchas', canchaForm, tokenConfig);
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
      await axios.delete(`http://localhost:8080/api/canchas/${canchaToDelete}`, tokenConfig);
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

  const buttonStyle = { fontFamily: 'Bungee inline, sans-serif' };

  return (
    <>
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
          textAlign: 'center',
        }}
      >
        <TableContainer component={Paper}>
          <Box justifyContent={'center'} display={'flex'}>
            <Button
              variant="contained"
              color="custom"
              startIcon={<Add />}
              onClick={handleAdd}
              style={buttonStyle}
            >
              <Typography sx={{ fontFamily: 'Bungee, sans-serif' }}>Agregar Cancha</Typography>
            </Button>
          </Box>
          {canchas.length === 0 ? (
            <Box justifyContent={'center'} display={'flex'} padding={2}>
              <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                Aún no hay canchas
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="right">Nombre</StyledTableCell>
                  <StyledTableCell align="right">Tipo</StyledTableCell>
                  <StyledTableCell align="right">Precio por Hora</StyledTableCell>
                  <StyledTableCell align="right">Disponibilidad</StyledTableCell>
                  <StyledTableCell align="right">Descripción</StyledTableCell>
                  <StyledTableCell align="right">Deporte</StyledTableCell>
                  <StyledTableCell align="right">Acciones</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {canchas.map((cancha) => (
                  <TableRow key={cancha.id}>
                    <TableCell align="right">{cancha.nombre}</TableCell>
                    <TableCell align="right">{cancha.tipo}</TableCell>
                    <TableCell align="right">${cancha.precioHora}.-</TableCell>
                    <TableCell align="right">
                      <Typography style={{ color: cancha.disponibilidad ? 'green' : 'red' }}>
                        {cancha.disponibilidad ? 'Disponible' : 'No Disponible'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{cancha.descripcion}</TableCell>
                    <TableCell align="right">{cancha.deporte}</TableCell>
                    <TableCell align="right">
                      <IconButton color="custom" onClick={() => handleEdit(cancha)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(cancha.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{selectedCancha ? 'Editar Cancha' : 'Agregar Cancha'}</DialogTitle>
            <DialogContent>
              <InputLabel id="label">Deporte</InputLabel>
              <Select
                labelId="label"
                id="deporte-select"
                name="deporte"
                value={canchaForm.deporte}
                label="Deporte"
                onChange={handleChange}
                fullWidth
                color="custom"
              >
                <MenuItem value={"FUTBOL"}>FÚTBOL</MenuItem>
                <MenuItem value={"PADEL"}>PADEL</MenuItem>
              </Select>
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                id="tipo-select"
                name="tipo"
                value={canchaForm.tipo}
                onChange={handleChange}
                fullWidth
                color="custom"
              >
                {tipoOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                autoFocus
                margin="dense"
                label="Nombre de la Cancha"
                name="nombre"
                fullWidth
                value={canchaForm.nombre}
                onChange={handleChange}
                color="custom"
              />
              <TextField
                color="custom"
                margin="dense"
                label="Precio por Hora"
                name="precioHora"
                fullWidth
                type="number"
                value={canchaForm.precioHora}
                onChange={handleChange}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={canchaForm.disponibilidad}
                    onChange={handleChange}
                    name="disponibilidad"
                    color="primary"
                  />
                }
                label="Disponibilidad"
              />
              <TextField
                color="custom"
                margin="dense"
                label="Descripción"
                name="descripcion"
                fullWidth
                multiline
                rows={4}
                value={canchaForm.descripcion}
                onChange={handleChange}
              />
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
          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography>¿Estás seguro de que deseas eliminar esta cancha?</Typography>
              <Typography>Puede que haya turnos registrados en esta cancha.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
      </Box>
    </>
  );
};

export default AdminCanchas;