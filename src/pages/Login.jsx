import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Button,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Switch,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  Container
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { alpha, styled } from '@mui/material/styles';
import backgroundImage from '../assets/images/imagen_background_adv.png'

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#00b04b',
    '&:hover': {
      backgroundColor: alpha('#00b04b', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#00b04b',
  },
}));

const Login = () => {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error States
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async () => {
    setSuccess(null);
    setError(null);

    // Validación simple
    let hasError = false;
    if (!email) { setEmailError(true); hasError = true; } else { setEmailError(false); }
    if (!password) { setPasswordError(true); hasError = true; } else { setPasswordError(false); }

    if (hasError) {
      setError("Por favor completa los campos requeridos.");
      return;
    }

    const credentials = { email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, credentials);
      const result = response.data;

      localStorage.setItem('currentUser', JSON.stringify(result));
      localStorage.setItem('token', response.data.token);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setSuccess("¡Bienvenido de nuevo!");

      // Pequeño delay para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const role = decodedToken.roles[0];

        if (role === 'CLIENTE') navigate('/client-home');
        else if (role === 'ADMIN') navigate('/admin-home');
      }, 1000);

    } catch (error) {
      console.error('Error during login:', error);
      setError("Email o contraseña incorrectos.");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          minHeight: '100vh', // Asegura pantalla completa
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* Capa oscura para mejorar lectura */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />

        <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>

          <Paper
            elevation={10}
            sx={{
              width: '100%',
              padding: { xs: 3, sm: 5 },
              borderRadius: '24px', // Mucho más moderno que el 25%
              backgroundColor: 'rgba(255, 255, 255, 0.95)', // Efecto casi sólido pero luminoso
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
          >
            {/* Título */}
            <Typography variant="h4" sx={{ fontFamily: "Bungee, sans-serif", mb: 1, color: '#1a1a1a' }}>
              HOLA DE NUEVO
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#666', mb: 4 }}>
              Ingresa tus credenciales para continuar
            </Typography>

            {/* Inputs */}
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                placeholder='ejemplo@correo.com'
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                onKeyDown={handleKeyPress}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
              />

              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                onKeyDown={handleKeyPress}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            {/* Opciones extra */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
              <FormControlLabel
                control={<CustomSwitch checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label={<Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem' }}>Recordarme</Typography>}
              />
              <RouterLink to='/forgot-password' style={{ textDecoration: 'none', color: '#00b04b', fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem', fontWeight: 600 }}>
                ¿Olvidaste tu contraseña?
              </RouterLink>
            </Box>

            {/* Botón de Acción */}
            <Button
              variant='contained'
              fullWidth
              size='large'
              onClick={handleSubmit}
              startIcon={<LoginIcon />}
              sx={{
                fontFamily: "Bungee, sans-serif",
                backgroundColor: '#00b04b',
                py: 1.5,
                borderRadius: '50px',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(0, 176, 75, 0.4)',
                '&:hover': { backgroundColor: '#009640' }
              }}
            >
              INGRESAR
            </Button>

            {/* Feedback Mensajes */}
            <Box sx={{ mt: 2 }}>
              {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ borderRadius: '12px' }}>{success}</Alert>}
            </Box>

            {/* Link a Registro */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#666' }}>
                ¿No tienes una cuenta? {' '}
                <RouterLink to='/register' style={{ textDecoration: 'none', color: '#00b04b', fontWeight: 'bold' }}>
                  Regístrate aquí
                </RouterLink>
              </Typography>
            </Box>

          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;