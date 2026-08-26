import { useEffect, useState } from "react";
import api from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    notas: "",
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setCargando(true);

      const response = await api.get("/Clientes");

      setClientes(response.data);
      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cargar los clientes."
      );
    } finally {
      setCargando(false);
    }
  };

  const buscarClientes = async () => {
    if (!busqueda.trim()) {
      cargarClientes();
      return;
    }

    try {
      setCargando(true);

      const response = await api.get(
        `/Clientes/buscar?texto=${encodeURIComponent(
          busqueda
        )}`
      );

      setClientes(response.data);
      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible realizar la búsqueda."
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    cargarClientes();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const crearCliente = async (e) => {
    e.preventDefault();

    try {
      await api.post("/Clientes", {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion:
          form.direccion.trim() || null,
        notas:
          form.notas.trim() || null,
      });

      setForm({
        nombre: "",
        telefono: "",
        direccion: "",
        notas: "",
      });

      setMostrarFormulario(false);

      await cargarClientes();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data ||
          "No fue posible crear el cliente."
      );
    }
  };

  const moneda = (valor) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(valor || 0);
  };

  return (
    <div className="page-container">
      <div className="page-header page-header-actions">
        <div>
          <p className="page-eyebrow">
            CLIENTES
          </p>

          <h1>Clientes</h1>

          <p>
            Administra clientes, teléfonos y
            saldos pendientes.
          </p>
        </div>

        <button
          className="btn-primary-app"
          onClick={() =>
            setMostrarFormulario(true)
          }
        >
          + Nuevo cliente
        </button>
      </div>

      <div className="content-card">
        <div className="search-row">
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                buscarClientes();
              }
            }}
          />

          <button
            className="btn-dark-app"
            onClick={buscarClientes}
          >
            Buscar
          </button>

          {busqueda && (
            <button
              className="btn-secondary-app"
              onClick={limpiarBusqueda}
            >
              Limpiar
            </button>
          )}
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {cargando ? (
          <p>Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <div className="empty-state">
            No hay clientes para mostrar.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Saldo</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <strong>
                        {cliente.nombre}
                      </strong>
                    </td>

                    <td>
                      {cliente.telefono}
                    </td>

                    <td>
                      {cliente.direccion || "-"}
                    </td>

                    <td>
                      <strong
                        className={
                          cliente.saldo > 0
                            ? "text-debt"
                            : ""
                        }
                      >
                        {moneda(cliente.saldo)}
                      </strong>
                    </td>

                    <td>
                      {cliente.activo ? (
                        <span className="badge-status active">
                          Activo
                        </span>
                      ) : (
                        <span className="badge-status inactive">
                          Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
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
                <h2>Nuevo cliente</h2>
                <p>
                  Registra un nuevo cliente.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setMostrarFormulario(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={crearCliente}>
              <div className="form-group">
                <label>Nombre</label>

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>

                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>

                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Notas</label>

                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  rows="3"
                />
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
                  Guardar cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;