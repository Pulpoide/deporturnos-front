import { useState } from "react";
import { Button, Grid, Paper, TextField, Box, Typography, Stack, IconButton, Alert, FormControlLabel, Switch } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from "axios";
import NavbarClient from "../../components/NavbarClient"
import backgroundImage from '../../assets/images/imagen_background_adv.png';
import { margin } from "@mui/system";

const isTelefono = (telefono) =>
    /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/i.test(telefono);

const paperStyle = {
    padding: '32px 24px',
    borderRadius: 20,
    maxWidth: 420,
    margin: 'auto',
    background: 'rgba(255,255,255,0.97)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
};

const titleFont = {
    fontFamily: 'Bungee, sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 30,
    marginTop: 0,
    marginBottom: 20,
};

const emailFont = {
    fontFamily: 'Bungee Hairline, sans-serif',
    fontWeight: 'bold',
    fontSize: 18.7,
};

const buttonStyle = {
    fontFamily: 'Bungee, sans-serif',
    fontWeight: 400,
    borderRadius: 12,
    padding: '8px 16px',
    fontSize: 16,
};

const ClientProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    const [nameDisabled, setNameDisabled] = useState(true);
    const [telDisabled, setTelDisabled] = useState(true);
    const [originalNombre, setOriginalNombre] = useState(currentUser?.nombre || "");
    const [originalTelefono, setOriginalTelefono] = useState(currentUser?.telefono || "");
    const [recibirNotificaciones, setRecibirNotificaciones] = useState(currentUser?.notificaciones || false);
    const [editedNombre, setEditedNombre] = useState(originalNombre);
    const [editedTelefono, setEditedTelefono] = useState(originalTelefono);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleEditClick = (field) => {
        if (field === "nombre") {
            if (!nameDisabled) setEditedNombre(originalNombre);
            setNameDisabled(!nameDisabled);
        }
        if (field === "telefono") {
            if (!telDisabled) setEditedTelefono(originalTelefono);
            setTelDisabled(!telDisabled);
        }
        setShowSaveButton(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        if (field === "nombre") setEditedNombre(value);
        else if (field === "telefono") setEditedTelefono(value);
        setShowSaveButton(true);
        setErrorMessage("");
    };

    const handleSwitchChange = (e) => {
        setRecibirNotificaciones(e.target.checked);
        setShowSaveButton(true);
    };

    const handleSaveChanges = async () => {
        if (editedTelefono && !isTelefono(editedTelefono)) {
            setErrorMessage("Teléfono no válido.");
            return;
        }
        if (editedNombre.length > 30) {
            setErrorMessage("El nombre es demasiado largo.");
            return;
        } else if (editedNombre.length < 4) {
            setErrorMessage("El nombre es demasiado corto.");
            return;
        }
        const newValues = {
            nombre: editedNombre === originalNombre ? null : editedNombre,
            telefono: editedTelefono === originalTelefono ? null : editedTelefono,
            notificaciones: recibirNotificaciones
        };
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${currentUser.id}/edit-profile`, newValues, tokenConfig);
            setSuccessMessage("Datos actualizados correctamente!");
            setTimeout(() => setSuccessMessage(""), 2500);
            setOriginalNombre(editedNombre);
            setOriginalTelefono(editedTelefono);
            const updatedUser = { ...currentUser, nombre: editedNombre, telefono: editedTelefono, notificaciones: recibirNotificaciones };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setNameDisabled(true);
            setTelDisabled(true);
            setShowSaveButton(false);
        } catch (error) {
            setErrorMessage("Error actualizando datos");
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
                    <Paper elevation={24} style={paperStyle}>
                        <h2 style={titleFont}>Datos<br />personales</h2>
                        <Typography style={emailFont}>{currentUser?.email}</Typography>
                        <Stack direction="row" spacing={2} justifyContent="center" marginTop="20px">
                            <TextField
                                label="Nombre"
                                value={editedNombre}
                                margin="dense"
                                variant="outlined"
                                disabled={nameDisabled}
                                onChange={(e) => handleInputChange(e, "nombre")}
                            />
                            <IconButton color="primary" onClick={() => handleEditClick("nombre")}> <Edit /> </IconButton>
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
                            <IconButton color="primary" onClick={() => handleEditClick("telefono")}> <Edit /> </IconButton>
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center" marginTop="20px">
                            <TextField
                                label="Contraseña"
                                value={"*****************"}
                                margin="dense"
                                variant="outlined"
                                disabled
                            />
                            <IconButton color="error" href="/client-changepassword"> <Edit /> </IconButton>
                        </Stack>
                        <Box sx={{marginTop: 3}}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={recibirNotificaciones}
                                        onChange={handleSwitchChange}
                                    />
                                }
                                label="Recibir notificaciones"
                                componentsProps={{typography: { style: { fontFamily: 'Fjalla One, sans-serif'} }}}
                            />
                        </Box>
                        {errorMessage && (
                            <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                                <Alert severity="error">{errorMessage}</Alert>
                            </Stack>
                        )}
                        {successMessage && (
                            <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                                <Alert severity="success">{successMessage}</Alert>
                            </Stack>
                        )}
                        {showSaveButton && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={buttonStyle}
                            >
                                Guardar Cambios
                            </Button>
                        )}
                    </Paper>
                </Grid>
            </Box>
        </>
    );
};

export default ClientProfile;