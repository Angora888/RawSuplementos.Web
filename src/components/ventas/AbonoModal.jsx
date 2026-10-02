import { formatCRC } from "../../utils/formatters";

function AbonoModal({ pendiente, abono, guardando, onChange, onSubmit, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="app-modal">
        <div className="modal-header-app">
          <div><h2>Registrar abono</h2><p>Saldo actual: <strong>{formatCRC(pendiente)}</strong></p></div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group"><label>Monto</label><input type="number" name="monto" value={abono.monto} onChange={onChange} min="1" max={pendiente} required /></div>
          <div className="form-group">
            <label>Método de pago</label>
            <select name="metodoPago" value={abono.metodoPago} onChange={onChange}>
              <option value="Efectivo">Efectivo</option><option value="SINPE">SINPE</option><option value="Transferencia">Transferencia</option><option value="Tarjeta">Tarjeta</option><option value="Otro">Otro</option>
            </select>
          </div>
          <div className="form-group"><label>Referencia</label><input type="text" name="referencia" value={abono.referencia} onChange={onChange} placeholder="Opcional" /></div>
          <div className="form-group"><label>Notas</label><textarea name="notas" value={abono.notas} onChange={onChange} rows="3" /></div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary-app" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary-app" disabled={guardando}>{guardando ? "Guardando..." : "Registrar abono"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AbonoModal;
