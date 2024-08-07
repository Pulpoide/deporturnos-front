import React from "react";
//MUI imports
import { Button, FormControlLabel, Grid, Paper, TextField, Switch, Typography } from '@mui/material';

import NavbarClient from "../../components/NavbarClient"


const ClientProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const email = currentUser?.email;
    const nombre = currentUser?.nombre;

    const paperStyle = { padding: 20, height: "auto", width: 280, margin: "20px auto" }

    return (
        <>
            <NavbarClient />

            <Grid align="center">
                <Paper elevation={10} style={paperStyle} >

                <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal' }}>Datos personales</h2>
                    <TextField
                        label="Nombre"
                        value={nombre}
                        margin="dense"
                        variant="outlined"
                        disabled
                    />
                    <TextField
                        label="Email"
                        value={email}
                        margin="dense"
                        variant="outlined"
                        disabled
                        
                    />
                    <TextField
                        label="Contraseña"
                        value={"*****************"}
                        margin="dense"
                        variant="outlined"
                        disabled
                        
                    />
                    <Button color="error" variant="outlined">Cambiar contraseña</Button>
                </Paper>
            </Grid>
        </>
    )
};


export default ClientProfile;