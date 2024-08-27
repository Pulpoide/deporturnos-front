import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Switch, FormControlLabel, MenuItem, Select,
  Box, InputLabel, Typography
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from "react-router";
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


const AdminCanchas = () => {
  const [canchas, setCanchas] = useState([]);

  const [selectedCancha, setSelectedCancha] = useState(null);
  // Cancha
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [precioHora, setPrecioHora] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [deporte, setDeporte] = useState('');
  const [originalValues, setOriginalValues] = useState({ nombre, tipo, precioHora, disponibilidad, descripcion, deporte });
  // Dialogos
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [canchaToDelete, setCanchaToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCanchas();
  }, []);


  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchCanchas = async () => {

    try {
      const response = await axios.get('http://localhost:8080/api/canchas', tokenConfig);
      console.log(response.data);

      if (response && response.data) {
        setCanchas(response.data);
      }

    } catch (error) {
      if (error.response && error.response.status == 403) {
        navigate('/login');
      } else if (error.response && error.response.status === 404) {
        setCanchas([]);
      } else {
        console.log('Error fetchCanchas:', error);

      }
    }
  };

  const handleAdd = () => {
    setSelectedCancha(null);
    setNombre('');
    setTipo('');
    setPrecioHora('');
    setDisponibilidad(true);
    setDescripcion('');
    setDeporte('FUTBOL');
    setOpen(true);
  };

  const handleEdit = (cancha) => {
    setOriginalValues(cancha.nombre, cancha.tipo, cancha.precioHora, cancha.disponibilidad, cancha.descripcion, cancha.deporte);
    setNombre(cancha.nombre);
    setTipo(cancha.tipo);
    setPrecioHora(cancha.precioHora);
    setDisponibilidad(cancha.disponibilidad);
    setDescripcion(cancha.descripcion);
    setDeporte(cancha.deporte);
    setSelectedCancha(cancha);

    setOpen(true);
  };

  const handleSave = async () => {
    const canchaData = { nombre, tipo, precioHora, disponibilidad, descripcion, deporte };

    if (JSON.stringify(originalValues) === JSON.stringify(canchaData)) {
      return;
    }

    if (selectedCancha) {
      const response = await axios.put(`http://localhost:8080/api/canchas/${selectedCancha.id}`, canchaData, tokenConfig);
      console.log(response)
    } else {
      const response = await axios.post('http://localhost:8080/api/canchas', canchaData, tokenConfig);
      console.log(response)

    }

    fetchCanchas();
    setOpen(false);
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
        console.log("NO PUEDES BORRAR UNA CANCHA CON TURNOS BROU")
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
            Agregar Cancha
          </Button>
        </Box>
        {canchas.length === 0 ? (
          <Box justifyContent={'center'} display={'flex'} padding={2}>
            <Typography variant="h5" sx={{ fontFamily: "Bungee, sans-serif" }}>Aún no hay canchas</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">ID</StyledTableCell>
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
                  <TableCell align="right">{cancha.id}</TableCell>
                  <TableCell align="right">{cancha.nombre}</TableCell>
                  <TableCell align="right">{cancha.tipo}</TableCell>
                  <TableCell align="right">${cancha.precioHora}.-</TableCell>
                  <TableCell align="right">
                    <Typography
                      style={{
                        color: cancha.disponibilidad ? 'green' : 'red'
                      }}
                    >
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
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              fullWidth
              value={nombre || ''}
              onChange={(e) => setNombre(e.target.value)}
              color="custom"
            />
            <TextField
              color="custom"
              margin="dense"
              label="Tipo"
              fullWidth
              value={tipo || ''}
              onChange={(e) => setTipo(e.target.value)}
            />
            <TextField
              color="custom"
              margin="dense"
              label="Precio por Hora"
              fullWidth
              type="number"
              value={precioHora || ''}
              onChange={(e) => setPrecioHora(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={disponibilidad}
                  onChange={(e) => setDisponibilidad(e.target.checked)}
                  color="primary"
                />
              }
              label="Disponibilidad"
            />
            <TextField
              color="custom"
              margin="dense"
              label="Descripción"
              fullWidth
              multiline
              rows={4}
              value={descripcion || ''}
              onChange={(e) => setDescripcion(e.target.value)}
            />


            <InputLabel id="label">
              Deporte
            </InputLabel>
            <Select
              labelId="label"
              id="demo-simple-select-helper"
              value={deporte || ''}
              defaultValue="FUTBOL"
              label="Deporte"
              onChange={(e) => setDeporte(e.target.value)}
              fullWidth
              color="custom"
            >
              <MenuItem value={"FUTBOL"}>FUTBOL</MenuItem>
              <MenuItem value={"PADEL"}>PADEL</MenuItem>
            </Select>
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
            <p>¿Estás seguro de que deseas eliminar esta cancha?</p>
            <p>Puede que haya turnos registrados en esta cancha..</p>
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
    </>
  );
};

export default AdminCanchas;