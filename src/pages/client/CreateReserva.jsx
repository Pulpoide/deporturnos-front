import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../../components/NavbarClient';
import { Button, Container, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

const CreateReserva = () => {
    const location = useLocation();
    const turno = location.state?.turno || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const turnoId = turno?.id;
    const email = currentUser?.email;
    const navigate = useNavigate();

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const handleConfirm = async () => {
        const turnoData = { turnoId }
        turnoData.turnoId = turnoId;

        try {
            const response = await axios.post(`http://localhost:8080/api/reservas/byuser`, turnoData, tokenConfig);
            console.log(response)
            alert("Reserva Confirmada!♥")
            navigate('/client-reservas')
        } catch (error) {
            console.log("turno data:", turnoData)
            console.log("turno id:", email)
            console.log(turno)
            console.error(error)
        }
    };

    return (
        <>
            <NavbarClient />
            <Container>
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
                        <Typography variant="body1">Hora de Inicio: {turno.horaInicio}</Typography>
                        <Typography variant="body1">Hora de Fin: {turno.horaFin}</Typography>
                        <Typography variant="body1">Tipo de Cancha: {turno.cancha.tipo}</Typography>
                        <Typography variant="body1">Cancha: {turno.cancha.nombre}</Typography>
                        <Typography variant='body1'>Precio por hora:{turno.cancha.precioHora}</Typography>
                    </CardContent>
                </Card>

                <Button variant="contained" color="primary" onClick={handleConfirm} sx={{ marginTop: 2 }}>
                    Confirmar
                </Button>
            </Container>
        </>
    )
}

export default CreateReserva;