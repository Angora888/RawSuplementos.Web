import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const response =
        await api.get("/Productos/catalogo");

      console.log(
        "Catálogo público:",
        response.data
      );

      setProductos(
        response.data || []
      );
    } catch (error) {
      console.error(
        "Error cargando catálogo:",
        error
      );

      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  const moneda = (valor) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(valor || 0);
  };

  const irCatalogo = () => {
    document
      .getElementById("catalogo")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const irBeneficios = () => {
    document
      .getElementById("beneficios")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const irInicio = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <header className="home-navbar">

        <div
          className="home-brand"
          onClick={irInicio}
        >
          <div className="home-brand-logo">
            RAW
          </div>

          <div>
            <strong>
              RAW
            </strong>

            <span>
              SUPLEMENTOS
            </span>
          </div>
        </div>

        <nav className="home-nav-links">

          <button
            type="button"
            onClick={irInicio}
          >
            Inicio
          </button>

          <button
            type="button"
            onClick={irCatalogo}
          >
            Catálogo
          </button>

          <button
            type="button"
            onClick={irBeneficios}
          >
            Nosotros
          </button>

        </nav>

        <button
          className="home-login-button"
          onClick={() =>
            navigate("/login")
          }
        >
          Iniciar sesión
        </button>

      </header>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <p className="home-eyebrow">
            SUPLEMENTOS DEPORTIVOS
          </p>

          <h1>
            FUERZA REAL.
            <br />

            <span>
              RESULTADOS RAW.
            </span>
          </h1>

          <p className="home-hero-description">
            Encuentra proteínas, creatinas
            y suplementos seleccionados
            para llevar tu entrenamiento
            al siguiente nivel.
          </p>

          <div className="home-hero-actions">

            <button
              className="home-primary-button"
              onClick={irCatalogo}
            >
              Ver catálogo
            </button>

            <button
              className="home-secondary-button"
              onClick={() =>
                navigate("/login")
              }
            >
              Administración
            </button>

          </div>

          <div className="home-hero-features">

            <div>
              <strong>
                Productos originales
              </strong>

              <span>
                Calidad garantizada
              </span>
            </div>

            <div>
              <strong>
                Atención directa
              </strong>

              <span>
                Compra fácil y rápida
              </span>
            </div>

            <div>
              <strong>
                Stock actualizado
              </strong>

              <span>
                Consulta disponibilidad
              </span>
            </div>

          </div>

        </div>

        <div className="home-hero-visual">

          <div className="hero-product-circle">

            <div className="hero-product-bottle">

              <span>
                RAW
              </span>

              <strong>
                WHEY
              </strong>

              <small>
                SUPLEMENTOS
              </small>

            </div>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* CATÁLOGO */}
      {/* ========================= */}

      <section
        id="catalogo"
        className="home-catalog"
      >

        <div className="home-section-header">

          <div>

            <p className="home-eyebrow">
              CATÁLOGO
            </p>

            <h2>
              Nuestros productos
            </h2>

            <p>
              Suplementos disponibles
              actualmente.
            </p>

          </div>

        </div>

        {cargando ? (

          <div className="home-loading">
            Cargando catálogo...
          </div>

        ) : productos.length === 0 ? (

          <div className="home-empty">
            En este momento no hay productos
            disponibles.
          </div>

        ) : (

          <div className="home-products-grid">

            {productos.map(
              (producto) => (

                <article
                  key={producto.id}
                  className="home-product-card"
                >

                  {/* IMAGEN */}

                  <div className="home-product-image">

                    {producto.imageUrl ? (

                      <img
                        src={
                          producto.imageUrl
                        }
                        alt={
                          producto.nombre
                        }
                      />

                    ) : (

                      <div className="home-product-placeholder">
                        RAW
                      </div>

                    )}

                  </div>

                  {/* INFORMACIÓN */}

                  <div className="home-product-content">

                    <span className="home-product-category">
                      {producto.categoria}
                    </span>

                    <h3>
                      {producto.nombre}
                    </h3>

                    <p>

                      {producto.marca ||
                        "RAW Suplementos"}

                      {producto.presentacion
                        ? ` · ${producto.presentacion}`
                        : ""}

                      {producto.sabor
                        ? ` · ${producto.sabor}`
                        : ""}

                    </p>

                    {/* PRECIO / DISPONIBILIDAD */}

                    <div className="home-product-footer">

                      <strong>
                        {moneda(
                          producto.precioVenta
                        )}
                      </strong>

                      <span>
                        Disponible
                      </span>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </section>

      {/* ========================= */}
      {/* BENEFICIOS */}
      {/* ========================= */}

      <section
        id="beneficios"
        className="home-benefits"
      >

        <div className="home-benefit-card">

          <strong>
            Calidad
          </strong>

          <p>
            Suplementos seleccionados para
            acompañar tus objetivos.
          </p>

        </div>

        <div className="home-benefit-card">

          <strong>
            Confianza
          </strong>

          <p>
            Información clara de precios
            y disponibilidad.
          </p>

        </div>

        <div className="home-benefit-card">

          <strong>
            Atención
          </strong>

          <p>
            Servicio personalizado y
            comunicación directa.
          </p>

        </div>

      </section>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer className="home-footer">

        <div>

          <strong>
            RAW Suplementos
          </strong>

          <span>
            Entrena fuerte. Vive RAW.
          </span>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
        >
          Iniciar sesión
        </button>

      </footer>

    </div>
  );
}

export default Home;