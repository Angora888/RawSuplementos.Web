import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatCRC, getApiErrorMessage } from "../utils/formatters";
import { SaleCustomerSection, SaleItemsSection, SaleProductSection } from "../components/SaleSections";

function NuevaVenta() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");

  const [busquedaProducto, setBusquedaProducto] = useState("");

  const [items, setItems] = useState([]);

  const [descuento, setDescuento] = useState("");
  const [pagoInicial, setPagoInicial] = useState("");

  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [
        clientesResponse,
        productosResponse,
      ] = await Promise.all([
        api.get("/Clientes"),
        api.get("/Productos"),
      ]);

      setClientes(
        clientesResponse.data.filter(
          (cliente) => cliente.activo
        )
      );

      setProductos(
        productosResponse.data.filter(
          (producto) => producto.activo
        )
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cargar clientes y productos."
      );
    } finally {
      setCargando(false);
    }
  };

  const moneda = formatCRC;

  const clientesFiltrados = useMemo(() => {
    if (!busquedaCliente.trim()) {
      return clientes;
    }

    const texto =
      busquedaCliente.toLowerCase();

    return clientes.filter(
      (cliente) =>
        cliente.nombre
          .toLowerCase()
          .includes(texto) ||
        cliente.telefono.includes(texto)
    );
  }, [clientes, busquedaCliente]);

  const productosFiltrados = useMemo(() => {
    const disponibles = productos.filter(
      (producto) => producto.stock > 0
    );

    if (!busquedaProducto.trim()) {
      return disponibles;
    }

    const texto =
      busquedaProducto.toLowerCase();

    return disponibles.filter(
      (producto) =>
        producto.nombre
          .toLowerCase()
          .includes(texto) ||
        (producto.marca || "")
          .toLowerCase()
          .includes(texto)
    );
  }, [productos, busquedaProducto]);

  const agregarProducto = (producto) => {
    const existente = items.find(
      (item) =>
        item.productoId === producto.id
    );

    if (existente) {
      if (
        existente.cantidad >= producto.stock
      ) {
        setError(
          `No hay más stock disponible para ${producto.nombre}.`
        );
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.productoId === producto.id
            ? {
                ...item,
                cantidad:
                  item.cantidad + 1,
              }
            : item
        )
      );

      return;
    }

    setItems((prev) => [
      ...prev,
      {
        productoId: producto.id,
        nombre: producto.nombre,
        marca: producto.marca,
        precioVenta:
          producto.precioVenta,
        stock: producto.stock,
        cantidad: 1,
      },
    ]);

    setError("");
  };

  const cambiarCantidad = (
    productoId,
    nuevaCantidad
  ) => {
    const cantidad = Number(nuevaCantidad);

    setItems((prev) =>
      prev.map((item) => {
        if (
          item.productoId !== productoId
        ) {
          return item;
        }

        if (cantidad < 1) {
          return item;
        }

        if (cantidad > item.stock) {
          setError(
            `Stock máximo disponible para ${item.nombre}: ${item.stock}.`
          );

          return item;
        }

        setError("");

        return {
          ...item,
          cantidad,
        };
      })
    );
  };

  const quitarProducto = (productoId) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          item.productoId !== productoId
      )
    );
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.precioVenta *
          item.cantidad,
      0
    );
  }, [items]);

  const descuentoNumero =
    Number(descuento) || 0;

  const total = Math.max(
    subtotal - descuentoNumero,
    0
  );

  const pagoInicialNumero =
    Number(pagoInicial) || 0;

  const pendiente = Math.max(
    total - pagoInicialNumero,
    0
  );

  const quedaDeuda =
    total > 0 &&
    pagoInicialNumero < total;

  const guardarVenta = async () => {
    if (!clienteId) {
      setError(
        "Debe seleccionar un cliente."
      );
      return;
    }

    if (items.length === 0) {
      setError(
        "Debe agregar al menos un producto."
      );
      return;
    }

    if (descuentoNumero < 0) {
      setError(
        "El descuento no puede ser negativo."
      );
      return;
    }

    if (descuentoNumero > subtotal) {
      setError(
        "El descuento no puede superar el subtotal."
      );
      return;
    }

    if (pagoInicialNumero < 0) {
      setError(
        "El pago inicial no puede ser negativo."
      );
      return;
    }

    if (pagoInicialNumero > total) {
      setError(
        "El pago inicial no puede superar el total."
      );
      return;
    }

    if (
      quedaDeuda &&
      !fechaVencimiento
    ) {
      setError(
        "Debe indicar una fecha de vencimiento porque queda saldo pendiente."
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const payload = {
        clienteId: Number(clienteId),

        descuento:
          descuentoNumero,

        pagoInicial:
          pagoInicialNumero,

        metodoPago,

        referenciaPago:
          referenciaPago.trim() || null,

        fechaVencimiento:
          quedaDeuda
            ? fechaVencimiento
            : null,

        notas:
          notas.trim() || null,

        productos: items.map(
          (item) => ({
            productoId:
              item.productoId,

            cantidad:
              item.cantidad,
          })
        ),
      };

      const response =
        await api.post(
          "/Ventas",
          payload
        );

const ventaId =
  response.data?.venta?.id;

if (ventaId) {
  navigate(`/ventas/${ventaId}`);
} else {
  navigate("/ventas");
}
    } catch (error) {
      console.error(error);

      setError(getApiErrorMessage(error, "No fue posible registrar la venta."));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="page-container">
        <p>Cargando nueva venta...</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <p className="page-eyebrow">
          VENTAS
        </p>

        <h1>Nueva venta</h1>

        <p>
          Registra una venta de contado,
          parcial o a crédito.
        </p>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="sale-layout">

        {/* ========================== */}
        {/* IZQUIERDA */}
        {/* ========================== */}

        <div className="sale-main">

          <SaleCustomerSection
            busqueda={busquedaCliente}
            onBusquedaChange={setBusquedaCliente}
            clienteId={clienteId}
            onClienteChange={setClienteId}
            clientes={clientesFiltrados}
          />

          <SaleProductSection
            busqueda={busquedaProducto}
            onBusquedaChange={setBusquedaProducto}
            productos={productosFiltrados}
            onAgregar={agregarProducto}
          />

          <SaleItemsSection
            items={items}
            onCantidadChange={cambiarCantidad}
            onQuitar={quitarProducto}
          />

        </div>

        {/* ========================== */}
        {/* DERECHA - RESUMEN */}
        {/* ========================== */}

        <aside className="sale-summary">

          <div className="content-card sale-summary-card">

            <div className="section-heading">
              <h2>Resumen</h2>

              <p>
                Totales y forma de pago.
              </p>
            </div>

            <div className="sale-total-row">
              <span>Subtotal</span>

              <strong>
                {moneda(subtotal)}
              </strong>
            </div>

            <div className="form-group">
              <label>Descuento</label>

              <input
                type="number"
                min="0"
                max={subtotal}
                value={descuento}
                onChange={(e) =>
                  setDescuento(
                    e.target.value
                  )
                }
                placeholder="0"
              />
            </div>

            <div className="sale-total-row sale-total-main">
              <span>Total</span>

              <strong>
                {moneda(total)}
              </strong>
            </div>

            <hr />

            <div className="form-group">
              <label>
                Pago inicial
              </label>

              <input
                type="number"
                min="0"
                max={total}
                value={pagoInicial}
                onChange={(e) =>
                  setPagoInicial(
                    e.target.value
                  )
                }
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>
                Método de pago
              </label>

              <select
                value={metodoPago}
                onChange={(e) =>
                  setMetodoPago(
                    e.target.value
                  )
                }
              >
                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="SINPE">
                  SINPE
                </option>

                <option value="Transferencia">
                  Transferencia
                </option>

                <option value="Tarjeta">
                  Tarjeta
                </option>

                <option value="Otro">
                  Otro
                </option>
              </select>
            </div>

            {pagoInicialNumero > 0 && (
              <div className="form-group">
                <label>
                  Referencia
                </label>

                <input
                  type="text"
                  value={referenciaPago}
                  onChange={(e) =>
                    setReferenciaPago(
                      e.target.value
                    )
                  }
                  placeholder="Opcional"
                />
              </div>
            )}

            <div
              className={
                quedaDeuda
                  ? "sale-debt-card debt"
                  : "sale-debt-card paid"
              }
            >
              <span>
                {quedaDeuda
                  ? "Saldo pendiente"
                  : "Saldo pendiente"}
              </span>

              <strong>
                {moneda(pendiente)}
              </strong>

              <small>
                {quedaDeuda
                  ? "La venta quedará a crédito."
                  : "La venta queda pagada."}
              </small>
            </div>

            {quedaDeuda && (
              <div className="form-group">
                <label>
                  Fecha de vencimiento
                </label>

                <input
                  type="date"
                  value={
                    fechaVencimiento
                  }
                  onChange={(e) =>
                    setFechaVencimiento(
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Notas</label>

              <textarea
                rows="3"
                value={notas}
                onChange={(e) =>
                  setNotas(
                    e.target.value
                  )
                }
                placeholder="Opcional..."
              />
            </div>

            <button
              type="button"
              className="btn-primary-app sale-save"
              onClick={guardarVenta}
              disabled={guardando}
            >
              {guardando
                ? "Registrando..."
                : "Registrar venta"}
            </button>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default NuevaVenta;