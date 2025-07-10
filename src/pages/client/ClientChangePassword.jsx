import React, { useState } from "react";
import {
  Button,
  TextField,
  Avatar,
  Container,
  Box,
  Paper,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Grid
} from "@mui/material";
import LockResetIcon from '@mui/icons-material/LockReset';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router";
import NavbarClient from "../../components/NavbarClient";
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const isPassword = (pass) =>
    /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/i.test(pass);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!oldPassword) {
      setErrorMessage("Ingrese su contraseña actual.")
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (!isPassword(newPassword)) {
      setErrorMessage("La nueva contraseña no cumple con los requisitos de seguridad: Minimo ocho caracteres, al menos un número y una letra.")
      return;
    }

    const credentials = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/usuarios/change-password`, credentials, tokenConfig);
      setSuccessMessage(response.data.body.message)
      setErrorMessage("");
      setTimeout(() => {
        navigate("/client-home");
      }, 1500);

    } catch (error) {
      if (error.response.status === 403) {
        navigate("/")
      }

      setErrorMessage(error.response.data.message)
      setSuccessMessage("");
    }


    // Restablecer el formulario después del envío
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const paperStyle = { padding: 27, width: 450 };
  const avatarStyle = { backgroundColor: "#121212" };

  return (
    <>
      <NavbarClient />
      <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
                minHeight={'100vh'}
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >

          <Paper elevation={24} style={paperStyle}>
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <LockResetIcon />
              </Avatar>
              <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal' }}>
                Cambiar contraseña
              </h2>
            </Grid>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contraseña actual"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nueva contraseña"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                margin="normal"
                required
                fullWidth
                label="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {errorMessage && (
                <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                  <Alert severity="error">
                    {errorMessage}
                  </Alert>
                </Stack>
              )}
              {successMessage && (
                <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                  <Alert severity="success">
                    {successMessage}
                  </Alert>
                </Stack>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, fontFamily: 'Bungee, sans-serif', fontWeight: 400, fontSize: 16, padding: '8px 24px' }}
              >
                Confirmar Cambio
              </Button>
            </Box>
          </Paper>
        </Box>
    </>
  );
};

export default ChangePassword;
