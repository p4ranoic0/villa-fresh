import type { Producto } from '../../types'
import { soles } from '../pedido/mensajeWhatsApp'

interface Props {
  producto: Producto
  onAgregar: (sku: string) => void
}

export default function TarjetaProducto({ producto, onAgregar }: Props) {
  return (
    <article className="card">
      <div className="shot">
        {producto.etiqueta && <span className="tag">{producto.etiqueta}</span>}
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
      </div>
      <div className="sku">{producto.sku}</div>
      <h3>{producto.nombre}</h3>
      <p className="desc">{producto.desc}</p>
      <div className="foot-row">
        {producto.precio !== null ? (
          <div className="price">
            {soles(producto.precio)} <small>{producto.unidad}</small>
          </div>
        ) : (
          <div className="price pending">A cotizar</div>
        )}
        <button
          className="btn btn-cyan btn-sm"
          type="button"
          onClick={() => onAgregar(producto.sku)}
        >
          Agregar
        </button>
      </div>
    </article>
  )
}
