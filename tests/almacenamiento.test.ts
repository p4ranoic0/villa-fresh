import { beforeEach, expect, test } from 'bun:test'
import { guardarPedido, leerPedido } from '../src/features/pedido/almacenamiento'
import type { Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', precio: 30, unidad: '', imagen: '/b.svg', desc: '' },
]

function crearLocalStorage(): Storage {
  const datos = new Map<string, string>()
  return {
    get length() {
      return datos.size
    },
    clear: () => datos.clear(),
    getItem: (clave) => datos.get(clave) ?? null,
    key: (indice) => [...datos.keys()][indice] ?? null,
    removeItem: (clave) => datos.delete(clave),
    setItem: (clave, valor) => datos.set(clave, valor),
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: crearLocalStorage(),
    configurable: true,
  })
})

test('JSON corrupto devuelve un pedido vacío', () => {
  localStorage.setItem('villafresh:pedido', '{no es json')
  expect(leerPedido(PRODUCTOS)).toEqual([])
})

test('un array con basura conserva sólo las líneas válidas', () => {
  localStorage.setItem(
    'villafresh:pedido',
    JSON.stringify([null, {}, { sku: 20, cantidad: 1 }, { sku: 'VF-B20', cantidad: '2' }, { sku: 'VF-B20', cantidad: 2 }]),
  )
  expect(leerPedido(PRODUCTOS)).toEqual([{ sku: 'VF-B20', cantidad: 2 }])
})

test('cantidades cero o negativas se descartan', () => {
  localStorage.setItem(
    'villafresh:pedido',
    JSON.stringify([{ sku: 'VF-B20', cantidad: 0 }, { sku: 'VF-B20', cantidad: -1 }]),
  )
  expect(leerPedido(PRODUCTOS)).toEqual([])
})

test('un SKU retirado del catálogo se descarta', () => {
  localStorage.setItem(
    'villafresh:pedido',
    JSON.stringify([{ sku: 'VF-RETIRADO', cantidad: 3 }]),
  )
  expect(leerPedido(PRODUCTOS)).toEqual([])
})

test('un pedido válido hace ida y vuelta por localStorage', () => {
  const lineas = [{ sku: 'VF-B20', cantidad: 2 }]
  guardarPedido(lineas)
  expect(leerPedido(PRODUCTOS)).toEqual(lineas)
})
