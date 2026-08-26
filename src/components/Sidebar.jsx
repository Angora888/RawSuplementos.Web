import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function Sidebar({
  menuAbierto,
  cerrarMenu,
}) {
  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    cerrarMenu();

    navigate("/login");
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
          RAW
        </div>

        <div className="sidebar-brand-text">

          <h2>
            RAW Suplementos
          </h2>

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