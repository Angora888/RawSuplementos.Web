import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/superadmin.css";

const estadoInicial = {
  nombre: "",
  slug: "",
  whatsApp: "",
  telefono: "",
  direccion: "",
  logoUrl: "",
  colorPrimario: "#2563eb",
  colorSecundario: "#0f172a",
  adminNombre: "",
  adminEmail: "",
  adminPassword: "",
};

function SuperAdmin() {
  const navigate = useNavigate();
  const [negocios, setNegocios] = useState([]);
  const [form, setForm] = useState(estadoInicial);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token") || usuario?.rol !== "SuperAdmin") {
      navigate("/login", { replace: true });
      return;
    }
    cargarNegocios();
  }, []);

  const cargarNegocios = async () => {
    try {
      setCargando(true);
      setError("");
      const response = await api.get("/SuperAdmin/negocios");
      setNegocios(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        cerrarSesion();
        return;
      }
      setError(e.response?.data || "No fue posible cargar los negocios.");
    } finally {
      setCargando(false);
    }
  };

  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setForm((actual) => ({ ...actual, [name]: value }));
  };

  const generarSlug = () => {
    if (form.slug.trim()) return;
    const slug = form.nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((actual) => ({ ...actual, slug }));
  };

  const crearNegocio = async (e) => {
    e.preventDefault();
    try {
      setGuardando(true);
      setError("");
      setMensaje("");
      await api.post("/SuperAdmin/negocios", form);
      setForm(estadoInicial);
      setMostrarFormulario(false);
      setMensaje("Negocio creado correctamente. Ya puede iniciar sesión con su usuario administrador.");
      await cargarNegocios();
    } catch (e) {
      setError(e.response?.data || "No fue posible crear el negocio.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (negocio) => {
    const accion = negocio.activo ? "desactivar" : "activar";
    if (!window.confirm(`¿Deseas ${accion} ${negocio.nombre}?`)) return;

    try {
      setError("");
      setMensaje("");
      await api.put(`/SuperAdmin/negocios/${negocio.id}/estado`, { activo: !negocio.activo });
      setMensaje(`Negocio ${negocio.activo ? "desactivado" : "activado"} correctamente.`);
      await cargarNegocios();
    } catch (e) {
      setError(e.response?.data || "No fue posible cambiar el estado del negocio.");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  };

  const totalActivos = negocios.filter((n) => n.activo).length;
  const totalUsuarios = negocios.reduce((suma, n) => suma + (n.usuarios || 0), 0);
  const totalVentas = negocios.reduce((suma, n) => suma + (n.ventas || 0), 0);

  return (
    <div className="sa-page">
      <header className="sa-header">
        <div>
          <span className="sa-kicker">PLATAFORMA SaaS</span>
          <h1>Administración de negocios</h1>
          <p>Gestiona clientes, accesos y catálogos desde un solo lugar.</p>
        </div>
        <div className="sa-header-actions">
          <button className="sa-button sa-button-primary" onClick={() => setMostrarFormulario((v) => !v)}>
            {mostrarFormulario ? "Cerrar formulario" : "+ Nuevo negocio"}
          </button>
          <button className="sa-button sa-button-ghost" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>

      <main className="sa-main">
        <section className="sa-stats">
          <article><span>Negocios</span><strong>{negocios.length}</strong><small>registrados</small></article>
          <article><span>Activos</span><strong>{totalActivos}</strong><small>con acceso habilitado</small></article>
          <article><span>Usuarios</span><strong>{totalUsuarios}</strong><small>en toda la plataforma</small></article>
          <article><span>Ventas</span><strong>{totalVentas}</strong><small>registradas por clientes</small></article>
        </section>

        {error && <div className="sa-alert sa-alert-error">{String(error)}</div>}
        {mensaje && <div className="sa-alert sa-alert-success">{mensaje}</div>}

        {mostrarFormulario && (
          <section className="sa-panel sa-form-panel">
            <div className="sa-panel-title">
              <div><span>ONBOARDING</span><h2>Crear nuevo negocio</h2></div>
              <p>El negocio quedará activo y se creará su primer administrador.</p>
            </div>

            <form onSubmit={crearNegocio} className="sa-form">
              <div className="sa-form-section">
                <h3>Datos del negocio</h3>
                <div className="sa-grid">
                  <label>Nombre<input name="nombre" value={form.nombre} onChange={actualizarCampo} onBlur={generarSlug} required placeholder="Ej. Mini Súper La Esquina" /></label>
                  <label>Slug<input name="slug" value={form.slug} onChange={actualizarCampo} required placeholder="mini-super-la-esquina" /></label>
                  <label>WhatsApp<input name="whatsApp" value={form.whatsApp} onChange={actualizarCampo} placeholder="50688888888" /></label>
                  <label>Teléfono<input name="telefono" value={form.telefono} onChange={actualizarCampo} placeholder="88888888" /></label>
                  <label className="sa-wide">Dirección<input name="direccion" value={form.direccion} onChange={actualizarCampo} placeholder="Dirección del negocio" /></label>
                  <label className="sa-wide">Logo URL<input name="logoUrl" value={form.logoUrl} onChange={actualizarCampo} placeholder="https://..." /></label>
                  <label>Color principal<input type="color" name="colorPrimario" value={form.colorPrimario} onChange={actualizarCampo} /></label>
                  <label>Color secundario<input type="color" name="colorSecundario" value={form.colorSecundario} onChange={actualizarCampo} /></label>
                </div>
              </div>

              <div className="sa-form-section">
                <h3>Administrador inicial</h3>
                <div className="sa-grid">
                  <label>Nombre<input name="adminNombre" value={form.adminNombre} onChange={actualizarCampo} required /></label>
                  <label>Correo<input type="email" name="adminEmail" value={form.adminEmail} onChange={actualizarCampo} required /></label>
                  <label>Contraseña<input type="password" name="adminPassword" value={form.adminPassword} onChange={actualizarCampo} minLength="8" required /></label>
                </div>
              </div>

              <div className="sa-form-actions">
                <button type="button" className="sa-button sa-button-ghost" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                <button type="submit" className="sa-button sa-button-primary" disabled={guardando}>{guardando ? "Creando..." : "Crear y activar negocio"}</button>
              </div>
            </form>
          </section>
        )}

        <section className="sa-panel">
          <div className="sa-panel-title">
            <div><span>CLIENTES</span><h2>Negocios registrados</h2></div>
            <button className="sa-refresh" onClick={cargarNegocios}>Actualizar</button>
          </div>

          {cargando ? (
            <div className="sa-empty">Cargando negocios...</div>
          ) : negocios.length === 0 ? (
            <div className="sa-empty">Todavía no hay negocios registrados.</div>
          ) : (
            <div className="sa-business-grid">
              {negocios.map((negocio) => (
                <article className="sa-business" key={negocio.id}>
                  <div className="sa-business-top">
                    <div className="sa-business-logo">
                      {negocio.logoUrl ? <img src={negocio.logoUrl} alt={negocio.nombre} /> : negocio.nombre?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="sa-business-name">
                      <div><h3>{negocio.nombre}</h3><span>/{negocio.slug}</span></div>
                      <span className={`sa-status ${negocio.activo ? "active" : "inactive"}`}>{negocio.activo ? "Activo" : "Inactivo"}</span>
                    </div>
                  </div>

                  <div className="sa-business-metrics">
                    <div><strong>{negocio.usuarios || 0}</strong><span>Usuarios</span></div>
                    <div><strong>{negocio.productos || 0}</strong><span>Productos</span></div>
                    <div><strong>{negocio.clientes || 0}</strong><span>Clientes</span></div>
                    <div><strong>{negocio.ventas || 0}</strong><span>Ventas</span></div>
                  </div>

                  <div className="sa-business-actions">
                    <button onClick={() => window.open(`/catalogo/${negocio.slug}`, "_blank", "noopener,noreferrer")}>Ver catálogo</button>
                    <button className={negocio.activo ? "danger" : "success"} onClick={() => cambiarEstado(negocio)}>{negocio.activo ? "Desactivar" : "Activar"}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SuperAdmin;
