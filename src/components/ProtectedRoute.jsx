import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { getStoredBusiness, getStoredUser } from "../utils/session";

const ADMIN_WHATSAPP = "50660662375";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const [verificando, setVerificando] = useState(Boolean(token));
  const [bloqueado, setBloqueado] = useState(() => {
    const negocio = getStoredBusiness();
    return negocio?.bloqueado ?? negocio?.Bloqueado ?? false;
  });

  useEffect(() => {
    if (!token) return;
    let activo = true;

    api.get("/Auth/sesion")
      .then(({ data }) => {
        if (!activo) return;
        const negocio = data?.negocio || {};
        const usuario = getStoredUser();
        localStorage.setItem("usuario", JSON.stringify({ ...usuario, negocio }));
        setBloqueado(Boolean(negocio.bloqueado ?? negocio.Bloqueado));
      })
      .catch(() => {})
      .finally(() => activo && setVerificando(false));

    return () => { activo = false; };
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (verificando) return <div className="business-blocked-page"><div className="business-blocked-card"><p>Verificando acceso...</p></div></div>;

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
