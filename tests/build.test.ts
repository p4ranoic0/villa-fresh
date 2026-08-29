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

/* --------------------------------------------------------------------------
   El sistema de dos temas
   -------------------------------------------------------------------------- */

/** Devuelve la hoja de estilo publicada, sea cual sea su hash. */
async function cssPublicado() {
  const html = await readFile('dist/index.html', 'utf8')
  const ruta = html.match(/href="(\/assets\/[^"]+\.css)"/)?.[1]
  if (!ruta) throw new Error('el HTML publicado no enlaza ninguna hoja de estilo')
  return readFile(`dist${ruta}`, 'utf8')
}

test('la web publicada define los dos temas y deja mandar al sistema', async () => {
  const css = await cssPublicado()
  // Claro por defecto.
  expect(css).toContain('--ground:#f2f1ec')
  // Oscuro cuando lo pide el sistema, salvo que el visitante haya elegido claro.
  // El minificador quita las comillas del selector, asi que no se asumen.
  expect(css).toContain('(prefers-color-scheme:dark)')
  expect(css).toMatch(/\[data-tema=["']?claro["']?\]/)
  // Y oscuro cuando el visitante lo elige, mande lo que mande el sistema.
  expect(css).toMatch(/\[data-tema=["']?oscuro["']?\]/)
  // El oscuro llega hasta el CSS publicado, no solo hasta el fuente.
  expect(css).toContain('#04101d')
})

test('el tema se resuelve antes del primer pintado, no al hidratar', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const cabeza = html.slice(0, html.indexOf('</head>'))
  // El script vive en <head> y por tanto corre antes de que se pinte el body.
  expect(cabeza).toContain("'vf-tema'")
  expect(cabeza).toContain('localStorage')
  // Y el conmutador escucha desde ahi, no desde React: el boton responde
  // aunque el bundle todavia no haya cargado.
  expect(cabeza).toContain('data-conmuta-tema')
  expect(html).toContain('data-conmuta-tema=""')
})

test('el conmutador viaja en el HTML de las dos páginas', async () => {
  for (const pagina of ['dist/index.html', 'dist/catalogo.html']) {
    const html = await readFile(pagina, 'utf8')
    expect(html).toContain('aria-label="Cambiar entre tema claro y oscuro"')
  }
})

test('ningún color se pinta a mano fuera del bloque de tokens', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // Todo lo que hay debajo del ultimo bloque de tokens tiene que hablar en
  // roles. Un literal ahi abajo es un tema a medio hacer: se veria bien en uno
  // de los dos y mal en el otro.
  const cuerpo = css.slice(css.indexOf(':root[data-tema="oscuro"]{'))
  const declaraciones = cuerpo.slice(cuerpo.indexOf('\n}\n') + 3)
  const literales = declaraciones.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([\d.,\s]+\)/g) ?? []
  expect(literales).toEqual([])
})

test('cada tema define exactamente los mismos tokens', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const nombres = (bloque: string) =>
    [...bloque.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]).sort()

  const claro = css.slice(css.indexOf(':root{'), css.indexOf('/* El tema oscuro'))
  const porSistema = css.slice(css.indexOf('@media (prefers-color-scheme:dark)'), css.indexOf(':root[data-tema="oscuro"]{'))
  const porEleccion = css.slice(css.indexOf(':root[data-tema="oscuro"]{'))

  // Los dos caminos al tema oscuro tienen que decir lo mismo; si uno se queda
  // corto, elegir el tema a mano daria un resultado distinto al del sistema.
  expect(nombres(porEleccion.slice(0, porEleccion.indexOf('\n}\n')))).toEqual(nombres(porSistema))

  // Y todo token que cambia con el tema tiene que existir tambien en claro.
  const enClaro = new Set(nombres(claro))
  for (const token of nombres(porSistema)) expect(enClaro.has(token)).toBe(true)
})

test('las tarjetas publican la foto y el dato que la foto no da', async () => {
  const html = await readFile('dist/catalogo.html', 'utf8')
  // Un bidon lleno y uno vacio son la misma fotografia: el plastico es
  // transparente y no hay linea de agua. Sin la etiqueta, VF-EV20 y VF-B20
  // serian la misma tarjeta.
  expect(html).toContain('producto-bidon-20l.webp')
  expect(html).toContain('Envase vacío, sin agua')
  expect(html).toContain('Sellado en planta')
  // Y ya no queda rastro de las ilustraciones que sustituyo la fotografia.
  for (const viejo of ['bidon-20l.svg', 'bidon-vacio.svg', 'botella-600.svg', 'dispensador.svg']) {
    expect(html).not.toContain(viejo)
  }
})

test('toda imagen referida existe en lo publicado', async () => {
  for (const pagina of ['dist/index.html', 'dist/catalogo.html']) {
    const html = await readFile(pagina, 'utf8')
    for (const [, ruta] of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:webp|jpg|png|svg))"/g)) {
      expect({ pagina, ruta, existe: existsSync(`dist${ruta}`) }).toEqual({ pagina, ruta, existe: true })
    }
  }
})
