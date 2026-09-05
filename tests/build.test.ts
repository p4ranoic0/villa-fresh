import { beforeAll, test, expect } from 'bun:test'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { SITIO_URL } from '../src/rutas'
import { PRODUCTOS } from '../src/data/productos'

const URL_PAGES = 'https://p4ranoic0.github.io/villa-fresh'
const BASE_PAGES = '/villa-fresh/'

function archivoPublicado(ruta: string): string {
  if (!ruta.startsWith(BASE_PAGES)) {
    throw new Error(`la ruta publicada no empieza por ${BASE_PAGES}: ${ruta}`)
  }
  return `dist/${ruta.slice(BASE_PAGES.length)}`
}

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
  expect(html).toContain('Hacemos el agua')
  expect(html).toContain('el mismo día.')
})

test('los titulares no van en versalitas', async () => {
  // Siete titulares en mayúsculas seguidos no eran una voz, eran un cartel
  // repetido. La caja normal es lo que hace que la página suene a alguien
  // hablando; si vuelve el uppercase, vuelve el cartel.
  const css = await readFile('src/styles/site.css', 'utf8')
  const regla = css.match(/^h1,h2\{[^}]*\}/m)?.[0] ?? ''
  expect(regla).not.toContain('uppercase')
})

test('la ficha técnica y el precio viajan dentro del HTML publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('8.3')
  expect(html).toContain('Ósmosis inversa')
})

test('lo que falta se publica junto y fuera del diseño', async () => {
  // Los seis marcadores sueltos (tres recuadros de línea discontinua dentro de
  // las secciones, tres corchetes en el pie) leían como contenido a medio
  // hacer. La información sigue publicada, pero en un solo bloque marcado como
  // nota, no repartida por la página.
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('Nota para Villa Fresh')
  expect(html).toContain('Razón social, RUC')
  expect(html).toContain('distritos que aparecen son de referencia')
  expect(html).not.toContain('[ RAZÓN SOCIAL Y RUC ]')
  expect(html.match(/class="ph"/g)).toBeNull()

  // Y fuera de <main>, detrás del pie. Metida entre el cierre y el pie ocupaba
  // el sitio donde va la última sección de contenido de cualquier web, y se
  // leía como contenido por mucho que el rótulo dijera lo contrario.
  const finMain = html.indexOf('</main>')
  const pie = html.indexOf('<footer')
  const nota = html.indexOf('Nota para Villa Fresh')
  expect({ fueraDeMain: nota > finMain, detrasDelPie: nota > pie })
    .toEqual({ fueraDeMain: true, detrasDelPie: true })
})

test('los 6 productos viajan dentro del HTML, sin depender de JavaScript', async () => {
  // Antes esto buscaba los SKU. Se quitaron de la cara de la tarjeta —VF-B20X2
  // es la referencia del almacén, no algo que le sirva a quien compra agua— así
  // que ahora se comprueba lo que el visitante ve de verdad: el nombre.
  const html = await readFile('dist/index.html', 'utf8')
  for (const producto of PRODUCTOS) {
    expect({ sku: producto.sku, publicado: html.includes(producto.nombre) })
      .toEqual({ sku: producto.sku, publicado: true })
  }
  expect(PRODUCTOS.length).toBe(6)
})

