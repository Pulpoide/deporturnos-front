import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, Typography, Box, useTheme, useMediaQuery, Stack
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
    fontFamily: 'Fjalla One, sans-serif',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const buttonStyle = {
  fontFamily: "Bungee Inline, sans-serif",
  marginBottom: 2,
  width: '233px',
};
const cardStyle = {
  fontFamily: 'Fjalla One, sans-serif',
  fontSize: '16px',
  marginBottom: '8px',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
  textAlign: 'left',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  margin: '8px 0',
};



const ClientReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [open, setDialogOpen] = useState(false);
  const [reservaToCancelId, setReservaToCancelId] = useState(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;
  const tokenConfig = {
    headers: { Authorization: `Bearer ${currentUser.token}` }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchReservas(showCompleted);
  }, [showCompleted]);

  const fetchReservas = async (includeCompleted) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios/${userId}/reservas?includeCompleted=${includeCompleted}`, tokenConfig);
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

  const handleShowCancelledToggle = () => {
    setShowCancelled(prev => !prev);
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
    await axios.put(`${import.meta.env.VITE_API_URL}/api/reservas/${reservaToCancelId}/cancelar`, {}, tokenConfig);
    setDialogOpen(false);
    fetchReservas(showCompleted);
  };

  const filteredReservas = reservas.filter(reserva => {
    if (!showCancelled && reserva.estado === 'CANCELADA') return false;
    return true;
  });

  return (
    <>
      <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <NavbarClient />
        <Box sx={{ textAlign: 'center', padding: 2 }}>
          <Typography variant="h4" fontFamily="Bungee Inline, sans-serif" sx={{ m: 3 }}>
            Mis Reservas
          </Typography>
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              color={showCompleted ? "black" : "primary"}
              onClick={handleShowCompletedToggle}
              sx={buttonStyle}
            >
              {showCompleted ? "Ocultar Completas" : "Mostrar Completas"}
            </Button>
            <Button
              variant="contained"
              color={showCancelled ? "black" : "primary"}
              onClick={handleShowCancelledToggle}
              sx={buttonStyle}
            >
              {showCancelled ? "Ocultar Canceladas" : "Mostrar Canceladas"}
            </Button>
          </Stack>
        </Box>

        {!isMobile && (<TableContainer component={Paper} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>Fecha de Creación</StyledTableCell>
                <StyledTableCell align='center'>Fecha de Turno</StyledTableCell>
                <StyledTableCell align='center'>Hora de Inicio</StyledTableCell>
                <StyledTableCell align='center'>Hora de Fin</StyledTableCell>
                <StyledTableCell align='center'>Estado</StyledTableCell>
                <StyledTableCell align='center'>Cancelar</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="h6" color="textSecondary">
                      No hay reservas aún
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservas.map((reserva) => (

                  <TableRow key={reserva.id}>
                    <TableCell align='center'>{dayjs(reserva.fecha).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align='center'>{dayjs(reserva.turno.fecha).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align='center'>{reserva.turno.horaInicio}</TableCell>
                    <TableCell align='center'>{reserva.turno.horaFin}</TableCell>
                    <TableCell align='center'>
                      <Typography
                        style={{
                          color: reserva.estado === 'CONFIRMADA' ? 'green' :
                            reserva.estado === 'CANCELADA' ? 'red' :
                              'default',
                          fontFamily: 'Bungee, sans-serif'
                        }}
                      >
                        {reserva.estado}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      {reserva.estado === 'CONFIRMADA' && (
                        <IconButton color="warning" onClick={() => handleCancelReservaClick(reserva.id)}>
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
            disableScrollLock
          >
            <DialogTitle id="alert-dialog-title" sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>
              ¿Estás seguro de cancelar esta reserva?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>
                No podrás deshacer esta acción.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelReserva} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Cancelar reserva
              </Button>
              <Button onClick={handleAbortCancel} color="primary" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                No cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>)}


        {isMobile && (<Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
          {filteredReservas.map(reserva => (
            <Paper key={reserva.id} sx={{ mb: 2, p: 2 }}>

              <Typography variant="body2" sx={{
                color: reserva.estado === 'CONFIRMADA' ? 'green' :
                  reserva.estado === 'CANCELADA' ? 'red' : 'inherit',
                fontFamily: 'Bungee, sans-serif', textAlign: 'center'
              }}>
                {reserva.estado}
              </Typography>
              <hr />

              <Typography variant="body2" style={cardStyle}><strong>Fecha de creación:</strong> {dayjs(reserva.fecha).format('DD/MM/YYYY')}</Typography>
              <Typography variant="body2" style={cardStyle}><strong>Turno:</strong> {dayjs(reserva.turno.fecha).format('DD/MM/YYYY')}</Typography>
              <Typography variant="body2" style={cardStyle}><strong>Hora Inicio:</strong> {reserva.turno.horaInicio}</Typography>
              <Typography variant="body2" style={cardStyle}><strong>Hora Fin:</strong> {reserva.turno.horaFin}</Typography>

              {reserva.estado === 'CONFIRMADA' && (
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton color="error" onClick={() => handleCancelReservaClick(reserva.id)}>
                    <CancelIcon fontSize="large" />
                  </IconButton>
                </Box>
              )}

            </Paper>
          ))}
          <Dialog
            open={open}
            onClose={handleAbortCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableScrollLock
          >
            <DialogTitle id="alert-dialog-title" sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>
              ¿Estás seguro de cancelar esta reserva?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>
                No podrás deshacer esta acción.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={handleCancelReserva} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Cancelar reserva
              </Button>
              <Button onClick={handleAbortCancel} color="primary" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                No cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        )}
      </Box>
    </>
  );
};

export default ClientReservas;

