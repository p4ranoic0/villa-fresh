import type { Producto } from '../../types'
import TarjetaProducto from './TarjetaProducto'

interface Props {
  productos: Producto[]
  onAgregar: (sku: string) => void
}

export default function Grilla({ productos, onAgregar }: Props) {
  if (productos.length === 0) {
    return <div className="empty">Ningún producto en esa selección</div>
  }
  return (
    <div className="grid">
      {productos.map((p) => (
        <TarjetaProducto key={p.sku} producto={p} onAgregar={onAgregar} />
      ))}
    </div>
  )
}
