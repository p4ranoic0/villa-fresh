import type { LineaPedido, Producto } from '../../types'

const CLAVE = 'villafresh:pedido'

/** Devuelve [] ante cualquier fallo: modo privado, cuota llena o JSON corrupto.
 *  Un pedido perdido es molesto; una página que no carga es peor. */
export function leerPedido(productos: Producto[]): LineaPedido[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return []
    const dato: unknown = JSON.parse(crudo)
    if (!Array.isArray(dato)) return []
    const skusValidos = new Set(productos.map((p) => p.sku))
    return dato.filter(
      (l): l is LineaPedido =>
        typeof l === 'object' && l !== null &&
        typeof (l as LineaPedido).sku === 'string' &&
        typeof (l as LineaPedido).cantidad === 'number' &&
        (l as LineaPedido).cantidad > 0 &&
        // Descarta SKU que ya no existen en el catálogo. Sin esto, un producto
        // retirado de productos.ts dejaría al cliente con el contador marcando
        // unidades que el cajón no puede mostrar.
        skusValidos.has((l as LineaPedido).sku),
    )
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
