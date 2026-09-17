import { useEffect, useState } from "react";
import api from "../services/api";

function LandingSettings({ onClose, onSaved }) {
  const [form, setForm] = useState({ tituloLanding: "", descripcionLanding: "", logoUrl: "", whatsApp: "", colorPrimario: "#5267df", colorSecundario: "#172033" });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/Configuracion/landing").then(({ data }) => {
      setForm({
        tituloLanding: data.tituloLanding || "",
        descripcionLanding: data.descripcionLanding || "",
        logoUrl: data.logoUrl || "",
        whatsApp: data.whatsApp || "",
        colorPrimario: data.colorPrimario || "#5267df",
        colorSecundario: data.colorSecundario || "#172033",
      });
    }).catch(() => setError("No fue posible cargar la configuración.")).finally(() => setCargando(false));
  }, []);

  const cambiar = (e) => setForm((actual) => ({ ...actual, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    try {
      setGuardando(true); setError(""); setMensaje("");
      const { data } = await api.put("/Configuracion/landing", form);
      setMensaje("✓ Página actualizada correctamente");
      onSaved?.(data.negocio);
    } catch (err) {
      setError(typeof err.response?.data === "string" ? err.response.data : "No fue posible guardar los cambios.");
    } finally { setGuardando(false); }
  };

  return (
    <div className="landing-settings-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="landing-settings-modal">
        <div className="landing-settings-head"><div><span>MI PÁGINA</span><h2>Personalizar página pública</h2><p>Estos datos son los que verán tus clientes.</p></div><button type="button" onClick={onClose}>×</button></div>
        {cargando ? <div className="landing-settings-loading">Cargando...</div> : (
          <form onSubmit={guardar} className="landing-settings-form">
            <label>Título principal<input name="tituloLanding" maxLength="180" value={form.tituloLanding} onChange={cambiar} placeholder="Ej: Todo lo que necesitas, cerca de ti." /></label>
            <label>Descripción<textarea name="descripcionLanding" maxLength="500" rows="4" value={form.descripcionLanding} onChange={cambiar} placeholder="Cuéntales a tus clientes qué pueden encontrar en tu negocio." /></label>
            <label>Logo (URL)<input name="logoUrl" maxLength="500" value={form.logoUrl} onChange={cambiar} placeholder="https://..." /></label>
            <label>WhatsApp<input name="whatsApp" maxLength="20" value={form.whatsApp} onChange={cambiar} placeholder="50688888888" /></label>
            <div className="landing-color-grid">
              <label>Color principal<div className="landing-color-input"><input type="color" name="colorPrimario" value={form.colorPrimario} onChange={cambiar} /><span>{form.colorPrimario}</span></div></label>
              <label>Color secundario<div className="landing-color-input"><input type="color" name="colorSecundario" value={form.colorSecundario} onChange={cambiar} /><span>{form.colorSecundario}</span></div></label>
            </div>
            {error && <div className="landing-settings-error">{error}</div>}{mensaje && <div className="landing-settings-success">{mensaje}</div>}
            <div className="landing-settings-actions"><button type="button" onClick={onClose}>Cancelar</button><button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar cambios"}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LandingSettings;