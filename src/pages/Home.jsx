import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Box, Button, styled, Typography, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '../components/Footer';
import Faqs from '../components/Faqs';
import Advertising from '../components/Advertising';
import './../styles/App.css'

import futbol from '../assets/images/futbol.avif';
import futbol2 from '../assets/images/futbol2.avif';
import padel1 from '../assets/images/padel1.avif';


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

const StyledButton = styled(Button)(() => ({
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

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  // Precarga todas las imágenes al montar el componente
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-advance del carousel
  useEffect(() => {
    const intervalId = setInterval(next, 4000);
    return () => clearInterval(intervalId);
  }, [next]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', p: 0, m: 0 }}>
      {/* Renderiza las 3 imágenes siempre — crossfade via opacity */}
      {images.map((src, index) => (
        <Box
          key={index}
          component="img"
          src={src}
          alt={`Slide ${index + 1}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchpriority={index === 0 ? 'high' : 'auto'}
          decoding={index === 0 ? 'sync' : 'async'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            willChange: 'opacity',
            filter: 'brightness(0.7)',
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
        }}
      />
    </Box>
  );
};

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        {/* HERO SECTION */}
        <Box sx={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>

          {/* 1. CAPA DE FONDO: CARRUSEL */}
          <Carousel />

          {/* 2. CAPA INTERMEDIA: OVERLAY OBSCURO (La Magia) 
             Esto oscurece toda la imagen para que el texto resalte.
          */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.55)', // Ajusta el 0.55 si quieres más/menos oscuridad
              zIndex: 1,
            }}
          />

          {/* 3. CAPA SUPERIOR: CONTENIDO (Texto y Botón) */}
          <Box
            sx={{
              position: 'absolute',
              // Centrado y posicionado responsive
              top: { xs: '45%', sm: '50%' }, // Bajé un poco el mobile para que respire mejor
              left: { xs: '50%', sm: '10%', md: '5%' },
              transform: { xs: 'translate(-50%, -50%)', sm: 'translateY(-50%)' },
              zIndex: 2,
              color: 'white',
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '90%', sm: '70%', md: 'auto' }, // 90% en mobile para evitar bordes pegados
            }}
          >
            {/* Título: Mantenemos Bungee (Tu gusto) */}
            <Typography
              variant="h4"
              component="h1" // Semánticamente es un H1
              sx={{
                fontSize: { xs: '2.7rem', sm: '3rem', md: '3.5rem' },
                lineHeight: { xs: 1.1, md: 1.2 },
                fontFamily: "Bungee Inline, sans-serif",
                mb: 1
              }}
            >
              Reserva tu<br />cancha al instante
            </Typography>

            {/* Subtítulo: CAMBIO A ROBOTO (Limpio y legible) */}
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                mt: 1,
                mb: 3, // Separación con el botón
                fontFamily: "'Roboto', sans-serif", // Fuente limpia
                fontWeight: 400, // Regular (no bold) para mejor contraste con el título
                letterSpacing: '0.5px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              Explorá las canchas disponibles en tiempo real
            </Typography>

            {/* Botón: Mantenemos Bungee (Tu gusto) */}
            <StyledButton
              variant="contained"
              component="a"
              href="/register"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                padding: { xs: '10px 24px', md: '12px 30px' },
                fontFamily: "Bungee, sans-serif",
                boxShadow: '0 4px 14px rgba(0, 176, 75, 0.4)', // Glow sutil verde
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
