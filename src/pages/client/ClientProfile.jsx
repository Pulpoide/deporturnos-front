import React, { useState } from "react";
//MUI imports
import { Button, Grid, Paper, TextField, Box, Typography, Stack, IconButton, Alert, FormControlLabel, Switch } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from "axios";
import NavbarClient from "../../components/NavbarClient"
import backgroundImage from '../../assets/images/imagen_background_adv.png';

// Telefono Validation
const isTelefono = (telefono) =>
    /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/i.test(telefono);

const ClientProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const [nameDisabled, setNameDisabled] = useState(true)
    const [telDisabled, setTelDisabled] = useState(true)
    const [originalNombre, setOriginalNombre] = useState(currentUser?.nombre || "");
    const [originalTelefono, setOriginalTelefono] = useState(currentUser?.telefono || "");
    const [recibirNotificaciones, setRecibirNotificaciones] = useState(currentUser?.notificaciones || false);

    const [editedNombre, setEditedNombre] = useState(originalNombre);
    const [editedTelefono, setEditedTelefono] = useState(originalTelefono);

    const [showSaveButton, setShowSaveButton] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const paperStyle = { paddingTop: 0.02, paddingBottom: 26, paddingLeft: 23, paddingRight: 23 }

    const handleEditClick = (field) => {
        if (field === "nombre") {
            if (!nameDisabled) {
                setEditedNombre(originalNombre); // Restaurar valores originales
            }
            setNameDisabled(!nameDisabled);
        }

        if (field === "telefono") {
            if (!telDisabled) {
                setEditedTelefono(originalTelefono); // Restaurar valores originales
            }
            setTelDisabled(!telDisabled);
        }

        setShowSaveButton(false);
        setErrorMessage("")
        setSuccessMessage("")
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;

        if (field === "nombre") {
            setEditedNombre(value);
        } else if (field === "telefono") {
            setEditedTelefono(value);
        }

        setShowSaveButton(true); // Mostrar botón cuando hay cambios
        setErrorMessage("")
    };

    const handleSwitchChange = (e) => {
        const newValue = e.target.checked;
        setRecibirNotificaciones(newValue);
        setShowSaveButton(true);
    };


    const handleSaveChanges = async () => {

        if (editedTelefono && !isTelefono(editedTelefono)) {
            setErrorMessage("Teléfono no válido.")
            return;
        }

        if (editedNombre.length > 30) {
            setErrorMessage("El nombre es demasiado largo.")
            return;
        } else if (editedNombre.length < 4) {
            setErrorMessage("El nombre es demasiado corto.")
            return;
        }


        const newValues = {
            nombre: editedNombre === originalNombre ? null : editedNombre,
            telefono: editedTelefono === originalTelefono ? null : editedTelefono,
            notificaciones: recibirNotificaciones
        };



        try {
            const response = await axios.put(`http://localhost:8080/api/usuarios/${currentUser.id}/edit-profile`, newValues, tokenConfig);
            console.log("Perfil actualizado:", response.data);
            setSuccessMessage("Datos actualizados correctamente!")
            setTimeout(() => {
                setSuccessMessage("");
            }, 2500);
            // Actualizar valores originales y desactivar edición
            setOriginalNombre(editedNombre);
            setOriginalTelefono(editedTelefono);

            // Actualizar currentUser en localStorage
            const updatedUser = { ...currentUser, nombre: editedNombre, telefono: editedTelefono, notificaciones: recibirNotificaciones };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            setNameDisabled(true);
            setTelDisabled(true);
            setShowSaveButton(false);

        } catch (error) {
            setErrorMessage("Error actualizando datos")
            console.error("Error actualizando perfil:", error);
        }

    };


    return (
        <>
            <NavbarClient />

            <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
                minHeight={'100vh'}
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >

                <Grid item>
                    <Paper elevation={24} style={{ ...paperStyle, marginTop: '10px' }} >
                        <h2 style={{ fontFamily: "Bungee, sans-serif", fontWeight: 400, fontStyle: 'normal', fontSize: 30 }}>Datos
                            <br />
                            personales</h2>
                        <Typography fontFamily={"Bungee Hairline, sans-serif"} fontWeight={'bold'} fontSize={18.7}>{currentUser?.email}</Typography>


                        <Stack direction="row" spacing={2} justifyContent="center" marginTop="20px">
                            <TextField
                                label="Nombre"
                                value={editedNombre}
                                margin="dense"
                                variant="outlined"
                                disabled={nameDisabled}
                                onChange={(e) => handleInputChange(e, "nombre")}
                            />
                            <IconButton color="custom" onClick={() => handleEditClick("nombre")} >
                                <Edit />
                            </IconButton>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="center" marginTop="20px">
                            <TextField
                                label="Teléfono"
                                placeholder="- - - - - - - - - - -"
                                value={editedTelefono}
                                margin="dense"
                                variant="outlined"
                                disabled={telDisabled}
                                onChange={(e) => handleInputChange(e, "telefono")}
                            />
                            <IconButton color="custom" onClick={() => handleEditClick("telefono")}>
                                <Edit />
                            </IconButton>
                        </Stack>


                        <Stack direction="row" spacing={2} justifyContent="center" marginTop="20px">
                            <TextField
                                label="Contraseña"
                                value={"*****************"}
                                margin="dense"
                                variant="outlined"
                                disabled

                            />
                            <IconButton color="error" href="/client-changepassword">
                                <Edit />
                            </IconButton>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={recibirNotificaciones}
                                        onChange={handleSwitchChange}
                                    />
                                }
                                label ="Recibir notificaciones sobre torneos."
                            />
                        </Stack>

                        {errorMessage && (
                            <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                                <Alert severity="error">
                                    {errorMessage}
                                </Alert>
                            </Stack>
                        )}
                        {successMessage && (
                            <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                                <Alert severity="success">
                                    {successMessage}
                                </Alert>
                            </Stack>
                        )}
                        {showSaveButton && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={{ marginTop: 2 }}
                            >
                                Guardar Cambios
                            </Button>
                        )}
                    </Paper>
                </Grid>
            </Box>
        </>
    )
};


export default ClientProfile;