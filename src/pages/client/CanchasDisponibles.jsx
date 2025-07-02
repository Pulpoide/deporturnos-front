import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, MenuItem, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../../components/NavbarClient';
import backgroundImage from '../../assets/images/imagen_background_adv.png';


const CanchasDisponibles = () => {
    const { deporte } = useParams();
    const [canchas, setCanchas] = useState([]);
    const [canchasFiltradas, setCanchasFiltradas] = useState([]);
    const [tipoDeCancha, setTipoDeCancha] = useState("Todos");
    const navigate = useNavigate();

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
        if (tipoDeCancha === "Todos") {
            setCanchasFiltradas(canchas);
        } else {
            setCanchasFiltradas(canchas.filter((cancha) => cancha.tipo === tipoDeCancha));
        }
    }, [tipoDeCancha, canchas]);

    const obtenerOpcionesDeCancha = () => {
        if (deporte === 'futbol') {
            return [
                { value: 'FÚTBOL 5', label: 'FÚTBOL 5' },
                { value: 'FÚTBOL 7', label: 'FÚTBOL 7' },
                { value: 'FÚTBOL 11', label: 'FÚTBOL 11' }
            ];
        } else if (deporte === 'padel') {
            return [
                { value: 'DE CEMENTO', label: 'DE CEMENTO' },
                { value: 'DE ACRÍLICO', label: 'DE ACRÍLICO' }
            ];
        } else {
            navigate('/select-sport');
            return [];
        }
    };

    const opcionesDeCancha = obtenerOpcionesDeCancha();


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
            }}
            >
                <Typography
                    variant='h4'
                    component="h4"
                    sx={{
                        fontFamily: "Bungee, sans-serif",
                        fontWeight: 400,
                        mb: '30px',
                        mt: '30px'
                    }}
                >
                    2. Selecciona una cancha
                </Typography>
                <TextField
                    select
                    label="Tipo de cancha"
                    value={tipoDeCancha}
                    onChange={(e) => setTipoDeCancha(e.target.value)}
                    sx={{
                        width: {
                            xs: '150px',
                            sm: '200px',
                            md: '250px',
                        },
                        marginBottom: 3
                    }}
                    
                >
                    <MenuItem value="Todos" sx={{ fontFamily: "Fjalla One, sans-serif", textAlign: 'center' }}>
                        Todos
                    </MenuItem>
                    {
                        opcionesDeCancha.map((opcion) => (
                            <MenuItem 
                                sx={{ fontFamily: "Fjalla One, sans-serif", textAlign: 'center' }}
                                key={opcion.value} 
                                value={opcion.value}>
                                {opcion.label}
                            </MenuItem>
                        ))
                    }
                </TextField>

                <Grid container spacing={2}>
                    {canchasFiltradas.length > 0 ? (
                        canchasFiltradas.map((cancha) => (
                            <Grid item key={cancha.id} xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                                <Card sx={{ width: '100%', maxWidth: '300px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 2, height: 'auto' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h4" sx={{ fontFamily: "Fjalla One, sans-serif" }}>{cancha.tipo}</Typography>
                                        <hr style={{ margin: '10px 0' }} />
                                        <Typography variant="h5" sx={{ fontFamily: "Fjalla One, sans-serif", color:"green" }}>{cancha.nombre}</Typography>
                                        <hr style={{ margin: '10px 0' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "Fjalla One, sans-serif" }}>${cancha.precioHora} x hora</Typography>
                                        <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {cancha.descripcion}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewTurnos(cancha.id)}
                                        sx={{
                                            alignSelf: 'center',
                                            paddingY: 1.5,
                                            width: 'fit-content',
                                            marginBottom: 2.7,
                                            fontFamily: "Bungee, sans-serif",
                                        }}
                                    >
                                        Ver Turnos disponibles
                                    </Button>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center', fontFamily:"Fjalla One, sans serif", margin: 3 }}>
                                No se encontraron canchas disponibles :(
                            </Typography>
                        </Grid>
                    )}
                </Grid>
                <Grid container justifyContent="center" sx={{marginBottom: 6}}>
                    <Button variant="contained" color="black" onClick={() => navigate(-1)} sx={{
                        fontFamily: "Bungee, sans-serif", minWidth: '130px'} }>
                        Atras
                    </Button>
                </Grid>
            </Box>
        </>
    );
};

export default CanchasDisponibles;
