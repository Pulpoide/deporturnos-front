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
  padding: '10px 20px',
  marginTop: '60px',
  borderRadius: '5px',
}));

const Advertising = () => {
  return (
    <Box sx={{ width: '100%', height: '50vh', bgcolor: "#FAFAFA", color: "#089342", p: 4, backgroundImage:`url(${backgroundImage})`, backgroundSize:'cover', backgroundPosition:'center' }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={7}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#45A048', mt: '60px' }}>¿Te gustaría probar </Typography>
            <Typography variant="h4" component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "Bungee Shade, sans-serif",
                fontWeight: "400",
                maxWidth: "fit-content",
                cursor: "pointer",
                flexShrink: 0,
                color: 'black',
                "&:hover": {
                  color: theme.palette.primary.main // Color al pasar el mouse
                },
                mr: 'auto'
              }}
              onClick={() => navigate("/")}
            >
              DEPORTURNOS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#45A048' }}>en tu complejo deportivo? </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <StyledButton variant="contained" component="a" href="/planes">
              VER PLANES Y PRECIOS
            </StyledButton>
            <StyledButton variant="contained"  component="a" href="/funcionalidades" sx={{backgroundColor:'white', color:'#45A048'}}>
              VER FUNCIONALIDADES
            </StyledButton>
          </Grid>
        </Grid>
      </Container>

    </Box>
  );
};

export default Advertising;



