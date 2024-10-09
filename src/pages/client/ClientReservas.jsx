import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, Typography, Box
} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import CancelIcon from '@mui/icons-material/Cancel'; import axios from 'axios';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import NavbarClient from "../../components/NavbarClient";

const ClientReservas = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;
  //Dialogo
  const [open, setDialogOpen] = useState(false);
  const [reservaToCancelId, setReservaToCancelId] = useState(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${currentUser.token}` }
  };

  const fetchReservas = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/usuarios/${userId}/reservas`, tokenConfig);
      if (response && response.data) {
        setReservas(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/login");
      } else {
        console.log('Error fetchReservas:', error);
      }
    }
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
    fetchReservas();
    setDialogOpen(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <>
      <NavbarClient />
      <Box sx={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: "Bungee Inline, sans-serif", fontWeight: 400, fontStyle: 'normal', fontSize: 30 }}>Mis Reservas</h2>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align='right'>ID</StyledTableCell>
              <StyledTableCell align='right'>Fecha</StyledTableCell>
              <StyledTableCell align='right'>Hora de Inicio</StyledTableCell>
              <StyledTableCell align='right'>Hora de Fin</StyledTableCell>
              <StyledTableCell align='right'>Estado</StyledTableCell>
              <StyledTableCell align='right'>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                <TableCell align='right'>{reserva.id}</TableCell>
                <TableCell align='right'>{reserva.fecha}</TableCell>
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
                  {reserva.estado == 'CONFIRMADA' && (
                    <IconButton color="secondary" onClick={() => handleCancelReservaClick(reserva.id)}>
                      <CancelIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
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
            <Button onClick={handleAbortCancel} color="black">
              No cancelar
            </Button>
            <Button onClick={handleCancelReserva} color="error">
              Cancelar reserva
            </Button>
          </DialogActions>
        </Dialog>

      </TableContainer>
    </>
  );
};

export default ClientReservas;
