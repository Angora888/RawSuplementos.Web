import { formatCRC } from "../../utils/formatters";

function VentaProductos({ detalles = [] }) {
  return (
    <div className="content-card sale-detail-section">
      <div className="section-heading">
        <h2>Productos</h2>
        <p>Detalle de artículos vendidos.</p>
      </div>
      <div className="table-responsive">
        <table className="app-table">
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {detalles.map((detalle) => (
              <tr key={detalle.id}>
                <td>
                  <strong>{detalle.producto}</strong>
                  {detalle.marca && <div className="table-secondary">{detalle.marca}</div>}
                </td>
                <td>{detalle.cantidad}</td>
                <td>{formatCRC(detalle.precioUnitario)}</td>
                <td><strong>{formatCRC(detalle.subtotal)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VentaProductos;
