import { formatCRC } from "../utils/formatters";

export function SaleCustomerSection({ busqueda, onBusquedaChange, clienteId, onClienteChange, clientes }) {
  return <div className="content-card sale-section"><div className="section-heading"><h2>1. Cliente</h2><p>Selecciona quién realiza la compra.</p></div><div className="form-group"><label>Buscar cliente</label><input type="text" value={busqueda} onChange={(e)=>onBusquedaChange(e.target.value)} placeholder="Nombre o teléfono..." /></div><div className="form-group"><label>Cliente</label><select value={clienteId} onChange={(e)=>onClienteChange(e.target.value)}><option value="">Seleccionar cliente...</option>{clientes.map((cliente)=><option key={cliente.id} value={cliente.id}>{cliente.nombre} — {cliente.telefono}{cliente.saldo > 0 ? ` — Debe ${formatCRC(cliente.saldo)}` : ""}</option>)}</select></div></div>;
}

export function SaleProductSection({ busqueda, onBusquedaChange, productos, onAgregar }) {
  return <div className="content-card sale-section"><div className="section-heading"><h2>2. Productos</h2><p>Agrega los productos de la venta.</p></div><div className="form-group"><label>Buscar producto</label><input type="text" value={busqueda} onChange={(e)=>onBusquedaChange(e.target.value)} placeholder="Producto o marca..." /></div><div className="sale-product-list">{productos.map((producto)=><button type="button" className="sale-product-option" key={producto.id} onClick={()=>onAgregar(producto)}><div><strong>{producto.nombre}</strong><span>{producto.marca || "Sin marca"} · Stock {producto.stock}</span></div><strong>{formatCRC(producto.precioVenta)}</strong></button>)}</div></div>;
}

export function SaleItemsSection({ items, onCantidadChange, onQuitar }) {
  return <div className="content-card sale-section"><div className="section-heading"><h2>3. Detalle de venta</h2><p>Confirma cantidades antes de guardar.</p></div>{items.length===0?<div className="empty-state">Todavía no has agregado productos.</div>:<div className="sale-items">{items.map((item)=><div key={item.productoId} className="sale-item"><div className="sale-item-info"><strong>{item.nombre}</strong><span>{item.marca || "Sin marca"} · {formatCRC(item.precioVenta)}</span></div><div className="sale-item-controls"><input type="number" min="1" max={item.stock} value={item.cantidad} onChange={(e)=>onCantidadChange(item.productoId,e.target.value)} /><strong>{formatCRC(item.precioVenta*item.cantidad)}</strong><button type="button" className="sale-remove" onClick={()=>onQuitar(item.productoId)}>×</button></div></div>)}</div>}</div>;
}
