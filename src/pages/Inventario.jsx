import { useEffect, useState } from "react";
import api from "../services/api";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");

  const [productoSeleccionado, setProductoSeleccionado] =
    useState(null);

  const [movimientos, setMovimientos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [cargandoHistorial, setCargandoHistorial] =
    useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    cantidad: "",
    tipo: "Entrada",
    motivo: "",
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const response =
        await api.get("/Productos");

      setProductos(response.data);
      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cargar los productos."
      );
    } finally {
      setCargando(false);
    }
  };

  const cargarHistorial = async (id) => {
    if (!id) {
      setProductoSeleccionado(null);
      setMovimientos([]);
      return;
    }

    try {
      setCargandoHistorial(true);

      const response = await api.get(
        `/Inventario/producto/${id}`
      );

      setProductoSeleccionado(
        response.data.producto
      );

      setMovimientos(
        response.data.movimientos
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cargar el historial."
      );
    } finally {
      setCargandoHistorial(false);
    }
  };

  const seleccionarProducto = async (e) => {
    const id = e.target.value;

    setProductoId(id);
    setMensaje("");
    setError("");

    await cargarHistorial(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registrarMovimiento = async (e) => {
    e.preventDefault();

    if (!productoId) {
      setError(
        "Debe seleccionar un producto."
      );
      return;
    }

    const cantidadIngresada =
      Number(form.cantidad);

    if (
      !cantidadIngresada ||
      cantidadIngresada === 0
    ) {
      setError(
        "Debe ingresar una cantidad válida."
      );
      return;
    }

    let cantidadFinal =
      cantidadIngresada;

    // Para pérdidas permitimos que el usuario
    // escriba un número positivo y lo convertimos.
    if (
      form.tipo === "Perdida" &&
      cantidadFinal > 0
    ) {
      cantidadFinal *= -1;
    }

    // Para entradas/devoluciones debe ser positivo.
    if (
      (form.tipo === "Entrada" ||
        form.tipo === "Devolucion") &&
      cantidadFinal < 0
    ) {
      cantidadFinal =
        Math.abs(cantidadFinal);
    }

    try {
      setError("");
      setMensaje("");

      await api.post(
        `/Inventario/ajustar/${productoId}`,
        {
          cantidad: cantidadFinal,
          tipo: form.tipo,
          motivo:
            form.motivo.trim() || null,
        }
      );

      setForm({
        cantidad: "",
        tipo: "Entrada",
        motivo: "",
      });

      setMensaje(
        "Inventario actualizado correctamente."
      );

      await Promise.all([
        cargarHistorial(productoId),
        cargarProductos(),
      ]);
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data ===
        "string"
          ? error.response.data
          : "No fue posible actualizar el inventario."
      );
    }
  };

  const obtenerClaseMovimiento = (cantidad) => {
    if (cantidad > 0) {
      return "inventory-positive";
    }

    if (cantidad < 0) {
      return "inventory-negative";
    }

    return "";
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">
          CONTROL DE STOCK
        </p>

        <h1>Inventario</h1>

        <p>
          Registra entradas, pérdidas,
          devoluciones y ajustes de productos.
        </p>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="success-message">
          {mensaje}
        </div>
      )}

      <div className="inventory-layout">

        {/* =========================== */}
        {/* MOVIMIENTO */}
        {/* =========================== */}

        <div className="content-card">

          <div className="section-heading">
            <h2>Registrar movimiento</h2>

            <p>
              Selecciona un producto y
              actualiza sus existencias.
            </p>
          </div>

          {cargando ? (
            <p>Cargando productos...</p>
          ) : (
            <form
              onSubmit={registrarMovimiento}
            >

              <div className="form-group">
                <label>Producto</label>

                <select
                  value={productoId}
                  onChange={
                    seleccionarProducto
                  }
                  required
                >
                  <option value="">
                    Seleccionar producto...
                  </option>

                  {productos
                    .filter(
                      (producto) =>
                        producto.activo
                    )
                    .map((producto) => (
                      <option
                        key={producto.id}
                        value={producto.id}
                      >
                        {producto.nombre}
                        {" — "}
                        Stock: {producto.stock}
                      </option>
                    ))}
                </select>
              </div>

              {productoSeleccionado && (
                <div className="inventory-stock-card">
                  <span>Stock actual</span>

                  <strong>
                    {
                      productoSeleccionado.stock
                    }
                  </strong>

                  <small>
                    {
                      productoSeleccionado.nombre
                    }
                  </small>
                </div>
              )}

              <div className="form-group">
                <label>
                  Tipo de movimiento
                </label>

                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                >
                  <option value="Entrada">
                    Entrada
                  </option>

                  <option value="Ajuste">
                    Ajuste
                  </option>

                  <option value="Devolucion">
                    Devolución
                  </option>

                  <option value="Perdida">
                    Pérdida
                  </option>

                  <option value="Correccion">
                    Corrección
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad</label>

                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  placeholder={
                    form.tipo === "Perdida"
                      ? "Ej: 2"
                      : "Ej: 10"
                  }
                  required
                />

                {form.tipo === "Perdida" && (
                  <small className="form-help">
                    Puedes escribir 2 y el
                    sistema registrará -2.
                  </small>
                )}

                {(form.tipo === "Ajuste" ||
                  form.tipo ===
                    "Correccion") && (
                  <small className="form-help">
                    Usa valores positivos para
                    sumar y negativos para
                    restar.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Motivo</label>

                <textarea
                  name="motivo"
                  value={form.motivo}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ej: Compra de mercadería"
                />
              </div>

              <button
                type="submit"
                className="btn-primary-app inventory-submit"
              >
                Registrar movimiento
              </button>

            </form>
          )}

        </div>

        {/* =========================== */}
        {/* HISTORIAL */}
        {/* =========================== */}

        <div className="content-card inventory-history-card">

          <div className="section-heading">
            <h2>Historial</h2>

            <p>
              Movimientos recientes del
              producto seleccionado.
            </p>
          </div>

          {!productoId ? (
            <div className="empty-state">
              Selecciona un producto para
              ver su historial.
            </div>
          ) : cargandoHistorial ? (
            <p>Cargando historial...</p>
          ) : movimientos.length === 0 ? (
            <div className="empty-state">
              Este producto aún no tiene
              movimientos de inventario.
            </div>
          ) : (
            <div className="table-responsive">

              <table className="app-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Anterior</th>
                    <th>Nuevo</th>
                    <th>Usuario</th>
                    <th>Motivo</th>
                  </tr>
                </thead>

                <tbody>
                  {movimientos.map(
                    (movimiento) => (
                      <tr
                        key={
                          movimiento.id
                        }
                      >
                        <td>
                          {new Date(
                            movimiento.fecha
                          ).toLocaleString(
                            "es-CR"
                          )}
                        </td>

                        <td>
                          <span className="inventory-type">
                            {
                              movimiento.tipo
                            }
                          </span>
                        </td>

                        <td>
                          <strong
                            className={obtenerClaseMovimiento(
                              movimiento.cantidad
                            )}
                          >
                            {movimiento.cantidad >
                            0
                              ? "+"
                              : ""}
                            {
                              movimiento.cantidad
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            movimiento.stockAnterior
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              movimiento.stockNuevo
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            movimiento.usuario
                          }
                        </td>

                        <td>
                          {movimiento.motivo ||
                            "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Inventario;