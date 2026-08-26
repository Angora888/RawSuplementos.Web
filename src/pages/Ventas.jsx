import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Ventas() {
  const navigate = useNavigate();

  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtros, setFiltros] = useState({
    estado: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async (
    filtrosActuales = filtros
  ) => {
    try {
      setCargando(true);
      setError("");

      const params = {};

      if (filtrosActuales.estado) {
        params.estado =
          filtrosActuales.estado;
      }

      if (filtrosActuales.fechaDesde) {
        params.fechaDesde =
          filtrosActuales.fechaDesde;
      }

      if (filtrosActuales.fechaHasta) {
        params.fechaHasta =
          filtrosActuales.fechaHasta;
      }

      const response = await api.get(
        "/Ventas",
        {
          params,
        }
      );

      console.log(
        "Respuesta Ventas:",
        response.data
      );

      setVentas(
        response.data?.ventas || []
      );
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data ===
        "string"
          ? error.response.data
          : "No fue posible cargar las ventas."
      );
    } finally {
      setCargando(false);
    }
  };

  const handleFiltro = (e) => {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buscar = (e) => {
    e.preventDefault();

    cargarVentas();
  };

  const limpiarFiltros = () => {
    const nuevosFiltros = {
      estado: "",
      fechaDesde: "",
      fechaHasta: "",
    };

    setFiltros(nuevosFiltros);

    cargarVentas(nuevosFiltros);
  };

  const moneda = (valor) => {
    return new Intl.NumberFormat(
      "es-CR",
      {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0,
      }
    ).format(valor || 0);
  };

  const fecha = (valor) => {
    if (!valor) {
      return "-";
    }

    return new Date(
      valor
    ).toLocaleString(
      "es-CR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  const obtenerClaseEstado = (
    estado
  ) => {
    switch (
      estado?.toLowerCase()
    ) {
      case "pagada":
        return "paid";

      case "parcial":
        return "partial";

      case "pendiente":
        return "pending";

      case "anulada":
        return "cancelled";

      default:
        return "";
    }
  };

  return (
    <div className="page-container">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="page-header page-header-actions">

        <div>
          <p className="page-eyebrow">
            VENTAS
          </p>

          <h1>Ventas</h1>

          <p>
            Consulta ventas, pagos y
            saldos pendientes.
          </p>
        </div>

        <button
          className="btn-primary-app"
          onClick={() =>
            navigate(
              "/ventas/nueva"
            )
          }
        >
          + Nueva venta
        </button>

      </div>

      {/* ========================= */}
      {/* ERROR */}
      {/* ========================= */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* ========================= */}
      {/* FILTROS */}
      {/* ========================= */}

      <div className="content-card sales-filter-card">

        <form
          className="sales-filters"
          onSubmit={buscar}
        >

          <div className="form-group">
            <label>
              Estado
            </label>

            <select
              name="estado"
              value={
                filtros.estado
              }
              onChange={
                handleFiltro
              }
            >
              <option value="">
                Todos
              </option>

              <option value="Pagada">
                Pagadas
              </option>

              <option value="Parcial">
                Parciales
              </option>

              <option value="Pendiente">
                Pendientes
              </option>

              <option value="Anulada">
                Anuladas
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Desde
            </label>

            <input
              type="date"
              name="fechaDesde"
              value={
                filtros.fechaDesde
              }
              onChange={
                handleFiltro
              }
            />
          </div>

          <div className="form-group">
            <label>
              Hasta
            </label>

            <input
              type="date"
              name="fechaHasta"
              value={
                filtros.fechaHasta
              }
              onChange={
                handleFiltro
              }
            />
          </div>

          <div className="sales-filter-actions">

            <button
              type="submit"
              className="btn-dark-app"
            >
              Buscar
            </button>

            <button
              type="button"
              className="btn-secondary-app"
              onClick={
                limpiarFiltros
              }
            >
              Limpiar
            </button>

          </div>

        </form>

      </div>

      {/* ========================= */}
      {/* LISTADO */}
      {/* ========================= */}

      <div className="content-card sales-list-card">

        <div className="section-heading">

          <h2>
            Historial de ventas
          </h2>

          <p>
            {ventas.length} venta
            {ventas.length !== 1
              ? "s"
              : ""} encontrada
            {ventas.length !== 1
              ? "s"
              : ""}.
          </p>

        </div>

        {cargando ? (

          <p>
            Cargando ventas...
          </p>

        ) : ventas.length === 0 ? (

          <div className="empty-state">
            No hay ventas para mostrar.
          </div>

        ) : (

          <div className="table-responsive">

            <table className="app-table sales-table">

              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Pagado</th>
                  <th>Pendiente</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {ventas.map(
                  (venta) => (

                    <tr
                      key={
                        venta.id
                      }
                      className="sales-row"
                      onClick={() =>
                        navigate(
                          `/ventas/${venta.id}`
                        )
                      }
                    >

                      <td>
                        <strong>
                          #{venta.id}
                        </strong>
                      </td>

                      <td>
                        {fecha(
                          venta.fecha
                        )}
                      </td>

                      <td>
                        <div className="sales-client">

                          <strong>
                            {
                              venta
                                .cliente
                                ?.nombre
                            }
                          </strong>

                          <span>
                            {
                              venta
                                .cliente
                                ?.telefono
                            }
                          </span>

                        </div>
                      </td>

                      <td>
                        <strong>
                          {moneda(
                            venta.total
                          )}
                        </strong>
                      </td>

                      <td className="sales-paid">
                        {moneda(
                          venta.pagado
                        )}
                      </td>

                      <td>
                        <strong
                          className={
                            venta.pendiente >
                            0
                              ? "sales-debt"
                              : ""
                          }
                        >
                          {moneda(
                            venta.pendiente
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`sale-status ${obtenerClaseEstado(
                            venta.estado
                          )}`}
                        >
                          {venta.estado}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="table-action"
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            navigate(
                              `/ventas/${venta.id}`
                            );
                          }}
                        >
                          Ver
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

    </div>
  );
}

export default Ventas;