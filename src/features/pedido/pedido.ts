import type { LineaPedido, Producto } from '../../types'

export type AccionPedido =
  | { tipo: 'agregar'; sku: string }
  | { tipo: 'incrementar'; sku: string }
  | { tipo: 'decrementar'; sku: string }
  | { tipo: 'quitar'; sku: string }
  | { tipo: 'limpiar' }

export function reducirPedido(estado: LineaPedido[], accion: AccionPedido): LineaPedido[] {
  switch (accion.tipo) {
    case 'agregar':
    case 'incrementar': {
      const existe = estado.some((l) => l.sku === accion.sku)
      return existe
        ? estado.map((l) => (l.sku === accion.sku ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...estado, { sku: accion.sku, cantidad: 1 }]
    }
    case 'decrementar':
      return estado.flatMap((l) =>
        l.sku !== accion.sku ? [l] : l.cantidad > 1 ? [{ ...l, cantidad: l.cantidad - 1 }] : [],
      )
    case 'quitar':
      return estado.filter((l) => l.sku !== accion.sku)
    case 'limpiar':
      return []
  }
}

export function totalUnidades(lineas: LineaPedido[]): number {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0)
}

export function totalSoles(lineas: LineaPedido[], productos: Producto[]): number {
  return lineas.reduce((suma, l) => {
    const producto = productos.find((p) => p.sku === l.sku)
    // Comprobación explícita contra null: un precio 0 sería un precio, no una ausencia.
    return producto && producto.precio !== null ? suma + producto.precio * l.cantidad : suma
  }, 0)
}

export function hayPendientes(lineas: LineaPedido[], productos: Producto[]): boolean {
  return lineas.some((l) => productos.find((p) => p.sku === l.sku)?.precio === null)
}
