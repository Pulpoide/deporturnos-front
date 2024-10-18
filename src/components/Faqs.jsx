import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Box } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const Faqs = () => {
    return (
        <Box sx={{ width: '100%', backgroundColor: 'white', padding: '20px', color: '#089342' }}>
            <Typography variant='h4' component='h2' sx={{ mb: 4, textAlign: 'center' }}>
                Preguntas frecuentes
            </Typography>
            <div>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#45A048' }}>
                            ¿Cómo me registro para sacar mi turno?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368' }}>
                            <b>Para poder reservar un turno, debes iniciar sesion en tu cuenta.</b> Ingresa tu dirección de correo electrónico, a la cual se te enviará un email con un código. Abre tu correo electronico e ingresa el código proporcionado para iniciar sesión. Una vez logueado podrás proceder con la reserva del turno.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#45A048' }}>
                            No he recibido el correo electrónico con el código para iniciar sesión. ¿Qué debo hacer?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368' }}>
                            Si no encuentras el email en tu bandeja de entrada, te recomendamos que revises la bandeja de spam o correo no desdeado. Por cualquier otro inconveniente puedes comunicarte con el área de soporte.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#45A048' }}>
                            ¿Cómo reservar un turno?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368' }}>
                            Luego de iniciar sesión, deberas seleccionar el deporte que desees. Deporturnos te mostrará una lista con los turnos disponibles según los filtros que hayas aplicado. Verifica que los datos que seleccionaste estén correctos (Día, horario y deporte). Selecciona el botón de "Confirmar reserva" y ¡Listo!. 
                            <b>A continuación te llegará un email de confirmación con los datos de la reserva.</b> 
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel4-content"
                        id="panel4-header"
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#45A048' }}>
                            ¿Cómo sé si mi reserva esta confirmada?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ color: '#636368' }}>
                            Deberías haber recibido un correo electrónico de confirmación de reserva. Te sugerimos que revises tu carpeta de spam o correo no deseado por si acaso. Si no encuentras el correo electrónico de confirmación, tambien puedes acceder a la sección "Mis reservas" de tu cuenta en la pagina de www.deporturrnos.com. En el caso de que el turno este confirmado lo verás reflejado en tus reservas activas. 
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        </Box>
    );
};

export default Faqs;
