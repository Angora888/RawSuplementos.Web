import { formatCRC } from "../utils/formatters";

export default function SaleSummary({ subtotal, descuento, onDescuentoChange, total, pagoInicial, onPagoInicialChange, metodoPago, onMetodoPagoChange, referenciaPago, onReferenciaPagoChange, pendiente, quedaDeuda, fechaVencimiento, onFechaVencimientoChange, notas, onNotasChange, guardando, onGuardar }) {
  return (
    <aside className="sale-summary">
      <div className="content-card sale-summary-card">
        <div className="section-heading"><h2>Resumen</h2><p>Totales y forma de pago.</p></div>
        <div className="sale-total-row"><span>Subtotal</span><strong>{formatCRC(subtotal)}</strong></div>
        <div className="form-group"><label>Descuento</label><input type="number" min="0" max={subtotal} value={descuento} onChange={(e) => onDescuentoChange(e.target.value)} placeholder="0" /></div>
        <div className="sale-total-row sale-total-main"><span>Total</span><strong>{formatCRC(total)}</strong></div>
        <hr />
        <div className="form-group"><label>Pago inicial</label><input type="number" min="0" max={total} value={pagoInicial} onChange={(e) => onPagoInicialChange(e.target.value)} placeholder="0" /></div>
        <div className="form-group"><label>Método de pago</label><select value={metodoPago} onChange={(e) => onMetodoPagoChange(e.target.value)}><option value="Efectivo">Efectivo</option><option value="SINPE">SINPE</option><option value="Transferencia">Transferencia</option><option value="Tarjeta">Tarjeta</option><option value="Otro">Otro</option></select></div>
        {Number(pagoInicial) > 0 && <div className="form-group"><label>Referencia</label><input type="text" value={referenciaPago} onChange={(e) => onReferenciaPagoChange(e.target.value)} placeholder="Opcional" /></div>}
        <div className={quedaDeuda ? "sale-debt-card debt" : "sale-debt-card paid"}><span>Saldo pendiente</span><strong>{formatCRC(pendiente)}</strong><small>{quedaDeuda ? "La venta quedará a crédito." : "La venta queda pagada."}</small></div>
        {quedaDeuda && <div className="form-group"><label>Fecha de vencimiento</label><input type="date" value={fechaVencimiento} onChange={(e) => onFechaVencimientoChange(e.target.value)} required /></div>}
        <div className="form-group"><label>Notas</label><textarea rows="3" value={notas} onChange={(e) => onNotasChange(e.target.value)} placeholder="Opcional..." /></div>
        <button type="button" className="btn-primary-app sale-save" onClick={onGuardar} disabled={guardando}>{guardando ? "Registrando..." : "Registrar venta"}</button>
      </div>
    </aside>
  );
}
