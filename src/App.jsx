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
          path="/turnos-disponibles/:id"
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

      </Routes>
    </ThemeProvider>
  )
}

export default App
