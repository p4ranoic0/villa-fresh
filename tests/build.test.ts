import { test, expect } from 'bun:test'
import { readFile } from 'node:fs/promises'

test('la home publicada lleva su título dentro del HTML', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('<title>Villa Fresh — Agua purificada a domicilio en Lima | Bidón 20 L S/30</title>')
})

test('la home publicada NO es un contenedor vacío', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).not.toContain('<div id="root"></div>')
  expect(html).not.toContain('<!--app-html-->')
})

test('el catálogo se publica en su propia carpeta, con su título', async () => {
  const html = await readFile('dist/catalogo.html', 'utf8')
  expect(html).toContain('<title>Catálogo — Villa Fresh | Bidones, recarga y accesorios en Lima</title>')
  expect(html).not.toContain('<div id="root"></div>')
})

test('el titular del hero viaja dentro del HTML publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('No revendemos')
  expect(html).toContain('La fabricamos.')
})

test('la ficha técnica y el precio viajan dentro del HTML publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('8.3')
  expect(html).toContain('Ósmosis inversa')
})

test('los marcadores pendientes se publican a propósito', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('RAZÓN SOCIAL Y RUC')
  expect(html).toContain('Distritos referenciales')
})
