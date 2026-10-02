import { formatCRC, formatDate, formatDateTime, getSaleStatusClass } from "../../utils/formatters";

function VentaResumen({ venta, onAbonar, onAnular }) {
  const puedeAbonar =
    venta.estado !== "Pagada" &&
    venta.estado !== "Anulada" &&
    venta.pendiente > 0;
  const puedeAnular = venta.estado !== "Anulada";

  return (
    <div className="sale-detail-grid">
      <div className="content-card sale-detail-main">
        <div className="sale-detail-header">
          <div>
            <span className="sale-detail-label">Cliente</span>
            <h2>{venta.cliente?.nombre}</h2>
            <p>{venta.cliente?.telefono}</p>
            {venta.cliente?.direccion && <p>{venta.cliente.direccion}</p>}
          </div>
          <span className={`sale-status ${getSaleStatusClass(venta.estado)}`}>
            {venta.estado}
          </span>
        </div>

        <div className="sale-detail-info-grid">
          <div><span>Fecha</span><strong>{formatDateTime(venta.fecha)}</strong></div>
          <div><span>Vencimiento</span><strong>{formatDate(venta.fechaVencimiento)}</strong></div>
          <div><span>Registrada por</span><strong>{venta.usuario?.nombre || "-"}</strong></div>
        </div>

        {venta.notas && (
          <div className="sale-notes">
            <strong>Notas</strong>
            <p>{venta.notas}</p>
          </div>
        )}
      </div>

      <div className="content-card sale-detail-summary">
        <div className="sale-total-row"><span>Subtotal</span><strong>{formatCRC(venta.subtotal)}</strong></div>
        <div className="sale-total-row"><span>Descuento</span><strong>{formatCRC(venta.descuento)}</strong></div>
        <div className="sale-total-row sale-total-main"><span>Total</span><strong>{formatCRC(venta.total)}</strong></div>
        <hr />
        <div className="sale-total-row"><span>Pagado</span><strong className="sales-paid">{formatCRC(venta.totalPagado)}</strong></div>
        <div className="sale-total-row">
          <span>Pendiente</span>
          <strong className={venta.pendiente > 0 ? "sales-debt" : ""}>{formatCRC(venta.pendiente)}</strong>
        </div>

        <div className="sale-detail-actions">
          {puedeAbonar && <button type="button" className="btn-primary-app" onClick={onAbonar}>Registrar abono</button>}
          {puedeAnular && <button type="button" className="btn-danger-app" onClick={onAnular}>Anular venta</button>}
        </div>
      </div>
    </div>
  );
}

export default VentaResumen;
