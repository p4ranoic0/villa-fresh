/* ==========================================================================
   Escribe el HTML final de cada ruta. Corre en Bun después de los dos builds
   de Vite. Si una ruta falla al renderizar, el proceso termina con código 1:
   preferimos un build roto a publicar una página vacía.
   ========================================================================== */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { RUTAS, SITIO_URL } from '../src/rutas'
import type { MetaRuta } from '../src/rutas'
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

function cabecera(ruta: MetaRuta): string {
  const url = `${SITIO_URL}${ruta.path}`
  const imagen = `${SITIO_URL}${ruta.imagenOg}`
  return [
    `<title>${escapar(ruta.title)}</title>`,
    `<meta name="description" content="${escapar(ruta.description)}">`,
    `<meta property="og:title" content="${escapar(ruta.title)}">`,
    `<meta property="og:description" content="${escapar(ruta.description)}">`,
    `<meta property="og:image" content="${escapar(imagen)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:url" content="${escapar(url)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
  ].join('\n')
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
} catch (error) {
  console.error('✗ Falló el pre-renderizado. No se publica HTML incompleto.')
  console.error(error)
  process.exit(1)
}