test('el código de almacén no se le enseña a quien compra', async () => {
  // En el JSON-LD sí corresponde: schema.org/Product define `sku` y es lo que
  // lee un buscador. Lo que no puede aparecer es en el marcado visible.
  //
  // Esta prueba sola no basta y conviene saberlo: el cajón del pedido se pinta
  // en el navegador, no en el prerenderizado, así que se le escapó el SKU que
  // salía bajo el nombre de cada línea. Por eso debajo se revisa también el
  // código fuente, que es donde vive lo que el HTML publicado no enseña.
  const html = await readFile('dist/index.html', 'utf8')
  const visible = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  for (const producto of PRODUCTOS) {
    expect({ sku: producto.sku, visible: visible.includes(producto.sku) })
      .toEqual({ sku: producto.sku, visible: false })
  }

  // Ningún componente lo pinta, ni siquiera los que sólo existen tras un clic.
  // Se exige el `>` delante para mirar sólo lo que va como contenido de un
  // elemento: `key={linea.sku}` y `onClick={() => quitar(linea.sku)}` son usos
  // legítimos y no se ven. Es una heurística, no un análisis del JSX.
  const fuentes = new Bun.Glob('src/**/*.tsx')
  for await (const ruta of fuentes.scan('.')) {
    const codigo = await readFile(ruta, 'utf8')
    expect({ ruta, pintaElSku: />\s*\{\s*\w+\.sku\s*\}/.test(codigo) })
      .toEqual({ ruta, pintaElSku: false })
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
  const ruta = html.match(/href="(\/[^"]+\/assets\/[^"]+\.css)"/)?.[1]
  if (!ruta) throw new Error('el HTML publicado no enlaza ninguna hoja de estilo')
  return readFile(archivoPublicado(ruta), 'utf8')
}

test('la web publicada define los dos temas y deja mandar al sistema', async () => {
  const css = await cssPublicado()
  // Claro por defecto. El valor va escrito a mano y no leido del fuente: si
  // alguien cambia la temperatura de la pagina, esta prueba lo dice en voz
  // alta en vez de dejarlo pasar. (Fue #f4f2ee, beige, hasta que se vio que
  // el papel templado contradecia el producto; ver la prueba de los neutros.)
  expect(css).toContain('--ground:#f1f2f8')
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
    expect({ ruta, existe: existsSync(archivoPublicado(ruta)) }).toEqual({ ruta, existe: true })
  }
})

/* --------------------------------------------------------------------------
   La secuencia de agua de la sección de proceso
   -------------------------------------------------------------------------- */

test('la secuencia publica el póster, no el vídeo', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // El póster (17 KB) viaja en el HTML y ya cuenta lo mismo.
  expect(html).toContain(`poster="${BASE_PAGES}proceso-agua.webp"`)
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
  const ts = await readFile('src/revelado.ts', 'utf8')
  expect(css).toContain('@media (prefers-reduced-motion:reduce)')
  // Y lo que se anade por gusto solo existe si nadie ha pedido lo contrario.
  expect(css).toContain('@media (prefers-reduced-motion:no-preference)')
  // El revelado se apaga desde JavaScript, no desde el CSS: apagar sólo la
  // transición dejaría el elemento escondido hasta que el observador lo
  // enseñara de golpe. Quien pide menos movimiento no esconde nada.
  expect(ts).toContain("matchMedia('(prefers-reduced-motion: reduce)').matches")
})
test('el revelado nunca es lo que hace visible el texto', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const ts = await readFile('src/revelado.ts', 'utf8')
  // El estado base tiene que ser el final. Nada se esconde desde el CSS: es el
  // observador quien pone `data-revela`, y sólo en lo que aún no se ve. Sin
  // JavaScript no hay atributo, no hay regla que aplique y la página se lee
  // entera.
  const regla = css.slice(css.indexOf('.pasos{'), css.indexOf('@keyframes surge'))
  expect(regla).not.toMatch(/\.paso\{[^}]*opacity:0/)
  expect(css).toMatch(/:root \[data-revela\]\{opacity:0/)
  expect(ts).toContain("setAttribute('data-revela'")
  // Y lo que ya está en pantalla al cargar no se esconde para volver a
  // enseñarlo: eso sería un parpadeo entre el pintado y la hidratación.
  expect(ts).toMatch(/getBoundingClientRect\(\)\.top > alcance/)
})
test('la página no arrastra un router para una sola ruta', async () => {
  // El alias de "/index.html" existía porque, sin él, React Router no
  // encontraba ruta en esa dirección y vaciaba la página. Sin router no hay
  // ruta que encontrar: el componente se pinta y ya. Lo que aquí se vigila es
  // que no vuelva a entrar la dependencia por costumbre.
  const paquete = JSON.parse(await readFile('package.json', 'utf8'))
  expect(Object.keys(paquete.dependencies)).not.toContain('react-router')

  const cliente = await readFile('dist/index.html', 'utf8')
  expect(cliente).toContain('id="root"')
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

test('la portada se mueve sola, sin que nadie toque nada', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const css = await readFile('src/styles/site.css', 'utf8')
  // La versión anterior sí tenía animaciones y aun así el sitio se veía
  // muerto: todas dependían de que alguien hiciera scroll. Una página que
  // sólo se mueve cuando la mueven no contesta a «¿esto está vivo?».
  expect(html).toContain('class="marea"')
  expect(css).toMatch(/\.marea-fondo\{animation:marea [\d.]+s linear infinite\}/)
  expect(css).toMatch(/\.marea-cara\{animation:marea [\d.]+s linear infinite\}/)
  // Y la marea viaja en el HTML publicado, no la pinta JavaScript al hidratar.
  expect(html).toMatch(/<svg class="marea-capa[^"]*"[^>]*>\s*<path/)
})

test('el desplazamiento del revelado llega a verse', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const surge = css.match(/@keyframes surge\{from\{opacity:0;transform:translateY\((\d+)px\)/)
  expect(surge).not.toBeNull()
  const px = Number(surge![1])
  // El recorrido anterior eran 12 px repartidos a lo largo de media pantalla
  // de scroll: el navegador gastaba cuadros en algo que nadie podía ver.
  expect({ px, seVe: px >= 20 }).toEqual({ px, seVe: true })
})

test('el revelado dura lo mismo baje quien baje como baje', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const ts = await readFile('src/revelado.ts', 'utf8')
  // Fue `animation-timeline: view()`, que ata el avance de la animación a la
  // posición del dedo: de un manotazo se consumía en dos cuadros y el elemento
  // aparecía de golpe. El reloj tiene que ser el del navegador.
  expect(css).not.toContain('animation-timeline')
  expect(css).not.toContain('animation-range')
  const dur = css.match(/:root \[data-revela\]\{opacity:0;transform:translateY\((\d+)px\);\s*transition:opacity ([\d.]+)s/)
  expect(dur).not.toBeNull()
  const px = Number(dur![1])
  const segundos = Number(dur![2])
  // Lento a propósito: es contenido apareciendo, no un control respondiendo.
  expect({ px, segundos, lento: segundos >= 0.6, seVe: px >= 20 })
    .toEqual({ px, segundos, lento: true, seVe: true })
  // Y se revela una sola vez: volver a esconder lo ya leído es un parpadeo.
  expect(ts).toContain('observador.unobserve(el)')
})
test('ninguna clase puede pisar la transición del revelado', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // `.dist{transition:color .2s}` se llevaba por delante el revelado de los
  // doce distritos: misma especificidad, más abajo en el archivo. El CSS era
  // correcto leído regla a regla y sólo se veía midiendo en el navegador.
  // El `:root` de delante sube la especificidad a (0,1,1) y ninguna clase
  // suelta la alcanza, esté donde esté.
  expect(css).toContain(':root [data-revela]{')
  // Y no queda ninguna forma sin blindar rondando por la hoja.
  const sinBlindar = [...css.matchAll(/(^|[^ ])\[data-revela\]\{/gm)]
  expect(sinBlindar.map((m) => m[0])).toEqual([])
})

test('el revelado no puede dejar una sección en blanco sobre papel', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // Al imprimir no hay observador que revele nada, y lo que quedó escondido
  // saldría en blanco por la impresora.
  expect(css).toMatch(/@media print\{:root \[data-revela\]\{opacity:1/)
})
test('los neutros del tema claro son agua, no papel templado', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const claro = css.slice(css.indexOf(':root{'), css.indexOf('/* El tema oscuro'))
  // Durante una versión entera el tema claro fue beige: rojo por encima de
  // azul en todos los neutros. El producto es agua fría y el material de la
  // página decía panadería. Ahora el matiz es el del azul de marca, diluido.
  for (const token of ['--ground', '--panel', '--panel-2', '--ink', '--ink-2', '--dim']) {
    const h = claro.match(new RegExp(`${token}:#([0-9a-f]{6})`))![1]!
    const r = parseInt(h.slice(0, 2), 16)
    const b = parseInt(h.slice(4, 6), 16)
    expect({ token, hex: `#${h}`, frio: b > r }).toEqual({ token, hex: `#${h}`, frio: true })
  }
})

test('la monoespaciada sólo viste a lo que se lee como cifra', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // Llegó a haber veinte hojas de texto en Plex Mono: precios de tarjeta,
  // «A cotizar», los números de paso, Hogar/Empresa/Obra, PRECIO POR VOLUMEN,
  // la tira de cobertura, el kicker del cierre. Ese estrato es el que hacía
  // que la página hablara en dos voces, una humana y otra de máquina, y la de
  // máquina es la que se lee como generada.
  //
  // Lista blanca, no un tope: cada entrada tiene que poder defenderse sola.
  const permitidos = new Set([
    '.nav-tel',            // el teléfono de la barra: se memoriza y se marca
    '.close .num',         // el mismo teléfono, en grande
    '.precios .amt sup',   // el «S/» del precio grande (ver DESIGN.md §5)
    '.line .pr',           // importes del cajón: se alinean en columna
    '.line .qty span',     // la cantidad, entre los dos botones
    '.total',              // el total del cajón
    '.nota-titulo',        // la nota de pendientes, que a propósito no parece web
  ])
  const declaraciones = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const usan = [...declaraciones.matchAll(/([^{}]+)\{[^}]*font-family:var\(--mono\)/g)]
    .map((m) => m[1]!.split('\n').pop()!.trim())
  const sobran = usan.filter((sel) => !permitidos.has(sel))
  expect({ usan: usan.length, sobran }).toEqual({ usan: usan.length, sobran: [] })

  // Y la utilidad que la repartía desde el JSX ya no existe.
  expect(declaraciones).not.toMatch(/\.mono\{/)
})

test('ninguna versalita se cuela por estilo en línea', async () => {
  // Cuatro `textTransform:'uppercase'` sobrevivieron a la limpieza anterior
  // porque iban en el JSX y no en la hoja: Planes ×2, Cobertura y Cierre. Un
  // grep del CSS no los veía.
  const { readdir } = await import('node:fs/promises')
  const rutas: string[] = []
  const recorrer = async (dir: string) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const ruta = `${dir}/${e.name}`
      if (e.isDirectory()) await recorrer(ruta)
      else if (ruta.endsWith('.tsx')) rutas.push(ruta)
    }
  }
  await recorrer('src')

  const culpables: string[] = []
  for (const ruta of rutas) {
    const codigo = await readFile(ruta, 'utf8')
    if (/textTransform:\s*'uppercase'/.test(codigo)) culpables.push(ruta)
  }
  expect(culpables).toEqual([])
})

