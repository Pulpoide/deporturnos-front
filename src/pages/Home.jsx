import React from 'react';
import Navbar from '../components/Navbar';
import { Typography, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';

const theme = createTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
    custom: {
      main: '#43a047',
      light: '#68b36b',
      dark: '#2e7031',
      contrastText: '#fff',
    },
    black: {
      main: '#121212',
      contrastText: '#fff',
    }
  },
});

const Home = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingTop={"20px"}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 5,
            px: { xs: 2, md: 10 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 960,
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 480,
                gap: { xs: 3, md: 4 },
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/d309cc70-e959-4e53-ac0d-dfad7f36eb5f.png")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: { xs: 0, md: '16px' },
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Reservá tu cancha en minutos
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  minWidth: 84,
                  maxWidth: 480,
                  height: { xs: '40px', md: '48px' },
                  px: { xs: 2, md: 3 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 'bold',
                }}
                onClick={() => navigate('/login')}
              >
                Reservar ahora
              </Button>
            </Box>
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default Home;
