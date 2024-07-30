import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientReservas = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;

  useEffect(() => {
    fetchReservas();
  }, []);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${currentUser.token}` }
  };

  const fetchReservas = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/usuarios/${userId}/reservas`, tokenConfig);
      if (response && response.data) {
        setReservas(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/login");
      } else {
        console.log('Error fetchReservas:', error);
      }
    }
  };

  const handleCancel = async (id) => {
    await axios.put(`http://localhost:8080/api/reservas/${id}/cancelar`, {}, tokenConfig);
    fetchReservas();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Hora de Inicio</TableCell>
            <TableCell>Hora de Fin</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservas.map((reserva) => (
            <TableRow key={reserva.id}>
              <TableCell>{reserva.id}</TableCell>
              <TableCell>{reserva.fecha}</TableCell>
              <TableCell>{reserva.turno.horaInicio}</TableCell>
              <TableCell>{reserva.turno.horaFin}</TableCell>
              <TableCell>{reserva.estado}</TableCell>
              <TableCell>
                {reserva.estado !== 'CANCELADA' && (
                  <IconButton color="secondary" onClick={() => handleCancel(reserva.id)}>
                    <CancelIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientReservas;
