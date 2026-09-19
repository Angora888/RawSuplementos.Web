import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import { getBusinessIdentity, getStoredUser } from "../utils/session";

function Sidebar({
  menuAbierto,
  cerrarMenu,
}) {
  const navigate = useNavigate();

  const usuario = getStoredUser();
  const { nombre: nombreNegocio, logoUrl, iniciales } = getBusinessIdentity();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    cerrarMenu();

    navigate("/");
  };

  const handleNavegacion = () => {
    cerrarMenu();
  };

  return (
    <aside
      className={`sidebar ${
        menuAbierto
          ? "sidebar-mobile-open"
          : ""
      }`}
    >

      <div className="sidebar-brand">

        <div className="sidebar-logo">
          {logoUrl ? (
            <img src={logoUrl} alt={nombreNegocio} className="sidebar-logo-image" />
          ) : (
            iniciales
          )}
        </div>

        <div className="sidebar-brand-text">

          <h2>{nombreNegocio}</h2>

          <span>
            {usuario.nombre ||
              "Usuario"}
          </span>

        </div>

        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={cerrarMenu}
        >
          ×
        </button>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/dashboard"
          onClick={handleNavegacion}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/ventas"
          onClick={handleNavegacion}
        >
          Ventas
        </NavLink>

        <NavLink
          to="/ventas/nueva"
          onClick={handleNavegacion}
        >
          Nueva Venta
        </NavLink>

        <NavLink
          to="/clientes"
          onClick={handleNavegacion}
        >
          Clientes
        </NavLink>

        <NavLink
          to="/cuentas-por-cobrar"
          onClick={handleNavegacion}
        >
          Cuentas por Cobrar
        </NavLink>

        <NavLink
          to="/productos"
          onClick={handleNavegacion}
        >
          Productos
        </NavLink>

        <NavLink
          to="/inventario"
          onClick={handleNavegacion}
        >
          Inventario
        </NavLink>

        {usuario.rol === "Admin" && (
          <NavLink
            to="/usuarios"
            onClick={handleNavegacion}
          >
            Usuarios
          </NavLink>
        )}

      </nav>

      <button
        className="sidebar-logout"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

    </aside>
  );
}

export default Sidebar;
