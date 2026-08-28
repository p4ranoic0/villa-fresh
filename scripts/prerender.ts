/* ==========================================================================
   Escribe el HTML final de cada ruta. Corre en Bun después de los dos builds
   de Vite. Si una ruta falla al renderizar, el proceso termina con código 1:
   preferimos un build roto a publicar una página vacía.
   ========================================================================== */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { RUTAS } from '../src/rutas'
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

function cabecera(title: string, description: string): string {
  return [
    `<title>${escapar(title)}</title>`,
    `<meta name="description" content="${escapar(description)}">`,
  ].join('\n')
}

// Se lee una sola vez, antes del bucle: dist/index.html es a la vez plantilla y salida.
const plantilla = await readFile(join(DIST, 'index.html'), 'utf8')

try {
  for (const ruta of RUTAS) {
    const html = render(ruta.path)
    if (!html.trim()) throw new Error(`${ruta.path} renderizó vacío`)

    const salida = plantilla
      .replace('<!--app-head-->', cabecera(ruta.title, ruta.description))
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
