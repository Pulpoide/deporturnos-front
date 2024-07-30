import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Link from '@mui/material/Link';


const theme = createTheme({
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

const Navbar = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color='background'>

        <Toolbar>
          <Typography variant="h4" component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "Bungee Inline, sans-serif",
              fontWeight: "400"
            }}>

            <Link underline="none" href="/">
              DEPORTURNOS
            </Link>

          </Typography>



          
            <div className=''>
              <Button color='primary' variant='text' href='/login' sx={{ mr: 2 }}>Ingresar</Button>
              <Button color='primary' variant='contained' href='/register'>Registrarme</Button>
            </div>

        </Toolbar>
      </AppBar>
    </ThemeProvider>

  );
};

export default Navbar;
