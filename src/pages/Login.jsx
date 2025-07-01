import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { Avatar, Button, FormControlLabel, Grid, Paper, TextField, Switch, Box } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import backgroundImage from '../assets/images/imagen_background_adv.png'
import Footer from '../components/Footer';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#43a047',
    '&:hover': {
      backgroundColor: alpha('#43a047', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#43a047',
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const paperStyle = {
    maxWidth: 500,
    width: '100%',
    boxSizing: 'border-box',
    padding: { xs: '27px 32px', sm: '32px 32px' },
    mx: 'auto',
    borderRadius:'25%'
  };

  const avatarStyle = { backgroundColor: "#121212" };


  const handleSubmit = async () => {
    setSuccess(null);
    if (!email) {
      setEmailError(true)
      setError("Email inválido.");
      return;
    } else {
      setEmailError(false)
    }
    if (!password) {
      setError("Ingrese su contraseña.");
      return;
    }
    setError(null);
    const credentials = { email, password };
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      const result = response.data;
      localStorage.setItem('currentUser', JSON.stringify(result));
      localStorage.setItem('token', response.data.token);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      setSuccess("Ingreso Exitoso!");
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const role = decodedToken.roles[0];
      if (role === 'CLIENTE') {
        navigate('/client-home');
      } else if (role === 'ADMIN') {
        navigate('/admin-home');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError("Credenciales Inválidas.");
    }
  };

  return (
    <>
    <Navbar/>
    <Box sx={{
      width: '100%',
      height: '100dvh', 
      display: 'flex',
      flexDirection: 'column',
      backgroundImage:`url(${backgroundImage})`,
      backgroundSize:'cover',
      backgroundPosition:'center',
      overflow:'hidden',
    }}>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        textAlign={'center'}
        flexGrow={1}
        sx={{
          paddingTop: { xs: '12px', sm: '60px' }, 
          py: { xs: 2, sm: 0 }, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          px: { xs: 0.5, sm: 0 },
        }}
      >
        <Grid>
          <Paper elevation={24} sx={paperStyle} >
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <AccountCircleIcon />
              </Avatar>
              <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal' }}>Iniciar Sesión</h2>
            </Grid>

            <TextField
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              value={email}
              helperText="Por favor ingrese su correo electrónico"
              margin='normal'
              label="Email"
              placeholder='example@gmail.com'
              fullWidth required
              onKeyDown={handleKeyPress}
            />


            <FormControl variant="outlined" fullWidth color='custom'>
              <InputLabel error={passwordError} htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                error={passwordError}
                onChange={(e) => setPassword(e.target.value)}
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

            <FormControlLabel control={<CustomSwitch color='#26a69a' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Recordarme" />

            <Button color='custom' sx={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal', marginTop:'12px' }} size='large' type='submit' variant='contained' fullWidth onClick={handleSubmit} startIcon={
              <LoginIcon />
            }>Ingresar</Button>



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

            <div style={{ marginTop: "23px", fontSize: "15px", fontFamily:"Roboto, sans-serif" }} margin="left">
              <a href='/forgot-password'>¿Olvidaste tu contraseña?</a>
            </div>

          </Paper>
        </Grid>
      </Box>
      <Footer/>
    </Box>
    </>
  );
};

export default Login;