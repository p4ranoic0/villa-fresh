import { PRODUCTOS } from '../../data/productos'
import Grilla from '../../features/catalogo/Grilla'

interface Props {
  onAgregar: (sku: string) => void
}

/**
 * Los seis productos, en la portada.
 *
 * Vivían en una página aparte con filtros por categoría. Con seis productos
 * ese catálogo era una sala de espera: un clic más para llegar a lo mismo, y
 * un filtro que nunca tendría nada que filtrar. Ahora se pide desde donde se
 * lee el precio.
 */
export default function Productos({ onAgregar }: Props) {
  return (
    <section className="band" id="productos">
      <div className="wrap">
        <div className="split">
          <div>
            <span className="lbl lbl-cyan">Qué pedir</span>
            <h2 style={{ marginTop: 18 }}>Arma tu pedido.</h2>
          </div>
          <p className="lede" style={{ maxWidth: '46ch' }}>
            Elige lo que necesitas y lo enviamos armado por WhatsApp: llega la lista completa
            con cantidades y total, y desde ahí coordinamos dirección y hora.
          </p>
        </div>

        <div className="cat-head">
          <span className="lbl">{PRODUCTOS.length} productos</span>
          <span className="lbl">Precios en soles · IGV incluido</span>
        </div>
        <Grilla productos={PRODUCTOS} onAgregar={onAgregar} />
        <p className="ph" style={{ marginTop: 28 }}>[ Presentaciones de botella y tarifa de pedidos con marca — confirmar y cargarlas en src/data/productos.ts ]</p>
      </div>
    </section>
  )
}
