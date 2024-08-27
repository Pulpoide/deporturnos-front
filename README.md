# DeporTurnos Frontend

Este es el repositorio del frontend para la aplicación DeporTurnos, una plataforma para la gestión integral de canchas deportivas. La aplicación está desarrollada con React y utiliza Vite como herramienta de construcción. El frontend se comunica con el backend de DeporTurnos para manejar reservas, usuarios, y otros aspectos clave de la gestión de centros deportivos.

## Características

- **Interfaz de usuario moderna:** Desarrollada con React y Material-UI para una experiencia visual atractiva.
- **Navegación optimizada:** Uso de React Router para una navegación fluida entre las diferentes páginas.
- **Gestión de estado:** Implementación de soluciones eficientes para el manejo del estado de la aplicación.
- **Conexión con backend:** Axios se utiliza para realizar solicitudes HTTP al backend de DeporTurnos.
- **Seguridad:** Manejo de autenticación con JWT en el frontend.

## Tecnologías Utilizadas

- **React:** Biblioteca para construir interfaces de usuario.
- **Vite:** Herramienta rápida para el desarrollo y construcción del proyecto.
- **Material-UI (MUI):** Librería de componentes para React con estilo y funcionalidad.
- **React Router:** Librería para la gestión de rutas en React.
- **Axios:** Cliente HTTP para realizar solicitudes al backend.
- **JWT-decode:** Decodificación de JSON Web Tokens para la autenticación en el frontend.
- **Date-fns/Dayjs:** Librerías para manipulación de fechas.

## Estructura del Proyecto

```bash
deporturnos-front
├── public
├── src
│   ├── assets
│   │   └── images
│   ├── components
│   ├── pages
│   │   ├── admin
│   │   └── client
│   ├── services
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Instalación y Uso

```bash
git clone https://github.com/Pulpoide/deporturnos-front.git
cd deporturnos-front
npm install
npm run dev
```

## Autor
[**Joaquin D. Olivero**](https://github.com/Pulpoide) ->
[LinkedIn](https://www.linkedin.com/in/JoaquinOlivero)