import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import NavbarAdmin from "../../components/NavbarAdmin";
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const AdminProfits = () => {
    const [fechaDesdeInput, setFechaDesdeInput] = useState(null);
    const [fechaHastaInput, setFechaHastaInput] = useState(null);
    const [error, setError] = useState(null);
    const [ganancias, setGanancias] = useState(null);

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };

    const handleCalculate = async () => {
        if (!fechaDesdeInput || !fechaHastaInput) {
            setError('Por favor, seleccione ambas fechas');
            return;
        }
        setError(null); // Resetear error

        const fechaDesde = dayjs(fechaDesdeInput).format('YYYY-MM-DD');
        const fechaHasta = dayjs(fechaHastaInput).format('YYYY-MM-DD');

        try {
            const response = await fetch(`http://localhost:8080/api/reportes/calculate-profits?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...tokenConfig.headers,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setGanancias(data); // Guardar ganancias
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al calcular ganancias');
            }
        } catch (error) {
            setError('Error de conexión: ' + error.message);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NavbarAdmin />
            <Box
                sx={{
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
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Calcular Ganancias</Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <DatePicker
                            label="Fecha Desde"
                            value={fechaDesdeInput}
                            onChange={(newValue) => setFechaDesdeInput(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            label="Fecha Hasta"
                            value={fechaHastaInput}
                            onChange={(newValue) => setFechaHastaInput(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={handleCalculate} sx={{ marginTop: 2 }}>
                    Calcular Ganancias
                </Button>

                {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
                
                {ganancias !== null && (
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            marginTop: 2, 
                            padding: 2, 
                            backgroundColor: '#f0f4f8', 
                            textAlign: 'left' 
                        }}>
                        <Typography variant="h6">Ganancias: ${ganancias.toLocaleString()}</Typography>
                        <Typography variant="body2">Desde: {dayjs(fechaDesdeInput).format('DD-MM-YYYY')}</Typography>
                        <Typography variant="body2">Hasta: {dayjs(fechaHastaInput).format('DD-MM-YYYY')}</Typography>
                    </Paper>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default AdminProfits;
