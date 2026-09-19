import { Navigate } from "react-router-dom";
import { getStoredBusiness } from "../utils/session";

const ADMIN_WHATSAPP = "50660662375";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const negocio = getStoredBusiness();
  const bloqueado = negocio?.bloqueado ?? negocio?.Bloqueado ?? false;

  if (bloqueado) {
    const mensaje = encodeURIComponent("Hola, tengo un pago pendiente de Mi Emprendimiento y deseo habilitar nuevamente mi negocio.");
    return (
      <div className="business-blocked-page">
        <div className="business-blocked-card">
          <div className="business-blocked-icon">🔒</div>
          <h1>Administración temporalmente bloqueada</h1>
          <p>Tu negocio tiene un pago pendiente. Para recuperar el acceso a la administración, contacta al administrador.</p>
          <a className="btn-primary-app" href={`https://wa.me/${ADMIN_WHATSAPP}?text=${mensaje}`} target="_blank" rel="noreferrer">Contactar por WhatsApp</a>
          <button type="button" className="btn-secondary-app" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("usuario"); window.location.replace("/login"); }}>Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
