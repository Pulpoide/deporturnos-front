import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import '../styles/App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#43a047' },
    black: { main: '#121212', contrastText: '#fff' },
  },
});

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="background" sx={{ boxShadow: 'none' }}>
        <Container maxWidth={false} sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
        }}>
          {/* Logo */}
          <Typography
            variant="h4"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              fontFamily: "Bungee Shade, sans-serif",
              fontWeight: 400,
              cursor: "pointer",
              color: theme.palette.black.main,
              "&:hover": { color: theme.palette.primary.main },
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 1, md: 0 },
            }}
          >
            DEPORTURNOS
          </Typography>

          {/* Botones */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'row', 
            gap: 1,
            justifyContent: { xs: 'center', md: 'flex-end' },
            width: '100%',
            maxWidth: { md: 'auto' },
          }}>
            <Button color="primary" variant="contained" href="/login" sx={{fontFamily: "Bungee, sans-serif",}}>
              Iniciar Sesión
            </Button>
            <Button color="black" variant="contained" href="/register" sx={{fontFamily: "Bungee, sans-serif",}}>
              Registrarme
            </Button>
          </Box>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
