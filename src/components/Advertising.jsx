import { Box, Grid, Typography, Container, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import backgroundImage from '../assets/images/imagen_background_adv.png' // Tu imagen de fondo

const Advertising = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        // Usamos padding vertical en lugar de height fija para evitar desbordes en móviles
        py: { xs: 8, md: 12 },
        bgcolor: "#f9f9f9", // Un gris muy sutil para diferenciarlo del footer
        color: "#1a1a1a",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Overlay sutil blanco para asegurar que el texto se lea sobre los dibujos del fondo */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.85)', zIndex: 1 }} />

      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">

          {/* TEXTO DE VENTA */}
          <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300, // Light
                color: '#333',
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.3
              }}
            >
              ¿Te gustaría probar
            </Typography>

            <Typography
              variant="h2"
              component="span" // Usamos span para que siga en la misma línea visual o bloque destacado
              sx={{
                fontFamily: "Bungee, sans-serif",
                color: '#00b04b',
                display: 'block', // Que ocupe su propia línea para impacto
                fontSize: { xs: '2.5rem', md: '4rem' },
                my: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
              onClick={() => navigate("/")}
            >
              DEPORTURNOS
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700, // Bold
                color: '#1a1a1a',
                fontSize: { xs: '1.5rem', md: '2.2rem' }
              }}
            >
              en tu complejo deportivo?
            </Typography>

            <Typography variant="body1" sx={{ mt: 2, maxWidth: '600px', mx: { xs: 'auto', md: 0 }, opacity: 0.8 }}>
              Gestiona reservas, clientes y pagos en una sola plataforma. Moderniza tu club hoy mismo.
            </Typography>
          </Grid>

          {/* BOTONES DE ACCIÓN */}
          <Grid item xs={12} md={5}>
            <Stack
              direction="column"
              spacing={2}
              alignItems={{ xs: 'center', md: 'flex-end' }} // En desktop alineados a la derecha (cerca del borde) o centro según gusto
            >
              <Button
                variant="contained"
                href="/planes"
                size="large"
                sx={{
                  backgroundColor: '#00b04b',
                  color: 'white',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 'bold',
                  py: 1.5,
                  px: 4,
                  width: { xs: '100%', sm: 'auto' }, // Full width en celular
                  minWidth: '250px',
                  borderRadius: '50px',
                  boxShadow: '0 8px 20px rgba(0, 176, 75, 0.3)', // Sombra "Glow"
                  '&:hover': { backgroundColor: '#009640' }
                }}
              >
                VER PLANES Y PRECIOS
              </Button>

              <Button
                variant="outlined"
                href="/funcionalidades"
                size="large"
                sx={{
                  borderColor: '#00b04b',
                  color: '#00b04b',
                  borderWidth: '2px',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 'bold',
                  py: 1.5,
                  px: 4,
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: '250px',
                  borderRadius: '50px',
                  '&:hover': {
                    borderWidth: '2px',
                    backgroundColor: 'rgba(0, 176, 75, 0.05)',
                    borderColor: '#009640'
                  }
                }}
              >
                VER FUNCIONALIDADES
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Advertising;