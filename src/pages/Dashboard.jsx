import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setCargando(true);

      const response =
        await api.get("/Dashboard");

      setDatos(response.data);
      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cargar el dashboard."
      );
    } finally {
      setCargando(false);
    }
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

  const plural = (
    cantidad,
    singular,
    pluralTexto
  ) => {
    return cantidad === 1
      ? singular
      : pluralTexto;
  };

  if (cargando) {
    return (
      <div className="page-container">
        <div className="dashboard-loading">
          Cargando dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  const ventasHoy =
    datos?.ventas?.hoy || 0;

  const cantidadVentasHoy =
    datos?.ventas?.cantidadHoy || 0;

  const ventasMes =
    datos?.ventas?.mes || 0;

  const cantidadVentasMes =
    datos?.ventas?.cantidadMes || 0;

  const gananciaHoy =
    datos?.ganancias?.hoy || 0;

  const gananciaMes =
    datos?.ganancias?.mes || 0;

  const pagosHoy =
    datos?.pagos?.hoy || 0;

  const cantidadPagosHoy =
    datos?.pagos?.cantidadHoy || 0;

  const totalPorCobrar =
    datos?.cuentasPorCobrar?.total || 0;

  const clientesConDeuda =
    datos?.cuentasPorCobrar
      ?.clientesConDeuda || 0;

  const ventasPendientes =
    datos?.cuentasPorCobrar
      ?.ventasPendientes || 0;

  const ventasVencidas =
    datos?.cuentasPorCobrar
      ?.ventasVencidas || 0;

  const vencenHoy =
    datos?.cuentasPorCobrar
      ?.vencenHoy || 0;

  const stockBajo =
    datos?.inventario?.stockBajo || 0;

  const sinStock =
    datos?.inventario?.sinStock || 0;

  const totalClientes =
    datos?.clientes?.total || 0;

  return (
    <div className="page-container dashboard-page">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="dashboard-top">

        <div>
          <p className="dashboard-eyebrow">
            RESUMEN GENERAL
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Estado actual de RAW Suplementos
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh"
          onClick={cargarDashboard}
        >
          ↻ Actualizar
        </button>

      </div>

      {/* ========================= */}
      {/* CARDS PRINCIPALES */}
      {/* ========================= */}

      <section className="dashboard-cards-grid">

        <div className="dashboard-card red">

          <div className="dashboard-card-header">
            <div className="dashboard-icon red">
              🛒
            </div>

            <span>
              Ventas hoy
            </span>
          </div>

          <strong className="dashboard-card-value">
            {moneda(ventasHoy)}
          </strong>

          <small>
            {cantidadVentasHoy}{" "}
            {plural(
              cantidadVentasHoy,
              "venta",
              "ventas"
            )}
          </small>

          <div className="dashboard-card-footer neutral">
            Actividad del día
          </div>

        </div>

        <div className="dashboard-card green">

          <div className="dashboard-card-header">
            <div className="dashboard-icon green">
              ↗
            </div>

            <span>
              Ganancia hoy
            </span>
          </div>

          <strong className="dashboard-card-value">
            {moneda(gananciaHoy)}
          </strong>

          <small>
            Ganancia estimada
          </small>

          <div className="dashboard-card-footer success">
            Rentabilidad de hoy
          </div>

        </div>

        <div className="dashboard-card blue">

          <div className="dashboard-card-header">
            <div className="dashboard-icon blue">
              💳
            </div>

            <span>
              Pagos recibidos
            </span>
          </div>

          <strong className="dashboard-card-value">
            {moneda(pagosHoy)}
          </strong>

          <small>
            {cantidadPagosHoy}{" "}
            {plural(
              cantidadPagosHoy,
              "pago",
              "pagos"
            )}
          </small>

          <div className="dashboard-card-footer info">
            Cobros registrados hoy
          </div>

        </div>

        <div className="dashboard-card red">

          <div className="dashboard-card-header">
            <div className="dashboard-icon red">
              👤
            </div>

            <span>
              Por cobrar
            </span>
          </div>

          <strong className="dashboard-card-value debt-value">
            {moneda(totalPorCobrar)}
          </strong>

          <small>
            {clientesConDeuda}{" "}
            {plural(
              clientesConDeuda,
              "cliente",
              "clientes"
            )}
          </small>

          <div
            className={
              totalPorCobrar > 0
                ? "dashboard-card-footer danger"
                : "dashboard-card-footer success"
            }
          >
            {totalPorCobrar > 0
              ? "Atención requerida"
              : "Sin cuentas pendientes"}
          </div>

        </div>

        <div className="dashboard-card purple">

          <div className="dashboard-card-header">
            <div className="dashboard-icon purple">
              🛍
            </div>

            <span>
              Ventas del mes
            </span>
          </div>

          <strong className="dashboard-card-value">
            {moneda(ventasMes)}
          </strong>

          <small>
            {cantidadVentasMes}{" "}
            {plural(
              cantidadVentasMes,
              "venta",
              "ventas"
            )}
          </small>

          <div className="dashboard-card-footer purple">
            Acumulado mensual
          </div>

        </div>

        <div className="dashboard-card green">

          <div className="dashboard-card-header">
            <div className="dashboard-icon green">
              💵
            </div>

            <span>
              Ganancia del mes
            </span>
          </div>

          <strong className="dashboard-card-value">
            {moneda(gananciaMes)}
          </strong>

          <small>
            Acumulado mensual
          </small>

          <div className="dashboard-card-footer success">
            Ganancia estimada
          </div>

        </div>

        <div className="dashboard-card orange">

          <div className="dashboard-card-header">
            <div className="dashboard-icon orange">
              📅
            </div>

            <span>
              Ventas vencidas
            </span>
          </div>

          <strong className="dashboard-card-value overdue-value">
            {ventasVencidas}
          </strong>

          <small>
            {vencenHoy} vencen hoy
          </small>

          <div
            className={
              ventasVencidas > 0
                ? "dashboard-card-footer danger"
                : "dashboard-card-footer success"
            }
          >
            {ventasVencidas > 0
              ? "Revisar pendientes"
              : "Todo al día"}
          </div>

        </div>

        <div className="dashboard-card yellow">

          <div className="dashboard-card-header">
            <div className="dashboard-icon yellow">
              📦
            </div>

            <span>
              Stock bajo
            </span>
          </div>

          <strong className="dashboard-card-value">
            {stockBajo}
          </strong>

          <small>
            {sinStock} sin stock
          </small>

          <div
            className={
              stockBajo > 0
                ? "dashboard-card-footer warning"
                : "dashboard-card-footer success"
            }
          >
            {stockBajo > 0
              ? "Revisar inventario"
              : "Inventario saludable"}
          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* BLOQUES INFERIORES */}
      {/* ========================= */}

      <section className="dashboard-bottom-grid">

        {/* RESUMEN */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">
            <span className="dashboard-panel-icon">
              ◷
            </span>

            <h2>
              Resumen rápido
            </h2>
          </div>

          <div className="dashboard-summary-list">

            <div>
              <span>
                Ventas del mes
              </span>

              <strong>
                {moneda(ventasMes)}
              </strong>
            </div>

            <div>
              <span>
                Ganancia del mes
              </span>

              <strong>
                {moneda(gananciaMes)}
              </strong>
            </div>

            <div>
              <span>
                Clientes registrados
              </span>

              <strong>
                {totalClientes}
              </strong>
            </div>

            <div>
              <span>
                Clientes con deuda
              </span>

              <strong>
                {clientesConDeuda}
              </strong>
            </div>

            <div>
              <span>
                Ventas pendientes
              </span>

              <strong>
                {ventasPendientes}
              </strong>
            </div>

            <div>
              <span>
                Productos sin stock
              </span>

              <strong>
                {sinStock}
              </strong>
            </div>

          </div>

        </div>

        {/* ALERTAS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">
            <span className="dashboard-panel-icon">
              🔔
            </span>

            <h2>
              Alertas
            </h2>
          </div>

          <div className="dashboard-alert-list">

            <div
              className={
                clientesConDeuda > 0
                  ? "dashboard-alert danger"
                  : "dashboard-alert success"
              }
            >
              <div>
                <strong>
                  Clientes con deuda
                </strong>

                <span>
                  {clientesConDeuda > 0
                    ? `${clientesConDeuda} cliente(s) con cuentas pendientes.`
                    : "No hay clientes con deuda."}
                </span>
              </div>
            </div>

            <div
              className={
                ventasVencidas > 0
                  ? "dashboard-alert danger"
                  : "dashboard-alert success"
              }
            >
              <div>
                <strong>
                  Ventas vencidas
                </strong>

                <span>
                  {ventasVencidas > 0
                    ? `${ventasVencidas} venta(s) requieren seguimiento.`
                    : "No tienes ventas vencidas."}
                </span>
              </div>
            </div>

            <div
              className={
                stockBajo > 0
                  ? "dashboard-alert warning"
                  : "dashboard-alert success"
              }
            >
              <div>
                <strong>
                  Stock bajo
                </strong>

                <span>
                  {stockBajo > 0
                    ? `${stockBajo} producto(s) requieren reposición.`
                    : "No hay productos con stock bajo."}
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;