import { PAGOS, type Pago } from '../../data/contenido'
import type { Entrega, LineaPedido, Producto } from '../../types'
import { CANTIDAD_MAXIMA } from './pedido'

const CLAVE = 'villafresh:pedido'
const CLAVE_ENTREGA = 'villafresh:entrega'

export const ENTREGA_VACIA: Entrega = { direccion: '', distrito: '', referencia: '', pago: 'Yape' }

/** Devuelve [] ante cualquier fallo: modo privado, cuota llena o JSON corrupto.
 *  Un pedido perdido es molesto; una página que no carga es peor. */
export function leerPedido(productos: Producto[]): LineaPedido[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return []
    const dato: unknown = JSON.parse(crudo)
    if (!Array.isArray(dato)) return []
    const skusValidos = new Set(productos.map((p) => p.sku))
    return dato
      .filter(
        (l): l is LineaPedido =>
          typeof l === 'object' && l !== null &&
          typeof (l as LineaPedido).sku === 'string' &&
          Number.isInteger((l as LineaPedido).cantidad) &&
          (l as LineaPedido).cantidad > 0 &&
          // Descarta SKU que ya no existen en el catálogo. Sin esto, un producto
          // retirado de productos.ts dejaría al cliente con el contador marcando
          // unidades que la bolsa no puede mostrar.
          skusValidos.has((l as LineaPedido).sku),
      )
      .map((l) => ({ sku: l.sku, cantidad: Math.min(l.cantidad, CANTIDAD_MAXIMA) }))
  } catch {
    return []
  }
}

export function guardarPedido(lineas: LineaPedido[]): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lineas))
  } catch {
    /* sin persistencia, el pedido sigue funcionando en memoria */
  }
}

/** Los datos de entrega guardados. Cualquier campo raro vuelve a su valor vacío. */
export function leerEntrega(): Entrega {
  try {
    const dato: unknown = JSON.parse(localStorage.getItem(CLAVE_ENTREGA) || 'null')
    if (typeof dato !== 'object' || dato === null) return ENTREGA_VACIA
    const d = dato as Record<string, unknown>
    const texto = (v: unknown) => (typeof v === 'string' ? v : '')
    return {
      direccion: texto(d.direccion),
      distrito: texto(d.distrito),
      referencia: texto(d.referencia),
      pago: PAGOS.includes(d.pago as Pago) ? (d.pago as Pago) : ENTREGA_VACIA.pago,
    }
  } catch {
    return ENTREGA_VACIA
  }
}

export function guardarEntrega(entrega: Entrega): void {
  try {
    localStorage.setItem(CLAVE_ENTREGA, JSON.stringify(entrega))
  } catch {
    /* igual que el pedido: sin persistencia sigue funcionando */
  }
}
