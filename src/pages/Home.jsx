import React, { useEffect, useState } from 'react'; 
import Navbar from '../components/Navbar';
import { Box, Button, styled, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '../components/Footer';
import Faqs from '../components/Faqs';
import Advertising from '../components/Advertising';
import '../App.css'

import futbol from '../assets/images/futbol.jpg';
import futbol2 from '../assets/images/futbol2.jpg';
import padel1 from '../assets/images/padel1.jpg';


const images = [padel1, futbol, futbol2];

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#00b04b',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      }}}
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: '#45a048',
  },
}));

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const intervalId = setInterval(next, 4000); 

    return () => clearInterval(intervalId); 
}, []);

  return (
<<<<<<< Updated upstream
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '66vh',
            backgroundImage: `url(${bgimg})`,
            backgroundSize: 'auto',
            backgroundPosition: 'center',
            opacity: 1,
            zIndex: -1,
            borderRadius: 7,
          }}
        />
      
      <Navbar />
=======
    <Box sx={{ position: 'relative', width: '100%', height: "75vh", overflow: 'hidden', p:'0', m:'0' }}>
>>>>>>> Stashed changes
      <Box
        component="img"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        sx={{ width: '100%', height: '100%', objectFit: "cover", objectPosition:'center', transition: 'transform 0.5s ease' }}
      />
      <Box sx={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)', 
        zIndex: 2,
      }}>
        <StyledButton variant="contained" component="a" href="/register">
          Registrate de forma gratuita
        </StyledButton>
      </Box>
    </Box>
  );
};

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ position: 'relative' }}>
          <Carousel />
          <Box sx={{
            position: 'absolute',
            top: '20%',
            right: '20px',
            zIndex: 2,
            color: 'white',
            textAlign: 'right',
          }}>
            <Typography variant='h2' component="h2">
              Reserva tu
              <br />cancha al instante
            </Typography>
            <Typography variant='h5' component="h5" sx={{ color: "white" }}>
              Explorá las canchas disponibles
              <br />en tiempo real
            </Typography>
          </Box>
        </Box>

        <Advertising/>
        <Faqs/>
        <Footer />

      </Box>
    </ThemeProvider>
  );
};  

export default Home;
