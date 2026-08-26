import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CuentasPorCobrar() {
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [clientes, setClientes] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [cuentasResponse, resumenResponse] =
        await Promise.all([
          api.get("/CuentasPorCobrar"),
          api.get("/CuentasPorCobrar/resumen"),
        ]);

      setClientes(
        cuentasResponse.data?.clientes || []
      );

      setResumen(
        resumenResponse.data || null
      );
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : "No fue posible cargar las cuentas por cobrar."
      );
    } finally {
      setCargando(false);
    }
  };

  const moneda = (valor) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(valor || 0);
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

  const clientesFiltrados = clientes.filter(
    (cliente) => {
      if (!busqueda.trim()) {
        return true;
      }

      const texto =
        busqueda.toLowerCase();

      return (
        cliente.nombre
          ?.toLowerCase()
          .includes(texto) ||
        cliente.telefono
          ?.toLowerCase()
          .includes(texto)
      );
    }
  );

  const obtenerEstadoCliente = (cliente) => {
    if (cliente.ventasVencidas > 0) {
      return {
        texto: "Vencida",
        clase: "danger",
      };
    }

    if (cliente.vencenHoy > 0) {
      return {
        texto: "Vence hoy",
        clase: "warning",
      };
    }

    return {
      texto: "Al día",
      clase: "good",
    };
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <p className="page-eyebrow">
          COBROS
        </p>

        <h1>Cuentas por cobrar</h1>

        <p>
          Controla saldos pendientes,
          vencimientos y clientes con deuda.
        </p>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* RESUMEN */}

      <div className="collections-summary-grid">

        <div className="collections-summary-card dark">
          <span>Total por cobrar</span>

          <strong>
            {moneda(
              resumen?.totalPorCobrar
            )}
          </strong>

          <small>
            {resumen?.clientesConDeuda || 0} clientes
          </small>
        </div>

        <div className="collections-summary-card">
          <span>
            Ventas pendientes
          </span>

          <strong>
            {resumen?.ventasPendientes || 0}
          </strong>

          <small>
            Pendientes o parciales
          </small>
        </div>

        <div className="collections-summary-card danger">
          <span>
            Vencidas
          </span>

          <strong>
            {resumen?.ventasVencidas || 0}
          </strong>

          <small>
            Requieren seguimiento
          </small>
        </div>

        <div className="collections-summary-card warning">
          <span>
            Vencen hoy
          </span>

          <strong>
            {resumen?.vencenHoy || 0}
          </strong>

          <small>
            Revisar durante el día
          </small>
        </div>

      </div>

      {/* LISTADO */}

      <div className="content-card">

        <div className="collections-toolbar">

          <div>
            <h2>
              Clientes con saldo
            </h2>

            <p>
              Selecciona un cliente para ver
              sus ventas pendientes.
            </p>
          </div>

          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            placeholder="Buscar cliente..."
          />

        </div>

        {cargando ? (
          <p>
            Cargando cuentas...
          </p>
        ) : clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            No hay clientes con saldo pendiente.
          </div>
        ) : (
          <div className="table-responsive">

            <table className="app-table collections-table">

              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Saldo</th>
                  <th>Ventas pendientes</th>
                  <th>Vencidas</th>
                  <th>Próximo vencimiento</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map(
                  (cliente) => {
                    const estado =
                      obtenerEstadoCliente(
                        cliente
                      );

                    return (
                      <tr
                        key={cliente.id}
                        className="collections-row"
                        onClick={() =>
                          navigate(
                            `/cuentas-por-cobrar/${cliente.id}`
                          )
                        }
                      >
                        <td>
                          <div className="collections-client">
                            <strong>
                              {cliente.nombre}
                            </strong>

                            <span>
                              {cliente.telefono}
                            </span>
                          </div>
                        </td>

                        <td>
                          <strong className="sales-debt">
                            {moneda(
                              cliente.saldo
                            )}
                          </strong>
                        </td>

                        <td>
                          {
                            cliente.ventasPendientes
                          }
                        </td>

                        <td>
                          {
                            cliente.ventasVencidas
                          }
                        </td>

                        <td>
                          {fecha(
                            cliente.proximoVencimiento
                          )}
                        </td>

                        <td>
                          <span
                            className={`collection-status ${estado.clase}`}
                          >
                            {estado.texto}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="table-action"
                            onClick={(e) => {
                              e.stopPropagation();

                              navigate(
                                `/cuentas-por-cobrar/${cliente.id}`
                              );
                            }}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default CuentasPorCobrar;