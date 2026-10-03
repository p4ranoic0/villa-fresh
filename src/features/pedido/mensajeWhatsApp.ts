import type { Entrega, LineaPedido, Producto } from '../../types'
import { hayPendientes, lineasConProducto, totalSoles } from './pedido'

export function soles(n: number): string {
  // Los precios de Villa Fresh son enteros y nadie en Lima dice «treinta soles
  // con cero céntimos». Los céntimos sólo aparecen cuando los hay de verdad.
  return Number.isInteger(n) ? `S/ ${n}` : `S/ ${n.toFixed(2)}`
}

/** Arma el texto del pedido. Función pura: sin React, sin DOM, sin efectos.
 *  El formato lo lee un cliente en WhatsApp — no se cambia sin actualizar los tests. */
export function mensajeWhatsApp(lineas: LineaPedido[], productos: Producto[], entrega: Entrega): string {
  const total = totalSoles(lineas, productos)
  const cotiza = hayPendientes(lineas, productos)
  const referencia = entrega.referencia.trim()

  return [
    'Hola Villa Fresh, quiero hacer un pedido:',
    '',
    ...lineasConProducto(lineas, productos).map(({ linea, producto }) =>
      `• ${linea.cantidad} × ${producto.nombre} — ${
        producto.precio === null ? 'a cotizar' : soles(producto.precio * linea.cantidad)
      }`,
    ),
    '',
    `Total: ${soles(total)}${cotiza ? ' + productos a cotizar' : ''}`,
    '',
    `Dirección: ${entrega.direccion.trim()}`,
    `Distrito: ${entrega.distrito}`,
    ...(referencia ? [`Referencia: ${referencia}`] : []),
    `Pago: ${entrega.pago}`,
  ].join('\n')
}
