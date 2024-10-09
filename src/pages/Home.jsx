import React from 'react';
import Navbar from '../components/Navbar';
import { Container, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import futbol1 from '../assets/images/futbol1.jpg';
import futbol2 from '../assets/images/futbol2.jpg';
import cancha from '../assets/images/futbol3.jpg';
import bgimg from '../assets/images/thw.jpg'
const images = [
  futbol1,
  cancha,
  futbol2
]


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
    black2: {
      main: 'rgb(23 23 23)'
    }
  },
});




const h1Style = { marginBottom: '1rem', fontFamily: 'Terminal Normal', fontWeight: 400, fontStyle: 'normal', fontSize: '62px', color:'#FFFFFF', textShadow:"2px 2px 4px rgba(0, 0, 0, 0.5)"}
const pStyle = { marginLeft: 'auto', marginRight: 'auto', maxWidth: '42rem', fontSize: '20px', fontFamily: 'Roboto, sans-serif', color:'#FFFFFF' };
const buttonStyle = { paddingTop: '1rem', paddingBottom: '1rem', alignSelf: 'center', marginTop: '3rem', marginBottom: '2rem' }
const spanStyle = { fontSize: '18px', lineHeight: '1.6', letterSpacing: '.01em', fontFamily: 'Roboto, sans-serif', color:'#FFFFFF' }

const Home = () => {
  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '66vh',
            backgroundImage: `url(${bgimg})`,
            backgroundSize: 'auto',
            backgroundPosition: 'center',
            opacity: 1,
            zIndex: -1,
            borderRadius: 7,
          }}
        />
      
      <Navbar />
      <Box
        display={'flex'}
        width={'100%'}
        flexDirection={'column'}
        justifyContent={'center'}
        marginLeft={'auto'}
        marginRight={'auto'}
        maxWidth={'720px'}
        textAlign={'center'}
        paddingTop={'6rem'}
      >
        <h1 style={h1Style}>
          Reservá tu cancha
          <br />
          al instante
          {/* <br />
            rápido, fácil y seguro */}
        </h1>
        <p style={pStyle}>Aliquam at massa eu purus tincidunt condimentum. Aliquam convallis non ligula nec tincidunt. Phasellus eu mattis velit, et congue augue.</p>

        <Button style={buttonStyle} variant='contained' href='/register'>Regístrate de forma gratuita</Button>
        {/* <span style={spanStyle}>¿Ya tienes una cuenta?</span>
        <a href="http://localhost:5173/login" > Iniciar sesión</a> */}
      </Box>
      {/* Aquí iría tu contenido, por ejemplo, la Navbar */}
    </Box>

  );
};

export default Home;
