// ==== IMPORTS IGUALES ==== 
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, Typography, Box, useTheme, useMediaQuery,
  Pagination, ToggleButton, ToggleButtonGroup
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
};


const ClientReservas = () => {

  const [reservasPage, setReservasPage] = useState(null);
  const [estado, setEstado] = useState("FUTURAS");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);

  const [open, setDialogOpen] = useState(false);
  const [reservaToCancelId, setReservaToCancelId] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.id;

  const tokenConfig = {
    headers: { Authorization: `Bearer ${currentUser?.token}` }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchReservas();
  }, [estado, page]);

  const fetchReservas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/usuarios/${userId}/reservas`,
        {
          ...tokenConfig,
          params: {
            estado,
            page,
            size: pageSize,
            sort: 'turno.fecha,desc'
          }
        }
      );
      setReservasPage(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        navigate("/login");
      } else {
        console.log("Error fetchReservas:", error);
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
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/reservas/${reservaToCancelId}/cancelar`,
      {},
      tokenConfig
    );
    setDialogOpen(false);
    fetchReservas();
  };


  const totalPages = reservasPage?.totalPages ?? 0;
  const reservas = reservasPage?.content || [];
  const totalElements = reservasPage?.totalElements ?? 0;
  const currentPage = reservasPage?.number ?? page;
  const startIndex = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min(totalElements, (currentPage + 1) * pageSize);

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <NavbarClient />

      <Box sx={{ textAlign: 'center', padding: 2 }}>
        <Typography variant="h4" fontFamily="Bungee Inline, sans-serif" sx={{ m: 3 }}>
          Mis Reservas
        </Typography>

        <ToggleButtonGroup
          value={estado}
          exclusive
          onChange={(e, val) => {
            if (val !== null) {
              setPage(0);
              setEstado(val);
            }
          }}
          color="primary"
          sx={{
            mb: 3,
            display: 'flex',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: 'center',       // 👈 Centrado en todas las pantallas
            width: '100%',
            '& .MuiToggleButton-root': {
              flex: { xs: '1 1 50%', sm: 'initial' }, // 2 por fila en mobile
            }
          }}
        >
          <ToggleButton value="FUTURAS">Futuras</ToggleButton>
          <ToggleButton value="COMPLETADAS">Completadas</ToggleButton>
          <ToggleButton value="CANCELADAS">Canceladas</ToggleButton>
          <ToggleButton value="TODAS">Todas</ToggleButton>
        </ToggleButtonGroup>
      </Box>


      {/* ================== DESKTOP ================== */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ width: '95%', margin: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>Fecha</StyledTableCell>
                <StyledTableCell align='center'>Inicio</StyledTableCell>
                <StyledTableCell align='center'>Fin</StyledTableCell>
                <StyledTableCell align='center'>Cancha</StyledTableCell>
                <StyledTableCell align='center'>Tipo</StyledTableCell>
                <StyledTableCell align='center'>Estado</StyledTableCell>
                <StyledTableCell align='center'>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h6" color="textSecondary">
                      No hay reservas que mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell align='center'>
                      {dayjs(reserva.turno?.fecha).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align='center'>{reserva.turno?.horaInicio}</TableCell>
                    <TableCell align='center'>{reserva.turno?.horaFin}</TableCell>
                    <TableCell align='center'>{reserva.turno?.cancha?.nombre}</TableCell>
                    <TableCell align='center'>{reserva.turno?.cancha?.tipo}</TableCell>
                    <TableCell align='center'>
                      <Typography
                        sx={{
                          fontFamily: 'Bungee, sans-serif',
                          color:
                            reserva.estado === 'CONFIRMADA' ? 'green' :
                              reserva.estado === 'CANCELADA' ? 'red' :
                                reserva.estado === 'COMPLETADA' ? 'blue' :
                                  'default'
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
          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: 'Fjalla One, sans-serif' }}
              >
                {totalElements === 0
                  ? 'Mostrando 0'
                  : `Mostrando ${startIndex} - ${endIndex} de ${totalElements}`}
              </Typography>

              <Pagination
                count={Math.max(1, totalPages)}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                size="small"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontFamily: "Fjalla One, sans-serif",
                  }
                }}
              />
            </Box>
          )}
        </TableContainer>
      )}


      {/* ================== MOBILE ================== */}
      {isMobile && (
        <Box sx={{ p: 2 }}>
          {reservas.map(reserva => (
            <Paper key={reserva.id} sx={{ mb: 2, p: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color:
                    reserva.estado === 'CONFIRMADA' ? 'green' :
                      reserva.estado === 'CANCELADA' ? 'red' :
                        reserva.estado === 'COMPLETADA' ? 'blue' :
                          'default',
                  fontFamily: 'Bungee, sans-serif',
                  textAlign: 'center'
                }}
              >
                {reserva.estado}
              </Typography>

              <hr />


              <Typography variant="body2" style={cardStyle}>
                <strong>Día:</strong> {dayjs(reserva.turno?.fecha).format('DD/MM/YYYY')}
              </Typography>
              <Typography variant="body2" style={cardStyle}>
                <strong>Inicio:</strong> {reserva.turno?.horaInicio}
              </Typography>
              <Typography variant="body2" style={cardStyle}>
                <strong>Fin:</strong> {reserva.turno?.horaFin}
              </Typography>
              <Typography variant="body2" style={cardStyle}>
                <strong>Cancha:</strong> {reserva.turno?.cancha?.nombre}
              </Typography>
              <Typography variant="body2" style={cardStyle}>
                <strong>Tipo:</strong> {reserva.turno?.cancha?.tipo}
              </Typography>

              {reserva.estado === 'CONFIRMADA' && (
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton color="error" onClick={() => handleCancelReservaClick(reserva.id)}>
                    <CancelIcon fontSize="large" />
                  </IconButton>
                </Box>
              )}
            </Paper>
          ))}

          {reservasPage && reservasPage.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              <Pagination
                count={reservasPage.totalPages}
                page={page + 1}
                onChange={(e, value) => setPage(value - 1)}
              />
            </Box>
          )}
        </Box>
      )}


      {/* ================== DIALOG ================== */}
      <Dialog open={open} onClose={handleAbortCancel} disableScrollLock>
        <DialogTitle
          sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}
        >
          ¿Cancelar reserva?
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}
          >
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
  );
};

export default ClientReservas;
