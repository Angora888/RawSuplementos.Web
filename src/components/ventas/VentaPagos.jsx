import { formatCRC, formatDateTime } from "../../utils/formatters";

function VentaPagos({ pagos = [] }) {
  return (
    <div className="content-card sale-detail-section">
      <div className="section-heading">
        <h2>Historial de pagos</h2>
        <p>Pagos iniciales y abonos registrados.</p>
      </div>
      {pagos.length === 0 ? (
        <div className="empty-state">Esta venta todavía no tiene pagos.</div>
      ) : (
        <div className="table-responsive">
          <table className="app-table">
            <thead><tr><th>Fecha</th><th>Monto</th><th>Método</th><th>Referencia</th><th>Registrado por</th></tr></thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>{formatDateTime(pago.fecha)}</td>
                  <td><strong className="sales-paid">{formatCRC(pago.monto)}</strong></td>
                  <td>{pago.metodoPago}</td>
                  <td>{pago.referencia || "-"}</td>
                  <td>{pago.registradoPor || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VentaPagos;
