import React from 'react';
import { useNavigate } from 'react-router';

import { Button, Typography, Box } from '@mui/material'
import NavbarAdmin from '../../components/NavbarAdmin';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import backgroundImage from '../../assets/images/imagen_background_adv.png'



const theme = createTheme({
  palette: {
    primary: {
      main: '#121212'
    },
    secondary: {
      main: '#43a047',
      light: '#68b36b',
      dark: '#2e7031',
      contrastText: '#fff',
    },
    background: {
      default: 'white',
    }
  },
});

const AdminHome = () => {
  const navigate = useNavigate();

  const buttonStyle = { width: '100%', marginTop: '9px' };

  return (<div>
    <ThemeProvider theme={theme}>

      <NavbarAdmin />

      <Box
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: "Bungee, sans-serif", fontWeight: "1", marginBottom: '90px' }}>
            Bienvenido, Admin
          </Typography>

          {/* Agrupando botones en un Box */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button style={buttonStyle} size='large' variant="contained" color='secondary' onClick={() => navigate('/admin-turnos')}>
              Turnos
            </Button>
            <Button style={buttonStyle} size='large' variant="contained" color="secondary" onClick={() => navigate('/admin-reservas')}>
              Reservas
            </Button>
            <Button style={buttonStyle} size='large' variant="contained" color="secondary" onClick={() => navigate('/admin-canchas')}>
              Canchas
            </Button>
            <Button style={buttonStyle} size='large' variant="contained" color="secondary" onClick={() => navigate('/admin-usuarios')}>
              Usuarios
            </Button>
          </Box>
        </Box>


    </ThemeProvider>
  </div>)

};

export default AdminHome;