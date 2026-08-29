import { beforeAll, test, expect } from 'bun:test'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

beforeAll(() => {
  if (!existsSync('dist/index.html')) {
    throw new Error(
      'dist/ no existe: estas pruebas verifican el HTML publicado. Ejecuta `bun run build` antes, o usa `bun run test:build`, que encadena las dos cosas.',
    )
  }
})

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

test('el catálogo publica los 7 productos dentro del HTML, sin depender de JavaScript', async () => {
  const html = await readFile('dist/catalogo.html', 'utf8')
  for (const sku of ['VF-B20', 'VF-B20X2', 'VF-R20', 'VF-EV20', 'VF-BOT', 'VF-DISP', 'VF-EMP']) {
    expect(html).toContain(sku)
  }
})

test('los 5 productos sin precio se publican como "A cotizar"', async () => {
  // Cuenta exacta en vez de buscar "S/ 0.00": el total del cajón vacío ES "S/ 0.00",
  // y React separa textos contiguos con <!-- --> al renderizar en servidor, así que
  // afirmar sobre el fragmento "S/ 0.00 <small>" sería frágil. Se cuenta el nodo de
  // precio porque VF-EMP también conserva una etiqueta literal con el texto "A cotizar".
  const html = await readFile('dist/catalogo.html', 'utf8')
  expect(html.split('<div class="price pending">A cotizar</div>').length - 1).toBe(5)
})
