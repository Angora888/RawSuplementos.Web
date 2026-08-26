import { useEffect, useState } from "react";
import api from "../services/api";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState(null);

  const [mostrarCategoria, setMostrarCategoria] =
    useState(false);

  const [nombreCategoria, setNombreCategoria] =
    useState("");

  const [form, setForm] = useState({
    nombre: "",
    marca: "",
    presentacion: "",
    sabor: "",
    precioCompra: "",
    precioVenta: "",
    stockMinimo: "",
    imageUrl: "",
    categoriaId: "",
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [
        productosResponse,
        categoriasResponse,
      ] = await Promise.all([
        api.get("/Productos"),
        api.get("/Categorias"),
      ]);

      setProductos(productosResponse.data);
      setCategorias(categoriasResponse.data);

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

  const moneda = (valor) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(valor || 0);
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      marca: "",
      presentacion: "",
      sabor: "",
      precioCompra: "",
      precioVenta: "",
      stockMinimo: "",
      imageUrl: "",
      categoriaId: "",
      activo: true,
    });

    setEditandoId(null);
  };

  const abrirNuevoProducto = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const editarProducto = (producto) => {
    setEditandoId(producto.id);

    setForm({
      nombre: producto.nombre || "",
      marca: producto.marca || "",
      presentacion:
        producto.presentacion || "",
      sabor: producto.sabor || "",

      precioCompra:
        producto.precioCompra ?? "",

      precioVenta:
        producto.precioVenta ?? "",

      stockMinimo:
        producto.stockMinimo ?? "",

      imageUrl:
        producto.imageUrl || "",

      categoriaId:
        producto.categoriaId || "",

      activo:
        producto.activo,
    });

    setMostrarFormulario(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        nombre: form.nombre.trim(),

        marca:
          form.marca.trim() || null,

        presentacion:
          form.presentacion.trim() || null,

        sabor:
          form.sabor.trim() || null,

        precioCompra:
          Number(form.precioCompra),

        precioVenta:
          Number(form.precioVenta),

        stockMinimo:
          Number(form.stockMinimo),

        imageUrl:
          form.imageUrl.trim() || null,

        categoriaId:
          Number(form.categoriaId),
      };

      if (editandoId) {
        await api.put(
          `/Productos/${editandoId}`,
          {
            ...payload,
            activo: form.activo,
          }
        );
      } else {
        await api.post(
          "/Productos",
          payload
        );
      }

      setMostrarFormulario(false);
      limpiarFormulario();

      await cargarDatos();
    } catch (error) {
      console.error(error);

      const mensaje =
        typeof error.response?.data ===
        "string"
          ? error.response.data
          : "No fue posible guardar el producto.";

      setError(mensaje);
    }
  };

  const crearCategoria = async (e) => {
    e.preventDefault();

    if (!nombreCategoria.trim()) {
      return;
    }

    try {
      setError("");

      const response = await api.post(
        "/Categorias",
        {
          nombre: nombreCategoria.trim(),
        }
      );

      const nuevaCategoria =
        response.data;

      setCategorias((prev) => [
        ...prev,
        nuevaCategoria,
      ]);

      setForm((prev) => ({
        ...prev,
        categoriaId:
          nuevaCategoria.id,
      }));

      setNombreCategoria("");
      setMostrarCategoria(false);
    } catch (error) {
      console.error(error);

      setError(
        typeof error.response?.data ===
        "string"
          ? error.response.data
          : "No fue posible crear la categoría."
      );
    }
  };

  const cerrarModal = () => {
    setMostrarFormulario(false);
    limpiarFormulario();
  };

  const cerrarCategoria = () => {
    setMostrarCategoria(false);
    setNombreCategoria("");
  };

  return (
    <div className="page-container">

      <div className="page-header page-header-actions">
        <div>
          <p className="page-eyebrow">
            INVENTARIO
          </p>

          <h1>Productos</h1>

          <p>
            Administra suplementos, precios
            y niveles de stock.
          </p>
        </div>

        <button
          className="btn-primary-app"
          onClick={abrirNuevoProducto}
        >
          + Nuevo producto
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="content-card">

        {cargando ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <div className="empty-state">
            No hay productos registrados.
          </div>
        ) : (
          <div className="table-responsive">

            <table className="app-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Compra</th>
                  <th>Venta</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {productos.map(
                  (producto) => (

                    <tr key={producto.id}>

                      <td>
                        <div className="product-cell">

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
                            <div className="product-placeholder">
                              RAW
                            </div>
                          )}

                          <div>
                            <strong>
                              {producto.nombre}
                            </strong>

                            <div className="table-secondary">
                              {producto.marca ||
                                "Sin marca"}

                              {producto.presentacion
                                ? ` · ${producto.presentacion}`
                                : ""}

                              {producto.sabor
                                ? ` · ${producto.sabor}`
                                : ""}
                            </div>
                          </div>

                        </div>
                      </td>

                      <td>
                        {producto.categoria}
                      </td>

                      <td>
                        {moneda(
                          producto.precioCompra
                        )}
                      </td>

                      <td>
                        <strong>
                          {moneda(
                            producto.precioVenta
                          )}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {producto.stock}
                        </strong>

                        <div className="table-secondary">
                          Mínimo:{" "}
                          {
                            producto.stockMinimo
                          }
                        </div>
                      </td>

                      <td>

                        {producto.stock <= 0 ? (

                          <span className="badge-stock danger">
                            Sin stock
                          </span>

                        ) : producto.stockBajo ? (

                          <span className="badge-stock warning">
                            Stock bajo
                          </span>

                        ) : (

                          <span className="badge-stock good">
                            Disponible
                          </span>

                        )}

                      </td>

                      <td>
                        <button
                          className="table-action"
                          onClick={() =>
                            editarProducto(
                              producto
                            )
                          }
                        >
                          Editar
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>
            </table>

          </div>
        )}

      </div>

      {/* ========================================= */}
      {/* MODAL PRODUCTO */}
      {/* ========================================= */}

      {mostrarFormulario && (

        <div className="modal-overlay">

          <div className="app-modal product-modal">

            <div className="modal-header-app">

              <div>
                <h2>
                  {editandoId
                    ? "Editar producto"
                    : "Nuevo producto"}
                </h2>

                <p>
                  {editandoId
                    ? "Actualiza los datos del producto."
                    : "Registra un nuevo suplemento."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={cerrarModal}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={guardarProducto}
            >

              <div className="form-grid">

                <div className="form-group form-grid-full">
                  <label>
                    Nombre del producto
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Marca
                  </label>

                  <input
                    type="text"
                    name="marca"
                    value={form.marca}
                    onChange={handleChange}
                  />
                </div>

                {/* ============================= */}
                {/* CATEGORIA */}
                {/* ============================= */}

                <div className="form-group">

                  <div className="category-label-row">

                    <label>
                      Categoría
                    </label>

                    <button
                      type="button"
                      className="category-add-button"
                      onClick={() =>
                        setMostrarCategoria(true)
                      }
                    >
                      + Nueva categoría
                    </button>

                  </div>

                  <select
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Seleccionar...
                    </option>

                    {categorias
                      .filter(
                        (categoria) =>
                          categoria.activa
                      )
                      .map(
                        (categoria) => (

                          <option
                            key={
                              categoria.id
                            }
                            value={
                              categoria.id
                            }
                          >
                            {
                              categoria.nombre
                            }
                          </option>

                        )
                      )}

                  </select>

                </div>

                <div className="form-group">
                  <label>
                    Presentación
                  </label>

                  <input
                    type="text"
                    name="presentacion"
                    value={
                      form.presentacion
                    }
                    onChange={handleChange}
                    placeholder="Ej: 5 lb"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Sabor
                  </label>

                  <input
                    type="text"
                    name="sabor"
                    value={form.sabor}
                    onChange={handleChange}
                    placeholder="Ej: Chocolate"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Precio compra
                  </label>

                  <input
                    type="number"
                    name="precioCompra"
                    value={
                      form.precioCompra
                    }
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Precio venta
                  </label>

                  <input
                    type="number"
                    name="precioVenta"
                    value={
                      form.precioVenta
                    }
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Stock mínimo
                  </label>

                  <input
                    type="number"
                    name="stockMinimo"
                    value={
                      form.stockMinimo
                    }
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    URL imagen
                  </label>

                  <input
                    type="text"
                    name="imageUrl"
                    value={
                      form.imageUrl
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                {editandoId && (

                  <div className="form-group form-grid-full">

                    <label className="checkbox-row">

                      <input
                        type="checkbox"
                        name="activo"
                        checked={
                          form.activo
                        }
                        onChange={
                          handleChange
                        }
                      />

                      Producto activo

                    </label>

                  </div>
                )}

                {editandoId && (

                  <div className="stock-info form-grid-full">

                    El stock no se modifica
                    desde esta pantalla.
                    Utiliza Inventario para
                    registrar entradas,
                    pérdidas o ajustes.

                  </div>
                )}

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary-app"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary-app"
                >
                  {editandoId
                    ? "Guardar cambios"
                    : "Crear producto"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================= */}
      {/* MODAL NUEVA CATEGORIA */}
      {/* ========================================= */}

      {mostrarCategoria && (

        <div className="modal-overlay category-modal-overlay">

          <div className="app-modal category-modal">

            <div className="modal-header-app">

              <div>
                <h2>
                  Nueva categoría
                </h2>

                <p>
                  Crea una categoría sin
                  salir del producto.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  cerrarCategoria
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={crearCategoria}
            >

              <div className="form-group">

                <label>
                  Nombre de la categoría
                </label>

                <input
                  type="text"
                  value={
                    nombreCategoria
                  }
                  onChange={(e) =>
                    setNombreCategoria(
                      e.target.value
                    )
                  }
                  placeholder="Ej: Vitaminas"
                  autoFocus
                  required
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary-app"
                  onClick={
                    cerrarCategoria
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary-app"
                >
                  Crear categoría
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Productos;