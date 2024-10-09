import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Avatar, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockResetIcon from '@mui/icons-material/LockReset';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import bgimg from '../../assets/images/thw.jpg';
import { jwtDecode } from 'jwt-decode';


// Password Validation
const isPassword = (pass) =>
    /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/i.test(pass);


const ClientResetPassword = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const tokenConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const paperStyle = { padding: 27, width: 450 };
    const avatarStyle = { backgroundColor: "#121212" };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);

            if (!decodedToken.roles || !decodedToken.roles.includes('CLIENTE')) {
                navigate('/login')
            }
            // Todo god mostro, pase pase

        } else {
            navigate('/login')
        }
    }, [token, navigate]);

    const handleSubmit = async () => {
        setSuccess(null);
        setError(null);

        if (!newPassword || !isPassword(newPassword)) {
            setPasswordError(true)
            setError("La nueva contraseña no cumple con los requisitos de seguridad: Minimo ocho caracteres, al menos un número y una letra.")
            return;
        }

        if (newPassword != confirmNewPassword) {
            setPasswordError(true)
            setError("Las contraseñas no coinciden.")
            return;
        }

        setPasswordError(false)

        try {
            const authToken = localStorage.getItem('token');
            const tokenConfig = {
                headers: { Authorization: `Bearer ${authToken}` }
            };

            await axios.post('http://localhost:8080/api/usuarios/reset-password',
                {
                    newPassword,
                    confirmNewPassword
                },
                {
                    params: {token},
                    ...tokenConfig
                }
                
            );

            setSuccess("Tu contraseña ha sido restablecida exitosamente.")

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error(error)
            setError(error.response?.data || "Ocurrió un error al restablecer la contraseña.")
        }



    };

    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

    return (
        <div>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '75vh',
                    backgroundImage: `url(${bgimg})`,
                    backgroundSize: 'auto',
                    backgroundPosition: 'center',
                    opacity: 1,
                    zIndex: -1,
                }}
            />

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
                                Restablecer contraseña
                            </h2>
                        </Grid>

                        <TextField
                            onChange={(e) => setNewPassword(e.target.value)}
                            error={passwordError}
                            value={newPassword}
                            type={showNewPassword ? "text" : "password"}
                            helperText="Ingrese su nueva contraseña"
                            placeholder='Nueva contraseña'
                            fullWidth required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowNewPassword} edge="end">
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            error={passwordError}
                            value={confirmNewPassword}
                            type={showConfirmNewPassword ? "text" : "password"}
                            helperText="Confirme su nueva contraseña"
                            placeholder='Confirmar contraseña'
                            fullWidth required
                            sx={{ marginTop: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowConfirmNewPassword} edge="end">
                                            {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />



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
                        <Button color='custom' size='large' type='submit' variant='contained' fullWidth onClick={handleSubmit} sx={{ marginTop: 2 }}>
                            Cambiar contraseña
                        </Button>
                    </Paper>
                </Grid>
            </Box>
        </div>
    );
}

export default ClientResetPassword;