test('cada intención tiene un solo rótulo', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // «Ver productos» en el hero y «Ver todos los productos» en la banda de
  // precio llevaban al mismo ancla. El visitante aprende el vocabulario de la
  // página; cambiárselo a mitad es ruido.
  const rotulos = [...html.matchAll(/<a class="btn[^"]*"[^>]*>([^<]*)</g)]
    .map((m) => m[1]!.trim())
    .filter((t) => t.startsWith('Ver '))
  expect([...new Set(rotulos)]).toEqual(['Ver productos'])
})

test('ningún titular promete un número que su sección no enseña', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // El h2 de proceso decía «Ocho pasos entre el agua y tu vaso» y debajo había
  // cuatro. Era la única frase de la web que prometía algo que la propia
  // página no cumplía dos centímetros más abajo, y justo en la sección que
  // existe para dar confianza. Un lector atento lo ve y desconfía del resto.
  const NUMEROS: Record<string, number> = {
    un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
    siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
  }
  // Qué es «uno» de lo que cuenta cada sección.
  const UNIDAD: Record<string, RegExp> = {
    proceso: /<div class="paso"/g,
    planes: /class="plan-etq/g,
    productos: /class="card"/g,
    cobertura: /<div class="dist"/g,
    preguntas: /<div class="qa"/g,
  }

  const desajustes: { seccion: string; titular: string; promete: number; enseña: number }[] = []
  for (const [seccion, unidad] of Object.entries(UNIDAD)) {
    const desde = html.indexOf(`id="${seccion}"`)
    expect({ seccion, existe: desde >= 0 }).toEqual({ seccion, existe: true })
    const hasta = html.indexOf('</section>', desde)
    const bloque = html.slice(desde, hasta)
    const h2 = bloque.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)
    if (!h2) continue
    const titular = h2[1]!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    const cifra = titular.match(/\b\d+\b/)
    const palabra = titular.toLowerCase().match(/\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)\b/)
    const promete = cifra ? Number(cifra[0]) : palabra ? NUMEROS[palabra[1]!]! : null
    if (promete === null) continue

    const enseña = (bloque.match(unidad) ?? []).length
    if (promete !== enseña) desajustes.push({ seccion, titular, promete, enseña })
  }
  expect(desajustes).toEqual([])
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

