import { rotuloTotal, rotuloUnidades } from './Bolsa'
import type { Pedido } from './usePedido'

interface Props {
  pedido: Pedido
  onAbrir: () => void
}

/** Barra flotante que aparece en cuanto hay algo en la bolsa. */
export default function BarraPedido({ pedido, onAbrir }: Props) {
  return (
    <div className="barra-pedido">
      <button type="button" className="barra-resumen" onClick={onAbrir}>
        <b>{rotuloUnidades(pedido.unidades)}</b>
        <span className="tenue"> · {rotuloTotal(pedido.total, pedido.pendientes)}</span>
        <span className="barra-detalle">Ver detalle de la bolsa ›</span>
      </button>
      <button type="button" className="btn btn-md barra-revisar" onClick={onAbrir}>Revisar pedido</button>
    </div>
  )
}
