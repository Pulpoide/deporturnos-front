import { Accordion, AccordionDetails, AccordionSummary, Typography, Box, Container, alpha } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// 1. DATA DRIVEN: Definimos el contenido fuera del render para mantener el código limpio.
// Usamos JSX en la respuesta para poder mantener tus negritas (<b>).
const faqData = [
    {
        id: 'panel1',
        question: "¿Cómo me registro para sacar mi turno?",
        answer: (
            <>
                <Box component="span" fontWeight="bold">Para poder reservar un turno, debes registrarte e iniciar sesión en tu cuenta.</Box> Ingresa tu dirección de correo electrónico, a la cual se te enviará un email con un código. Abre tu correo electrónico e ingresa el código proporcionado para activar tu cuenta. Una vez dentro podrás proceder con la reserva.
            </>
        )
    },
    {
        id: 'panel2',
        question: "No recibí el correo con el código. ¿Qué debo hacer?",
        answer: (
            <>
                Si no encuentras el email en tu bandeja de entrada, te recomendamos que revises la <Box component="span" fontWeight="bold">bandeja de spam o correo no deseado</Box>. Por cualquier otro inconveniente puedes comunicarte con el área de soporte.
            </>
        )
    },
    {
        id: 'panel3',
        question: "¿Cómo reservar un turno?",
        answer: (
            <>
                Luego de iniciar sesión, deberás seleccionar el deporte y cancha que desees reservar. Deporturnos te mostrará una lista con los turnos disponibles según los filtros que hayas aplicado. Verifica que los datos sean correctos, selecciona el botón de <Box component="span" fontWeight="bold">"Confirmar reserva"</Box> y ¡Listo!. A continuación te llegará un <Box component="span" fontWeight="bold">email de confirmación con los datos de la reserva y un código QR</Box> que debes mostrar para ingresar.
            </>
        )
    },
    {
        id: 'panel4',
        question: "¿Cómo sé si mi reserva está confirmada?",
        answer: (
            <>
                Deberías haber recibido un correo electrónico de confirmación. Te sugerimos revisar tu carpeta de spam. Si no encuentras el correo, también puedes acceder a la sección <Box component="span" fontWeight="bold">"Mis reservas"</Box> de tu cuenta. Si el turno está confirmado, lo verás reflejado en tus reservas activas.
            </>
        )
    }
];

const Faqs = () => {
    return (
        <Box
            component="section"
            sx={{
                width: '100%',
                backgroundColor: '#fff', // Fondo blanco limpio
                py: 8 // Padding vertical generoso
            }}
        >
            <Container maxWidth="md"> {/* Contenedor centrado para mejor lectura */}

                {/* TÍTULO */}
                <Typography
                    variant='h3'
                    component='h2'
                    sx={{
                        mb: 6,
                        textAlign: 'center',
                        color: '#1a1a1a',
                        fontFamily: "Bungee Inline, sans-serif",
                        fontSize: { xs: '2rem', md: '3rem' } // Responsive font size
                    }}
                >
                    PREGUNTAS FRECUENTES
                </Typography>

                {/* LISTA DE ACORDEONES */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {faqData.map((faq) => (
                        <Accordion
                            key={faq.id}
                            disableGutters
                            elevation={0} // Quitamos la sombra fea por defecto
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px !important', // Bordes redondeados forzados
                                '&:before': { display: 'none' }, // Quitamos la línea divisoria default de MUI
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: '#00b04b', // Hover sutil verde en el borde
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                },
                                '&.Mui-expanded': {
                                    borderColor: '#00b04b', // Borde verde cuando está abierto
                                    backgroundColor: alpha('#00b04b', 0.02) // Fondo verde muuuuy suave al abrir
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#00b04b' }} />} // Flecha verde
                                aria-controls={`${faq.id}-content`}
                                id={`${faq.id}-header`}
                                sx={{
                                    px: 3,
                                    py: 1
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#1a1a1a',
                                        fontFamily: "'Roboto', sans-serif",
                                        fontWeight: 600,
                                        fontSize: { xs: '1rem', md: '1.1rem' }
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography
                                    sx={{
                                        color: '#555',
                                        fontFamily: "'Roboto', sans-serif",
                                        lineHeight: 1.7, // Importante para leer párrafos largos
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Faqs;