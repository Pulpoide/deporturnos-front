import { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import {
  Avatar, Button, Grid, Paper, TextField,
  CircularProgress, FormHelperText, OutlinedInput,
  InputLabel, InputAdornment, IconButton, FormControl,
  Stack, Alert, Box
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import backgroundImage from '../assets/images/imagen_background_adv.png'
import Footer from '../components/Footer';
import { textAlign } from '@mui/system';

const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const isPassword = (pass) =>
  /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/i.test(pass);

const isTelefono = (telefono) =>
  /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/i.test(telefono);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');

  const [nombreError, setNombreError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [secondPasswordError, setSecondPasswordError] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const paperStyle = {
    maxWidth: 433,
    width: '100%',
    boxSizing: 'border-box',
    padding: { xs: '17px 32px', sm: '32px 32px' },
    mx: 'auto',
    borderRadius: '7%',
    textAlign: 'center',
    overflowY: { xs: 'auto', sm: 'visible' },
  };
  const avatarStyle = { backgroundColor: "#121212" };

  const handleNombre = () => {
    if (!nombre) {
      setNombreError(true);
      return;
    }
    setNombreError(false);
  };

  const handleEmail = () => {
    if (!isEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
  };

  const handleTelefono = () => {
    if (telefono && !isTelefono(telefono)) {
      setTelefonoError(true);
      return;
    }
    setTelefonoError(false);
  };

  const handlePassword = () => {
    if (!isPassword(password)) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  const handleSecondPassword = () => {
    if (password !== secondPassword) {
      setSecondPasswordError(true);
      return;
    }
    setSecondPasswordError(false);
  };

  const handleSubmit = async () => {
    setSuccess(null);

    if (nombreError) {
      setError("Ingrese un nombre porfavor.");
      return;
    }

    if (emailError || !email) {
      setError("Email no válido.");
      return;
    }

    if (telefonoError) {
      setError("Teléfono no válido.");
      return;
    }

    if (passwordError || !password) {
      setError("La contraseña no cumple con los requisitos de seguridad: Minimo ocho caracteres, al menos un número y una letra.");
      return;
    }

    if (secondPasswordError || !secondPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError(null);
    setLoading(true);

    const user = { nombre, email, password, telefono };
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, user);
      const result = response.data;

      localStorage.setItem('currentUser', JSON.stringify(result));
      localStorage.setItem('token', response.data.token);

      setSuccess("Registro Exitoso!");
      setTimeout(() => {
        window.location.href = '/verify';
      }, 1500);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.data.message + ".");
      } else {
        setError('Error al registrar el usuario. Inténtalo de nuevo.');
      }
      setSuccess('');
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
          <Paper elevation={24} sx={paperStyle} >
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <AppRegistrationIcon />
              </Avatar>
              <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal' }}>Registro</h2>
            </Grid>
            <TextField
              onChange={(e) => setNombre(e.target.value)}
              error={nombreError}
              onBlur={handleNombre}
              helperText="Por favor ingrese su nombre completo"
              margin='normal'
              label="Nombre"
              placeholder='Juan Morales'
              color='custom'
              onKeyDown={handleKeyPress}
              fullWidth required
            />
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              onBlur={handleEmail}
              helperText="Por favor ingrese su correo electrónico"
              margin='normal'
              label="Email"
              placeholder='example@gmail.com'
              color='custom'
              onKeyDown={handleKeyPress}
              fullWidth required
            />
            <TextField
              onChange={(e) => setTelefono(e.target.value)}
              error={telefonoError}
              onBlur={handleTelefono}
              helperText="Por favor ingrese su teléfono"
              margin='normal'
              label="Teléfono"
              placeholder='3512767955'
              color='custom'
              onKeyDown={handleKeyPress}
              fullWidth
            />
            <FormControl margin='normal' variant="outlined" color='custom' fullWidth required>
              <InputLabel error={passwordError} htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                error={passwordError}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePassword}
                required
                placeholder='**************'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                onKeyDown={handleKeyPress}
              />
              <FormHelperText id="standard-weight-helper-text">Por favor ingrese su contraseña</FormHelperText>
            </FormControl>
            <FormControl margin='normal' variant="outlined" color='custom' fullWidth required>
              <InputLabel error={secondPasswordError} htmlFor="outlined-adornment-password">Confirmar</InputLabel>
              <OutlinedInput
                error={secondPasswordError}
                onChange={(e) => setSecondPassword(e.target.value)}
                onBlur={handleSecondPassword}
                required
                placeholder='**************'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                onKeyDown={handleKeyPress}
              />
              <FormHelperText id="standard-weight-helper-text">Repita su contraseña</FormHelperText>
            </FormControl>
            <Button
              type='submit'
              color='custom'
              sx={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal', marginTop: '12px' }}
              variant='contained'
              fullWidth
              onClick={handleSubmit}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              disabled={loading}
            >
              Registrarme
            </Button>
            {error && (
              <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                <Alert severity="error">{error}</Alert>
              </Stack>
            )}
            {success && (
              <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                <Alert severity="success">{success}</Alert>
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Register;