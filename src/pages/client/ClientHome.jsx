import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import NavbarClient from "../../components/NavbarClient"
import { useNavigate } from 'react-router';

const ClientHome = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const navigate = useNavigate();

    const handleReserveNow = () => {
        navigate('/select-sport');
    };

    const handleSeeReservations = () => {
      navigate('/client-reservas');
    };

  const buttonStyle = {marginTop:'25px'}
  return (
    <div>
    <NavbarClient/>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingTop={"15%"}>

      {/* <Typography variant="h4" gutterBottom>Bienvenid@ {currentUser.nombre}</Typography> */}
      <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Bungee, sans-serif", fontWeight: "100" }}>complejo deportivo:</Typography>
      <Typography variant="h3" sx={{ flexGrow: 1, fontFamily: "Bungee Inline, sans-serif", fontWeight: "100" }}>LOS GIGANTES</Typography>
     
     
      <Button style={buttonStyle} color='custom' type='submit' variant="contained" onClick={handleReserveNow}>Reservar Ahora</Button>
      <Button style={buttonStyle} color='custom' type='submit' variant="contained" onClick={handleSeeReservations}>Mis Reservas</Button>


    </Box>
    </div>
  );
};

export default ClientHome;