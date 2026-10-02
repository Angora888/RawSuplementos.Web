import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AbonoModal from "../components/ventas/AbonoModal";
import AnularVentaModal from "../components/ventas/AnularVentaModal";
import VentaPagos from "../components/ventas/VentaPagos";
import VentaProductos from "../components/ventas/VentaProductos";
import VentaResumen from "../components/ventas/VentaResumen";
import api from "../services/api";
import { formatDateTime, getApiErrorMessage } from "../utils/formatters";

const abonoInicial = {
  monto: "",
  metodoPago: "Efectivo",
  referencia: "",
  notas: "",
};

function VentaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarAbono, setMostrarAbono] = useState(false);
  const [mostrarAnular, setMostrarAnular] = useState(false);
  const [abono, setAbono] = useState(abonoInicial);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");

  const cargarVenta = async () => {
    try {
      setCargando(true);
      setError("");
      const response = await api.get(`/Ventas/${id}`);
      setVenta(response.data);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "No fue posible cargar la venta."));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVenta();
  }, [id]);

  const handleAbono = (event) => {
    const { name, value } = event.target;
    setAbono((actual) => ({ ...actual, [name]: value }));
  };

  const registrarAbono = async (event) => {
    event.preventDefault();
    const monto = Number(abono.monto);

    if (!monto || monto <= 0) {
      setError("El monto del abono debe ser mayor a cero.");
      return;
    }

    if (monto > venta.pendiente) {
      setError("El abono no puede ser mayor al saldo pendiente.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await api.post(`/Ventas/${id}/abonos`, {
        monto,
        metodoPago: abono.metodoPago,
        referencia: abono.referencia.trim() || null,
        notas: abono.notas.trim() || null,
      });

      setMostrarAbono(false);
      setAbono(abonoInicial);
      setMensaje("Abono registrado correctamente.");
      await cargarVenta();
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "No fue posible registrar el abono."));
    } finally {
      setGuardando(false);
    }
  };

  const anularVenta = async (event) => {
    event.preventDefault();

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await api.post(`/Ventas/${id}/anular`, {
        motivo: motivoAnulacion.trim() || null,
      });

      setMostrarAnular(false);
      setMotivoAnulacion("");
      setMensaje("Venta anulada correctamente.");
      await cargarVenta();
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "No fue posible anular la venta."));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="page-container"><p>Cargando venta...</p></div>;
  }

  if (!venta) {
    return (
      <div className="page-container">
        <div className="dashboard-error">{error || "Venta no encontrada."}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header page-header-actions">
        <div>
          <p className="page-eyebrow">VENTAS</p>
          <h1>Venta #{venta.id}</h1>
          <p>{venta.cliente?.nombre} · {formatDateTime(venta.fecha)}</p>
        </div>
        <button type="button" className="btn-secondary-app" onClick={() => navigate("/ventas")}>
          ← Volver
        </button>
      </div>

      {error && <div className="dashboard-error">{error}</div>}
      {mensaje && <div className="success-message">{mensaje}</div>}

      <VentaResumen
        venta={venta}
        onAbonar={() => setMostrarAbono(true)}
        onAnular={() => setMostrarAnular(true)}
      />
      <VentaProductos detalles={venta.detalles} />
      <VentaPagos pagos={venta.pagos} />

      {mostrarAbono && (
        <AbonoModal
          pendiente={venta.pendiente}
          abono={abono}
          guardando={guardando}
          onChange={handleAbono}
          onSubmit={registrarAbono}
          onClose={() => setMostrarAbono(false)}
        />
      )}

      {mostrarAnular && (
        <AnularVentaModal
          ventaId={venta.id}
          motivo={motivoAnulacion}
          guardando={guardando}
          onMotivoChange={setMotivoAnulacion}
          onSubmit={anularVenta}
          onClose={() => setMostrarAnular(false)}
        />
      )}
    </div>
  );
}

export default VentaDetalle;
