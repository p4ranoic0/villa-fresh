import type { Producto } from '../../types'
import { soles } from '../pedido/mensajeWhatsApp'
import { encuadreDe } from '../../data/encuadre'

interface Props {
  producto: Producto
  onAgregar: (sku: string) => void
}

export default function TarjetaProducto({ producto, onAgregar }: Props) {
  /* Alto relativo y proporcion de la foto. Ver src/data/encuadre.ts. */
  const encuadre = encuadreDe(producto.imagen)

  return (
    <article className="card">
      <div className="shot">
        {producto.etiqueta && <span className="tag">{producto.etiqueta}</span>}
        <span className="objeto" style={encuadre}>
          <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        </span>
      </div>
      {/* Fuera del encuadre. Iba dentro, apoyado en el fondo del panel gris;
          sin panel se quedó encima de la sombra del producto y los dos se
          estorbaban. Debajo se lee como lo que es: un pie de foto. */}
      {producto.nota && <span className="nota">{producto.nota}</span>}
      {/* El SKU se quito de la cara de la tarjeta: VF-B20X2 es la
          referencia interna del almacen, no algo que le sirva a
          quien esta comprando agua para su casa. Sigue en los datos
          y sigue siendo la clave del pedido. */}
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
