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

test('el sitio se publica en una sola página', async () => {
  // Con seis productos, un catálogo aparte era un clic de más para llegar a lo
  // mismo y un filtro sin nada que filtrar. Todo vive en la portada.
  expect(existsSync('dist/catalogo.html')).toBe(false)
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('id="productos"')
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

test('los 6 productos viajan dentro del HTML, sin depender de JavaScript', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  for (const sku of ['VF-B20', 'VF-B20X2', 'VF-R20', 'VF-BOT', 'VF-MARCA', 'VF-EMP']) {
    expect(html).toContain(sku)
  }
})

test('los 3 productos sin precio se publican como "A cotizar"', async () => {
  // Cuenta exacta en vez de buscar "S/ 0.00": el total del cajón vacío ES "S/ 0.00",
  // y React separa textos contiguos con <!-- --> al renderizar en servidor, así que
  // afirmar sobre el fragmento "S/ 0.00 <small>" sería frágil. Se cuenta el nodo de
  // precio porque VF-EMP también conserva una etiqueta literal con el texto "A cotizar".
  const html = await readFile('dist/index.html', 'utf8')
  expect(html.split('<div class="price pending">A cotizar</div>').length - 1).toBe(3)
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

test('el conmutador de tema viaja en el HTML', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('aria-label="Cambiar entre tema claro y oscuro"')
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
  const html = await readFile('dist/index.html', 'utf8')
  // El bidón y la recarga comparten fotografía porque son el mismo objeto: lo
  // que cambia es si traes el envase. Sin la etiqueta serían la misma tarjeta.
  expect(html).toContain('producto-bidon-20l.webp')
  expect(html).toContain('Sellado en planta')
  expect(html).toContain('Cambias envase por envase')
  expect(html).toContain('Tu etiqueta, nuestra agua')
  // Y ya no queda rastro de las ilustraciones que sustituyo la fotografia.
  for (const viejo of ['bidon-20l.svg', 'bidon-vacio.svg', 'botella-600.svg', 'dispensador.svg']) {
    expect(html).not.toContain(viejo)
  }
})

test('toda imagen referida existe en lo publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  for (const [, ruta] of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:webp|jpg|png|svg))"/g)) {
    expect({ ruta, existe: existsSync(`dist${ruta}`) }).toEqual({ ruta, existe: true })
  }
})

/* --------------------------------------------------------------------------
   La secuencia de agua de la sección de proceso
   -------------------------------------------------------------------------- */

test('la secuencia publica el póster, no el vídeo', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // El póster (17 KB) viaja en el HTML y ya cuenta lo mismo.
  expect(html).toContain('poster="/proceso-agua.webp"')
  // El vídeo (570 KB) no. Lo pide el navegador solo si la pantalla es ancha,
  // no hay preferencia por menos movimiento y no se están ahorrando datos.
  // Un src aquí lo descargaría siempre, incluso en un móvil con datos contados.
  expect(html).not.toContain('proceso-agua.mp4')
  expect(html).toContain('preload="none"')
})

test('la secuencia no reclama ser la planta de Villa Fresh', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('Imagen de archivo con licencia')
})

test('ninguna animación arranca con ease-in', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // Sin los comentarios: ahí abajo está explicado justamente por qué no se usa.
  const declaraciones = css.replace(/\/\*[\s\S]*?\*\//g, '')
  // ease-in retrasa el movimiento justo en el instante que el visitante está
  // mirando, y hace que la misma duración se sienta más lenta.
  expect(declaraciones).not.toMatch(/[\s,:]ease-in[\s,;}]/)
})

test('el movimiento se apaga con prefers-reduced-motion', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  expect(css).toContain('@media (prefers-reduced-motion:reduce)')
  // Y lo que se añade por gusto sólo existe si nadie ha pedido lo contrario.
  expect(css).toContain('@media (prefers-reduced-motion:no-preference)')
})

test('el revelado de los pasos nunca es lo que hace visible el texto', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // El estado base tiene que ser el final. Si `.paso` naciera en opacity:0,
  // un navegador sin líneas de tiempo de scroll dejaría el proceso en blanco.
  const regla = css.slice(css.indexOf('.pasos{'), css.indexOf('@keyframes surge'))
  expect(regla).not.toMatch(/\.paso\{[^}]*opacity:0/)
  expect(css).toContain('@supports (animation-timeline:view())')
})

test('la portada responde también en /index.html', async () => {
  // Un servidor estático sirve la portada en las dos direcciones; si React
  // sólo conoce "/", quien entre por /index.html se queda sin página.
  const app = await readFile('src/App.tsx', 'utf8')
  expect(app).toContain('path="/index.html"')
})

test('los iconos son SVG en línea, sin librería ni fuente', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // Doce iconos dibujados a mano en una retícula de 24 con trazo 1.7. La
  // primera versión del sitio usaba una fuente de iconos y, cuando Google
  // Fonts no cargó, los iconos salieron como las palabras "chat" y "check".
  expect(html).toContain('class="ico"')
  expect(html).toContain('viewBox="0 0 24 24"')
  expect(html).not.toMatch(/material-symbols|font-awesome|<i class="(fa|icon)/)
})

