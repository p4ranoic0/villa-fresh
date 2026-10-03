import { test, expect } from 'bun:test'
import { CANTIDAD_MAXIMA, hayPendientes, lineasConProducto, productosACotizar, reducirPedido, totalSoles, totalUnidades } from '../src/features/pedido/pedido'
import type { LineaPedido, Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', precio: 30, unidad: '', imagen: '/b.svg', desc: '' },
  { sku: 'VF-R20', nombre: 'Recarga 20 L', precio: null, unidad: '', imagen: '/b.svg', desc: '' },
]

test('agregar un SKU nuevo crea la línea con cantidad 1', () => {
  expect(reducirPedido([], { tipo: 'agregar', sku: 'VF-B20' })).toEqual([
    { sku: 'VF-B20', cantidad: 1 },
  ])
})

test('agregar un SKU que ya está suma cantidad, no duplica la línea', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 1 }]
  expect(reducirPedido(estado, { tipo: 'agregar', sku: 'VF-B20' })).toEqual([
    { sku: 'VF-B20', cantidad: 2 },
  ])
})

test('decrementar por debajo de 1 elimina la línea entera', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 1 }]
  expect(reducirPedido(estado, { tipo: 'decrementar', sku: 'VF-B20' })).toEqual([])
})

test('el reducer no muta el estado que recibe', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 1 }]
  reducirPedido(estado, { tipo: 'incrementar', sku: 'VF-B20' })
  expect(estado).toEqual([{ sku: 'VF-B20', cantidad: 1 }])
})

test('quitar elimina sólo el SKU indicado', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-B20', cantidad: 3 },
    { sku: 'VF-R20', cantidad: 1 },
  ]
  expect(reducirPedido(estado, { tipo: 'quitar', sku: 'VF-B20' })).toEqual([
    { sku: 'VF-R20', cantidad: 1 },
  ])
})

test('limpiar deja el pedido vacío', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 3 }]
  expect(reducirPedido(estado, { tipo: 'limpiar' })).toEqual([])
})

test('restaurar sustituye el estado completo', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 3 }]
  const restaurado: LineaPedido[] = [{ sku: 'VF-R20', cantidad: 2 }]
  expect(reducirPedido(estado, { tipo: 'restaurar', lineas: restaurado })).toEqual(restaurado)
})

test('el total suma sólo lo que tiene precio', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-B20', cantidad: 2 },
    { sku: 'VF-R20', cantidad: 5 },
  ]
  expect(totalSoles(estado, PRODUCTOS)).toBe(60)
})

test('las unidades cuentan todo, tenga precio o no', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-B20', cantidad: 2 },
    { sku: 'VF-R20', cantidad: 5 },
  ]
  expect(totalUnidades(estado)).toBe(7)
})

test('hayPendientes detecta productos sin precio', () => {
  expect(hayPendientes([{ sku: 'VF-R20', cantidad: 1 }], PRODUCTOS)).toBe(true)
  expect(hayPendientes([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)).toBe(false)
})

test('ninguna cantidad pasa del tope de 99', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: CANTIDAD_MAXIMA }]
  expect(reducirPedido(estado, { tipo: 'agregar', sku: 'VF-B20' })).toEqual(estado)
})

test('las líneas se listan en el orden del catálogo, no en el de agregado', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-R20', cantidad: 1 },
    { sku: 'VF-B20', cantidad: 2 },
    { sku: 'VF-RETIRADO', cantidad: 1 },
  ]
  expect(lineasConProducto(estado, PRODUCTOS).map(({ producto }) => producto.sku)).toEqual(['VF-B20', 'VF-R20'])
})

test('productosACotizar cuenta productos distintos, no unidades', () => {
  expect(productosACotizar([{ sku: 'VF-R20', cantidad: 4 }, { sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)).toBe(1)
})