/* --------------------------------------------------------------------------
   Estructura SEO
   -------------------------------------------------------------------------- */

function jsonLdPublicado(html: string): unknown {
  const contenido = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
  if (!contenido) throw new Error('el HTML publicado no contiene datos estructurados JSON-LD')
  return JSON.parse(contenido)
}

function objetosAnidados(valor: unknown): Record<string, unknown>[] {
  if (Array.isArray(valor)) return valor.flatMap(objetosAnidados)
  if (valor === null || typeof valor !== 'object') return []
  const objeto = valor as Record<string, unknown>
  return [objeto, ...Object.values(objeto).flatMap(objetosAnidados)]
}

test('los datos estructurados publicados son JSON válido', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(jsonLdPublicado(html)).toBeTruthy()
})

test('los datos estructurados publican sólo los tres precios confirmados en PEN', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const ofertas = objetosAnidados(jsonLdPublicado(html))
    .filter((objeto) => objeto['@type'] === 'Offer')

  expect(ofertas.map((oferta) => oferta.price).sort((a, b) => Number(a) - Number(b)))
    .toEqual([20, 30, 50])
  expect(ofertas.map((oferta) => oferta.priceCurrency)).toEqual(['PEN', 'PEN', 'PEN'])
})

test('los datos estructurados no inventan información del negocio', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const claves = new Set(objetosAnidados(jsonLdPublicado(html)).flatMap(Object.keys))

  for (const prohibida of [
    'address',
    'openingHours',
    'openingHoursSpecification',
    'geo',
    'aggregateRating',
    'review',
  ]) {
    expect(claves.has(prohibida)).toBe(false)
  }
})

