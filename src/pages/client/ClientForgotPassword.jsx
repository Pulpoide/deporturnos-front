import { useState } from 'react';
import axios from 'axios';

import { Box, Grid, Paper, Avatar, TextField, Button } from "@mui/material"
import LockResetIcon from '@mui/icons-material/LockReset';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


import Navbar from "../../components/Navbar";
import backgroundImage from '../../assets/images/imagen_background_adv.png'
// Email Validation
const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const ClientForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const paperStyle = { padding: 27, width: 450 }
    const avatarStyle = { backgroundColor: "#121212" }

    const handleSubmit = async () => {
        setSuccess(null);
        setError(null);

        if (!email) {
            setEmailError(true)
            setError("Ingrese su email.")
            return;
        }else if(!isEmail(email)){
            setEmailError(true)
            setError("Ingrese un email válido.")
            return;
        } else {
            setEmailError(false)
        }



        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, null, {
                params: {
                    email: email,
                }
            });
            setSuccess('Fue enviado un link a tu email para restablecer tu contraseña.')
        } catch (error) {
            setError(error.response?.data || "Ocurrió un error al procesar la solicitud.");
        } 
    }

    return (
        <div>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '75vh',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'auto',
                    backgroundPosition: 'center',
                    opacity: 1,
                    zIndex: -1,
                }}
            />
            <Navbar />

            <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
                minHeight={'75vh'}
            >
                <Grid>
                    <Paper elevation={24} style={paperStyle} >
                        <Grid align="center">
                            <Avatar style={avatarStyle}>
                                <LockResetIcon />
                            </Avatar>
                            <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal' }}>
                                Recuperar contraseña
                            </h2>
                        </Grid>

                        <TextField
                            onChange={(e) => setEmail(e.target.value)}
                            error={emailError}
                            value={email}
                            helperText="Por favor ingrese su correo electrónico"
                            placeholder='example@gmail.com'
                            fullWidth required
                        />

                        <Button color='custom' size='large' type='submit' variant='contained' fullWidth onClick={handleSubmit} >
                            Recuperar
                        </Button>

                        {
                            error &&
                            <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            </Stack>
                        }

                        {
                            success &&
                            <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                                <Alert severity="success">
                                    {success}
                                </Alert>
                            </Stack>
                        }
                    </Paper>
                </Grid>
            </Box>

        </div>
    );
}

export default ClientForgotPassword;