import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Paper, Stack, Alert, CircularProgress, Box } from '@mui/material';

import { useNavigate } from "react-router";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import Navbar from "../components/Navbar";
import backgroundImage from '../assets/images/imagen_background_adv.png'


const VerifyAccout = () => {

    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState()
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.email) {
            setEmail(user.email);
        }
    }, []);

    const handleVerify = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify', {
                email,
                verificationCode,
            });

            setSuccess(response.data);
            setError('');

            // Redireccionamos al usuario
            setTimeout(() => {
                navigate('/client-home');
            }, 1500);


        } catch (error) {
            setError(error.response.data);
            setSuccess('');
        }
    }

    const handleResendCode = async () => {
        // Lógica para reenviar el código de verificación
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/resend', null, {
                params: {
                    email: email,
                }
            });
            console.log(response.data)
            setSuccess(response.data)
            setError('')
        } catch (err) {
            console.error(err)
            setError(err.response.data)
        } finally {
            setSuccess("Código reenviado!")
            setLoading(false);
        }
    };

    const pStyle = { marginLeft: 'auto', marginRight: 'auto', maxWidth: '42rem', fontSize: '16px', fontFamily: 'Roboto, sans-serif' };


    return (
        <>

            <Box
                sx={{
                    width: '100%', minHeight: '100vh', overflow: 'hidden', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
                }}>
                <Navbar />
                <Box >
                    <Grid container justifyContent="center" alignItems="center" textAlign='center'  style={{ minHeight: '100vh' }}>
                        <Grid item xs={10} sm={8} md={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal' }}>Verifica tu email</h2>
                                <p style={pStyle}>Un código de verificación fue enviado a: {email}</p>
                                <TextField
                                    fullWidth
                                    label="Código de Verificación"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    margin="normal"
                                    helperText="Introduce el código aquí"
                                    placeholder='-  -  -  -  -  -'
                                />

                                {error && (
                                    <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
                                        <Alert severity="error">{error}</Alert>
                                    </Stack>
                                )}
                                {success && (
                                    <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
                                        <Alert severity="success">{success}</Alert>
                                    </Stack>
                                )}

                                <Stack direction="column" spacing={2} justifyContent="center" marginTop="20px">
                                    <Button variant="contained" color="primary" onClick={handleVerify}>
                                        Verificar cuenta
                                    </Button>
                                    <Button variant="outlined" color="black" onClick={handleResendCode} startIcon={loading ? <CircularProgress size={20} /> : null}>
                                        Volver a enviar código
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )

}

export default VerifyAccout;