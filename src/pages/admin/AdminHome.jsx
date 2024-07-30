import React from 'react';
import { useNavigate } from 'react-router';

import { Button, Typography, Box } from '@mui/material'
import NavbarAdmin from '../../components/NavbarAdmin';
import { ThemeProvider, createTheme } from '@mui/material/styles';



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
      default: '#121212'
    }
  },
});

const AdminHome = () => {
  const navigate = useNavigate();

  const buttonStyle = { width: '15%', marginTop: '9px' };

  return (<div>
    <ThemeProvider theme={theme}>

      <NavbarAdmin />
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} marginTop={'15%'}>
        <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: "Bungee, sans-serif", fontWeight: "1" }}>Bienvenido, Admin</Typography>

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

    </ThemeProvider>
  </div>)

};

export default AdminHome;