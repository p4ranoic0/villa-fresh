import { test, expect } from 'bun:test'
import { alternar, contarPorCategoria, filtrarPorCategorias } from '../src/features/catalogo/filtros'
import type { CategoriaId, Producto } from '../src/types'

const p = (sku: string, categoria: CategoriaId): Producto => ({
  sku, nombre: sku, categoria, precio: 1, unidad: '', imagen: '/x.svg', desc: '',
})

const PRODUCTOS = [p('A', 'bidones'), p('B', 'bidones'), p('C', 'botellas')]

test('sin ninguna categoría marcada se muestra el catálogo completo', () => {
  expect(filtrarPorCategorias(PRODUCTOS, new Set())).toEqual(PRODUCTOS)
})

test('con una categoría marcada se muestran sólo sus productos', () => {
  expect(filtrarPorCategorias(PRODUCTOS, new Set<CategoriaId>(['botellas']))).toEqual([p('C', 'botellas')])
})

test('con varias marcadas se muestra la unión', () => {
  const r = filtrarPorCategorias(PRODUCTOS, new Set<CategoriaId>(['bidones', 'botellas']))
  expect(r).toHaveLength(3)
})

test('una categoría marcada sin productos deja la lista vacía', () => {
  expect(filtrarPorCategorias(PRODUCTOS, new Set<CategoriaId>(['empresas']))).toEqual([])
})

test('contarPorCategoria cuenta los productos de esa categoría', () => {
  expect(contarPorCategoria(PRODUCTOS, 'bidones')).toBe(2)
  expect(contarPorCategoria(PRODUCTOS, 'empresas')).toBe(0)
})

test('alternar marca y desmarca sin mutar el conjunto original', () => {
  const inicial = new Set<CategoriaId>()
  const marcado = alternar(inicial, 'bidones')
  expect(marcado.has('bidones')).toBe(true)
  expect(inicial.size).toBe(0)
  expect(alternar(marcado, 'bidones').has('bidones')).toBe(false)
})
