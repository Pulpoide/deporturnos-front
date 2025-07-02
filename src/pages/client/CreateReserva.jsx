import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarClient from '../../components/NavbarClient';
import { Button, Typography, Grid, Card, CardContent, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const titleStyle = {
    fontFamily: "Bungee, sans-serif",
    fontWeight: 400,
    mb: '30px',
    mt: '30px'
};

const userInfoFont = {
    fontFamily: "Fjalla One, sans-serif",
    fontWeight: 'bold',
    color: 'green'
};

const cardFont = {
    fontFamily: "Fjalla One, sans-serif"
};

const confirmButtonStyle = {
    marginTop: 2,
    fontFamily: 'Bungee, sans-serif'
};

const backButtonStyle = {
    fontFamily: "Bungee, sans-serif",
    minWidth: '130px'
};

const snackbarStyle = {
    width: '400px',
    fontSize: '1.2rem',
    fontFamily: 'Fjalla One, Sans-serif',
    fontWeight: 'bold'
};

const CreateReserva = () => {
    const location = useLocation();
    const turno = location.state?.turno || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const turnoId = turno?.id;
    const email = currentUser?.email;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const handleConfirm = async () => {
        const turnoData = { turnoId };
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/reservas/byuser`, turnoData, tokenConfig);
            setSnackbarMessage("Reserva Confirmada!♥");
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/client-reservas');
            }, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarClient />
            <Box
                sx={{
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
                }}
            >
                <Typography
                    variant='h4'
                    component="h4"
                    sx={titleStyle}
                >
                    Confirmación de Reserva
                </Typography>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={userInfoFont}>INFORMACIÓN DEL USUARIO</Typography>
                        <hr />
                        <Typography variant="h6" sx={cardFont}>{currentUser?.nombre}</Typography>
                        <Typography variant="h6" sx={cardFont}>{email}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ marginTop: 4 }}>
                    <CardContent>
                        <Typography variant="h5" sx={userInfoFont}>INFORMACIÓN DEL TURNO</Typography>
                        <hr />
                        <Typography variant="h6" sx={cardFont}>Fecha: {dayjs(turno.fecha).format('DD/MM/YYYY')}</Typography>
                        <Typography variant="h6" sx={cardFont}>Hora de Inicio: {turno.horaInicio}</Typography>
                        <Typography variant="h6" sx={cardFont}>Hora de Fin: {turno.horaFin}</Typography>
                        <Typography variant="h6" sx={cardFont}>Tipo de Cancha: {turno.cancha.tipo}</Typography>
                        <Typography variant="h6" sx={cardFont}>Nombre de Cancha: {turno.cancha.nombre}</Typography>
                        <Typography variant='h6' sx={cardFont}>Precio por hora: ${turno.cancha.precioHora}</Typography>
                    </CardContent>
                </Card>
                <Button variant="contained" color="primary" onClick={handleConfirm} sx={confirmButtonStyle} disabled={loading}>
                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={24} sx={{ marginRight: 1 }} />
                            <Typography variant="body1" sx={confirmButtonStyle}>La cancha ya casi es tuya...</Typography>
                        </Box>
                    ) : (
                        "Confirmar"
                    )}
                </Button>
                <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="black" onClick={() => navigate(-1)} sx={backButtonStyle}>
                        Atras
                    </Button>
                </Grid>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={snackbarStyle}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default CreateReserva;