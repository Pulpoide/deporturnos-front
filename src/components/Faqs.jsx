import { Accordion, AccordionDetails, AccordionSummary, Typography, Box } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const Faqs = () => {
    return (
        <Box sx={{ width: '100%', backgroundColor: 'white', color: '#089342', overflowX: 'hidden', p: 0 }}>
            <Typography variant='h4' component='h2' sx={{ mb: 4, textAlign: 'center', color:'black', fontFamily: "Bungee, sans-serif",}}>
                Preguntas frecuentes
            </Typography>
            <div>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h6" sx={{  color: '#45A048', fontFamily: "Bungee hairline, sans-serif", fontWeight: 'bold' }}>
                            ¿Cómo me registro para sacar mi turno?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368' , fontFamily: "Fjalla One, sans-serif",}}>
                            <b>{`"Para poder reservar un turno, debes registrarte e iniciar sesion en tu cuenta."`}</b> Ingresa tu dirección de correo electrónico, a la cual se te enviará un email con un código. Abre tu correo electronico e ingresa el código proporcionado para activar tu cuenta. Una vez dentro podrás proceder con la reserva.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant="h6" sx={{color: '#45A048', fontFamily: "Bungee hairline, sans-serif", fontWeight: 'bold'}}>
                            No he recibido el correo electrónico con el código para registarme y activar mi cuenta. ¿Qué debo hacer?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368' , fontFamily: "Fjalla One, sans-serif",}}>
                            Si no encuentras el email en tu bandeja de entrada, te recomendamos que revises la <b>{`"bandeja de spam o correo no deseado"`}</b>. Por cualquier otro inconveniente puedes comunicarte con el área de soporte.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography variant="h6" sx={{fontFamily: "Bungee hairline, sans-serif", fontWeight: 'bold', color: '#45A048' }}>
                            ¿Cómo reservar un turno?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368', fontFamily: "Fjalla One, sans-serif", }}>
                            Luego de iniciar sesión, deberas seleccionar el deporte y cancha que desees reservar. Deporturnos te mostrará una lista con los turnos disponibles según los filtros que hayas aplicado. Verifica que los datos que seleccionaste sean correctos, selecciona el botón de <b>{`"Confirmar reserva"`}</b> y ¡Listo!. A continuación te llegará un <b>{`"email de confirmación con los datos de la reserva y un código QR"`}</b> que debes mostrar para ingresar a la cancha.

                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel4-content"
                        id="panel4-header"
                    >
                        <Typography variant="h6" sx={{ fontFamily: "Bungee hairline, sans-serif", fontWeight: 'bold', color: '#45A048' }}>
                            ¿Cómo sé si mi reserva esta confirmada?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368', fontFamily: "Fjalla One, sans-serif", }}>
                            Deberías haber recibido un correo electrónico de confirmación de reserva. Te sugerimos que revises tu carpeta de spam o correo no deseado por si acaso. Si no encuentras el correo electrónico de confirmación, tambien puedes acceder a la sección <b>{`"Mis reservas"`}</b> de tu cuenta. En el caso de que el turno este confirmado lo verás reflejado en tus reservas activas. 
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        </Box>
    );
};

export default Faqs;
