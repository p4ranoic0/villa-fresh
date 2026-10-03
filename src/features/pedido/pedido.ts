import type { LineaPedido, Producto } from '../../types'

/** Tope por producto. Más de 99 bidones ya no es un pedido de la web. */
export const CANTIDAD_MAXIMA = 99

export type AccionPedido =
  | { tipo: 'agregar'; sku: string }
  | { tipo: 'incrementar'; sku: string }
  | { tipo: 'decrementar'; sku: string }
  | { tipo: 'quitar'; sku: string }
  | { tipo: 'limpiar' }
  | { tipo: 'restaurar'; lineas: LineaPedido[] }

export function reducirPedido(estado: LineaPedido[], accion: AccionPedido): LineaPedido[] {
  switch (accion.tipo) {
    case 'agregar':
    case 'incrementar': {
      const existe = estado.some((l) => l.sku === accion.sku)
      return existe
        ? estado.map((l) =>
            l.sku === accion.sku ? { ...l, cantidad: Math.min(CANTIDAD_MAXIMA, l.cantidad + 1) } : l,
          )
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
    case 'restaurar':
      return accion.lineas
  }
}

/** Las líneas en el orden del catálogo, cada una con su producto. Así la bolsa
 *  y el mensaje de WhatsApp listan siempre igual, se agregue en el orden que se
 *  agregue. Las líneas cuyo SKU ya no existe se descartan. */
export function lineasConProducto(lineas: LineaPedido[], productos: Producto[]) {
  return productos.flatMap((producto) => {
    const linea = lineas.find((l) => l.sku === producto.sku)
    return linea ? [{ linea, producto }] : []
  })
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

/** Cuántos productos distintos quedan por cotizar. */
export function productosACotizar(lineas: LineaPedido[], productos: Producto[]): number {
  return lineas.filter((l) => productos.find((p) => p.sku === l.sku)?.precio === null).length
}
