import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Corrección de import
import {
  Button,
  Paper,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
  Box,
  Typography,
  Container
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import backgroundImage from '../assets/images/bg_ad.png'

// Validaciones (Las mantenemos fuera del componente para limpieza)
const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
const isPassword = (pass) => /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/i.test(pass);
const isTelefono = (telefono) => /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/i.test(telefono);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');

  // Error States
  const [nombreError, setNombreError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [secondPasswordError, setSecondPasswordError] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSubmit(); };

  // Validation Handlers (OnBlur)
  const handleNombreBlur = () => setNombreError(!nombre);
  const handleEmailBlur = () => setEmailError(!isEmail(email));
  const handleTelefonoBlur = () => setTelefonoError(telefono && !isTelefono(telefono));
  const handlePasswordBlur = () => setPasswordError(!isPassword(password));
  const handleSecondPasswordBlur = () => setSecondPasswordError(password !== secondPassword);

  const handleSubmit = async () => {
    setSuccess(null);
    setError(null);

    // Validación Final antes de enviar
    if (!nombre) { setError("Ingrese su nombre."); setNombreError(true); return; }
    if (!email || !isEmail(email)) { setError("Email inválido."); setEmailError(true); return; }
    if (telefono && !isTelefono(telefono)) { setError("Teléfono inválido."); setTelefonoError(true); return; }
    if (!password || !isPassword(password)) {
      setError("La contraseña debe tener 8-16 caracteres, letras y números.");
      setPasswordError(true);
      return;
    }
    if (password !== secondPassword) { setError("Las contraseñas no coinciden."); setSecondPasswordError(true); return; }

    setLoading(true);
    const user = { nombre, email, password, telefono };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, user);

      // Auto-Login logic (opcional) o redirección
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      setSuccess("¡Registro Exitoso! Redirigiendo...");
      setTimeout(() => {
        navigate('/verify'); // O la ruta que prefieras
      }, 1500);

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.data.message || "El usuario ya existe.");
      } else {
        setError('Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          // Fix para móviles: evita que el teclado rompa el fondo
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay Oscuro */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }} />

        <Container
          maxWidth="sm" // Un poco más ancho que Login (xs) porque hay más campos
          sx={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Paper
            elevation={10}
            sx={{
              width: '100%',
              padding: { xs: 3, sm: 5 },
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
          >
            {/* Header */}
            <Typography variant="h4" sx={{ fontFamily: "Bungee, sans-serif", mb: 1, color: '#1a1a1a' }}>
              CREAR CUENTA
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#666', mb: 4 }}>
              Únete a la comunidad de Deporturnos
            </Typography>

            {/* Inputs Stack */}
            <Stack spacing={2}>
              <TextField
                label="Nombre Completo"
                placeholder='Ej: Juan Pérez'
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={handleNombreBlur}
                error={nombreError}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
              />

              <TextField
                label="Email"
                placeholder='ejemplo@correo.com'
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                error={emailError}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
              />

              <TextField
                label="Teléfono"
                placeholder='351...'
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onBlur={handleTelefonoBlur}
                error={telefonoError}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
              />

              {/* Password Field 1 */}
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                error={passwordError}
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

              {/* Password Field 2 */}
              <TextField
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={secondPassword}
                onChange={(e) => setSecondPassword(e.target.value)}
                onBlur={handleSecondPasswordBlur}
                error={secondPasswordError}
              />
            </Stack>

            {/* Mensaje de requisitos de contraseña sutil */}
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#888', fontSize: '0.75rem', textAlign: 'left' }}>
              * La contraseña debe tener entre 8 y 16 caracteres, al menos un número y una letra.
            </Typography>

            {/* Botón de Acción */}
            <Button
              variant='contained'
              fullWidth
              size='large'
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              sx={{
                mt: 3,
                fontFamily: "Bungee, sans-serif",
                backgroundColor: '#00b04b',
                py: 1.5,
                borderRadius: '50px',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(0, 176, 75, 0.4)',
                '&:hover': { backgroundColor: '#009640' }
              }}
            >
              {loading ? 'REGISTRANDO...' : 'REGISTRARME'}
            </Button>

            {/* Feedback Messages */}
            <Box sx={{ mt: 2 }}>
              {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ borderRadius: '12px' }}>{success}</Alert>}
            </Box>

            {/* Footer Link */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#666' }}>
                ¿Ya tienes una cuenta? {' '}
                <RouterLink to='/login' style={{ textDecoration: 'none', color: '#00b04b', fontWeight: 'bold' }}>
                  Inicia sesión aquí
                </RouterLink>
              </Typography>
            </Box>

          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Register;