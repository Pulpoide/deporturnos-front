import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Grid, Card, CardContent, MenuItem, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../../components/NavbarClient';


const CanchasDisponibles = () => {
    const { deporte } = useParams();
    const [canchas, setCanchas] = useState([]);
    const [canchasFiltradas, setCanchasFiltradas] = useState([]);
    const [tipoDeCancha, setTipoDeCancha] = useState("cualquiera");
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
                console.log(response.data);
                setCanchas(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status == 403) {
                    navigate("/login")
                }
                console.error("There was an error fetching the canchas!", error);
            });
    }, [deporte]);


    useEffect(() => {
        // Filtrar canchas según el tipo seleccionado
        if (tipoDeCancha === "cualquiera") {
          setCanchasFiltradas(canchas); // Mostrar todas las canchas si se selecciona "Cualquiera"
        } else {
          setCanchasFiltradas(canchas.filter((cancha) => cancha.tipo === tipoDeCancha));
        }
      }, [tipoDeCancha, canchas]);


    return (
        <>
            <NavbarClient />
            <Container>
                <Box sx={{ textAlign: 'start' }}>
                    <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal', fontSize: 30 }}>
                        2. Selección de cancha:
                    </h2>
                </Box>
                <TextField
                    select
                    helperText="Tipo de Cancha"
                    label="Cancha"
                    value={tipoDeCancha}
                    onChange={(e) => setTipoDeCancha(e.target.value)}
                >
                    <MenuItem value="cualquiera">
                            Cualquiera
                    </MenuItem>
                    <MenuItem value="FÚTBOL 5">
                            FÚTBOL 5
                    </MenuItem>
                    <MenuItem value="FÚTBOL 7">
                            FÚTBOL 7
                    </MenuItem>
                    <MenuItem value="FÚTBOL 11">
                            FÚTBOL 11
                    </MenuItem>
                </TextField>
                <Grid container spacing={2}>
                    {canchasFiltradas.length > 0 ? (
                        canchasFiltradas.map((cancha) => (
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
