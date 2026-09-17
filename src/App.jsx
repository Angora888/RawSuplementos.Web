import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import CatalogoPublico from "./pages/CatalogoPublico";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import NuevaVenta from "./pages/NuevaVenta";
import CuentasPorCobrar from "./pages/CuentasPorCobrar";
import Inventario from "./pages/Inventario";
import Usuarios from "./pages/Usuarios";
import VentaDetalle from "./pages/VentaDetalle";
import CuentaCliente from "./pages/CuentaCliente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo/:slug" element={<CatalogoPublico />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ventas/nueva" element={<NuevaVenta />} />
          <Route path="/ventas/:id" element={<VentaDetalle />} />
          <Route path="/cuentas-por-cobrar" element={<CuentasPorCobrar />} />
          <Route path="/cuentas-por-cobrar/:clienteId" element={<CuentaCliente />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
