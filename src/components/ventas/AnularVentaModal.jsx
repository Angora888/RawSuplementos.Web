function AnularVentaModal({ ventaId, motivo, guardando, onMotivoChange, onSubmit, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="app-modal sale-cancel-modal">
        <div className="modal-header-app">
          <div><h2>Anular venta #{ventaId}</h2><p>Se devolverá el inventario y se revertirá la cuenta del cliente.</p></div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="sale-cancel-warning">Esta acción no elimina la venta. Quedará registrada como anulada para fines de auditoría.</div>
          <div className="form-group">
            <label>Motivo</label>
            <textarea value={motivo} onChange={(e) => onMotivoChange(e.target.value)} rows="4" placeholder="Ej: Cliente canceló la compra" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary-app" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-danger-app" disabled={guardando}>{guardando ? "Anulando..." : "Confirmar anulación"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnularVentaModal;
