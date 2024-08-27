import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
  Stack,
  Alert,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router";
import NavbarClient from "../../components/NavbarClient";

const ChangePassword = () => {
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

  const navigate = useNavigate();



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (!isPassword(newPassword)) {
      setErrorMessage("La nueva contraseña debe tener almenos un numero y un caracter.")
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

  return (
    <>
      <NavbarClient />
      <Container maxWidth="xs">
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          textAlign={'center'}
          minHeight={'50vh'}
        >

          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography fontFamily={"Bungee, sans-serif"} component="h1" variant="h5" align="center" gutterBottom>
              Cambiar Contraseña
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contraseña Actual"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nueva Contraseña"
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
                label="Confirmar Nueva Contraseña"
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
                sx={{ mt: 3, mb: 2 }}
              >
                Confirmar Cambio
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default ChangePassword;
