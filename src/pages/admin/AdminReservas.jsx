import React, { useState, useEffect } from "react";
import {
    Table, TableBody, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, MenuItem, Select, Box, InputLabel, FormControl, Typography, TextField
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import NavbarAdmin from '../../components/NavbarAdmin';
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

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


    const navigate = useNavigate();


    useEffect(() => {
        fetchReservas();
        fetchUsuarios();
        fetchTurnos();
    }, []);

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    // Peticiones al Backend
    const fetchReservas = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/reservas', tokenConfig);
            setReservas(response.data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                navigate('/login');
            } else if (error.response && error.response.status === 404) {
                setReservas([]);
            } else {
                console.error('Error fetchReservas:', error);
            }
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/usuarios', tokenConfig);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetchUsuarios:', error);
        }
    };

    const fetchTurnos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/turnos', tokenConfig);

            if (response.data && response.data.length > 0) {
                const sortedReservas = response.data
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                    .filter(reserva => new Date(reserva.fecha) >= new Date());
                setTurnos(sortedReservas);
            } else {
                console.log("No se encontraron turnos.");
                setTurnos([]); 
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No hay turnos disponibles.");
                setTurnos([]); 
            } else {
                console.error('Error fetchTurnos:', error);
            }
        }
    };


    const fetchReservasByFecha = async (fechaDesde, fechaHasta) => {
        try {
            const response = await axios.get('http://localhost:8080/api/reservas/filtrar', {
                params: { fechaDesde, fechaHasta },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReservas(response.data);
        } catch (error) {
            console.error('Error fetching reservas by fecha:', error.response?.data || error.message);
        }
    };

    const handleSearch = () => {
        const fechaDesde = dayjs(fechaDesdeInput).format('YYYY-MM-DD');
        const fechaHasta = dayjs(fechaHastaInput).format('YYYY-MM-DD');

        if (fechaDesde && fechaHasta) {
            fetchReservasByFecha(fechaDesde, fechaHasta);
        } else {
            console.error('Por favor, asegúrate de que ambas fechas están seleccionadas.');
        }
    };


    // Handlers
    const handleAdd = () => {
        setSelectedReserva('');
        setUsuarioId('');
        setTurnoId('');
        setEstado('CONFIRMADA');
        setOpen(true);
    };

    const handleEdit = (reserva) => {
        setSelectedReserva(reserva);
        setUsuarioId(reserva.usuario.id);
        setTurnoId(reserva.turno.id);
        setEstado(reserva.estado);

        setInitialValues(reserva)
        setOpen(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/api/reservas/${id}`, tokenConfig);
        fetchReservas();
    };

    const handleSave = async () => {

        const oldReservaData = initialValues && initialValues.usuario && initialValues.turno ? {
            usuarioId: initialValues.usuario.id,
            turnoId: initialValues.turno.id,
            estado: initialValues.estado
        } : null;

        const reservaData = {};

        if (oldReservaData) {
            if (JSON.stringify(oldReservaData) === JSON.stringify(reservaData)) {
                console.log('reservaData', reservaData)
                console.log('oldReservaData', oldReservaData)
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
                    await axios.put(`http://localhost:8080/api/reservas/${selectedReserva.id}`, reservaData, tokenConfig);
                } else {
                    await axios.post('http://localhost:8080/api/reservas', reservaData, tokenConfig);
                }
            } catch (error) {
                console.log(error.response.data.message)
                console.error(error.response)
            }
        }

        fetchReservas();
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
                        Agregar Reserva
                    </Button>
                </Box>
                <Box justifyContent={'center'} display={'flex'} marginBottom={2}>
                    <TextField
                        label="Fecha Desde"
                        type="date"
                        onChange={(e) => setFechaDesdeInput(e.target.value)} 
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Fecha Hasta"
                        type="date"
                        onChange={(e) => setFechaHastaInput(e.target.value)} 
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button
                        variant="contained"
                        color="custom"
                        onClick={handleSearch}
                    >
                        Buscar
                    </Button>
                </Box>

                {reservas.length === 0 ? (
                    <Box justifyContent={'center'} display={'flex'} padding={2}>
                        <Typography variant="h5" sx={{ fontFamily: "Bungee, sans-serif" }}>Aún no hay reservas</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='right'>Fecha de reserva</StyledTableCell>
                                <StyledTableCell align='right'>Fecha de turno</StyledTableCell>
                                <StyledTableCell align='right'>Hora inicio</StyledTableCell>
                                <StyledTableCell align='right'>Hora inicio</StyledTableCell>
                                <StyledTableCell align='right'>Usuario</StyledTableCell>
                                <StyledTableCell align='right'>Turno</StyledTableCell>
                                <StyledTableCell align='right'>Cancha</StyledTableCell>
                                <StyledTableCell align='right'>Estado</StyledTableCell>
                                <StyledTableCell align='right'>Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead >
                        <TableBody>
                            {reservas.map((reserva) => (
                                <TableRow key={reserva.id}>
                                    <TableCell align='right'>{dayjs(reserva.fecha).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell align='right'>{dayjs(reserva.turno.fecha).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell align='right'>{reserva.turno.horaInicio}</TableCell>
                                    <TableCell align='right'>{reserva.turno.horaFin}</TableCell>
                                    <TableCell align='right'>{reserva.usuario.nombre}</TableCell>
                                    <TableCell align='right'>{reserva.turno.id}</TableCell>
                                    <TableCell align='right'>{reserva.turno.cancha.nombre}</TableCell>
                                    <TableCell align='right'>{reserva.estado}</TableCell>
                                    <TableCell align='right'>
                                        <IconButton color="custom" onClick={() => handleEdit(reserva)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(reserva.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table >
                )}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{selectedReserva ? 'Editar Reserva' : 'Agregar Reserva'}</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="dense" color='custom'>
                            <InputLabel>Usuario</InputLabel>
                            <Select
                                value={usuarioId || ''}
                                onChange={(e) => setUsuarioId(e.target.value)}
                            >
                                {usuarios.map((usuario) => (
                                    <MenuItem key={usuario.id} value={usuario.id}>
                                        {usuario.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" color='custom'>
                            <InputLabel>Turno</InputLabel>
                            <Select
                                value={turnoId || ''}
                                onChange={(e) => setTurnoId(e.target.value)}
                            >
                                {turnos
                                    .map((turno) => (
                                        <MenuItem key={turno.id} value={turno.id}>
                                            {turno.id}) {turno.fecha} {turno.horaInicio} - {turno.horaFin} - {turno.estado}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" color='custom'>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={estado || ''}
                                onChange={(e) => setEstado(e.target.value)}
                                defaultValue="CONFIRMADA"
                            >
                                <MenuItem value="CONFIRMADA">CONFIRMADA</MenuItem>
                                <MenuItem value="MODIFICADA">MODIFICADA</MenuItem>
                                <MenuItem value="CANCELADA">CANCELADA</MenuItem>
                                <MenuItem value="COMPLETADA">COMPLETADA</MenuItem>
                                <MenuItem value="EN_PROCESO">EN PROCESO</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button color='custom' onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button color='custom' onClick={handleSave}>
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </TableContainer >
        </>
    );
};

export default AdminReservas;