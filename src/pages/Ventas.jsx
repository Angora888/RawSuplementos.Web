import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatCRC, formatDateTime, getSaleStatusClass, getApiErrorMessage } from "../utils/formatters";

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

  const cargarVentas = useCallback(async (
    filtrosActuales = filtros
  ) => {
    try {
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

setVentas(
        response.data?.ventas || []
      );
      setError("");
    } catch (error) {
      console.error(error);

      setError(getApiErrorMessage(error, "No fue posible cargar las ventas."));
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  useEffect(() => {
    // Intentional: load remote data when this screen mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarVentas();
  }, [cargarVentas]);

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
                        {formatDateTime(venta.fecha)}
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
                          {formatCRC(venta.total)}
                        </strong>
                      </td>

                      <td className="sales-paid">
                        {formatCRC(venta.pagado)}
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
                          {formatCRC(venta.pendiente)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`sale-status ${getSaleStatusClass(venta.estado)}`}
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