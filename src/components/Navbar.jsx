import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box, IconButton, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router';
import LoginIcon from '@mui/icons-material/Login'; // O PersonIcon si prefieres
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const theme = createTheme({
  palette: {
    primary: { main: '#00b04b' },
    text: { primary: '#1a1a1a' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  // Breakpoint 'sm' suele ser 600px. Usamos uno un poco más alto si queremos ajustar antes.
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        color="default"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          transition: 'all 0.3s ease',
          py: 1
        }}
      >
        <Container maxWidth="xl" sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // En mobile quitamos padding extra para ganar espacio
          px: { xs: 2, md: 3 }
        }}>

          {/* LOGO */}
          <Typography
            variant="h4"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              fontFamily: "Bungee Shade, sans-serif",
              fontWeight: 400,
              cursor: "pointer",
              color: '#1a1a1a',
              // AJUSTE CLAVE: Reducimos fuente en móvil para evitar saltos de línea
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              whiteSpace: 'nowrap', // Prohibido romper línea
              "&:hover": { color: theme.palette.primary.main },
              transition: 'color 0.3s ease',
            }}
          >
            DEPORTURNOS
          </Typography>

          {/* ACCIONES */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 } }}>

            {/* 1. LOGIN: En móvil es SOLO ÍCONO (Limpio y elegante) */}
            {isMobile ? (
              <IconButton
                onClick={() => navigate("/login")}
                sx={{
                  color: '#555',
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                {/* Icono de persona suele ser más amigable que la puerta 'Login' */}
                <PersonOutlineIcon sx={{ fontSize: '1.8rem' }} />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                variant="text"
                onClick={() => navigate("/login")}
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: '#555',
                  '&:hover': { color: theme.palette.primary.main, backgroundColor: 'transparent' }
                }}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* 2. REGISTRO: Botón compacto en móvil */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '50px',
                boxShadow: '0 4px 14px rgba(0, 176, 75, 0.25)',
                // Padding reducido en móvil para que entre perfecto
                px: { xs: 2, md: 4 },
                py: { xs: 0.6, md: 1 },
                fontSize: { xs: '0.8rem', md: '1rem' },
                minWidth: { xs: 'auto', md: '64px' } // Permite que se encoja lo necesario
              }}
            >
              Registrarme
            </Button>
          </Box>

        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;