import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../../components/NavbarClient';
import { Button, Container, Typography, Card, CardContent, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import backgroundImage from '../../assets/images/imagen_background_adv.png';

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
        console.log("Datos de la reserva que se envían:", turnoData);

        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:8080/api/reservas/byuser`, turnoData, tokenConfig);
            console.log(response);
            setSnackbarMessage("Reserva Confirmada!♥");
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/client-reservas');
            }, 3000); // 2 segundos
        } catch (error) {
            console.log("turno data:", turnoData);
            console.log("turno id:", email);
            console.log(turno);
            console.error(error);
        } finally {
            setLoading(false); // Detener loading
        }
    };

    return (
        <>
            <NavbarClient />
            <Container>
                <Box
                    sx={{
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
                    <Typography variant="h4" gutterBottom>
                        Confirmación de Reserva
                    </Typography>

                    <Card>
                        <CardContent>
                            <Typography variant="h5">Información del Usuario</Typography>
                            <Typography variant="body1">Nombre: {currentUser?.nombre}</Typography>
                            <Typography variant="body1">Email: {email}</Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h5">Información del Turno</Typography>
                            <Typography variant="body1">Fecha:{dayjs(turno.fecha).format('DD/MM/YYYY')}</Typography>
                            <Typography variant="body1">Hora de Inicio: {turno.horaInicio}</Typography>
                            <Typography variant="body1">Hora de Fin: {turno.horaFin}</Typography>
                            <Typography variant="body1">Tipo de Cancha: {turno.cancha.tipo}</Typography>
                            <Typography variant="body1">Cancha: {turno.cancha.nombre}</Typography>
                            <Typography variant='body1'>Precio por hora: $ {turno.cancha.precioHora}</Typography>
                        </CardContent>
                    </Card>
                    <Button variant="contained" color="primary" onClick={handleConfirm} sx={{ marginTop: 2 }} disabled={loading}>
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={24} sx={{ marginRight: 1 }} /> 
                                <Typography variant="body1">La cancha ya casi es tuya...</Typography>
                            </Box>
                        ) : (
                            "Confirmar"
                        )}
                    </Button>

                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '400px', fontSize: '1.2rem' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </Container>
        </>
    )
}

export default CreateReserva;