import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../../components/NavbarClient';


const CanchasDisponibles = () => {
    const { deporte } = useParams();
    const [canchas, setCanchas] = useState([]);
    const navigate = useNavigate();

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const handleBack = () => {
        navigate('/select-sport');
    };

    const handleViewTurnos = (canchaId) => {
        navigate(`/turnos-disponibles/${canchaId}`);
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/canchas/disponibles/${deporte}`, tokenConfig)
            .then(response => {
                console.log(response.data); // Verifica que esto sea un array
                setCanchas(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status == 403) {
                    navigate("/login")
                }
                console.error("There was an error fetching the canchas!", error);
            });
    }, [deporte]);

    return (
        <>
            <NavbarClient />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Canchas disponibles para {deporte}
                </Typography>
                <Grid container spacing={2}>
                    {canchas.length > 0 ? (
                        canchas.map((cancha) => (
                            <Grid item key={cancha.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4">{cancha.tipo}</Typography>
                                        <Typography variant="h5">{cancha.nombre}</Typography>
                                        <Typography variant="body2">Precio por hora: ${cancha.precioHora}</Typography>
                                        <Typography variant="body1">{cancha.descripcion}</Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleViewTurnos(cancha.id)}>
                                            Ver Turnos
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1">No se encontraron canchas disponibles.</Typography>
                    )}
                </Grid>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Button variant="contained" color="black" onClick={handleBack}>
                            Atras
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default CanchasDisponibles;
