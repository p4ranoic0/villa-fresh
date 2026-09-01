import type { LineaPedido, Producto } from '../../types'

export function soles(n: number): string {
  // Los precios de Villa Fresh son enteros y nadie en Lima dice «treinta soles
  // con cero céntimos». Los céntimos sólo aparecen cuando los hay de verdad,
  // que hoy sólo puede pasar en el total si algún día entra un precio con
  // decimales; el formato de la lista que llega por WhatsApp cambia con esto,
  // y por eso los tests de mensajeWhatsApp fijan las dos formas.
  return Number.isInteger(n) ? `S/ ${n}` : `S/ ${n.toFixed(2)}`
}

/** Arma el texto del pedido. Función pura: sin React, sin DOM, sin efectos.
 *  El formato lo lee un cliente en WhatsApp — no se cambia sin actualizar los tests. */
export function mensajeWhatsApp(lineas: LineaPedido[], productos: Producto[]): string {
  const porSku = (sku: string) => productos.find((p) => p.sku === sku)
  const presentes = lineas.flatMap((l) => {
    const producto = porSku(l.sku)
    return producto ? [{ linea: l, producto }] : []
  })

  const total = presentes.reduce(
    (suma, { linea, producto }) =>
      producto.precio !== null ? suma + producto.precio * linea.cantidad : suma,
    0,
  )
  const hayPendientes = presentes.some(({ producto }) => producto.precio === null)

  const partes: string[] = ['Hola Villa Fresh, quiero hacer este pedido:', '']

  for (const { linea, producto } of presentes) {
    const importe =
      producto.precio !== null ? soles(producto.precio * linea.cantidad) : 'a cotizar'
    partes.push(`• ${linea.cantidad} x ${producto.nombre} (${producto.sku}) — ${importe}`)
  }

  partes.push('')
  if (total > 0) partes.push(`Total de lo que tiene precio: ${soles(total)}`)
  if (hayPendientes) partes.push('Hay productos que necesito que me coticen.')
  partes.push('', 'Mi dirección: ', 'Distrito: ')

  return partes.join('\n')
}
