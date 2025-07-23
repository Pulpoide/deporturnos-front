import { Typography, Box, Button, Stack } from '@mui/material';
import NavbarClient from '../../components/NavbarClient';
import { useNavigate } from 'react-router';
import backgroundImage from '../../assets/images/imagen_background_club.png';

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  margin: '20px',
  padding: '10px 20px',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: '#45a048',
  },
  fontFamily: 'Bungee, sans-serif',
  width:'250px'
  
};

const ClientHome = () => {
  const navigate = useNavigate();

  const handleReserveNow = () => {
    navigate('/select-sport');
  };

  const handleSeeReservations = () => {
    navigate('/client-reservas');
  };

  return (
    <div>
      <NavbarClient />
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100dvh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: { xs: 1, sm: 0 },
          overflow: 'hidden',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              fontFamily: 'Bungee, sans-serif',
              fontWeight: 100,
              color: 'white',
              fontSize: { xs: '1.2rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            complejo deportivo:
          </Typography>
          <Typography
            variant="h1"
            sx={{
              flexGrow: 1,
              fontFamily: 'Bungee Inline, sans-serif',
              fontWeight: 100,
              color: 'white',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '6rem' },
              marginBottom: '20px',
            }}
          >
            LOS GIGANTES
          </Typography>
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Button
              sx={buttonStyle}
              color="custom"
              type="submit"
              variant="contained"
              onClick={handleReserveNow}
            >
              Reservar Ahora
            </Button>
            <Button
              sx={buttonStyle}
              color="custom"
              type="submit"
              variant="contained"
              onClick={handleSeeReservations}
            >
              Mis Reservas
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default ClientHome;