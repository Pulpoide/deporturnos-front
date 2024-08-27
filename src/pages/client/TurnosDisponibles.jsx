import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import NavbarClient from '../../components/NavbarClient';


const TurnosDisponibles = () => {
    const { canchaId } = useParams();
    const [turnos, setTurnos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const navigate = useNavigate();

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    useEffect(() => {
        const fetchTurnos = (date) => {
            const formattedDate = date.format('YYYY-MM-DD');
            axios.get(`http://localhost:8080/api/turnos/disponibles/${canchaId}/cancha?fecha=${formattedDate}`, tokenConfig)
                .then(response => {
                    setTurnos(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the turnos!", error);
                });
        };

        fetchTurnos(selectedDate);
    }, [canchaId, selectedDate]);

    const handleCreateReserva = (turnoId, turno) => {
        navigate(`/create-reserva/confirm`, { state: { turno } })
    };

    return (
        <>
            <NavbarClient />
            <Container>
                <Box sx={{ textAlign: 'start' }}>
                    <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal', fontSize: 30 }}>Turnos disponibles:</h2>
                </Box>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        minDate={dayjs()}
                        label="Seleccionar fecha"
                        value={selectedDate.format('YYYY-MM-DD') ? dayjs(selectedDate) : null}
                        onChange={(date) => setSelectedDate(date)}
                        format='DD/MM/YYYY'
                    />
                </LocalizationProvider>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {turnos.length > 0 ? (
                        turnos.map((turno) => (
                            <Grid item key={turno.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">{`Turno ${turno.id}`}</Typography>
                                        <Typography variant="body1">{`Hora de inicio: ${turno.horaInicio}`}</Typography>
                                        <Typography variant="body1">{`Hora de fin: ${turno.horaFin}`}</Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleCreateReserva(turno.id, turno)}>
                                            Reservar
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1">No se encontraron turnos disponibles para la fecha seleccionada.</Typography>
                    )}
                </Grid>
                <Button variant="contained" color="black" onClick={() => navigate(-1)}>
                    Atras
                </Button>
            </Container>
        </>
    );
};

export default TurnosDisponibles;