test('cada paso del proceso lleva su propio icono', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const seccion = html.slice(html.indexOf('id="proceso"'), html.indexOf('id="planes"'))
  // Cuatro pasos, cuatro dibujos distintos. Si dos pasos comparten icono, el
  // icono ha dejado de distinguir y sólo decora.
  const dibujos = new Set([...seccion.matchAll(/<svg class="ico"[^>]*>(.*?)<\/svg>/g)].map((m) => m[1]))
  expect(dibujos.size).toBe(4)
})

test('la entrada de la portada nunca es lo que hace visible el hero', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const entrada = css.slice(css.indexOf('MOVIMIENTO DE PÁGINA'))
  // Igual que el revelado: el estado base es el final, y la animación vive
  // dentro de prefers-reduced-motion. Sin eso, quien pida menos movimiento
  // se quedaría mirando una portada en blanco.
  expect(entrada).toContain('@media (prefers-reduced-motion:no-preference)')
  expect(entrada.indexOf('@media (prefers-reduced-motion:no-preference)')).toBeLessThan(entrada.indexOf('.hero-grid'))
})

test('el texto secundario se aleja del titular lo mismo en los dos temas', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const lin = (v: number) => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  /** L* de CIELAB: escala perceptual. Dos colores con el mismo ΔL* se separan
   *  igual para el ojo, cosa que el ratio de contraste no dice. */
  const Lestrella = (h: string) => {
    const [r, g, b] = hex(h)
    const Y = 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!)
    return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y
  }
  const valor = (bloque: string, token: string) =>
    bloque.match(new RegExp(`${token}:(#[0-9a-f]{6})`))![1]!

  const claro = css.slice(css.indexOf(':root{'), css.indexOf('/* El tema oscuro'))
  const oscuro = css.slice(css.indexOf(':root[data-tema="oscuro"]{'))

  for (const token of ['--ink-2', '--ink-3', '--dim']) {
    const enClaro = Math.abs(Lestrella(valor(claro, token)) - Lestrella(valor(claro, '--ink')))
    const enOscuro = Math.abs(Lestrella(valor(oscuro, token)) - Lestrella(valor(oscuro, '--ink')))
    // Con los valores originales la bajada se alejaba 29.9 en claro y 12.6 en
    // oscuro: el texto que explica la página se caía en el tema por defecto.
    // Dos puntos de holgura para poder retocar un tono sin romper la prueba.
    const desajuste = +Math.abs(enClaro - enOscuro).toFixed(1)
    expect({ token, desajuste, tolerable: desajuste <= 2 })
      .toEqual({ token, desajuste, tolerable: true })
  }
})

test('la banda de precio no inventa un tercer precio', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const banda = html.slice(html.indexOf('id="precio"'), html.indexOf('id="proceso"'))
  // Los tres precios confirmados por el negocio, y ninguno más. Si aparece
  // una cuarta cifra en esta banda, alguien se la ha inventado.
  const cifras = [...banda.matchAll(/<b>(\d+)<\/b>/g)].map((m) => m[1])
  expect(cifras).toEqual(['30', '50', '20'])
})

test('sobre el envase no hay más texto que el logotipo', async () => {
  const guion = await readFile('scripts/marcar-producto.py', 'utf8')
  // El mockup de referencia rotulaba las botellas "NATURAL ALPINE WATER".
  // Además de ser una etiqueta inventada es falso: Villa Fresh vende agua de
  // mesa purificada, no de manantial, y esa distinción es el argumento de la
  // página. El script coloca el archivo de marca y no escribe nada.
  expect(guion).not.toMatch(/ImageDraw|ImageFont|\.text\(/)
  expect(guion).toContain('logo-villafresh-circulo.png')
})

test('la web no afirma nada que no tenga fuente', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // Cada una de estas estuvo publicada y ninguna salía de las redes ni del
  // negocio: eran suposiciones del diseño presentadas como hecho. El detalle
  // está en contenido/verificacion.md.
  const suposiciones = [
    'Más vendido',            // afirmación sobre las ventas del negocio
    'promoción permanente',   // promesa sobre el precio futuro
    'agua de caño',           // comparación de sabor con un tercero
    'call center',            // promesa sobre cómo atienden
    'consumo mensual',        // escala de precio que nadie confirmó
    'día siguiente',          // promesa de tiempo de respuesta
    'efectivo o transferencia', // medios de pago sin confirmar
    'ruta diaria',            // descripción de la operación, no del plazo
    'retornable',             // política de envases sin confirmar
  ]
  for (const frase of suposiciones) {
    expect({ frase, presente: html.toLowerCase().includes(frase.toLowerCase()) })
      .toEqual({ frase, presente: false })
  }
})
