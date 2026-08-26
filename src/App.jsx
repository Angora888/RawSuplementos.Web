import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
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

        {/* ========================= */}
        {/* RUTAS PÚBLICAS */}
        {/* ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ========================= */}
        {/* RUTAS PROTEGIDAS */}
        {/* ========================= */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* CLIENTES */}

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          {/* VENTAS */}

          <Route
            path="/ventas"
            element={<Ventas />}
          />

          <Route
            path="/ventas/nueva"
            element={<NuevaVenta />}
          />

          <Route
            path="/ventas/:id"
            element={<VentaDetalle />}
          />

          {/* CUENTAS POR COBRAR */}

          <Route
            path="/cuentas-por-cobrar"
            element={<CuentasPorCobrar />}
          />

          <Route
            path="/cuentas-por-cobrar/:clienteId"
            element={<CuentaCliente />}
          />

          {/* PRODUCTOS */}

          <Route
            path="/productos"
            element={<Productos />}
          />

          {/* INVENTARIO */}

          <Route
            path="/inventario"
            element={<Inventario />}
          />

          {/* USUARIOS */}

          <Route
            path="/usuarios"
            element={<Usuarios />}
          />

        </Route>

        {/* ========================= */}
        {/* RUTA NO ENCONTRADA */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;