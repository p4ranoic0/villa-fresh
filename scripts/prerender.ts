/* ==========================================================================
   Escribe el HTML final de cada ruta. Corre en Bun después de los dos builds
   de Vite. Si una ruta falla al renderizar, el proceso termina con código 1:
   preferimos un build roto a publicar una página vacía.
   ========================================================================== */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { NEGOCIO } from '../src/data/negocio'
import { PRODUCTOS } from '../src/data/productos'
import { RUTAS, SITIO_URL } from '../src/rutas'
import type { MetaRuta } from '../src/rutas'
import type { Producto } from '../src/types'
// @ts-expect-error — lo genera `vite build --ssr` justo antes de este script
import { render } from '../dist-ssr/entry-server.js'

const DIST = join(import.meta.dir, '..', 'dist')

function escapar(texto: string): string {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function urlAbsoluta(rutaPublica: string): string {
  return new URL(rutaPublica, `${SITIO_URL}/`).href
}

function datosEstructurados(ruta: MetaRuta): string {
  const conPrecio = PRODUCTOS.filter(
    (producto): producto is Producto & { precio: number } => producto.precio !== null,
  )
  const precios = conPrecio.map((producto) => producto.precio)
  const esquema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: NEGOCIO.nombre,
        slogan: NEGOCIO.eslogan,
        description: ruta.description,
        telephone: `+51 ${NEGOCIO.telefonoVisible}`,
        areaServed: NEGOCIO.areaAtendida,
        sameAs: [NEGOCIO.facebook, NEGOCIO.instagram],
        image: urlAbsoluta(ruta.imagenOg),
        url: `${SITIO_URL}${ruta.path}`,
        priceRange: `S/ ${Math.min(...precios)}–${Math.max(...precios)}`,
      },
      ...conPrecio.map((producto) => ({
        '@type': 'Product',
        sku: producto.sku,
        name: producto.nombre,
        description: producto.desc,
        image: urlAbsoluta(producto.imagen),
        offers: {
          '@type': 'Offer',
          price: producto.precio,
          priceCurrency: NEGOCIO.monedaIso,
        },
      })),
    ],
  }

  // Evita que un texto futuro pueda cerrar la etiqueta script desde los datos.
  const json = JSON.stringify(esquema).replaceAll('<', '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

function cabecera(ruta: MetaRuta): string {
  const url = `${SITIO_URL}${ruta.path}`
  const imagen = urlAbsoluta(ruta.imagenOg)
  return [
    `<title>${escapar(ruta.title)}</title>`,
    `<meta name="description" content="${escapar(ruta.description)}">`,
    `<meta property="og:title" content="${escapar(ruta.title)}">`,
    `<meta property="og:description" content="${escapar(ruta.description)}">`,
    `<meta property="og:image" content="${escapar(imagen)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:url" content="${escapar(url)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<link rel="canonical" href="${escapar(url)}">`,
    datosEstructurados(ruta),
  ].join('\n')
}

async function escribirArchivosSeo(): Promise<void> {
  const robots = `User-agent: *\nAllow: /\nSitemap: ${SITIO_URL}/sitemap.xml\n`
  const urls = RUTAS.map(
    (ruta) => `  <url><loc>${escapar(`${SITIO_URL}${ruta.path}`)}</loc></url>`,
  ).join('\n')
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')

  await Promise.all([
    writeFile(join(DIST, 'robots.txt'), robots, 'utf8'),
    writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8'),
  ])
  console.log('✓ dist/robots.txt')
  console.log('✓ dist/sitemap.xml')
}

// Se lee una sola vez, antes del bucle: dist/index.html es a la vez plantilla y salida.
const plantilla = await readFile(join(DIST, 'index.html'), 'utf8')

try {
  for (const ruta of RUTAS) {
    const html = render(ruta.path)
    if (!html.trim()) throw new Error(`${ruta.path} renderizó vacío`)

    const salida = plantilla
      .replace('<!--app-head-->', cabecera(ruta))
      .replace('<!--app-html-->', html)

    const destino = join(DIST, ruta.archivo)
    await mkdir(dirname(destino), { recursive: true })
    await writeFile(destino, salida, 'utf8')
    console.log(`✓ dist/${ruta.archivo}`)
  }
  await escribirArchivosSeo()
} catch (error) {
  console.error('✗ Falló el pre-renderizado. No se publica HTML incompleto.')
  console.error(error)
  process.exit(1)
}
