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

  const nombreNegocio = negocio?.nombre || "Mi negocio";
  const logoNegocio = negocio?.logoUrl || null;
  const tituloLanding = negocio?.tituloLanding || `Bienvenido a ${nombreNegocio}`;
  const descripcionLanding = negocio?.descripcionLanding || "Descubre nuestros productos y encuentra lo que necesitas. Consulta disponibilidad y realiza tu pedido fácilmente.";

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        setCargando(true); setNoEncontrado(false);
        const response = await api.get(`/Productos/catalogo/${slug}`);
        const data = response.data || {};
        setNegocio(data.negocio || null);
        setProductos(Array.isArray(data.productos) ? data.productos : []);
      } catch (error) {
        console.error("Error cargando catálogo:", error);
        setNegocio(null); setProductos([]); setNoEncontrado(true);
      } finally { setCargando(false); }
    };
    if (slug) cargarCatalogo();
  }, [slug]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--negocio-color-primario", negocio?.colorPrimario || "#5267df");
    root.style.setProperty("--negocio-color-secundario", negocio?.colorSecundario || "#172033");
    root.style.setProperty("--negocio-fondo", negocio?.colorFondo || "#f7f9fc");
    root.style.setProperty("--negocio-header", negocio?.colorHeader || "#ffffff");
    root.style.setProperty("--negocio-footer", negocio?.colorFooter || "#f7f9fc");
    root.style.setProperty("--negocio-boton", negocio?.colorBoton || negocio?.colorPrimario || "#5267df");
    root.style.setProperty("--negocio-texto", negocio?.colorTexto || "#172033");
    if (negocio?.nombre) document.title = `${negocio.nombre} | Catálogo`;
    return () => { root.style.removeProperty("--negocio-color-primario"); root.style.removeProperty("--negocio-color-secundario"); root.style.removeProperty("--negocio-fondo"); root.style.removeProperty("--negocio-header"); root.style.removeProperty("--negocio-footer"); root.style.removeProperty("--negocio-boton"); root.style.removeProperty("--negocio-texto"); document.title = "Mi Emprendimiento | Gestión para pequeños negocios"; };
  }, [negocio]);

  const moneda = (valor) => new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(valor || 0);

  const pedirPorWhatsApp = (producto) => {
    const numero = (negocio?.whatsApp || "").replace(/\D/g, "");
    if (!numero) return window.alert("Este negocio todavía no tiene WhatsApp configurado.");
    const detalles = [producto.marca, producto.presentacion, producto.sabor].filter(Boolean).join(" · ");
    const mensaje = [`Hola 👋 Quiero pedir este producto de ${nombreNegocio}:`, "", `Producto: ${producto.nombre}`, detalles ? `Detalle: ${detalles}` : null, `Precio: ${moneda(producto.precioVenta)}`, "", "¿Me confirmas disponibilidad, por favor?"].filter(Boolean).join("\n");
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
  };

  if (noEncontrado) return <div className="home-page"><div className="home-empty"><h2>Negocio no disponible</h2><p>Este catálogo no existe o se encuentra temporalmente desactivado.</p><button className="home-primary-button" onClick={() => navigate("/")}>Volver al inicio</button></div></div>;

  return (
    <div className="home-page">
      <header className="home-navbar">
        <div className="home-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="home-brand-logo">{logoNegocio ? <img src={logoNegocio} alt={nombreNegocio} /> : <span>{nombreNegocio.charAt(0).toUpperCase()}</span>}</div>
          <div><strong>{nombreNegocio}</strong><span>CATÁLOGO EN LÍNEA</span></div>
        </div>
        <nav className="home-nav-links"><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Inicio</button><button type="button" onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>Productos</button></nav>
        <button className="home-login-button" onClick={() => navigate("/")}>Mi Emprendimiento</button>
      </header>

      <section className={`home-hero ${negocio?.heroFondoUrl ? "tenant-hero-image" : ""} ${negocio?.heroEstilo === "editorial" ? "tenant-hero-editorial" : ""}`} style={negocio?.heroFondoUrl ? { backgroundImage: `linear-gradient(rgba(255,255,255,.82), rgba(255,255,255,.82)), url("${negocio.heroFondoUrl}")` } : undefined}>
        <div className="home-hero-content">
          <p className="home-eyebrow">{negocio?.heroEtiqueta || nombreNegocio.toUpperCase()}</p>
          <h1><span>{tituloLanding}</span>{negocio?.heroTituloResaltado && <strong>{negocio.heroTituloResaltado}</strong>}</h1>
          <p className="home-hero-description">{descripcionLanding}</p>
          <div className="home-hero-actions"><button className="home-primary-button" onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>Ver productos</button></div>
        </div>
        <div className="home-hero-visual">
          {negocio?.heroImagenUrl ? <img className="tenant-hero-product" src={negocio.heroImagenUrl} alt={nombreNegocio} /> : <div className="tenant-brand-card">{logoNegocio ? <img src={logoNegocio} alt={nombreNegocio} /> : <div className="tenant-brand-initial">{nombreNegocio.charAt(0).toUpperCase()}</div>}<strong>{nombreNegocio}</strong><span>Catálogo en línea</span></div>}
        </div>
      </section>

      <section id="catalogo" className="home-catalog">
        <div className="home-section-header"><div><p className="home-eyebrow">NUESTROS PRODUCTOS</p><h2>Catálogo de {nombreNegocio}</h2><p>Consulta los productos disponibles y realiza tu pedido.</p></div></div>
        {cargando ? <div className="home-loading">Cargando catálogo...</div> : productos.length === 0 ? <div className="home-empty">En este momento no hay productos disponibles.</div> : <div className="home-products-grid">{productos.map((producto) => <article key={producto.id} className="home-product-card"><div className="home-product-image">{producto.imageUrl ? <img src={producto.imageUrl} alt={producto.nombre} /> : <div className="home-product-placeholder">{nombreNegocio.charAt(0).toUpperCase()}</div>}</div><div className="home-product-content"><span className="home-product-category">{producto.categoria}</span><h3>{producto.nombre}</h3><p>{producto.marca || nombreNegocio}{producto.presentacion ? ` · ${producto.presentacion}` : ""}{producto.sabor ? ` · ${producto.sabor}` : ""}</p><div className="home-product-footer"><strong>{moneda(producto.precioVenta)}</strong><div className="home-product-order-actions"><span>{producto.disponible === false ? "Agotado" : "Disponible"}</span>{producto.disponible !== false && <button type="button" className="home-order-button" onClick={() => pedirPorWhatsApp(producto)}>Pedir</button>}</div></div></div></article>)}</div>}
      </section>

      <footer className="home-footer"><div><strong>{nombreNegocio}</strong><span>{negocio?.textoFooter || "Catálogo en línea"}</span></div><button type="button" onClick={() => navigate("/")}>Creado con Mi Emprendimiento</button></footer>
    </div>
  );
}

export default CatalogoPublico;