/* ==========================================================================
   El encuadre de una foto de producto, listo para pasarlo a CSS.

   Dos variables, y las dos existen por un motivo medido:

   --ratio  La envoltura que sostiene la sombra tiene que medir EXACTAMENTE lo
            que la foto. Cuando no lo hacía —la envoltura salía a 322 px y la
            foto a 149— la elipse se centraba en la envoltura y no en el
            objeto, y la sombra aparecía 86 px a la derecha del bidón en vez de
            debajo. Con la proporción fijada, el ancho sale del alto y no queda
            nada al azar del ajuste automático.

   --escala Cuánto del lienzo cuadrado común ocupaba el producto de alto. Es lo
            que mantiene la foto de grupo más baja que la del bidón suelto.
            Ver src/data/escala-fotos.ts.
   ========================================================================== */
import type { CSSProperties } from 'react'
import { ENCUADRE } from './escala-fotos'

/** Acepta la ruta pública de la foto («/villa-fresh/producto-bidon-20l.webp»). */
export function encuadreDe(imagen: string): CSSProperties {
  const foto = imagen.split('/').pop()!.replace('.webp', '')
  const e = ENCUADRE[foto]
  return { '--escala': e?.escala ?? 1, '--ratio': e?.ratio ?? 1 } as CSSProperties
}
