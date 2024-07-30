import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import NavbarClient from "../../components/NavbarClient"

const ClientHome = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const buttonStyle = {marginTop:'5%'}
  return (
    <div>
    <NavbarClient/>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingTop={"15%"}>

      <Typography variant="h4" gutterBottom>Bienvenido, {currentUser?.nombre} a</Typography>
      <Typography variant="h1" sx={{ flexGrow: 1, fontFamily: "Bungee Inline, sans-serif", fontWeight: "100" }}>LOS GIGANTES</Typography>
      <Button style={buttonStyle} color='custom' type='submit' variant="contained">Reservar Ahora</Button>

      {/* Contenido adicional para el usuario logeado */}
    </Box>
    </div>
  );
};

export default ClientHome;