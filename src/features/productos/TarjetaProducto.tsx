import type { CSSProperties } from 'react'
import type { Producto } from '../../types'
import { soles } from '../pedido/mensajeWhatsApp'
import { ESCALA_FOTO } from '../../data/escala-fotos'

interface Props {
  producto: Producto
  onAgregar: (sku: string) => void
}

export default function TarjetaProducto({ producto, onAgregar }: Props) {
  /* Las fotos van recortadas al objeto, asi que por si solas todas llenarian
     el encuadre por igual. Esto devuelve el alto que tenian dentro del lienzo
     comun de los archivos de marca: importa en la foto de grupo, que va mas
     baja porque tres bidones en fila tienen que caber a lo ancho. Sin esto,
     cada bidon del grupo se veria mas grande que el bidon suelto de al lado. */
  const foto = producto.imagen.split('/').pop()!.replace('.webp', '')
  const encuadre = { '--escala': ESCALA_FOTO[foto] ?? 1 } as CSSProperties

  return (
    <article className="card">
      <div className="shot">
        {producto.etiqueta && <span className="tag">{producto.etiqueta}</span>}
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" style={encuadre} />
        {producto.nota && <span className="nota">{producto.nota}</span>}
      </div>
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
