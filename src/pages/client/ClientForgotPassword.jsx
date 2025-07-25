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

    const paperStyle = {
        maxWidth: 500,
        width: '100%',
        boxSizing: 'border-box',
        padding: { xs: '27px 32px', sm: '32px 32px' },
        mx: 'auto',
        borderRadius: '7%',
        textAlign: 'center',
        maxHeight: { xs: '80vh', sm: 'auto' },
        overflowY: { xs: 'auto', sm: 'visible' },
    }
    const avatarStyle = { backgroundColor: "#121212" }

    const handleSubmit = async () => {
        setSuccess(null);
        setError(null);

        if (!email) {
            setEmailError(true)
            setError("Ingrese su email.")
            return;
        } else if (!isEmail(email)) {
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
  <>
    <Navbar />

    <Box
      component="main"
      sx={{
        minHeight: { xs: 'calc(100vh - 110px)', sm: 'calc(100vh - 66px)' },
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 2, sm: 0 },
          px: { xs: 2, sm: 0 },
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
        }}
      >
        <Paper elevation={24} sx={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockResetIcon />
            </Avatar>
            <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400 }}>
              Recuperar contraseña
            </h2>
          </Grid>

          <TextField
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            value={email}
            helperText="Por favor ingrese su correo electrónico"
            placeholder="example@gmail.com"
            fullWidth
            required
            margin="normal"
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{
              fontFamily: "Bungee, sans-serif",
              fontWeight: 400,
              mt: 2,
            }}
            onClick={handleSubmit}
          >
            Recuperar
          </Button>

          {error && (
            <Stack sx={{ width: "100%", pt: 1 }} spacing={2}>
              <Alert severity="error">{error}</Alert>
            </Stack>
          )}
          {success && (
            <Stack sx={{ width: "100%", pt: 1 }} spacing={2}>
              <Alert severity="success">{success}</Alert>
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  </>
);
}

export default ClientForgotPassword;