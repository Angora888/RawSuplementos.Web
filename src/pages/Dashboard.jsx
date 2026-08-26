import { useEffect, useState } from "react";
import api from "../services/api";

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

      const response = await api.get("/Dashboard");

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

  if (cargando) {
    return (
      <div className="page-container">
        <p>Cargando dashboard...</p>
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

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            RESUMEN GENERAL
          </p>

          <h1>Dashboard</h1>

          <p>
            Estado actual de RAW Suplementos
          </p>
        </div>
      </div>

      <section className="dashboard-grid">

        <div className="stat-card">
          <span>Ventas hoy</span>

          <strong>
            {moneda(datos?.ventas?.hoy)}
          </strong>

          <small>
            {datos?.ventas?.cantidadHoy || 0} ventas
          </small>
        </div>

        <div className="stat-card">
          <span>Ganancia hoy</span>

          <strong>
            {moneda(datos?.ganancias?.hoy)}
          </strong>

          <small>
            Ganancia estimada
          </small>
        </div>

        <div className="stat-card">
          <span>Pagos recibidos</span>

          <strong>
            {moneda(datos?.pagos?.hoy)}
          </strong>

          <small>
            {datos?.pagos?.cantidadHoy || 0} pagos
          </small>
        </div>

        <div className="stat-card warning-card">
          <span>Por cobrar</span>

          <strong>
            {moneda(
              datos?.cuentasPorCobrar?.total
            )}
          </strong>

          <small>
            {datos?.cuentasPorCobrar
              ?.clientesConDeuda || 0} clientes
          </small>
        </div>

        <div className="stat-card">
          <span>Ventas del mes</span>

          <strong>
            {moneda(datos?.ventas?.mes)}
          </strong>

          <small>
            {datos?.ventas?.cantidadMes || 0} ventas
          </small>
        </div>

        <div className="stat-card">
          <span>Ganancia del mes</span>

          <strong>
            {moneda(datos?.ganancias?.mes)}
          </strong>

          <small>
            Acumulado mensual
          </small>
        </div>

        <div className="stat-card danger-card">
          <span>Ventas vencidas</span>

          <strong>
            {datos?.cuentasPorCobrar
              ?.ventasVencidas || 0}
          </strong>

          <small>
            {datos?.cuentasPorCobrar
              ?.vencenHoy || 0} vencen hoy
          </small>
        </div>

        <div className="stat-card">
          <span>Stock bajo</span>

          <strong>
            {datos?.inventario?.stockBajo || 0}
          </strong>

          <small>
            {datos?.inventario?.sinStock || 0}
            {" "}sin stock
          </small>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;