import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';


// MUI imports
import { Avatar, Button, Grid, Paper, TextField } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Email Validation
const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// Password Validation
const isPassword = (pass) =>
  /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/i.test(pass);

// Telefono Validation
const isTelefono = (telefono) =>
  /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/i.test(telefono);

const Register = () => {

  const [showPassword, setShowPassword] = React.useState(false);

  //Inputs
  const [nombre, setNombre] = useState();
  const [email, setEmail] = useState();
  const [telefono, setTelefono] = useState();
  const [password, setPassword] = useState();
  const [secondPassword, setSecondPassword] = useState();

  //Inputs Errors
  const [nombreError, setNombreError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [secondPasswordError, setSecondPasswordError] = useState(false);

  // Aviso 
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  // Handles Mostrar y Escoder Password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Para que funcione el Enter.
  const handleKeyPress = (e) => {
    // Verificar si la tecla presionada es "Enter"
    if (e.key === 'Enter') {
      handleSubmit(); // Llamar a la función de inicio de sesión al presionar "Enter"
    }
  };

  // Estilos
  const paperStyle = { padding: 20, height: "auto", width: 280, margin: "20px auto" }
  const avatarStyle = { backgroundColor: "#121212" }

  // Validaciones:
  // Validation for onBlur Nombre
  const handleNombre = () => {
    if (!nombre) {
      setNombreError(true);
      return;
    }

    setNombreError(false);
  };

  // Validation for onBlur Email
  const handleEmail = () => {
    console.log(isEmail(email));
    if (!isEmail(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  // Validation for onBlur Telefono
  const handleTelefono = () => {
    console.log(isTelefono(telefono));
    if (telefono) {
      if (!isTelefono(telefono)) {
        setTelefonoError(true);
        return;
      }
    }


    setTelefonoError(false);
  };

  // Validation for onBlur Password
  const handlePassword = () => {
    console.log(isPassword(password));
    if (!isPassword(password)) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
  };

  // Validation for onBlur Second Password
  const handleSecondPassword = () => {
    if (!(password === secondPassword)) {
      setSecondPasswordError(true);
      return;
    }

    setSecondPasswordError(false);
  };


  // Handle Submit
  const handleSubmit = async () => {
    setSuccess(null);

    // If Nombre error is true
    if (nombreError) {
      setError("Ingrese un nombre")
    }

    // If Email error is true
    if (emailError || !email) {
      setError("Email inválido");
      return;
    }

    // If Telefono error is true
    if (telefonoError){
      setError("Teléfono inválido")
      return;
    }

    // If Password error is true
    if (passwordError || !password) {
      setError("Contraseña inválida");
      return;
    }

    // If Second Password error is true
    if (secondPasswordError || !secondPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setError(null);

    // Conexión con el Backend
    const user = { nombre, email, password, telefono };
    try {
      console.log(user);

      const response = await axios.post('http://localhost:8080/api/auth/register', user);
      const result = response.data;

      // Guardar el usuario en el localStorage
      localStorage.setItem('currentUser', JSON.stringify(result));
      localStorage.setItem('token', response.data.token);

      //Show Successfull Submittion
      setSuccess("Registro Exitoso!");

      // Redireccionar a la página de inicio
      setTimeout(() => {
        window.location.href = '/clientHome';
      }, 1500);

    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 409) {
        setError(error.response.data.message);
      } else {
        setError('Error al registrar el usuario. Inténtalo de nuevo.');
      }
      setSuccess('');
    
    }
  };

  return (
    <div>
      <Navbar />
      
      <Grid>
        <Paper elevation={10} style={paperStyle} >
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <AppRegistrationIcon />
            </Avatar>
            <h2 style={{fontFamily:"Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal'}}>Registro</h2>
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
            fullWidth required />

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
            fullWidth required />

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
            fullWidth />


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


          <Button type='submit' color='custom' variant='contained' fullWidth onClick={handleSubmit} startIcon={
            <LoginIcon />
          }> Registrarme </Button>



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
    </div>
  );
};

export default Register;