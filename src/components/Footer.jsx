import { Box, Grid, Typography, Link, Container, IconButton, Divider, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
        color: "#e0e0e0",
        py: 6,
        borderTop: '4px solid #00b04b'
      }}
    >
      <Container maxWidth="lg">
        {/* justifyContent="space-between" ayuda en desktop.
           En mobile (xs), el texto a la izquierda es más legible para listas.
        */}
        <Grid container spacing={5} justifyContent="space-between">

          {/* COLUMNA 1: BRAND */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Bungee Inline, sans-serif",
                color: 'white',
                mb: 2 // Un poco más de aire
              }}
            >
              DEPORTURNOS
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', opacity: 0.7, lineHeight: 1.6 }}>
              La forma más rápida y sencilla de encontrar tu cancha y asegurar tu partido. Juega sin límites.
            </Typography>
          </Grid>

          {/* COLUMNA 2: LINKS */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, mb: 2, color: 'white' }}>
              Explorar
            </Typography>
            {/* alignItems="flex-start" asegura que los links se alineen a la izquierda perfectamente */}
            <Stack spacing={1.5} alignItems="flex-start">
              <Link href="#" color="inherit" underline="hover" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.95rem', opacity: 0.8 }}>
                Inicio
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.95rem', opacity: 0.8 }}>
                Buscar Canchas
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.95rem', opacity: 0.8 }}>
                Políticas de Privacidad
              </Link>
            </Stack>
          </Grid>

          {/* COLUMNA 3: CONTACTO */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, mb: 2, color: 'white' }}>
              Contacto
            </Typography>
            <Link
              href="mailto:contacto@deporturnos.com"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 2, fontFamily: 'Roboto, sans-serif', opacity: 0.8 }}
            >
              contacto@deporturnos.com
            </Link>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton href="https://instagram.com" target="_blank" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: '#00b04b' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://facebook.com" target="_blank" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: '#1877F2' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://youtube.com" target="_blank" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: '#FF0000' } }}>
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* El Copyright SÍ va centrado, porque es una sola línea */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ fontFamily: 'Roboto, sans-serif', opacity: 0.5 }}>
            © {new Date().getFullYear()} Deporturnos. Todos los derechos reservados.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;