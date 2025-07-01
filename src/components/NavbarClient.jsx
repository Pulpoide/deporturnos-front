import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom'; // Asumiendo que utilizas react-router-dom para manejar las rutas
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
      main: '#121212'
    }
  },
});

const NavbarClient = () => {

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleLogoutConfirm = () => {
    console.log('Cerrar sesión');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate("/"); // Redirige al usuario a la página de inicio
  };

  const handleLogoutCancel = () => {
    setOpenDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color='background'>
        <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "Bungee Shade, sans-serif",
              fontWeight: "400",
              maxWidth:"fit-content",
              cursor: "pointer",
              flexShrink: 0,
              color: 'black', // Asegúrate de que el color sea el correcto
              "&:hover": {
                color: theme.palette.primary.main // Color al pasar el mouse
              },
              mr: 'auto'
            }}
            onClick={() => navigate("/client-home")}
          >
            DEPORTURNOS
          </Typography>

          {/* Icono de menú para desplegar */}
          <IconButton
            color='inherit'
            size="large"
            edge="end"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MenuIcon/>
          </IconButton>

          {/* Menú desplegable */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            disableScrollLock={true}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {/* Opciones del menú */}
            <MenuItem onClick={handleMenuClose} component={Link} to="/client-profile">Mi Perfil</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/client-reservas">Mis Reservas</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Cerrar Sesión</MenuItem>
          </Menu>

           {/* Cuadro de diálogo de confirmación */}
           <Dialog
            open={openDialog}
            onClose={handleLogoutCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Cerrar Sesión"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Estás seguro de que deseas cerrar sesión?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLogoutCancel} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleLogoutConfirm} color="error" autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>

        </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavbarClient;