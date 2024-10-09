import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const NotFound = () => {
    const navigate = useNavigate();
    const [redirectPath, setRedirectPath] = useState('/');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userRoles = decodedToken.roles;

                if (userRoles.includes('CLIENTE')) {
                    setRedirectPath('/client-home');
                } else if (userRoles.includes('ADMIN')) {
                    setRedirectPath('/admin-home');
                } else {
                    setRedirectPath('/');
                }
            } catch (error) {
                console.error('Error decoding token', error);
                setRedirectPath('/');
            }
        } else {
            setRedirectPath('/');
        }
    }, []);

    const handleBackToHome = () => {
        navigate(redirectPath);
    };

    return (
        <Container sx={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h2" gutterBottom fontFamily={"Bungee"}>
                   404 
            </Typography>
            <Typography variant="h5" gutterBottom fontFamily={"Bungee"}>
                Página no encontrada :c
            </Typography>
            <Typography variant="body1" gutterBottom sx={{marginBottom:3}}>
                Lo sentimos, pero la página que estás buscando no existe.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBackToHome}>
                Volver al Inicio
            </Button>
        </Container>
    );
};

export default NotFound;
