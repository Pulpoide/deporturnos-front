import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Box,
  Typography, Stack, Alert, useTheme, useMediaQuery, Pagination, CircularProgress
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

const AdminTurnos = () => {
  // data + dialogs
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [turnoToDelete, setTurnoToDelete] = useState(null);

  // pagination / sorting / loading
  const [currentPage, setCurrentPage] = useState(0); // backend 0-based
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('fecha'); // default sort field
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  // Fetch canchas once
  useEffect(() => {
    fetchCanchas();
  }, []);

  // Unified fetch: runs whenever pagination, pageSize, sortBy or date filters change
  useEffect(() => {
    fetchPaginatedTurnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortBy, fechaDesdeInput, fechaHastaInput]);

  const fetchPaginatedTurnos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy,
      };

      // If date filters are set, include them
      const hasFechaDesde = !!fechaDesdeInput;
      const hasFechaHasta = !!fechaHastaInput;

      if (hasFechaDesde) params.fechaDesde = fechaDesdeInput;
      if (hasFechaHasta) params.fechaHasta = fechaHastaInput;

      // Choose endpoint
      const endpointBase = `${import.meta.env.VITE_API_URL}/api/turnos`;
      const endpoint = (hasFechaDesde || hasFechaHasta) ? `${endpointBase}/filtrar` : endpointBase;

      const response = await axios.get(endpoint, { params, headers: tokenConfig.headers });

      // Expect backend to return paginated object: { content: [...], totalPages, totalElements }
      const data = response.data;

      // Defensive handling if backend returns array (older behavior)
      if (Array.isArray(data)) {
        // backend returned array (non-paginated) — adapt: treat as single page
        const futureTurnos = data
          .sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
            return (a.horaInicio || '') > (b.horaInicio || '') ? 1 : -1;
          })
          .filter(t => new Date(t.fecha) >= new Date());
        setTurnos(futureTurnos);
        setTotalElements(futureTurnos.length);
        setTotalPages(1);
      } else {
        setTurnos(data.content || []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? (data.content ? data.content.length : 0));
        if ((data.content || []).length === 0) {
          setError('No se encontraron turnos con los filtros o en la página especificada.');
        }
      }
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/login');
      } else if (err.response?.status === 404) {
        setTurnos([]);
        setTotalPages(0);
        setTotalElements(0);
        setError('No se encontraron turnos para listar.');
      } else {
        setError('Error al cargar turnos: ' + (err.response?.data?.message || err.message));
      }
      console.error('fetchPaginatedTurnos error:', err);
    } finally {
      setIsLoading(false);
    }
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
      }
      console.error('Error fetching canchas:', error);
    }
  };

  // Actions - keep your existing flows but call unified fetch afterwards
  const handleEdit = (turno) => {
    setSelectedTurno(turno);
    setFecha(turno.fecha);
    setHoraInicio(turno.horaInicio);
    setHoraFin(turno.horaFin);
    setEstado(turno.estado);
    setCanchaId(turno.cancha?.id ?? '');
    setInitialValues(turno);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/turnos/${id}`, tokenConfig);
      // If last element on page was deleted and now page is out of range, go back one page
      const likelyNewTotal = totalElements - 1;
      const lastPossiblePage = Math.max(0, Math.ceil(likelyNewTotal / pageSize) - 1);
      if (currentPage > lastPossiblePage) setCurrentPage(lastPossiblePage);
      else fetchPaginatedTurnos();
    } catch (err) {
      setError('Error al eliminar turno: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
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
      estado
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/turnos/massive-charge`,
        turnoData,
        tokenConfig
      );
      setOpenMassiveChargeDialog(false);
      // After mass upload, reset to first page to show results
      setCurrentPage(0);
      fetchPaginatedTurnos();
    } catch (error) {
      setError(error.response ? error.response.data.message : "Error al guardar los turnos.");
      console.error(error);
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
      try {
        if (selectedTurno) {
          await axios.put(`${import.meta.env.VITE_API_URL}/api/turnos/${selectedTurno.id}`, turnoData, tokenConfig);
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/turnos`, turnoData, tokenConfig);
        }
      } catch (err) {
        setError('Error al guardar cambios: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
    setOpen(false);
    fetchPaginatedTurnos();
  };

  const handleDeleteClick = (id) => {
    setTurnoToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(turnoToDelete);
    setConfirmDialogOpen(false);
    setTurnoToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setTurnoToDelete(null);
  };

  const handleClearFilters = () => {
    setFechaDesdeInput('');
    setFechaHastaInput('');
    setSortBy('fecha');
    setPageSize(10);
    setCurrentPage(0);
  };

  const sortedCanchas = [...canchas].sort((a, b) => a.deporte?.localeCompare(b.deporte));

  // UI helpers
  const startIndex = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NavbarAdmin />

        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center" alignItems={'center'}>
            <Button
              variant="contained"
              color="custom"
              startIcon={<Add />}
              onClick={() => setOpenMassiveChargeDialog(true)}
              sx={buttonStyle}
            >
              Cargar Turnos
            </Button>

            {/* Fecha inputs */}
            <TextField
              label="Fecha Desde"
              type="date"
              value={fechaDesdeInput}
              onChange={e => setFechaDesdeInput(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha Hasta"
              type="date"
              value={fechaHastaInput}
              onChange={e => setFechaHastaInput(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            {/* Sort By */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
              >
                <MenuItem value="fecha">Fecha</MenuItem>
                <MenuItem value="horaInicio">Hora Inicio</MenuItem>
                <MenuItem value="cancha">Cancha</MenuItem>
                <MenuItem value="estado">Estado</MenuItem>
              </Select>
            </FormControl>

            {/* Page size */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Mostrar</InputLabel>
              <Select
                value={pageSize}
                label="Mostrar"
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
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
        </Box>

        {error && (
          <Stack spacing={2} sx={{ width: '100%', px: 2, mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}

        <Box
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            py: 4
          }}>

          {/* Desktop Table */}
          {!isMobile && (
            <TableContainer component={Paper} >
              {isLoading ? (
                <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : turnos.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif' }}>
                    No hay turnos aún
                  </Typography>
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Fecha</StyledTableCell>
                        <StyledTableCell align="center">Hora Inicio</StyledTableCell>
                        <StyledTableCell align="center">Hora Fin</StyledTableCell>
                        <StyledTableCell align="center">Estado</StyledTableCell>
                        <StyledTableCell align="center">Cancha</StyledTableCell>
                        <StyledTableCell align="center">Acciones</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {turnos.map(turno => (
                        <TableRow key={turno.id}>
                          <TableCell align="center">{dayjs(turno.fecha).format('DD/MM/YYYY')}</TableCell>
                          <TableCell align="center">{turno.horaInicio}</TableCell>
                          <TableCell align="center">{turno.horaFin}</TableCell>
                          <TableCell align="center">
                            <Typography
                              style={{
                                color: turno.estado === 'DISPONIBLE' ? 'green' : turno.estado === 'RESERVADO' ? 'orange' : 'red',
                                fontFamily: 'Bungee, sans-serif'
                              }}>
                              {turno.estado}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{turno.cancha?.nombre}</TableCell>
                          <TableCell align="center">
                            <IconButton color='custom' onClick={() => handleEdit(turno)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(turno.id)}>
                              <Delete />
                            </IconButton>
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
                      onChange={(_, value) => setCurrentPage(value - 1)}
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

          {/* Mobile List */}
          {isMobile && (
            <Box sx={{ px: 2 }}>
              {isLoading ? (
                <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : turnos.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Fjalla One, sans-serif', color: 'white' }}>
                    No hay turnos aún
                  </Typography>
                </Box>
              ) : (
                <>
                  {turnos.map(turno => (
                    <Paper key={turno.id} sx={{ mb: 2, p: 2, textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontFamily: 'Bungee, sans-serif', color: turno.estado === "DISPONIBLE" ? 'green' : turno.estado === "RESERVADO" ? 'orange' : 'red' }}> {turno.estado}</Typography>
                      <hr />
                      <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Fecha:</strong> {dayjs(turno.fecha).format('DD/MM/YYYY')}</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Hora:</strong> {turno.horaInicio} <strong>a</strong> {turno.horaFin}</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'Fjalla One, sans-serif' }}><strong>Cancha:</strong> {turno.cancha?.nombre}</Typography>
                      <Box sx={{ mt: 1, textAlign: 'center' }}>
                        <IconButton color="custom" onClick={() => handleEdit(turno)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(turno.id)}>
                          <Delete />
                        </IconButton>
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
                      onChange={(_, value) => setCurrentPage(value - 1)}
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

          {/* Massive charge dialog */}
          <Dialog open={openMassiveChargeDialog} onClose={() => setOpenMassiveChargeDialog(false)} disableScrollLock>
            <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Cargar Turnos Masivamente</DialogTitle>
            <DialogContent>
              <DateRangePicker
                startText="Inicio"
                endText="Fin"
                value={selectedDates}
                onChange={setSelectedDates}
                minDate={dayjs()}
              />
              <TextField
                color="custom"
                margin="dense"
                label="Hora de Inicio"
                fullWidth
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
              <TextField
                color="custom"
                margin="dense"
                label="Hora de Fin"
                fullWidth
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
              <TextField
                color="custom"
                margin="dense"
                label="Duración en Minutos"
                fullWidth
                type="number"
                value={duracionEnMinutos}
                onChange={(e) => setDuracionEnMinutos(e.target.value)}
                required
              />
              <FormControl fullWidth margin="dense" color="custom">
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
              <FormControl fullWidth margin="dense" color="custom">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                  <MenuItem value="RESERVADO">RESERVADO</MenuItem>
                  <MenuItem value="BORRADO">BORRADO</MenuItem>
                </Select>
              </FormControl>
              {error && (
                <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
                  <Alert severity="error">{error}</Alert>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMassiveChargeDialog(false)} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Cancelar
              </Button>
              <Button onClick={handleSave} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit dialog */}
          <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock>
            <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }} >Editar Turno</DialogTitle>
            <DialogContent>
              <TextField
                color="custom"
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
                color="custom"
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
                color="custom"
                margin="dense"
                label="Hora de Fin"
                fullWidth
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
                focused
              />
              <FormControl fullWidth margin="dense" color="custom">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                  <MenuItem value="RESERVADO">RESERVADO</MenuItem>
                  <MenuItem value="BORRADO">BORRADO</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense" color="custom">
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
              <Button onClick={() => setOpen(false)} color="black" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} color="custom" sx={{ fontFamily: 'Bungee, sans-serif' }}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirm delete */}
          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete} disableScrollLock>
            <DialogTitle sx={{ fontFamily: 'Bungee, sans-serif', textAlign: 'center' }}>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography sx={{ fontFamily: 'Fjalla One, sans-serif', textAlign: 'center' }}>¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary" sx={{ fontFamily: 'Bungee, sans-serif' }}>Cancelar</Button>
              <Button onClick={handleConfirmDelete} color="error" sx={{ fontFamily: 'Bungee, sans-serif' }}>Eliminar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AdminTurnos;
