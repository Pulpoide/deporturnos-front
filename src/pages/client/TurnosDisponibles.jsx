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
import backgroundImage from '../../assets/images/imagen_background_adv.png';


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
                    console.error("Hay un error fetching los turnos!", error.response ? error.response.data : error.message);
                });
        };

        fetchTurnos(selectedDate);
    }, [canchaId, selectedDate]); 

    const handleCreateReserva = (turnoId, turno) => {
        navigate(`/create-reserva/confirm`, { state: { turno } });
    };


    return (
        <>
            <NavbarClient />
            <Box sx={{
                    width: '100%',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    p: 4,
                    m: 0,
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
                >
                <Typography variant='h5' component="h5" sx={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, mb:'50px' }}>
                    3. Selecciona un turno:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        minDate={dayjs()}
                        label="Seleccionar fecha"
                        value={selectedDate}
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
                        <Grid item xs={12}>
                        <Typography variant="body1" sx={{ textAlign: 'center', marginTop:5 }}>
                            No se encontraron turnos disponibles.
                        </Typography>
                    </Grid>
                    )}
                </Grid>
                <Button variant="contained" color="black" onClick={() => navigate(-1)}>
                    Atras
                </Button>
            </Box>
        </>
    );
};

export default TurnosDisponibles;
