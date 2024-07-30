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

const theme = createTheme({
  primary: {
    main: '#43a047'
  },
  palette: {
    custom: {
      main: '#43a047',
      light: '#68b36b',
      dark: '#2e7031',
      contrastText: '#fff',
    },
    black: {
      main:'#121212'
    }
  },
});

function App() {

  return (

    <ThemeProvider theme={theme}>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route
          path="/client-home"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <ClientHome />
            </ProtectedRoute>
          } />

        <Route
          path="/client-reservas"
          element={
            <ProtectedRoute role={"CLIENTE"}>
              <ClientReservas />
            </ProtectedRoute>
          } />

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
