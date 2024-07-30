import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom'; // Asumiendo que utilizas react-router-dom para manejar las rutas
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const NavbarClient = () => {

    const navigate = useNavigate();
    // Función para manejar el menú desplegable
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Función para cerrar sesión (simulada)
    const handleLogout = () => {
        // Implementa aquí la lógica para cerrar sesión
        console.log('Cerrar sesión');
        // Por ejemplo, podrías limpiar el localStorage y redirigir a la página de inicio
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirige al usuario a la página de inicio
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static" color='primary'>
                <Toolbar>
                <Typography variant="h4" component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "Bungee Shade, sans-serif",
              fontWeight: "400"

            }}>

            <a onClick={() => navigate('/client-home')}>
              DEPORTURNOS
            </a>

          </Typography>

                    {/* Icono de menú para desplegar */}
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Menú desplegable */}
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {/* Opciones del menú */}
                        <MenuItem onClick={handleMenuClose} component={Link} to="/profile">Perfil</MenuItem>
                        <MenuItem onClick={handleMenuClose} component={Link} to="/client-reservas">Mis Reservas</MenuItem>
                        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                    </Menu>

                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default NavbarClient;