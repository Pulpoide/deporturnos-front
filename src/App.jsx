import './App.css'
import { Route, Routes } from 'react-router-dom';

// Paginas
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ClientHome from './pages/client/ClientHome';
import AdminHome from './pages/admin/AdminHome';
import AdminCanchas from './pages/admin/AdminCanchas'
import AdminTurnos from './pages/admin/AdminTurnos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminReservas from './pages/admin/AdminReservas';


// Estilo
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProtectedRoute from './components/ProtectedRoute';
import ClientReservas from './pages/client/ClientReservas';
import SelectSport from './pages/client/SelectSport';
import CanchasDisponibles from './pages/client/CanchasDisponibles';
import TurnosDisponibles from './pages/client/TurnosDisponibles';
import CreateReserva from './pages/client/CreateReserva';
import ClientProfile from './pages/client/ClientProfile';
import VerifyAccout from './pages/VerifyAccount';
import ClientChangePassword from './pages/client/ClientChangePassword'
import ClientForgotPassword from './pages/client/ClientForgotPassword';
import ClientResetPassword from './pages/client/ClientResetPassword';
import NotFound from './pages/NotFound';
import AdminValidateReserva from './pages/admin/AdminValidateReserva';

const theme = createTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
    custom: {
      main: '#43a047',
      light: '#68b36b',
      dark: '#2e7031',
      contrastText: '#fff',
    },
    black: {
      main: '#121212',
      contrastText: '#fff',
    }
  },
});

function App() {

  return (

    <ThemeProvider theme={theme}>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyAccout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ClientForgotPassword />} />

        {/* CLIENT ROUTES */}
        <Route
          path="/client-home"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <ClientHome />
            </ProtectedRoute>
          } />

        <Route
          path="/client-profile"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <ClientProfile />
            </ProtectedRoute>
          } />

        <Route
          path="/client-changepassword"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <ClientChangePassword />
            </ProtectedRoute>
          } />

        <Route
          path="/client-resetpassword"
          element={
            <ClientResetPassword />
          } />

        <Route
          path="/client-reservas"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <ClientReservas />
            </ProtectedRoute>
          } />

        {/* PROCESO DE RESERVA DE UN TURNO */}
        <Route
          path="/select-sport"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <SelectSport />
            </ProtectedRoute>
          } />

        <Route
          path="/canchas-disponibles/:deporte"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <CanchasDisponibles />
            </ProtectedRoute>
          } />

        <Route
          path="/turnos-disponibles/:canchaId"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <TurnosDisponibles />
            </ProtectedRoute>
          } />

        <Route
          path="/create-reserva/confirm"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <CreateReserva />
            </ProtectedRoute>
          } />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute role={"ADMIN"}>
              <AdminHome />
            </ProtectedRoute>
          } />

        <Route
          path="/admin-turnos"
          element={
            <ProtectedRoute role={"ADMIN"}>
              <AdminTurnos />
            </ProtectedRoute>
          } />

        <Route
          path="/admin-canchas"
          element={
            <ProtectedRoute role={"ADMIN"}>
              <AdminCanchas />
            </ProtectedRoute>
          } />

        <Route
          path="/admin-usuarios"
          element={
            <ProtectedRoute role={"ADMIN"}>
              <AdminUsuarios />
            </ProtectedRoute>
          } />

        <Route
          path="/admin-reservas"
          element={
            <ProtectedRoute role={"ADMIN"}>
              <AdminReservas />
            </ProtectedRoute>
          } />

        {/* Validar Reserva */}
        <Route
          path='/validate-reserva/:reservaId'
          element={
            <ProtectedRoute role={"ADMIN"}>
          <AdminValidateReserva/>
          </ProtectedRoute>
          }/>

        {/* Ruta 404 */}
        <Route
          path='*' element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
