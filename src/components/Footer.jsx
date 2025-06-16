import React from 'react';
import { Box, Grid, Typography, Link, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: "#089342", color: "white", m: '0', overflowX: 'hidden', p: 0 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{fontFamily: "Bungee hairline, sans-serif", fontWeight:"bold" }}>Descubre </Typography>
            <Link href="#" color="inherit" underline="hover" sx={{ textAlign: 'center' }}>Políticas de privacidad</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{fontFamily: "Bungee hairline, sans-serif", fontWeight:"bold" }}>Contacto directo</Typography>
            <Link href="mailto:contacto@deporturnos.com" color="inherit" underline="hover" sx={{ textAlign: 'center' }}>contacto@deporturnos.com</Link>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: "Bungee hairline, sans-serif", fontWeight: "bold", mb: 1 }}>Seguinos</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <IconButton href="https://instagram.com" target="_blank" rel="noopener noreferrer" color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://facebook.com" target="_blank" rel="noopener noreferrer" color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://youtube.com" target="_blank" rel="noopener noreferrer" color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
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





