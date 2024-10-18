import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import NavbarClient from "../../components/NavbarClient"
import { useNavigate } from 'react-router';
import backgroundImage from '../../assets/images/imagen_background_club.png';
import { margin } from '@mui/system';


const ClientHome = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const navigate = useNavigate();

  const handleReserveNow = () => {
    navigate('/select-sport');
  };

  const handleSeeReservations = () => {
    navigate('/client-reservas');
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    margin: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#45a048',
    },
  }

  return (
    <div>
      <NavbarClient />
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>

        <Box>
          {/* <Typography variant="h4" gutterBottom>Bienvenid@ {currentUser.nombre}</Typography> */}
          <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: "Bungee, sans-serif", fontWeight: "100", color: 'white' }}>complejo deportivo:</Typography>
          <Typography variant="h1" sx={{ flexGrow: 1, fontFamily: "Bungee Inline, sans-serif", fontWeight: "100", color: 'white' }}>LOS GIGANTES</Typography>


          <Button style={buttonStyle} color='custom' type='submit' variant="contained" onClick={handleReserveNow}>Reservar Ahora</Button>
          <Button style={buttonStyle} color='custom' type='submit' variant="contained" onClick={handleSeeReservations}>Mis Reservas</Button>
        </Box>

      </Box>
    </div>
  );
};

export default ClientHome;