import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function VentaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venta, setVenta] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarAbono, setMostrarAbono] =
    useState(false);

  const [mostrarAnular, setMostrarAnular] =
    useState(false);

  const [abono, setAbono] = useState({
    monto: "",
    metodoPago: "Efectivo",
    referencia: "",
    notas: "",
  });

  const [motivoAnulacion, setMotivoAnulacion] =
    useState("");

  useEffect(() => {
    cargarVenta();
  }, [id]);

  const cargarVenta = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get(
        `/Ventas/${id}`
      );

      setVenta(response.data);
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : "No fue posible cargar la venta."
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

    return new Date(valor).toLocaleString("es-CR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const fechaSoloDia = (valor) => {
    if (!valor) {
      return "-";
    }

    return new Date(valor).toLocaleDateString("es-CR", {
      dateStyle: "medium",
    });
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado?.toLowerCase()) {
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

  const handleAbono = (e) => {
    const { name, value } = e.target;

    setAbono((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registrarAbono = async (e) => {
    e.preventDefault();

    const monto = Number(abono.monto);

    if (!monto || monto <= 0) {
      setError(
        "El monto del abono debe ser mayor a cero."
      );
      return;
    }

    if (monto > venta.pendiente) {
      setError(
        "El abono no puede ser mayor al saldo pendiente."
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await api.post(
        `/Ventas/${id}/abonos`,
        {
          monto,
          metodoPago: abono.metodoPago,

          referencia:
            abono.referencia.trim() || null,

          notas:
            abono.notas.trim() || null,
        }
      );

      setMostrarAbono(false);

      setAbono({
        monto: "",
        metodoPago: "Efectivo",
        referencia: "",
        notas: "",
      });

      setMensaje(
        "Abono registrado correctamente."
      );

      await cargarVenta();
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.mensaje ||
            "No fue posible registrar el abono."
      );
    } finally {
      setGuardando(false);
    }
  };

  const anularVenta = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await api.post(
        `/Ventas/${id}/anular`,
        {
          motivo:
            motivoAnulacion.trim() || null,
        }
      );

      setMostrarAnular(false);
      setMotivoAnulacion("");

      setMensaje(
        "Venta anulada correctamente."
      );

      await cargarVenta();
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.mensaje ||
            "No fue posible anular la venta."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="page-container">
        <p>Cargando venta...</p>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="page-container">
        <div className="dashboard-error">
          Venta no encontrada.
        </div>
      </div>
    );
  }

  const puedeAbonar =
    venta.estado !== "Pagada" &&
    venta.estado !== "Anulada" &&
    venta.pendiente > 0;

  const puedeAnular =
    venta.estado !== "Anulada";

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="page-header page-header-actions">

        <div>
          <p className="page-eyebrow">
            VENTAS
          </p>

          <h1>
            Venta #{venta.id}
          </h1>

          <p>
            {venta.cliente?.nombre}
            {" · "}
            {fecha(venta.fecha)}
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary-app"
          onClick={() =>
            navigate("/ventas")
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

      {mensaje && (
        <div className="success-message">
          {mensaje}
        </div>
      )}

      {/* RESUMEN */}

      <div className="sale-detail-grid">

        <div className="content-card sale-detail-main">

          <div className="sale-detail-header">

            <div>
              <span className="sale-detail-label">
                Cliente
              </span>

              <h2>
                {venta.cliente?.nombre}
              </h2>

              <p>
                {venta.cliente?.telefono}
              </p>

              {venta.cliente?.direccion && (
                <p>
                  {venta.cliente.direccion}
                </p>
              )}
            </div>

            <span
              className={`sale-status ${obtenerClaseEstado(
                venta.estado
              )}`}
            >
              {venta.estado}
            </span>

          </div>

          <div className="sale-detail-info-grid">

            <div>
              <span>
                Fecha
              </span>

              <strong>
                {fecha(venta.fecha)}
              </strong>
            </div>

            <div>
              <span>
                Vencimiento
              </span>

              <strong>
                {fechaSoloDia(
                  venta.fechaVencimiento
                )}
              </strong>
            </div>

            <div>
              <span>
                Registrada por
              </span>

              <strong>
                {venta.usuario?.nombre || "-"}
              </strong>
            </div>

          </div>

          {venta.notas && (
            <div className="sale-notes">
              <strong>
                Notas
              </strong>

              <p>
                {venta.notas}
              </p>
            </div>
          )}

        </div>

        <div className="content-card sale-detail-summary">

          <div className="sale-total-row">
            <span>
              Subtotal
            </span>

            <strong>
              {moneda(venta.subtotal)}
            </strong>
          </div>

          <div className="sale-total-row">
            <span>
              Descuento
            </span>

            <strong>
              {moneda(venta.descuento)}
            </strong>
          </div>

          <div className="sale-total-row sale-total-main">
            <span>
              Total
            </span>

            <strong>
              {moneda(venta.total)}
            </strong>
          </div>

          <hr />

          <div className="sale-total-row">
            <span>
              Pagado
            </span>

            <strong className="sales-paid">
              {moneda(
                venta.totalPagado
              )}
            </strong>
          </div>

          <div className="sale-total-row">
            <span>
              Pendiente
            </span>

            <strong
              className={
                venta.pendiente > 0
                  ? "sales-debt"
                  : ""
              }
            >
              {moneda(
                venta.pendiente
              )}
            </strong>
          </div>

          <div className="sale-detail-actions">

            {puedeAbonar && (
              <button
                type="button"
                className="btn-primary-app"
                onClick={() =>
                  setMostrarAbono(true)
                }
              >
                Registrar abono
              </button>
            )}

            {puedeAnular && (
              <button
                type="button"
                className="btn-danger-app"
                onClick={() =>
                  setMostrarAnular(true)
                }
              >
                Anular venta
              </button>
            )}

          </div>

        </div>

      </div>

      {/* PRODUCTOS */}

      <div className="content-card sale-detail-section">

        <div className="section-heading">
          <h2>
            Productos
          </h2>

          <p>
            Detalle de artículos vendidos.
          </p>
        </div>

        <div className="table-responsive">

          <table className="app-table">

            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>

              {venta.detalles?.map(
                (detalle) => (

                  <tr key={detalle.id}>

                    <td>
                      <strong>
                        {detalle.producto}
                      </strong>

                      {detalle.marca && (
                        <div className="table-secondary">
                          {detalle.marca}
                        </div>
                      )}
                    </td>

                    <td>
                      {detalle.cantidad}
                    </td>

                    <td>
                      {moneda(
                        detalle.precioUnitario
                      )}
                    </td>

                    <td>
                      <strong>
                        {moneda(
                          detalle.subtotal
                        )}
                      </strong>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGOS */}

      <div className="content-card sale-detail-section">

        <div className="section-heading">
          <h2>
            Historial de pagos
          </h2>

          <p>
            Pagos iniciales y abonos registrados.
          </p>
        </div>

        {!venta.pagos ||
        venta.pagos.length === 0 ? (

          <div className="empty-state">
            Esta venta todavía no tiene pagos.
          </div>

        ) : (

          <div className="table-responsive">

            <table className="app-table">

              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Referencia</th>
                  <th>Registrado por</th>
                </tr>
              </thead>

              <tbody>

                {venta.pagos.map(
                  (pago) => (

                    <tr key={pago.id}>

                      <td>
                        {fecha(
                          pago.fecha
                        )}
                      </td>

                      <td>
                        <strong className="sales-paid">
                          {moneda(
                            pago.monto
                          )}
                        </strong>
                      </td>

                      <td>
                        {pago.metodoPago}
                      </td>

                      <td>
                        {pago.referencia ||
                          "-"}
                      </td>

                      <td>
                        {pago.registradoPor ||
                          "-"}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* MODAL ABONO */}

      {mostrarAbono && (

        <div className="modal-overlay">

          <div className="app-modal">

            <div className="modal-header-app">

              <div>
                <h2>
                  Registrar abono
                </h2>

                <p>
                  Saldo actual:{" "}
                  <strong>
                    {moneda(
                      venta.pendiente
                    )}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setMostrarAbono(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={registrarAbono}>

              <div className="form-group">
                <label>
                  Monto
                </label>

                <input
                  type="number"
                  name="monto"
                  value={abono.monto}
                  onChange={handleAbono}
                  min="1"
                  max={venta.pendiente}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Método de pago
                </label>

                <select
                  name="metodoPago"
                  value={
                    abono.metodoPago
                  }
                  onChange={
                    handleAbono
                  }
                >
                  <option value="Efectivo">
                    Efectivo
                  </option>

                  <option value="SINPE">
                    SINPE
                  </option>

                  <option value="Transferencia">
                    Transferencia
                  </option>

                  <option value="Tarjeta">
                    Tarjeta
                  </option>

                  <option value="Otro">
                    Otro
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Referencia
                </label>

                <input
                  type="text"
                  name="referencia"
                  value={
                    abono.referencia
                  }
                  onChange={
                    handleAbono
                  }
                  placeholder="Opcional"
                />
              </div>

              <div className="form-group">
                <label>
                  Notas
                </label>

                <textarea
                  name="notas"
                  value={abono.notas}
                  onChange={handleAbono}
                  rows="3"
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary-app"
                  onClick={() =>
                    setMostrarAbono(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary-app"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : "Registrar abono"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* MODAL ANULAR */}

      {mostrarAnular && (

        <div className="modal-overlay">

          <div className="app-modal sale-cancel-modal">

            <div className="modal-header-app">

              <div>
                <h2>
                  Anular venta #{venta.id}
                </h2>

                <p>
                  Se devolverá el inventario y
                  se revertirá la cuenta del cliente.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setMostrarAnular(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={anularVenta}>

              <div className="sale-cancel-warning">
                Esta acción no elimina la venta.
                Quedará registrada como anulada
                para fines de auditoría.
              </div>

              <div className="form-group">
                <label>
                  Motivo
                </label>

                <textarea
                  value={
                    motivoAnulacion
                  }
                  onChange={(e) =>
                    setMotivoAnulacion(
                      e.target.value
                    )
                  }
                  rows="4"
                  placeholder="Ej: Cliente canceló la compra"
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary-app"
                  onClick={() =>
                    setMostrarAnular(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-danger-app"
                  disabled={guardando}
                >
                  {guardando
                    ? "Anulando..."
                    : "Confirmar anulación"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default VentaDetalle;