import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/imagen_background_adv.png';
import dayjs from 'dayjs';
import NavbarAdmin from '../../components/NavbarAdmin';

const AdminValidateReserva = () => {
    const { reservaId } = useParams();
    const [reserva, setReserva] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    useEffect(() => {
        if (reservaId) {
            fetchReserva();
        }
    }, [reservaId]);

    const fetchReserva = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservas/${reservaId}`, tokenConfig);
            setReserva(response.data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                navigate('/login');
            } else if (error.response && error.response.status === 404) {
                setError('Reserva no encontrada.');
            } else {
                console.error('Error fetchReserva:', error);
                setError('Error al cargar la reserva.');
            }
        }
    };

    const handleEmpezar = async () => {

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/reservas/${reservaId}/empezar`, {}, tokenConfig);
            console.log('Reserva empezada:', response.data);
            alert("¡Reserva iniciada correctamente! Los jugadores pueden ingresar a la cancha.")
            navigate('/admin-home');
        } catch (error) {
            console.error('Error al cambiar el estado de la reserva:', error);
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!reserva) {
        return <Typography variant="h6">Error al cargar los datos de la reserva.</Typography>;
    }

    return (
        <>
        <NavbarAdmin />
        <Box sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'center',
            padding: 5
        }}>
            <Typography variant="h4" fontFamily="Bungee Inline, sans-serif" sx={{ m: 3 }}>Validación de Reserva</Typography>
            <Typography variant="h5">
                {reserva.usuario.nombre}
            </Typography>
            <Typography variant="h5">
                {reserva.usuario.email}
            </Typography>
            <br />
            <Typography variant="body1">
                Fecha: {dayjs(reserva.turno.fecha).format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body1">
                Hora: {reserva.turno.horaInicio} - {reserva.turno.horaFin}
            </Typography>
            <Typography variant="body1">
                Cancha: {reserva.turno.cancha.nombre}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={handleEmpezar}
                sx={{ marginTop: 2, fontFamily: 'Bungee Inline, sans-serif', fontSize: '1.2rem' }}
            >
                EMPEZAR
            </Button>

        </Box>
        </>
    );
};

export default AdminValidateReserva;
