import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, Typography, Box
} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import NavbarClient from "../../components/NavbarClient";
import dayjs from 'dayjs';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#4CAF50',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const tableButtonStyle = {
  fontFamily: "Bungee Inline, sans-serif",
  marginBottom: 2
};

const ClientReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [open, setDialogOpen] = useState(false);
  const [reservaToCancelId, setReservaToCancelId] = useState(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;
  const tokenConfig = {
    headers: { Authorization: `Bearer ${currentUser.token}` }
  };

  useEffect(() => {
    fetchReservas(showCompleted);
  }, [showCompleted]);

  const fetchReservas = async (includeCompleted) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/usuarios/${userId}/reservas?includeCompleted=${includeCompleted}`, tokenConfig);
      setReservas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/login");
      } else {
        console.log('Error fetchReservas:', error);
      }
    }
  };

  const handleShowCompletedToggle = () => {
    setShowCompleted(prev => !prev);
  };

  const handleCancelReservaClick = (id) => {
    setDialogOpen(true);
    setReservaToCancelId(id);
  };

  const handleAbortCancel = () => {
    setDialogOpen(false);
    setReservaToCancelId(null);
  };

  const handleCancelReserva = async () => {
    await axios.put(`http://localhost:8080/api/reservas/${reservaToCancelId}/cancelar`, {}, tokenConfig);
    setDialogOpen(false);
    fetchReservas(showCompleted);
  };

  return (
    <>
      <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <NavbarClient />
        <Box sx={{ textAlign: 'center', padding: 2 }}>
          <Typography variant="h4" fontFamily="Bungee Inline, sans-serif" sx={{ m: 3 }}>
            Mis Reservas
          </Typography>
          <Button
            variant="contained"
            color={showCompleted ? "secondary" : "primary"}
            onClick={handleShowCompletedToggle}
            sx={tableButtonStyle}
          >
            {showCompleted ? "Ocultar Completadas" : "Mostrar Completadas"}
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align='right'>Fecha de creación</StyledTableCell>
                <StyledTableCell align='right'>Fecha de turno</StyledTableCell>
                <StyledTableCell align='right'>Hora de Inicio</StyledTableCell>
                <StyledTableCell align='right'>Hora de Fin</StyledTableCell>
                <StyledTableCell align='right'>Estado</StyledTableCell>
                <StyledTableCell align='right'>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="h6" color="textSecondary">
                      No hay reservas aún.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell align='right'>{dayjs(reserva.fecha).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align='right'>{dayjs(reserva.turno.fecha).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align='right'>{reserva.turno.horaInicio}</TableCell>
                    <TableCell align='right'>{reserva.turno.horaFin}</TableCell>
                    <TableCell align='right'>
                      <Typography
                        style={{
                          color: reserva.estado === 'CONFIRMADA' ? 'green' :
                            reserva.estado === 'CANCELADA' ? 'red' :
                              'default'
                        }}
                      >
                        {reserva.estado}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      {reserva.estado === 'CONFIRMADA' && (
                        <IconButton color="secondary" onClick={() => handleCancelReservaClick(reserva.id)}>
                          <CancelIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Dialog
            open={open}
            onClose={handleAbortCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              ¿Estás seguro de cancelar esta reserva?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                No podrás deshacer esta acción.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAbortCancel} color="primary">
                No cancelar
              </Button>
              <Button onClick={handleCancelReserva} color="error">
                Cancelar reserva
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
      </Box>
    </>
  );
};

export default ClientReservas;

