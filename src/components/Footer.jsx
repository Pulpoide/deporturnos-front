import React from 'react';
import { Box, Grid, Typography, Link, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: "#089342", color: "white", p: 4, m:'0'}}>
      <Container maxWidth="lg"> {/* Ajusta el ancho máximo aquí */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}> {/* Cambia el tamaño a 4 para 3 columnas en pantallas pequeñas */}
            <Typography variant="h6">Descubre DEPORTURNOS</Typography>
            <Link href="#" color="inherit" underline="hover">Políticas de privacidad</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Contacto directo</Typography>
            <Link href="mailto:contacto@deporturnos.com" color="inherit" underline="hover">contacto@deporturnos.com</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Seguinos en</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton href="https://instagram.com" target="_blank" rel="noopener noreferrer" color='inherit'>
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://facebook.com" target="_blank" rel="noopener noreferrer" color='inherit'>
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://youtube.com" target="_blank" rel="noopener noreferrer" color='inherit'>
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;





