import { test, expect } from 'bun:test'
import { CATEGORIAS, PRODUCTOS } from '../src/data/productos'
import { NEGOCIO, urlWhatsApp } from '../src/data/negocio'

test('no hay SKU repetidos', () => {
  const skus = PRODUCTOS.map((p) => p.sku)
  expect(new Set(skus).size).toBe(skus.length)
})

test('toda categoría usada por un producto existe en CATEGORIAS', () => {
  const ids = new Set(CATEGORIAS.map((c) => c.id))
  for (const p of PRODUCTOS) expect(ids.has(p.categoria)).toBe(true)
})

test('un precio es null o un número mayor que cero, nunca 0', () => {
  // El código antiguo trataba 0 como "sin precio" por comprobar con un truthy.
  // Aquí lo prohibimos: "sin precio" se escribe null y nada más.
  for (const p of PRODUCTOS) {
    if (p.precio !== null) expect(p.precio).toBeGreaterThan(0)
  }
})

test('los dos precios confirmados con las redes no cambiaron', () => {
  expect(PRODUCTOS.find((p) => p.sku === 'VF-B20')?.precio).toBe(30)
  expect(PRODUCTOS.find((p) => p.sku === 'VF-B20X2')?.precio).toBe(50)
})

test('todo producto apunta a una imagen bajo /', () => {
  for (const p of PRODUCTOS) expect(p.imagen.startsWith('/')).toBe(true)
})

test('urlWhatsApp arma el enlace con el texto codificado', () => {
  expect(urlWhatsApp('Hola Villa Fresh')).toBe(
    'https://wa.me/51994647840?text=Hola%20Villa%20Fresh',
  )
  expect(urlWhatsApp()).toBe('https://wa.me/51994647840')
  expect(NEGOCIO.telefonoVisible).toBe('994 647 840')
})
