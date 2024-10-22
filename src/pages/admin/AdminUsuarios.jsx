import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel, Box
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete, Lock, LockOpen } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    // Usuario
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [notificaciones, setNotificaciones] = useState('');
    const [rol, setRol] = useState('');
    const [initialValues, setInitialValues] = useState({});


    const navigate = useNavigate();

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const tokenConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/usuarios', tokenConfig);
            console.log(response)
            if (response && response.data) {
                setUsuarios(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status == 403) {
                navigate('/login');
            }
            console.error('Error fetching usuarios:', error);

        }
    };

    const handleAdd = () => {
        setSelectedUsuario(null);
        setNombre('');
        setEmail('');
        setPassword('');
        setTelefono('');
        setNotificaciones('');
        setRol('');
        setOpen(true);
        setInitialValues({});
    };

    const handleEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setNombre(usuario.nombre || '');
        setEmail(usuario.email || '');
        setPassword('');
        setTelefono(usuario.telefono || '');
        setNotificaciones(usuario.notificaciones || false);
        setRol(usuario.rol || '');
        setOpen(true);
        setInitialValues(usuario);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/usuarios/${id}`, tokenConfig);
            console.log(response)

        } catch (err) {
            console.error(err)
        }
        fetchUsuarios();
    };

    const handleSave = async () => {
        const updatedFields = {};

        if (nombre !== initialValues.nombre) updatedFields.nombre = nombre;
        if (email !== initialValues.email) updatedFields.email = email;
        if (password !== '') updatedFields.password = password;
        if (telefono !== initialValues.telefono) updatedFields.telefono = telefono;
        if (notificaciones !== initialValues.notificaciones) updatedFields.notificaciones = notificaciones;
        if (rol !== initialValues.rol) updatedFields.rol = rol;

        if (Object.keys(updatedFields).length > 0) {
            if (selectedUsuario) {
                await axios.put(`http://localhost:8080/api/usuarios/${selectedUsuario.id}`, updatedFields, tokenConfig);
            } else {
                await axios.post('http://localhost:8080/api/auth/register', updatedFields, tokenConfig);
            }
        }

        fetchUsuarios();
        setOpen(false);
    };

    const handleRoleChange = async (id, newRole) => {
        await axios.put(`http://localhost:8080/api/usuarios/${id}/role`, { rol: newRole }, tokenConfig);
        fetchUsuarios();
    };

    const handleAccountStatusChange = async (id, status) => {
        await axios.put(`http://localhost:8080/api/usuarios/${id}/account`, { enabled: status }, tokenConfig);
        fetchUsuarios();
    };

    const buttonStyle = { width: '33%', marginTop: '19px', marginBottom: '19px' };

    return (
        <>
            <NavbarAdmin />
            <TableContainer component={Paper}>
                <Box justifyContent={'center'} display={'flex'}>
                    <Button
                        variant="contained"
                        color="custom"
                        startIcon={<Add />}
                        onClick={handleAdd}
                        style={buttonStyle}
                    >
                        Agregar Usuario
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>ID</StyledTableCell>
                            <StyledTableCell align='center'>Nombre</StyledTableCell>
                            <StyledTableCell align='center'>Email</StyledTableCell>
                            <StyledTableCell align='center'>Teléfono</StyledTableCell>
                            <StyledTableCell align='center'>Recibe notificaciones</StyledTableCell>
                            <StyledTableCell align='center'>Rol</StyledTableCell>
                            <StyledTableCell align='center'>Cuenta Activada</StyledTableCell>
                            <StyledTableCell align='center'>Acciones</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell align='center'>{usuario.id}</TableCell>
                                <TableCell align='center'>{usuario.nombre}</TableCell>
                                <TableCell align='center'>{usuario.email}</TableCell>
                                <TableCell align='center'>{usuario.telefono}</TableCell>
                                <TableCell align='center'>{usuario.notificaciones ? 'Sí' : 'No'}</TableCell>
                                <TableCell align='center'>{usuario.rol}</TableCell>
                                <TableCell align='center'>{usuario.activada ? 'Sí' : 'No'}</TableCell>
                                <TableCell align='right'>
                                    <IconButton color="custom" onClick={() => handleEdit(usuario)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(usuario.id)}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton onClick={() => handleRoleChange(usuario.id, usuario.rol === 'ADMIN' ? 'CLIENTE' : 'ADMIN')}>
                                        {usuario.rol === 'ADMIN' ? <VerifiedIcon color='primary' /> : <PersonIcon color='black' />}
                                    </IconButton>
                                    <IconButton onClick={() => handleAccountStatusChange(usuario.id, !usuario.enabled)}>
                                        {usuario.activada ? <LockOpen /> : <Lock color='black' />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{selectedUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            color='custom'
                            autoFocus
                            margin="dense"
                            label="Nombre"
                            fullWidth
                            value={nombre || ''}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <TextField
                            color='custom'
                            margin="dense"
                            label="Email"
                            fullWidth
                            value={email || ''}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            color='custom'
                            margin="dense"
                            label="Password"
                            fullWidth
                            type="password"
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            color='custom'
                            margin="dense"
                            label="Teléfono"
                            fullWidth
                            value={telefono || ''}
                            onChange={(e) => setTelefono(e.target.value)}
                        />

                        <FormControl fullWidth margin="dense" color='custom'>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                value={rol || ''}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="CLIENTE">Cliente</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificaciones}
                                    onChange={(e) => setNotificaciones(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Recibe notificaciones"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="custom">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} color="custom">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
        </>
    );
};

export default AdminUsuarios;
