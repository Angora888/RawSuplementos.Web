import { useNavigate } from "react-router-dom";
import "../styles/saas-home.css";

function Home() {
  const navigate = useNavigate();
  const sesionActiva = Boolean(localStorage.getItem("token") && localStorage.getItem("usuario"));

  return (
    <div className="saas-page">
      <header className="saas-nav">
        <button className="saas-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="saas-brand-mark">N</span>
          <span>Negocio Fácil</span>
        </button>
        <nav>
          <button onClick={() => document.getElementById("funciones")?.scrollIntoView({ behavior: "smooth" })}>Funciones</button>
          <button onClick={() => document.getElementById("beneficios-saas")?.scrollIntoView({ behavior: "smooth" })}>Beneficios</button>
        </nav>
        <button className="saas-login" onClick={() => navigate(sesionActiva ? "/dashboard" : "/login")}>
          {sesionActiva ? "Ir al panel" : "Iniciar sesión"}
        </button>
      </header>

      <main>
        <section className="saas-hero">
          <div className="saas-hero-copy">
            <span className="saas-pill">HECHO PARA PEQUEÑOS NEGOCIOS</span>
            <h1>Tu negocio organizado.<br /><em>Todo en un solo lugar.</em></h1>
            <p>Administra ventas, inventario, clientes y cuentas por cobrar sin hojas de cálculo complicadas. Una plataforma sencilla para tener el control de tu negocio desde cualquier lugar.</p>
            <div className="saas-actions">
              <button className="saas-primary" onClick={() => navigate("/login")}>Entrar a mi negocio</button>
              <button className="saas-secondary" onClick={() => document.getElementById("funciones")?.scrollIntoView({ behavior: "smooth" })}>Ver cómo funciona</button>
            </div>
            <div className="saas-checks"><span>✓ Fácil de usar</span><span>✓ Desde celular o computadora</span><span>✓ Tus datos separados y seguros</span></div>
          </div>

          <div className="saas-dashboard-preview">
            <div className="preview-top"><div><small>RESUMEN DE HOY</small><strong>Tu negocio</strong></div><span>● En línea</span></div>
            <div className="preview-stats">
              <article><small>Ventas</small><strong>₡125,000</strong><span>Hoy</span></article>
              <article><small>Por cobrar</small><strong>₡42,500</strong><span>Pendiente</span></article>
              <article><small>Productos</small><strong>86</strong><span>En inventario</span></article>
              <article><small>Clientes</small><strong>124</strong><span>Registrados</span></article>
            </div>
            <div className="preview-chart"><div><strong>Ventas de la semana</strong><small>Todo bajo control</small></div><div className="bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          </div>
        </section>

        <section id="funciones" className="saas-section">
          <div className="saas-section-title"><span>MENOS PAPELEO. MÁS CONTROL.</span><h2>Todo lo que necesitas para manejar tu negocio</h2><p>Información clara para saber qué vendes, qué tienes y qué te deben.</p></div>
          <div className="saas-feature-grid">
            <article><b>01</b><div className="feature-icon">▣</div><h3>Ventas</h3><p>Registra tus ventas, pagos y movimientos sin perder tiempo.</p></article>
            <article><b>02</b><div className="feature-icon">▤</div><h3>Inventario</h3><p>Conoce tus existencias y detecta productos con poco stock.</p></article>
            <article><b>03</b><div className="feature-icon">◎</div><h3>Clientes</h3><p>Mantén la información de tus clientes organizada y disponible.</p></article>
            <article><b>04</b><div className="feature-icon">₡</div><h3>Cuentas por cobrar</h3><p>Visualiza saldos pendientes, abonos y deudas por cliente.</p></article>
            <article><b>05</b><div className="feature-icon">↗</div><h3>Dashboard</h3><p>Revisa de un vistazo ventas, ganancias y datos importantes.</p></article>
            <article><b>06</b><div className="feature-icon">◉</div><h3>Catálogo público</h3><p>Comparte tus productos en línea y recibe pedidos por WhatsApp.</p></article>
          </div>
        </section>

        <section id="beneficios-saas" className="saas-benefits">
          <div><span className="saas-pill">TU NEGOCIO VA CONTIGO</span><h2>Menos tiempo administrando.<br />Más tiempo haciendo crecer tu negocio.</h2><p>No necesitas ser experto en sistemas. Entra, registra tus movimientos y consulta la información que necesitas.</p></div>
          <div className="benefit-list"><article><strong>Información centralizada</strong><span>Deja de buscar datos entre cuadernos, chats y hojas de cálculo.</span></article><article><strong>Acceso desde cualquier lugar</strong><span>Consulta tu negocio desde el celular, tablet o computadora.</span></article><article><strong>Un espacio para cada negocio</strong><span>Cada empresa trabaja con sus propios usuarios, clientes, productos y ventas.</span></article></div>
        </section>

        <section className="saas-cta"><span>¿LISTO PARA ORGANIZAR TU NEGOCIO?</span><h2>Empieza a tener el control desde hoy.</h2><p>Una herramienta sencilla creada para el día a día de pequeños negocios.</p><button onClick={() => navigate("/login")}>Iniciar sesión</button></section>
      </main>

      <footer className="saas-footer"><div><strong>Negocio Fácil</strong><span>Gestión simple para pequeños negocios.</span></div><span>Ventas · Inventario · Clientes · Cuentas por cobrar</span></footer>
    </div>
  );
}

export default Home;
