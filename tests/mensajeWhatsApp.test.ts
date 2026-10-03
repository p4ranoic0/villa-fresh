import { test, expect } from 'bun:test'
import { mensajeWhatsApp, soles } from '../src/features/pedido/mensajeWhatsApp'
import type { Entrega, Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', precio: 30, unidad: 'con envase', imagen: '/producto-bidon-20l.webp', desc: '' },
  { sku: 'VF-R20', nombre: 'Recarga 20 L', precio: null, unidad: 'con tu envase', imagen: '/producto-bidon-20l.webp', desc: '' },
]

const ENTREGA: Entrega = { direccion: 'Av. Larco 123', distrito: 'Miraflores', referencia: '', pago: 'Yape' }

test('soles sólo lleva céntimos cuando los hay', () => {
  expect(soles(30)).toBe('S/ 30')
  expect(soles(0)).toBe('S/ 0')
  expect(soles(52.5)).toBe('S/ 52.50')
})

test('mezcla de precio y a cotizar: formato exacto', () => {
  const texto = mensajeWhatsApp(
    [{ sku: 'VF-B20', cantidad: 2 }, { sku: 'VF-R20', cantidad: 1 }],
    PRODUCTOS,
    ENTREGA,
  )
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer un pedido:\n' +
    '\n' +
    '• 2 × Bidón 20 L — S/ 60\n' +
    '• 1 × Recarga 20 L — a cotizar\n' +
    '\n' +
    'Total: S/ 60 + productos a cotizar\n' +
    '\n' +
    'Dirección: Av. Larco 123\n' +
    'Distrito: Miraflores\n' +
    'Pago: Yape',
  )
})

test('sólo productos con precio: el total va sin cotización', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS, ENTREGA)
  expect(texto).toContain('Total: S/ 30\n')
  expect(texto).not.toContain('a cotizar')
})

test('la referencia sólo aparece si se escribió, y sin espacios sobrantes', () => {
  const sin = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS, { ...ENTREGA, referencia: '   ' })
  expect(sin).not.toContain('Referencia')
  const con = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS, { ...ENTREGA, referencia: ' Portón azul, después de las 3 ', pago: 'Efectivo' })
  expect(con.endsWith('Distrito: Miraflores\nReferencia: Portón azul, después de las 3\nPago: Efectivo')).toBe(true)
})

test('sin dirección, las líneas quedan para completarlas en el chat', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS, { ...ENTREGA, direccion: '', distrito: '' })
  expect(texto).toContain('Dirección: \nDistrito: \nPago: Yape')
})

test('las líneas salen en el orden del catálogo y sin SKU', () => {
  const texto = mensajeWhatsApp(
    [{ sku: 'VF-R20', cantidad: 1 }, { sku: 'NO-EXISTE', cantidad: 1 }, { sku: 'VF-B20', cantidad: 1 }],
    PRODUCTOS,
    ENTREGA,
  )
  expect(texto.indexOf('Bidón 20 L')).toBeLessThan(texto.indexOf('Recarga 20 L'))
  expect(texto).not.toContain('NO-EXISTE')
  expect(texto).not.toContain('VF-')
})
