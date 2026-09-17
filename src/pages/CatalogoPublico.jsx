import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/home.css";

function CatalogoPublico() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [productos, setProductos] = useState([]);
  const [negocio, setNegocio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);

  const nombreNegocio = negocio?.nombre || "Catálogo";
  const logoNegocio = negocio?.logoUrl || null;

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        setCargando(true);
        setNoEncontrado(false);
        const response = await api.get(`/Productos/catalogo/${slug}`);
        const data = response.data || {};
        setNegocio(data.negocio || null);
        setProductos(Array.isArray(data.productos) ? data.productos : []);
      } catch (error) {
        console.error("Error cargando catálogo:", error);
        setNegocio(null);
        setProductos([]);
        setNoEncontrado(true);
      } finally {
        setCargando(false);
      }
    };

    if (slug) cargarCatalogo();
  }, [slug]);

  useEffect(() => {
    const root = document.documentElement;
    if (negocio?.colorPrimario) root.style.setProperty("--negocio-color-primario", negocio.colorPrimario);
    if (negocio?.colorSecundario) root.style.setProperty("--negocio-color-secundario", negocio.colorSecundario);
    return () => {
      root.style.removeProperty("--negocio-color-primario");
      root.style.removeProperty("--negocio-color-secundario");
    };
  }, [negocio]);

  const moneda = (valor) => new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(valor || 0);

  const pedirPorWhatsApp = (producto) => {
    const numero = (negocio?.whatsApp || "").replace(/\D/g, "");
    if (!numero) {
      window.alert("Este negocio todavía no tiene WhatsApp configurado.");
      return;
    }

    const detalles = [producto.marca, producto.presentacion, producto.sabor].filter(Boolean).join(" · ");
    const mensaje = [
      `Hola 👋 Quiero pedir este producto de ${nombreNegocio}:`,
      "",
      `Producto: ${producto.nombre}`,
      detalles ? `Detalle: ${detalles}` : null,
      `Precio: ${moneda(producto.precioVenta)}`,
      "",
      "¿Me confirmas disponibilidad, por favor?",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
  };

  if (noEncontrado) {
    return (
      <div className="home-page">
        <div className="home-empty">
          <h2>Negocio no disponible</h2>
          <p>Este catálogo no existe o se encuentra temporalmente desactivado.</p>
          <button className="home-primary-button" onClick={() => navigate("/")}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-navbar">
        <div className="home-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="home-brand-logo">{logoNegocio ? <img src={logoNegocio} alt={nombreNegocio} /> : "RAW"}</div>
          <div><strong>{nombreNegocio}</strong><span>CATÁLOGO</span></div>
        </div>
        <nav className="home-nav-links">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Inicio</button>
          <button type="button" onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>Catálogo</button>
        </nav>
        <button className="home-login-button" onClick={() => navigate("/")}>Plataforma</button>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">SUPLEMENTOS DEPORTIVOS</p>
          <h1>FUERZA REAL.<br /><span>RESULTADOS RAW.</span></h1>
          <p className="home-hero-description">Encuentra proteínas, creatinas y suplementos seleccionados para llevar tu entrenamiento al siguiente nivel.</p>
          <div className="home-hero-actions">
            <button className="home-primary-button" onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>Ver catálogo</button>
          </div>
        </div>
        <div className="home-hero-visual">
          <div className="hero-product-circle"><div className="hero-product-bottle"><span>RAW</span><strong>WHEY</strong><small>SUPLEMENTS</small></div></div>
        </div>
      </section>

      <section id="catalogo" className="home-catalog">
        <div className="home-section-header"><div><p className="home-eyebrow">CATÁLOGO</p><h2>Productos de {nombreNegocio}</h2><p>Disponibilidad actual.</p></div></div>
        {cargando ? <div className="home-loading">Cargando catálogo...</div> : productos.length === 0 ? <div className="home-empty">En este momento no hay productos disponibles.</div> : (
          <div className="home-products-grid">
            {productos.map((producto) => (
              <article key={producto.id} className="home-product-card">
                <div className="home-product-image">{producto.imageUrl ? <img src={producto.imageUrl} alt={producto.nombre} /> : <div className="home-product-placeholder">RAW</div>}</div>
                <div className="home-product-content">
                  <span className="home-product-category">{producto.categoria}</span>
                  <h3>{producto.nombre}</h3>
                  <p>{producto.marca || nombreNegocio}{producto.presentacion ? ` · ${producto.presentacion}` : ""}{producto.sabor ? ` · ${producto.sabor}` : ""}</p>
                  <div className="home-product-footer">
                    <strong>{moneda(producto.precioVenta)}</strong>
                    <div className="home-product-order-actions">
                      <span>{producto.disponible === false ? "Agotado" : "Disponible"}</span>
                      {producto.disponible !== false && <button type="button" className="home-order-button" onClick={() => pedirPorWhatsApp(producto)}>Pedir</button>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="home-footer"><div><strong>{nombreNegocio}</strong><span>Catálogo en línea</span></div><button type="button" onClick={() => navigate("/")}>Conoce la plataforma</button></footer>
    </div>
  );
}

export default CatalogoPublico;
