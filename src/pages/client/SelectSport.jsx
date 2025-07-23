import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import NavbarClient from '../../components/NavbarClient';
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const titleStyle = {
    fontFamily: "Bungee, sans-serif",
    fontWeight: 400,
    mb: '30px',
    mt: '30px'
};

const radioLabelFont = {
    fontSize: '1.5rem',
    fontFamily: "Fjalla One, sans-serif"
};

const buttonStyle = {
    fontFamily: "Bungee, sans-serif",
    minWidth: '130px'
};

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
                    1. Selecciona un deporte
                </Typography>
                <FormControl component="fieldset" sx={{ mb: 4, p: 4 }}>
                    <RadioGroup value={selectedSport} onChange={handleSportChange}>
                        <FormControlLabel value="futbol" control={<Radio />} label={<Typography sx={radioLabelFont}>FÚTBOL</Typography>} />
                        <FormControlLabel value="padel" control={<Radio />} label={<Typography sx={radioLabelFont}>PADEL</Typography>} />
                    </RadioGroup>
                </FormControl>
                <Grid container spacing={3} sx={{ justifyContent: 'center', marginTop: 4 }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleNext} sx={buttonStyle}>
                            Siguiente
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="black" onClick={handleCancel} sx={buttonStyle}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default SelectSport;
