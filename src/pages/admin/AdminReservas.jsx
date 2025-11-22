import { useState, useEffect } from "react";
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, Select, Box, InputLabel, FormControl, Typography, TextField,
  useTheme, useMediaQuery, Stack, Pagination, CircularProgress, Alert, Tooltip
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import NavbarAdmin from '../../components/NavbarAdmin';
import backgroundImage from '../../assets/images/imagen_background_club.png';
import { useNavigate } from "react-router";
import dayjs from "dayjs";

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

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [usuarioId, setUsuarioId] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [estado, setEstado] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [fechaDesdeInput, setFechaDesdeInput] = useState('');
  const [fechaHastaInput, setFechaHastaInput] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('fecha');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  useEffect(() => {
    fetchUsuarios();
    fetchTurnosList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPaginatedReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortBy, fechaDesdeInput, fechaHastaInput]);

  const fetchUsuarios = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, tokenConfig);
      setUsuarios(resp.data.content ?? resp.data ?? []);
    } catch (err) {
      console.error('Error fetchUsuarios:', err);
      if (err.response?.status === 403) navigate('/login');
    }
  };

  const fetchTurnosList = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/turnos`, tokenConfig);
      const data = resp.data;
      if (Array.isArray(data)) {
        setTurnos(data);
      } else if (data.content) {
        setTurnos(data.content);
      } else {
        setTurnos([]);
      }
    } catch (err) {
      console.error('Error fetchTurnos:', err);
    }
  };

  const fetchPaginatedReservas = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy,
      };

      const hasFechaDesde = !!fechaDesdeInput;
      const hasFechaHasta = !!fechaHastaInput;

      if (hasFechaDesde) params.fechaDesde = dayjs(fechaDesdeInput).format('YYYY-MM-DD');
      if (hasFechaHasta) params.fechaHasta = dayjs(fechaHastaInput).format('YYYY-MM-DD');

      const endpointBase = `${import.meta.env.VITE_API_URL}/api/reservas`;
      const endpoint = (hasFechaDesde || hasFechaHasta) ? `${endpointBase}/filtrar` : endpointBase;

      const resp = await axios.get(endpoint, { params, headers: tokenConfig.headers });

      const data = resp.data;

      if (data && (data.content || typeof data.totalElements !== 'undefined')) {
        setReservas(data.content || []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? (data.content ? data.content.length : 0));
      } else if (Array.isArray(data)) {
        setReservas(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setReservas([]);
        setTotalPages(0);
        setTotalElements(0);
      }

      const lastPossiblePage = Math.max(0, Math.ceil((data.totalElements ?? (data.length || 0)) / pageSize) - 1);
      if (currentPage > lastPossiblePage) setCurrentPage(lastPossiblePage);
    } catch (err) {
      console.error('fetchPaginatedReservas error:', err);
      if (err.response?.status === 403) {
        navigate('/login');
      } else if (err.response?.status === 404) {
        setReservas([]);
        setTotalPages(0);
        setTotalElements(0);
      } else {
        setError('Error al cargar reservas: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedReserva(null);
    setUsuarioId('');
    setTurnoId('');
    setEstado('CONFIRMADA');
    setOpen(true);
  };

  const handleEdit = (reserva) => {
    setSelectedReserva(reserva);
    setUsuarioId(reserva.usuario?.id ?? '');
    setTurnoId(reserva.turno?.id ?? '');
    setEstado(reserva.estado ?? '');
    setInitialValues(reserva);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reservas/${id}`, tokenConfig);
      fetchPaginatedReservas();
    } catch (err) {
      console.error('Error deleting reserva:', err);
    }
  };

  const handleDeleteClick = (id) => {
    setReservaToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(reservaToDelete);
    setConfirmDialogOpen(false);
    setReservaToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setReservaToDelete(null);
  };

  const handleSave = async () => {
    const oldReservaData = initialValues && initialValues.usuario && initialValues.turno ? {
      usuarioId: initialValues.usuario.id,
      turnoId: initialValues.turno.id,
      estado: initialValues.estado,
    } : null;
    const reservaData = {};
    if (oldReservaData) {
      if (JSON.stringify(oldReservaData) === JSON.stringify(reservaData)) {
        return;
      }
    }
    if (usuarioId && (!oldReservaData || usuarioId !== oldReservaData.usuarioId)) {
      reservaData.usuarioId = usuarioId;
    }
    if (turnoId && (!oldReservaData || turnoId !== oldReservaData.turnoId)) {
      reservaData.turnoId = turnoId;
    }
    if (estado && (!oldReservaData || estado !== oldReservaData.estado)) {
      reservaData.estado = estado;
    }
    if (Object.keys(reservaData).length > 0) {
      try {
        if (selectedReserva) {
          await axios.put(`${import.meta.env.VITE_API_URL}/api/reservas/${selectedReserva.id}`, reservaData, tokenConfig);
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/reservas`, reservaData, tokenConfig);
        }

        fetchPaginatedReservas();
        setOpen(false);
      } catch (err) {
        console.error('Error saving reserva:', err);
      }
    } else {
      setOpen(false);
    }
  };

  const onChangePage = (event, value) => {
    setCurrentPage(value - 1);
  };

  const onChangeSize = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFechaDesdeInput('');
    setFechaHastaInput('');
    setSortBy('fecha');
    setPageSize(10);
    setCurrentPage(0);
  };

  const startIndex = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

  const sortOptions = [
    { label: 'Fecha de Reserva', value: 'fecha' },
    { label: 'Fecha de Turno', value: 'turno.fecha' },
    { label: 'Cancha', value: 'turno.cancha.nombre' },
    { label: 'Estado', value: 'estado' },
  ];

  return (
    <>
      <NavbarAdmin />

      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Paper sx={{ display: 'inline-block', p: 2, width: '95%', maxWidth: 1200, boxShadow: 3 }}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              color="custom"
              startIcon={<Add />}
              onClick={handleAdd}
              sx={buttonStyle}
            >
              Agregar Reserva
            </Button>

            <TextField
              label="Fecha Desde"
              type="date"
              value={fechaDesdeInput}
              onChange={e => { setFechaDesdeInput(e.target.value); setCurrentPage(0); }}
              InputLabelProps={{ shrink: true }}
              size="small"
            />

            <TextField
              label="Fecha Hasta"
              type="date"
              value={fechaHastaInput}
              onChange={e => { setFechaHastaInput(e.target.value); setCurrentPage(0); }}
              InputLabelProps={{ shrink: true }}
              size="small"
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
              >
                {sortOptions.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Mostrar</InputLabel>
              <Select
                value={pageSize}
                label="Mostrar"
                onChange={onChangeSize}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="black"
              onClick={handleClearFilters}
              sx={buttonStyle}
            >
              Limpiar Filtros
            </Button>
          </Stack>
        </Paper>
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
        {error && (
          <Box sx={{ width: '95%', maxWidth: 1200, margin: '0 auto 16px' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Desktop table */}
        {!isMobile && (
          <TableContainer component={Paper} sx={{ width: '95%', maxWidth: 1200, margin: '0 auto 24px' }}>
            {isLoading ? (
              <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : reservas.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                  No hay reservas aún
                </Typography>
              </Box>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Fecha Reserva</StyledTableCell>
                      <StyledTableCell align="center">Fecha Turno</StyledTableCell>
                      <StyledTableCell align="center">Hora Inicio</StyledTableCell>
                      <StyledTableCell align="center">Hora Fin</StyledTableCell>
                      <StyledTableCell align="center">Email Usuario</StyledTableCell>
                      <StyledTableCell align="center">Cancha</StyledTableCell>
                      <StyledTableCell align="center">Tipo</StyledTableCell>
                      <StyledTableCell align="center">Estado</StyledTableCell>
                      <StyledTableCell align="center">Acciones</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservas.map(r => (
                      <TableRow key={r.id}>
                        <TableCell align="center">{dayjs(r.fecha).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="center">{dayjs(r.turno?.fecha).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="center">{r.turno?.horaInicio?.substring(0, 5)}</TableCell>
                        <TableCell align="center">{r.turno?.horaFin?.substring(0, 5)}</TableCell>
                        <TableCell align="center">{r.usuario?.email}</TableCell>
                        <TableCell align="center">{r.turno?.cancha?.nombre}</TableCell>
                        <TableCell align="center">{r.turno?.cancha?.tipo}</TableCell>
                        <TableCell align="center">
                          <Typography style={{
                            color: r.estado === "CONFIRMADA" ? 'green' : r.estado === "CANCELADA" ? 'red' : 'orange',
                            fontFamily: 'Bungee, sans-serif'
                          }}>
                            {r.estado}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Editar reserva" arrow placement="top">
                              <IconButton color="custom" onClick={() => handleEdit(r)}><Edit /></IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar reserva" arrow placement="top">
                              <IconButton color="error" onClick={() => handleDeleteClick(r.id)}><Delete /></IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Footer: range + pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                    {totalElements === 0 ? 'Mostrando 0' : `Mostrando ${startIndex} - ${endIndex} de ${totalElements}`}
                  </Typography>

                  <Pagination
                    count={Math.max(1, totalPages)}
                    page={currentPage + 1}
                    onChange={onChangePage}
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontFamily: "Fjalla One, sans-serif",
                      }
                    }}
                  />
                </Box>
              </>
            )}
          </TableContainer>
        )}

        {/* Mobile list */}
        {isMobile && (
          <Box sx={{ px: 2 }}>
            {isLoading ? (
              <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : reservas.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif', color: 'white' }}>
                  No hay reservas aún
                </Typography>
              </Box>
            ) : (
              <>
                {reservas.map(r => (
                  <Paper key={r.id} sx={{ mb: 2, p: 2, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif', color: r.estado === "CONFIRMADA" ? 'green' : r.estado === "CANCELADA" ? 'red' : 'orange' }}>{r.estado}</Typography>
                    <hr />
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Fecha de Reserva:</strong> {dayjs(r.fecha).format('DD/MM/YYYY')}</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Fecha de Turno:</strong> {dayjs(r.turno?.fecha).format('DD/MM/YYYY')}</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Email:</strong> {r.usuario?.email}</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Hora: </strong>{r.turno?.horaInicio?.substring(0, 5)} <strong>a</strong> {r.turno?.horaFin?.substring(0, 5)}</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Cancha:</strong> {r.turno?.cancha?.nombre} ({r.turno?.cancha?.tipo})</Typography>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <IconButton color="custom" onClick={() => handleEdit(r)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(r.id)}><Delete /></IconButton>
                    </Box>
                  </Paper>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'Fjalla One, sans-serif', color: 'white' }}>
                    {totalElements === 0 ? 'Mostrando 0' : `Mostrando ${startIndex} - ${endIndex} de ${totalElements}`}
                  </Typography>
                  <Pagination
                    count={Math.max(1, totalPages)}
                    page={currentPage + 1}
                    onChange={onChangePage}
                    size="small"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "white",
                        borderColor: "white",
                        fontFamily: "Fjalla One, sans-serif",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "rgba(255,255,255,0.3) !important",
                        color: "white",
                      },
                      "& .MuiPaginationItem-icon": {
                        color: "white",
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        )}

        {/* DIALOGS */}
        <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>{selectedReserva ? 'Editar Reserva' : 'Agregar Reserva'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense" color="custom">
              <InputLabel>Usuario</InputLabel>
              <Select value={usuarioId} onChange={e => setUsuarioId(e.target.value)}>
                {usuarios.map(u => <MenuItem key={u.id} value={u.id}>{u.nombre} ({u.email})</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" color="custom">
              <InputLabel>Turno</InputLabel>
              <Select value={turnoId} onChange={e => setTurnoId(e.target.value)}>
                {turnos.map(t => <MenuItem key={t.id} value={t.id}>{`${t.id} - ${dayjs(t.fecha).format('DD/MM/YYYY')} ${t.horaInicio?.substring(0, 5)}-${t.horaFin?.substring(0, 5)}`}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" color="custom">
              <InputLabel>Estado</InputLabel>
              <Select value={estado} onChange={e => setEstado(e.target.value)}>
                {['CONFIRMADA', 'MODIFICADA', 'CANCELADA', 'COMPLETADA', 'EN_PROCESO'].map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button color="black" onClick={() => setOpen(false)} sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
            <Button color="custom" onClick={handleSave} sx={{ fontFamily: 'Bungee, sans-serif' }}>Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
          <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.</Typography>
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

export default AdminReservas;