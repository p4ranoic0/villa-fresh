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

test('la ficha técnica y el precio viajan dentro del HTML publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('8.3')
  expect(html).toContain('Ósmosis inversa')
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
  // Se cuenta el nodo de precio de la tarjeta: VF-EMP también lleva una
  // etiqueta literal con el texto "A cotizar".
  const html = await readFile('dist/index.html', 'utf8')
  expect(html.split('<div class="card-precio">A cotizar</div>').length - 1).toBe(3)
})

test('las tarjetas publican la foto y el dato que la foto no da', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // El bidón y la recarga comparten fotografía porque son el mismo objeto: lo
  // que cambia es si traes el envase. Sin la etiqueta serían la misma tarjeta.
  expect(html).toContain('producto-bidon-20l.webp')
  expect(html).toContain('Sellado en planta')
  expect(html).toContain('Envase por envase')
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
   Movimiento
   -------------------------------------------------------------------------- */

test('las escenas fijas viajan en el HTML y avanzan con el scroll', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const css = await readFile('src/styles/site.css', 'utf8')
  const paquete = JSON.parse(await readFile('package.json', 'utf8'))
  // Portada, frase y proceso se quedan fijas mientras se recorren; el avance
  // lo escribe animaciones.ts en --p y el CSS decide qué hace cada pieza.
  for (const escena of ['hero', 'frase', 'proceso']) expect(html).toContain(`data-escena="${escena}"`)
  expect(css).toContain('.escena-fija{position:sticky')
  expect(css).toContain('var(--p, 0)')
  // GSAP y Lenis se instalan como dependencias, no se piden a un CDN.
  expect(Object.keys(paquete.dependencies)).toEqual(expect.arrayContaining(['gsap', 'lenis']))
  expect(html).not.toMatch(/cdn\.jsdelivr|unpkg\.com/)
})

test('la frase y las etapas se publican completas', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  // Las palabras se iluminan con el scroll, pero el HTML las trae todas: sin
  // JavaScript la frase se lee entera.
  expect((html.match(/data-w=""/g) ?? []).length).toBeGreaterThan(20)
  expect(html).toContain('sin intermediarios.')
  expect((html.match(/data-step=""/g) ?? []).length).toBe(4)
  expect(html).toContain(`src="${BASE_PAGES}proceso-agua.webp"`)
})

test('la entrada de la portada nunca deja el hero escondido', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const css = await readFile('src/styles/site.css', 'utf8')
  const cabeza = html.slice(0, html.indexOf('</head>'))
  // Lo único que se esconde antes de que cargue el JavaScript es la entrada,
  // y sólo bajo la clase que pone index.html. Esa clase se va sola a los tres
  // segundos y nunca se pone si se pidió menos movimiento.
  expect(css).toContain('.vf-entrada [data-enter]{opacity:0}')
  expect(cabeza).toContain("classList.add('vf-entrada')")
  expect(cabeza).toContain("classList.remove('vf-entrada')")
  expect(cabeza).toContain("prefers-reduced-motion: reduce")
  // El texto del hero viaja sin estilos en línea que lo oculten.
  expect(html).not.toMatch(/data-enter=""[^>]*style="[^"]*opacity:\s*0/)
})

test('el movimiento se apaga con prefers-reduced-motion', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const ts = await readFile('src/animaciones.ts', 'utf8')
  expect(css).toContain('@media (prefers-reduced-motion:reduce)')
  // Sin scroll suave y sin entradas: los bloques no se esconden para revelarse.
  expect(ts).toContain("matchMedia('(prefers-reduced-motion: reduce)').matches")
  expect(ts).toMatch(/if \(!reducido\) \{\s*gsap\.set\('\[data-reveal\]'/)
})

test('al imprimir no queda nada escondido', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  expect(css).toMatch(/@media print\{\s*\[data-enter\],\[data-reveal\],\[data-w\]\{opacity:1 !important/)
})

test('ninguna animación arranca con ease-in', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  // Sin los comentarios: ahí abajo está explicado justamente por qué no se usa.
  const declaraciones = css.replace(/\/\*[\s\S]*?\*\//g, '')
  // ease-in retrasa el movimiento justo en el instante que el visitante está
  // mirando, y hace que la misma duración se sienta más lenta.
  expect(declaraciones).not.toMatch(/[\s,:]ease-in[\s,;}]/)
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
  // Iconos dibujados a mano en una retícula de 24. La primera versión del sitio usaba una fuente de iconos y, cuando Google
  // Fonts no cargó, los iconos salieron como las palabras "chat" y "check".
  expect(html).toContain('class="ico"')
  expect(html).toContain('viewBox="0 0 24 24"')
  expect(html).not.toMatch(/material-symbols|font-awesome|<i class="(fa|icon)/)
})

test('los neutros del tema claro son agua, no papel templado', async () => {
  const css = await readFile('src/styles/site.css', 'utf8')
  const claro = css.slice(css.indexOf(':root{'), css.indexOf('}', css.indexOf(':root{')))
  // Durante una versión entera el tema claro fue beige: rojo por encima de
  // azul en todos los neutros. El producto es agua fría y el material de la
  // página decía panadería. Ahora el matiz es el del azul de marca, diluido.
  for (const token of ['--fondo', '--blanco', '--gris', '--tinta', '--tinta-2', '--tenue']) {
    const h = claro.match(new RegExp(`${token}:#([0-9a-f]{6})`))![1]!
    const r = parseInt(h.slice(0, 2), 16)
    const b = parseInt(h.slice(4, 6), 16)
    expect({ token, hex: `#${h}`, frio: b > r }).toEqual({ token, hex: `#${h}`, frio: true })
  }
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
    proceso: /class="paso"/g,
    planes: /class="plan"/g,
    productos: /class="card"/g,
    cobertura: /class="distrito"/g,
    preguntas: /class="qa"/g,
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
  const banda = html.slice(html.indexOf('id="precio"'), html.indexOf('id="productos"'))
  // Los tres precios confirmados por el negocio, y ninguno más. Si aparece
  // una cuarta cifra en esta banda, alguien se la ha inventado.
  const cifras = [...banda.matchAll(/data-count="(\d+)"/g)].map((m) => m[1])
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


/* --------------------------------------------------------------------------
   Fotos de producto
   -------------------------------------------------------------------------- */

test('cada foto de producto se sirve una sola vez', async () => {
  const { readdir } = await import('node:fs/promises')
  const fotos = (await readdir('public')).filter((f) => f.endsWith('.webp'))
  // Durante una versión se sirvieron dos familias: `producto-*` en lienzo
  // cuadrado para el catálogo y `objeto-*` recortada para las piezas sueltas.
  // Funcionaba, pero el visitante se descargaba las mismas dos fotos dos veces
  // —114 KB de más medidos en el navegador. Ahora hay un archivo por foto y el
  // encuadre viaja como dato en src/data/escala-fotos.ts.
  expect(fotos.filter((f) => f.startsWith('objeto-'))).toEqual([])

  // Y el dato existe para toda foto que el catálogo coloque.
  const [escalas, productos] = await Promise.all([
    readFile('src/data/escala-fotos.ts', 'utf8'),
    readFile('src/data/productos.ts', 'utf8'),
  ])
  const usadas = [...productos.matchAll(/activo\('\/([\w-]+)\.webp'\)/g)].map(([, n]) => n)
  expect(usadas.length).toBeGreaterThan(0)
  for (const foto of new Set(usadas)) {
    expect({ foto, tieneEscala: escalas.includes(`'${foto}':`) }).toEqual({ foto, tieneEscala: true })
  }
})