test('el sitio se publica cerrado a los buscadores', async () => {
  // Es una demo para el cliente y todavía cita datos por confirmar. Se abre el
  // día del lanzamiento real cambiando estas dos líneas a la vez.
  const [robots, html] = await Promise.all([
    readFile('dist/robots.txt', 'utf8'),
    readFile('dist/index.html', 'utf8'),
  ])
  expect(robots).toContain('Disallow: /')
  expect(robots).not.toContain('Allow: /')
  expect(html).toContain('name="robots" content="noindex, nofollow"')
})

test('el sitemap sigue apuntando al dominio configurado', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8')
  expect(sitemap).toContain(SITIO_URL)
})

test('la página publicada tiene un solo main y un solo enlace canonical', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html.match(/<main(?:\s|>)/g)?.length ?? 0).toBe(1)
  expect(html.match(/<\/main>/g)?.length ?? 0).toBe(1)
  expect(html.match(/<link rel="canonical"/g)?.length ?? 0).toBe(1)
  expect(html).toContain(`<link rel="canonical" href="${SITIO_URL}/">`)
})

/* --------------------------------------------------------------------------
   Publicación bajo la subcarpeta de GitHub Pages
   -------------------------------------------------------------------------- */

test('toda ruta local del HTML publicado lleva la base de GitHub Pages', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const rutas = [...html.matchAll(/(?:src|href|poster)="(\/[^\"]+)"/g)].map(([, ruta]) => ruta)
  expect(rutas.length).toBeGreaterThan(0)
  for (const ruta of rutas) expect(ruta.startsWith(BASE_PAGES)).toBe(true)
})

test('canonical, og:url y sitemap citan la URL de GitHub Pages', async () => {
  const [html, sitemap] = await Promise.all([
    readFile('dist/index.html', 'utf8'),
    readFile('dist/sitemap.xml', 'utf8'),
  ])
  expect(SITIO_URL).toBe(URL_PAGES)
  expect(html).toContain(`<link rel="canonical" href="${URL_PAGES}/">`)
  expect(html).toContain(`<meta property="og:url" content="${URL_PAGES}/">`)
  expect(sitemap).toContain(`<loc>${URL_PAGES}/</loc>`)
})
