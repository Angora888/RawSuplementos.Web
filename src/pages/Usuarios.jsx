import { useEffect, useState } from "react";
import api from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "Vendedor",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError("");

      const response =
        await api.get("/Usuarios");

      setUsuarios(response.data || []);
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : "No fue posible cargar los usuarios."
      );
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMensaje("");

      await api.post(
        "/Auth/registrar",
        {
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          rol: form.rol,
        }
      );

      setForm({
        nombre: "",
        email: "",
        password: "",
        rol: "Vendedor",
      });

      setMostrarFormulario(false);

      setMensaje(
        "Usuario creado correctamente."
      );

      await cargarUsuarios();
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.mensaje ||
            "No fue posible crear el usuario."
      );
    }
  };

  const cambiarEstado = async (usuario) => {
    const nuevoEstado =
      !usuario.activo;

    try {
      setError("");
      setMensaje("");

      await api.put(
        `/Usuarios/${usuario.id}/estado`,
        null,
        {
          params: {
            activo: nuevoEstado,
          },
        }
      );

      setMensaje(
        nuevoEstado
          ? "Usuario activado correctamente."
          : "Usuario desactivado correctamente."
      );

      await cargarUsuarios();
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : "No fue posible cambiar el estado del usuario."
      );
    }
  };

  const fecha = (valor) => {
    if (!valor) {
      return "-";
    }

    return new Date(valor).toLocaleDateString(
      "es-CR",
      {
        dateStyle: "medium",
      }
    );
  };

  return (
    <div className="page-container">

      <div className="page-header page-header-actions">

        <div>
          <p className="page-eyebrow">
            ADMINISTRACIÓN
          </p>

          <h1>Usuarios</h1>

          <p>
            Administra accesos y vendedores
            de RAW Suplementos.
          </p>
        </div>

        <button
          className="btn-primary-app"
          onClick={() =>
            setMostrarFormulario(true)
          }
        >
          + Nuevo usuario
        </button>

      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="success-message">
          {mensaje}
        </div>
      )}

      <div className="content-card">

        <div className="section-heading">
          <h2>
            Usuarios registrados
          </h2>

          <p>
            Solo administradores pueden
            acceder a esta sección.
          </p>
        </div>

        {cargando ? (
          <p>
            Cargando usuarios...
          </p>
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            No hay usuarios registrados.
          </div>
        ) : (
          <div className="table-responsive">

            <table className="app-table">

              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Creado</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {usuarios.map(
                  (usuario) => (

                    <tr key={usuario.id}>

                      <td>
                        <strong>
                          {usuario.nombre}
                        </strong>
                      </td>

                      <td>
                        {usuario.email}
                      </td>

                      <td>
                        <span
                          className={`user-role ${
                            usuario.rol === "Admin"
                              ? "admin"
                              : "seller"
                          }`}
                        >
                          {usuario.rol}
                        </span>
                      </td>

                      <td>
                        {fecha(
                          usuario.fechaCreacion
                        )}
                      </td>

                      <td>
                        <span
                          className={`badge-status ${
                            usuario.activo
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {usuario.activo
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={
                            usuario.activo
                              ? "table-action danger-action"
                              : "table-action"
                          }
                          onClick={() =>
                            cambiarEstado(
                              usuario
                            )
                          }
                        >
                          {usuario.activo
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {mostrarFormulario && (

        <div className="modal-overlay">

          <div className="app-modal">

            <div className="modal-header-app">

              <div>
                <h2>
                  Nuevo usuario
                </h2>

                <p>
                  Crea un acceso para un
                  administrador o vendedor.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setMostrarFormulario(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={crearUsuario}>

              <div className="form-group">
                <label>
                  Nombre
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Rol
                </label>

                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                >
                  <option value="Vendedor">
                    Vendedor
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary-app"
                  onClick={() =>
                    setMostrarFormulario(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary-app"
                >
                  Crear usuario
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Usuarios;