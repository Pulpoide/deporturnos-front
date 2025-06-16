import React from 'react';
import { Box, Grid, Typography, Container, styled, Button } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import backgroundImage from '../assets/images/imagen_background_adv.png'

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
    },
    background: {
      main: 'rgb(249 246 242)'
    }
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: 'white',
  borderRadius: '5px',
}));

const Advertising = () => {
  return (
    <Box sx={{
      width: '100%',
      height: '50vh',
      bgcolor: "#FAFAFA",
      color: "#089342",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 0
    }}>
      <Container>
        <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <Grid item xs={12} sm={7} sx={{ textAlign: { xs: 'center', sm: 'left' }, mt: { xs: 2, sm: 0 } }}>
            <Typography variant="h4" sx={{
              fontFamily: "Bungee hairline, sans-serif",
              fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: { xs: '2rem', md: '3rem' }
            }}>¿Te gustaría probar </Typography>
            <Typography variant="h4" component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "Bungee inline, sans-serif",
                maxWidth: "fit-content",
                color: theme.palette.primary.main,
                textAlign: 'center',
                margin: '0 auto',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
              onClick={() => navigate("/")}
            >
              DEPORTURNOS
            </Typography>
            <Typography variant="h4" sx={{fontFamily: "Bungee hairline, sans-serif", fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: { xs: '2rem', md: '3rem' } }}>en tu complejo deportivo? </Typography>
          </Grid>

          <Grid item xs={12} sm={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.3 }}>
            <StyledButton variant="contained" component="a" href="/planes" sx={{fontFamily: "Bungee, sans-serif", fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' }, padding: { xs: '0.6rem 1.2rem', sm: '0.7rem 1.3rem', md: '0.8rem 1.5rem' }, minWidth: { xs: '230px', md: '260px' } }}>
              VER PLANES Y PRECIOS
            </StyledButton>
            <StyledButton variant="contained" component="a" href="/funcionalidades" sx={{
              fontFamily: "Bungee, sans-serif",
              backgroundColor: 'white',
              color: '#45A048',
              mt: 2,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
              padding: { xs: '0.6rem 1.2rem', sm: '0.7rem 1.3rem', md: '0.8rem 1.5rem' },
              minWidth: { xs: '230px', md: '260px' },
              '&:hover': {
                backgroundColor: 'white',
                color: '#45A048',
              }
            }}>
              VER FUNCIONALIDADES
            </StyledButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Advertising;



