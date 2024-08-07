import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import NavbarClient from '../../components/NavbarClient';

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
            <Container>
                <Typography variant="h4" gutterBottom>
                    Elija un deporte
                </Typography>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Deportes</FormLabel>
                    <RadioGroup value={selectedSport} onChange={handleSportChange}>
                        <FormControlLabel value="futbol" control={<Radio />} label="Futbol" />
                        <FormControlLabel value="padel" control={<Radio />} label="Padel" />
                    </RadioGroup>
                </FormControl>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Button variant="contained" color="black" onClick={handleCancel}>
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Siguiente
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SelectSport;
