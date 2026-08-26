import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function CuentaCliente() {
  const { clienteId } = useParams();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCuenta();
  }, [clienteId]);

  const cargarCuenta = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get(
        `/CuentasPorCobrar/cliente/${clienteId}`
      );

      setDatos(response.data);
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : "No fue posible cargar la cuenta del cliente."
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

  const claseCobro = (estado) => {
    switch (estado) {
      case "Vencida":
        return "danger";

      case "VenceHoy":
      case "VencePronto":
        return "warning";

      default:
        return "good";
    }
  };

  if (cargando) {
    return (
      <div className="page-container">
        <p>Cargando cuenta...</p>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="page-container">
        <div className="dashboard-error">
          Cuenta no encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header page-header-actions">

        <div>
          <p className="page-eyebrow">
            CUENTAS POR COBRAR
          </p>

          <h1>
            {datos.cliente?.nombre}
          </h1>

          <p>
            {datos.cliente?.telefono}
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary-app"
          onClick={() =>
            navigate("/cuentas-por-cobrar")
          }
        >
          ← Volver
        </button>

      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="collections-client-summary">

        <div className="collections-summary-card dark">
          <span>Saldo pendiente</span>

          <strong>
            {moneda(
              datos.cliente?.saldo
            )}
          </strong>

          <small>
            Cuenta total del cliente
          </small>
        </div>

        <div className="collections-summary-card">
          <span>
            Ventas pendientes
          </span>

          <strong>
            {datos.ventasPendientes || 0}
          </strong>
        </div>

        <div className="collections-summary-card danger">
          <span>
            Vencidas
          </span>

          <strong>
            {datos.ventasVencidas || 0}
          </strong>
        </div>

        <div className="collections-summary-card warning">
          <span>
            Vencen hoy
          </span>

          <strong>
            {datos.ventasVenceHoy || 0}
          </strong>
        </div>

      </div>

      <div className="content-card">

        <div className="section-heading">
          <h2>
            Ventas pendientes
          </h2>

          <p>
            Selecciona una venta para
            registrar un abono.
          </p>
        </div>

        {!datos.ventas ||
        datos.ventas.length === 0 ? (
          <div className="empty-state">
            Este cliente no tiene ventas pendientes.
          </div>
        ) : (
          <div className="table-responsive">

            <table className="app-table">

              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Fecha</th>
                  <th>Vencimiento</th>
                  <th>Total</th>
                  <th>Pagado</th>
                  <th>Pendiente</th>
                  <th>Estado cobro</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {datos.ventas.map(
                  (venta) => (
                    <tr
                      key={venta.id}
                      className="collections-row"
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
                        {fecha(venta.fecha)}
                      </td>

                      <td>
                        {fecha(
                          venta.fechaVencimiento
                        )}
                      </td>

                      <td>
                        {moneda(
                          venta.total
                        )}
                      </td>

                      <td className="sales-paid">
                        {moneda(
                          venta.pagado
                        )}
                      </td>

                      <td>
                        <strong className="sales-debt">
                          {moneda(
                            venta.pendiente
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`collection-status ${claseCobro(
                            venta.estadoCobro
                          )}`}
                        >
                          {
                            venta.estadoCobro
                          }
                        </span>

                        {venta.diasAtraso >
                          0 && (
                          <div className="table-secondary">
                            {
                              venta.diasAtraso
                            }{" "}
                            días de atraso
                          </div>
                        )}

                        {venta.diasParaVencer >
                          0 && (
                          <div className="table-secondary">
                            Vence en{" "}
                            {
                              venta.diasParaVencer
                            }{" "}
                            días
                          </div>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="table-action"
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(
                              `/ventas/${venta.id}`
                            );
                          }}
                        >
                          Abrir
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

export default CuentaCliente;