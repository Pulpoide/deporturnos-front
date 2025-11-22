import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, MenuItem, Button, TextField } from '@mui/material';
import NavbarClient from '../../components/NavbarClient';
import backgroundImage from '../../assets/images/imagen_background_adv.png';

const buttonStyle = {
  fontFamily: 'Bungee, sans-serif',
  minWidth: '130px',
};

const cardButtonStyle = {
  alignSelf: 'center',
  paddingY: 1.5,
  width: 'fit-content',
  marginBottom: 2.7,
  fontFamily: 'Bungee, sans-serif',
};

const SelectField = () => {
  const { deporte } = useParams();
  const [canchas, setCanchas] = useState([]);
  const [canchasFiltradas, setCanchasFiltradas] = useState([]);
  const [tipoDeCancha, setTipoDeCancha] = useState('Todos');
  const navigate = useNavigate();

  const tokenConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const handleViewTurnos = (canchaId) => {
    navigate(`/turnos-disponibles/${canchaId}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/canchas/disponibles/${deporte}`, tokenConfig)
      .then((response) => {
        setCanchas(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate('/login');
        }
      });
  }, [deporte]);

  useEffect(() => {
    if (tipoDeCancha === 'Todos') {
      setCanchasFiltradas(canchas);
    } else {
      setCanchasFiltradas(canchas.filter((cancha) => cancha.tipo === tipoDeCancha));
    }
  }, [tipoDeCancha, canchas]);

  const obtenerOpcionesDeCancha = () => {
    if (deporte === 'futbol') {
      return [
        { value: 'FÚTBOL 5', label: 'FÚTBOL 5' },
        { value: 'FÚTBOL 7', label: 'FÚTBOL 7' },
        { value: 'FÚTBOL 11', label: 'FÚTBOL 11' },
      ];
    } else if (deporte === 'padel') {
      return [
        { value: 'DE CEMENTO', label: 'DE CEMENTO' },
        { value: 'DE ACRÍLICO', label: 'DE ACRÍLICO' },
      ];
    } else {
      navigate('/select-sport');
      return [];
    }
  };

  const opcionesDeCancha = obtenerOpcionesDeCancha();

  return (
    <>
      <NavbarClient />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          pt: { xs: '12px', sm: '60px' },
          m: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h4"
          sx={{ fontFamily: 'Bungee, sans-serif', fontWeight: 400, mb: '30px', mt: '30px' }}
        >
          2. Selecciona una cancha
        </Typography>
        <TextField
          select
          label="Tipo de cancha"
          value={tipoDeCancha}
          onChange={(e) => setTipoDeCancha(e.target.value)}
          variant="outlined"
          sx={{
            width: { xs: "160px", sm: "220px", md: "260px" },
            mb: 4,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              fontFamily: "Fjalla One",
              "& fieldset": {
                borderColor: "rgba(0,0,0,0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#009688",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#009688",
                borderWidth: 2,
              },
            },
            "& .MuiInputLabel-root": {
              fontFamily: "Fjalla One",
            }
          }}
          SelectProps={{
            MenuProps: {
              disableScrollLock: true,
              PaperProps: {
                elevation: 4,
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  background: "white",
                  "& .MuiMenuItem-root": {
                    fontFamily: "Fjalla One",
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0,150,136,0.1)",
                    }
                  }
                }
              }
            }
          }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          {opcionesDeCancha.map((opcion) => (
            <MenuItem key={opcion.value} value={opcion.value}>
              {opcion.label}
            </MenuItem>
          ))}
        </TextField>

        <Grid container spacing={2}>
          {canchasFiltradas.length > 0 ? (
            canchasFiltradas.map((cancha) => (
              <Grid
                item
                key={cancha.id}
                xs={12}
                sm={6}
                md={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 280,
                    p: 2,
                    borderRadius: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    transition: "0.25s",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>

                    <Typography
                      variant="subtitle2"
                      sx={{ opacity: 0.7, mb: 0.5 }}
                    >
                      Tipo de cancha
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "Fjalla One", fontWeight: "bold" }}
                    >
                      {cancha.tipo}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1, opacity: 0.8 }}
                    >
                      {cancha.nombre}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ mt: 1.5, color: "#009688", fontFamily: "Fjalla One" }}
                    >
                      ${cancha.precioHora} / hora
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        opacity: 0.7,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {cancha.descripcion}
                    </Typography>

                  </CardContent>

                  <Button
                    variant="contained"
                    onClick={() => handleViewTurnos(cancha.id)}
                    sx={{
                      mt: 2,
                      py: 1.2,
                      borderRadius: 3,
                      fontFamily: "Bungee",
                      textTransform: "none",
                      width: "100%"
                    }}
                  >
                    Ver turnos disponibles
                  </Button>

                </Card>
              </Grid>

            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{ textAlign: 'center', fontFamily: 'Fjalla One, sans-serif', margin: 3 }}
              >
                No se encontraron canchas disponibles :(
              </Typography>
            </Grid>
          )}
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 6, mb: 6 }}>
          <Button variant="contained" color="black" onClick={() => navigate(-1)} sx={buttonStyle}>
            Atras
          </Button>
        </Grid>
      </Box>
    </>
  );
};

export default SelectField;
