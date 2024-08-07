import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';


// MUI imports
import { Avatar, Button, FormControlLabel, Grid, Paper, TextField, Switch } from '@mui/material';
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


// Switch "Recordarme" color
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
  // Navigate
  const navigate = useNavigate();

  //Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  //Inputs Errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Overall Form Validity
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);


  // Para que funcione el Enter.
  const handleKeyPress = (e) => {
    // Verificar si la tecla presionada es "Enter"
    if (e.key === 'Enter') {
      handleSubmit(); // Llamar a la función de inicio de sesión al presionar "Enter"
    }
  };


  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const paperStyle = { padding: 20, height: "auto", width: 280, margin: "20px auto" }
  const avatarStyle = { backgroundColor: "#121212" }

  //handle Submittion
  const handleSubmit = async () => {
    setSuccess(null);


    // If Email error is true
    if (!email) {
      setError("Email inválido");
      return;
    }

    // If Password error is true
    if (!password) {
      setError("Ingrese su contraseña");
      return;
    }

    setError(null);


    // Conexión con el Backend 
    const credentials = { email, password };
    try {
      //console.log(credentials);

      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      const result = response.data;


      // Guardar el usuario en el localStorage
      localStorage.setItem('currentUser', JSON.stringify(result));
      localStorage.setItem('token', response.data.token);

      if (rememberMe) {
        // Guardar el nombre de usuario para recordarlo
        localStorage.setItem('rememberedEmail', email);
      } else {
        // Limpiar el nombre de usuario recordado si no se seleccionó recordar
        localStorage.removeItem('rememberedEmail');
      }


      //Show Successfull Submittion
      setSuccess("Ingreso Exitoso!");


      // Redireccionamos al usuario dependiendo su rol
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
      setError("Credenciales Inválidas");
    }
  };


  return (
    <>
      <Navbar />

      <Grid>
        <Paper elevation={10} style={paperStyle} >
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
            color='custom'
            onKeyDown={handleKeyPress} />


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

          <Button color='custom' size='large' type='submit' variant='contained' fullWidth onClick={handleSubmit} startIcon={
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

          <div style={{ marginTop: "10px", fontSize: "15px" }} margin="left">
            <a href='/'>Olvidé mi contraseña</a>
            <br />
            No tienes una cuenta?{"  "}
            <a href='/register'>
              <small style={{ textDecoration: "underline", color: "blue" }}>
                Registrarme
              </small>
            </a>
          </div>



        </Paper>
      </Grid>

    </>
  );
};

export default Login;