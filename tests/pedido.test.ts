import { test, expect } from 'bun:test'
import { hayPendientes, reducirPedido, totalSoles, totalUnidades } from '../src/features/pedido/pedido'
import type { LineaPedido, Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', categoria: 'bidones', precio: 30, unidad: '', imagen: '/b.svg', desc: '' },
  { sku: 'VF-R20', nombre: 'Recarga 20 L', categoria: 'bidones', precio: null, unidad: '', imagen: '/b.svg', desc: '' },
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
