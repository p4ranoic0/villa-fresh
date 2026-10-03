import { PRODUCTOS } from '../../data/productos'
import { soles } from '../../features/pedido/mensajeWhatsApp'
import type { LineaPedido } from '../../types'

interface Props {
  lineas: LineaPedido[]
  onAgregar: (sku: string) => void
  onQuitarUno: (sku: string) => void
}

export default function Productos({ lineas, onAgregar, onQuitarUno }: Props) {
  return (
    <section id="productos" className="seccion">
      <div className="contenedor">
        <div data-reveal="" className="productos-cabeza">
          <h2 className="titulo-seccion">Arma tu pedido.</h2>
          <p className="productos-bajada">Elige lo que necesitas y lo enviamos a WhatsApp con el mensaje ya escrito.</p>
        </div>
        <div className="productos">
          {PRODUCTOS.map((p) => {
            const cantidad = lineas.find((l) => l.sku === p.sku)?.cantidad ?? 0
            return (
              <article key={p.sku} data-reveal="" className="card">
                <div className="card-foto">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" />
                  {p.etiqueta && <span className="card-etiqueta">{p.etiqueta}</span>}
                </div>
                {p.nota && <div className="card-nota">{p.nota}</div>}
                <h3>{p.nombre}</h3>
                <p className="card-desc">{p.desc}</p>
                <div className="card-pie">
                  <div>
                    <div className="card-precio">{p.precio === null ? 'A cotizar' : soles(p.precio)}</div>
                    <div className="card-unidad">{p.unidad}</div>
                  </div>
                  {cantidad === 0 ? (
                    <button type="button" className="btn btn-md" onClick={() => onAgregar(p.sku)}>Agregar</button>
                  ) : (
                    <div className="stepper">
                      <button type="button" className="stepper-menos" onClick={() => onQuitarUno(p.sku)} aria-label="Quitar">−</button>
                      <span>{cantidad}</span>
                      <button type="button" className="stepper-mas" onClick={() => onAgregar(p.sku)} aria-label="Agregar">+</button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
