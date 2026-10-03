import { beforeEach, expect, test } from 'bun:test'
import { ENTREGA_VACIA, guardarEntrega, guardarPedido, leerEntrega, leerPedido } from '../src/features/pedido/almacenamiento'
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

test('una cantidad no entera se descarta y una enorme se recorta a 99', () => {
  localStorage.setItem(
    'villafresh:pedido',
    JSON.stringify([{ sku: 'VF-B20', cantidad: 1.5 }, { sku: 'VF-B20', cantidad: 500 }]),
  )
  expect(leerPedido(PRODUCTOS)).toEqual([{ sku: 'VF-B20', cantidad: 99 }])
})

test('los datos de entrega hacen ida y vuelta por localStorage', () => {
  const entrega = { direccion: 'Av. Larco 123', distrito: 'Miraflores', referencia: 'Portón azul', pago: 'Transferencia' as const }
  guardarEntrega(entrega)
  expect(leerEntrega()).toEqual(entrega)
})

test('una entrega corrupta vuelve a los valores vacíos campo por campo', () => {
  localStorage.setItem('villafresh:entrega', JSON.stringify({ direccion: 12, distrito: 'Lince', pago: 'Tarjeta' }))
  expect(leerEntrega()).toEqual({ ...ENTREGA_VACIA, distrito: 'Lince' })
  localStorage.setItem('villafresh:entrega', '{roto')
  expect(leerEntrega()).toEqual(ENTREGA_VACIA)
})
