import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import NavbarAdmin from '../../components/NavbarAdmin';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const theme = createTheme({
  palette: {
    primary: { main: '#121212' },
    secondary: {
      main: '#43a047',
      light: '#68b36b',
      dark: '#2e7031',
      contrastText: '#fff',
    },
    background: { default: 'white' },
  },
});

const buttonStyle = {
  width: '100%',
  marginTop: '9px',
  fontFamily: 'Bungee inline, sans-serif',
  color: 'white',
};

const welcomeTextStyle = {
  fontFamily: 'Bungee inline, sans-serif',
  color: 'black',
};

const AdminHome = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userName = currentUser?.nombre || '';

  const buttons = [
    { label: 'Turnos', path: '/admin-turnos' },
    { label: 'Reservas', path: '/admin-reservas' },
    { label: 'Reportes', path: '/admin-reportes' },
    { label: 'Canchas', path: '/admin-canchas' },
    { label: 'Usuarios', path: '/admin-usuarios' },
  ];

  return (
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
        <Typography
          variant="h2"
          sx={{ ...welcomeTextStyle, fontSize: { xs: '2rem', sm: '2rem', md: '2.125rem' } }}
        >
          ¡Bienvenido,
        </Typography>
        <Typography
          variant="h2"
          sx={{ ...welcomeTextStyle, fontSize: { xs: '3rem', sm: '3rem', md: '3rem' } }}
        >
          {userName}!
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          {buttons.map(({ label, path }) => (
            <Button
              key={label}
              style={buttonStyle}
              size="large"
              variant="contained"
              onClick={() => navigate(path)}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminHome;