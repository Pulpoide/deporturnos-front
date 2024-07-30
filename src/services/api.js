import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080', // URL base de tu backend
});

// Interceptor para incluir el token en las cabeceras de las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Incluir el token en las cabeceras
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
