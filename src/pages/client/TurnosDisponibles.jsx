import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import NavbarClient from '../../components/NavbarClient';
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const titleStyle = {
    fontFamily: "Bungee, sans-serif",
    fontWeight: 400,
    mb: '30px',
    mt: '30px'
};

const cardTitleFont = {
    fontFamily: 'Fjalla One, sans-serif'
};

const cardHourFont = {
    fontFamily: 'Fjalla One, sans-serif',
    fontWeight: 'bold',
    color: 'green'
};

const reservarButtonStyle = {
    alignSelf: 'center',
    paddingY: 1.5,
    width: 'fit-content',
    marginTop: 2,
    fontFamily: "Bungee, sans-serif"
};

const backButtonStyle = {
    fontFamily: "Bungee, sans-serif",
    minWidth: '130px'
};

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
            axios.get(`${import.meta.env.VITE_API_URL}/api/turnos/disponibles/${canchaId}/cancha?fecha=${formattedDate}`, tokenConfig)
                .then(response => {
                    const sorted = [...response.data].sort((a, b) =>
                        dayjs(a.horaInicio, "HH:mm").unix() - dayjs(b.horaInicio, "HH:mm").unix()
                    );
                    setTurnos(sorted);
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
                pt: { xs: '12px', sm: '60px' },
                m: 0,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Typography
                    variant='h4'
                    component="h4"
                    sx={titleStyle}
                >
                    2. Selecciona un turno
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
                            <Grid item key={turno.id} xs={12} sm={6} md={3}
                                sx={{ display: "flex", justifyContent: "center" }}
                            >
                                <Card
                                    sx={{
                                        width: "100%",
                                        maxWidth: 260,
                                        p: 2,
                                        borderRadius: 4,
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                                        transition: "0.25s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                                        },
                                        textAlign: "center"
                                    }}
                                >
                                    <CardContent>

                                        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                                            Horario
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            sx={{ fontFamily: "Fjalla One", fontWeight: "bold", color: "#009688" }}
                                        >
                                            {turno.horaInicio} – {turno.horaFin}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{ display: "block", mt: 1, opacity: 0.6 }}
                                        >
                                            Turno #{turno.id}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            onClick={() => handleCreateReserva(turno.id, turno)}
                                            fullWidth
                                            sx={{
                                                mt: 2,
                                                py: 1,
                                                borderRadius: 3,
                                                fontFamily: "Bungee",
                                                textTransform: "none"
                                            }}
                                        >
                                            Reservar
                                        </Button>

                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: "Fjalla One, sans serif", margin: 3 }}>
                                No se encontraron turnos disponibles :(
                            </Typography>
                        </Grid>
                    )}
                </Grid>
                <Grid container justifyContent="center" sx={{ mt: 6, mb: 6 }}>
                    <Button variant="contained" color="black" onClick={() => navigate(-1)} sx={backButtonStyle}>
                        Atras
                    </Button>
                </Grid>
            </Box>
        </>
    );
};

export default TurnosDisponibles;
