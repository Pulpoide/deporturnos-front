import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
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

const NavbarAdmin = () => {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const menuStyle = { fontFamily: 'Fjalla One, sans serif' };

    return (
        <div>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static" color='primary'>
                    <Container>
                        <Toolbar disableGutters>
                            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontFamily: "Bungee Shade, sans-serif", fontWeight: "400" }}>

                                <a onClick={() => navigate('/admin-home')}>
                                    DEPORTURNOS
                                </a>

                            </Typography>

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
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin-turnos" style={menuStyle}>Turnos</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin-reservas" style={menuStyle}>Reservas</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin-reportes" style={menuStyle}>Reportes</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin-canchas" style={menuStyle}>Canchas</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/admin-usuarios" style={menuStyle}>Usuarios</MenuItem>
                                <MenuItem onClick={handleLogout} style={menuStyle}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </Toolbar>
                    </Container>
                </AppBar>
            </ThemeProvider>

        </div>
    );

};

export default NavbarAdmin;