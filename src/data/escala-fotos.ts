/* ==========================================================================
   GENERADO POR scripts/marcar-producto.py — no editar a mano.

   Cuanto ocupaba de alto cada producto dentro del lienzo cuadrado comun de
   los archivos de marca. Casi todos lo llenan (0.879): el bidon y la botella
   salen a la misma altura y solo cambia la silueta. El que dice algo es el
   de la foto de grupo (0.720): tres bidones en fila tienen que caber a lo
   ancho, y por eso van mas bajos. Sin ese numero, cada bidon del grupo se
   veria mas grande que el bidon suelto de la tarjeta de al lado.

   Vivia escondido como aire transparente dentro de cada .webp. Ahora las
   fotos van recortadas al objeto —una sola por foto, sin descargar la misma
   imagen dos veces— y el encuadre viaja aparte, donde se puede leer.

   `ratio` es el ancho partido por el alto del recorte. La envoltura que
   sostiene la sombra tiene que medir exactamente lo que la foto: si es mas
   ancha, la elipse se centra en la envoltura y no en el objeto, y la sombra
   sale desplazada al lado del bidon en vez de debajo.
   ========================================================================== */
export interface Encuadre {
  /** Fraccion del alto del lienzo comun que ocupaba el producto. */
  escala: number
  /** Ancho / alto del recorte. */
  ratio: number
}

export const ENCUADRE: Record<string, Encuadre> = {
  'producto-bidon-20l': { escala: 0.8789, ratio: 0.5284 },
  'producto-bidones': { escala: 0.7197, ratio: 1.2212 },
  'producto-botella': { escala: 0.8789, ratio: 0.2710 },
  'producto-dispensador': { escala: 0.8789, ratio: 0.4057 },
}
