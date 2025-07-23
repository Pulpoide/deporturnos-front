import { Box, Grid, Typography, Link, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: "#089342", color: "white", m: '0', overflowX: 'hidden', p: 0 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{justifyContent:'center', textAlign: 'center', p: 1, flexDirection: { xs: 'column', sm: 'row' }}}>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop:2}}>
            <Typography variant="h6" sx={{fontFamily: "Bungee hairline, sans-serif", fontWeight:"bold", paddingBottom:1 }}>Descubre </Typography>
            <Link href="#" color="inherit" underline="hover" sx={{ textAlign: 'center', fontFamily: "Fjalla One, sans-serif", paddingBottom:1.2 }}>Políticas de privacidad</Link>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{fontFamily: "Bungee hairline, sans-serif", fontWeight:"bold", paddingBottom:1 }}>Contacto directo</Typography>
            <Link href="mailto:deporturnos@gmail.com" color="inherit" underline="hover" sx={{ textAlign: 'center', fontFamily: "Fjalla One, sans-serif", paddingBottom:1.2}}>contacto@deporturnos.com</Link>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: "Bungee hairline, sans-serif", fontWeight: "bold"}}>Seguinos</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center'}}>
              <IconButton href="https://instagram.com" target="_blank" rel="noopener noreferrer" color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
                <InstagramIcon fontSize='medium'/>
              </IconButton>
              <IconButton href="https://facebook.com" target="_blank" rel="noopener noreferrer" color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
                <FacebookIcon fontSize='medium'/>
              </IconButton>
              <IconButton href="https://youtube.com" target="_blank" rel="noopener noreferrer" color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
                <YouTubeIcon fontSize='medium'/>
              </IconButton>
            </Box>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;





