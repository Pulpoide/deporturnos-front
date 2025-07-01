import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Box, Button, styled, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '../components/Footer';
import Faqs from '../components/Faqs';
import Advertising from '../components/Advertising';
import './../styles/App.css'

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
      }
    }
  }
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
    <Box sx={{ position: 'relative', width: '100%', height: "100dvh", overflow: 'hidden', p: '0', m: '0' }}>
      <Box
        component="img"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'opacity 0.5s ease',
          opacity: 1,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      />
    </Box>
  );
};

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <Carousel />
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '20%', sm: '23%', md: '30%' },
              left: {
                xs: '50%',  
                sm: '10%',   
                md: '5%',     
              },
              transform: {
                xs: 'translateX(-50%)',
                sm: 'none',
                md: 'none',
              },
              zIndex: 2,
              color: 'white',
              textAlign: {
                xs: 'center', 
                sm: 'left',  
                md: 'left',   
              },
              width: {
                xs: '80%',    
                sm: '70%',    
                md: 'auto',   
              },
            }}
          >
            <Typography
              variant="h4"
              component="h4"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: { xs: '2.2rem', sm: '2.7rem', md: '3rem' },
                fontFamily: "Bungee inline, sans-serif",
              }}
            >
              Reserva tu<br />cancha al instante
            </Typography>

            <Typography
              variant="h5"
              component="h5"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.5rem' },
                mt: 1,
                fontFamily: "Bungee hairline, sans-serif",
                fontWeight: '700',
              }}
            >
              Explorá las canchas disponibles en tiempo real
            </Typography>

            <StyledButton
              variant="contained"
              component="a"
              href="/register"
              sx={{
                mt: 2,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                padding: {
                  xs: '0.6rem 1.2rem',
                  sm: '0.7rem 1.3rem',
                  md: '0.8rem 1.5rem',
                },
                fontFamily: "Bungee, sans-serif",
              }}
            >
              Registrate de forma gratuita
            </StyledButton>
          </Box>
        </Box>

        <Advertising />
        <Faqs />
        <Footer />

      </Box>
    </ThemeProvider>
  );
};

export default Home;
