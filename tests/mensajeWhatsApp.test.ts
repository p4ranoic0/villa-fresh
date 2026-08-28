import { test, expect } from 'bun:test'
import { mensajeWhatsApp, soles } from '../src/features/pedido/mensajeWhatsApp'
import type { Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', categoria: 'bidones', precio: 30, unidad: 'con envase', imagen: '/bidon-20l.svg', desc: '' },
  { sku: 'VF-R20', nombre: 'Recarga 20 L', categoria: 'bidones', precio: null, unidad: 'con tu envase', imagen: '/bidon-20l.svg', desc: '' },
]

test('soles siempre lleva dos decimales', () => {
  expect(soles(30)).toBe('S/ 30.00')
  expect(soles(0)).toBe('S/ 0.00')
  expect(soles(52.5)).toBe('S/ 52.50')
})

test('mezcla de precio y a cotizar: formato exacto', () => {
  const texto = mensajeWhatsApp(
    [{ sku: 'VF-B20', cantidad: 2 }, { sku: 'VF-R20', cantidad: 1 }],
    PRODUCTOS,
  )
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer este pedido:\n' +
    '\n' +
    '• 2 x Bidón 20 L (VF-B20) — S/ 60.00\n' +
    '• 1 x Recarga 20 L (VF-R20) — a cotizar\n' +
    '\n' +
    'Total de lo que tiene precio: S/ 60.00\n' +
    'Hay productos que necesito que me coticen.\n' +
    '\n' +
    'Mi dirección: \n' +
    'Distrito: ',
  )
})

test('sólo productos con precio: sin la línea de cotización', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer este pedido:\n' +
    '\n' +
    '• 1 x Bidón 20 L (VF-B20) — S/ 30.00\n' +
    '\n' +
    'Total de lo que tiene precio: S/ 30.00\n' +
    '\n' +
    'Mi dirección: \n' +
    'Distrito: ',
  )
})

test('sólo productos a cotizar: sin la línea de total', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-R20', cantidad: 1 }], PRODUCTOS)
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer este pedido:\n' +
    '\n' +
    '• 1 x Recarga 20 L (VF-R20) — a cotizar\n' +
    '\n' +
    'Hay productos que necesito que me coticen.\n' +
    '\n' +
    'Mi dirección: \n' +
    'Distrito: ',
  )
})

test('las dos últimas líneas terminan en espacio, para que el cliente escriba encima', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)
  expect(texto.endsWith('Mi dirección: \nDistrito: ')).toBe(true)
})

test('una línea con SKU inexistente se ignora sin romper el mensaje', () => {
  const texto = mensajeWhatsApp(
    [{ sku: 'NO-EXISTE', cantidad: 1 }, { sku: 'VF-B20', cantidad: 1 }],
    PRODUCTOS,
  )
  expect(texto).toContain('• 1 x Bidón 20 L (VF-B20) — S/ 30.00')
  expect(texto).not.toContain('NO-EXISTE')
})
