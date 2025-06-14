import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import NavbarClient from '../../components/NavbarClient';
import backgroundImage from '../../assets/images/imagen_background_adv.png';


const SelectSport = () => {
    const [selectedSport, setSelectedSport] = useState('');
    const navigate = useNavigate();

    const handleSportChange = (event) => {
        setSelectedSport(event.target.value);
    };

    const handleCancel = () => {
        navigate('/client-home');
    };

    const handleNext = () => {
        if (selectedSport) {
            navigate(`/canchas-disponibles/${selectedSport}`);
        } else {
            alert('Por favor, seleccione un deporte.');
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
                    p: 4,
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
                    1. Selecciona un deporte
                </Typography>
                <FormControl component="fieldset" sx={{ mb: '4', p: '4' }}>
                    <RadioGroup value={selectedSport} onChange={handleSportChange}>
                        <FormControlLabel value="futbol" control={<Radio />} label={<Typography sx={{ fontSize: '1.5rem' }}>Fútbol</Typography>} />
                        <FormControlLabel value="padel" control={<Radio />} label={<Typography sx={{ fontSize: '1.5rem' }}>Padel</Typography>} />
                    </RadioGroup>
                </FormControl>
                <Grid container spacing={3} sx={{ justifyContent: 'center', marginTop: 4 }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleNext} >
                            Siguiente
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="black" onClick={handleCancel}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default SelectSport;
