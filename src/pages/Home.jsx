import React from 'react';
import Navbar from '../components/Navbar';
import { Typography, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#121212'
    },
    secondary: {
      main: '#26a69a',
      light: '#4db6ac',
      dark: '#1a746b'
    },
    background: {
      default: '#121212'
    }
  },
});

const Home = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingTop={"20px"}>
        {/* <Typography
        variant="h2"
        sx={{ flexGrow: 1, fontFamily: "Bungee, sans-serif", fontWeight: "400" }}>
        WELCOME TO DEPORTURNOS
      </Typography> */}
        {/* <Button color='secondary' type='submit' variant="contained" size='large'>
        reservar mi cancha ahora
        </Button> */}


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
              >
                Reservar ahora
              </Button>
            </Box>
          </Box>
        </Box>

      </Box>

      {/* Contenido de la página de inicio */}
    </ThemeProvider>
  );
};

export default Home;
