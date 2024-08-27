import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
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
    },
    background: {
      main:'rgb(249 246 242)'
    }
  },
});

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Container>
        <Toolbar disableGutters>
          <Typography variant="h4" component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "Bungee Shade, sans-serif",
              fontWeight: "400",
              maxWidth:"fit-content",
              cursor: "pointer",
              flexShrink: 0,
              color: 'black',
              "&:hover": {
                color: theme.palette.primary.main // Color al pasar el mouse
              },
              mr:'auto'
            }}
            onClick={() => navigate("/")}
            >
              DEPORTURNOS
          </Typography>




          <div className=''>
            <Button color='primary' variant='contained' href='/login' sx={{ mr: 2 }}>Iniciar Sesión</Button>
            <Button color='black' variant='contained' href='/register'>Registrarme</Button>
          </div>

        </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>

  );
};

export default Navbar;
