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
   ========================================================================== */
export const ESCALA_FOTO: Record<string, number> = {
  'producto-bidon-20l': 0.8789,
  'producto-bidones': 0.7197,
  'producto-botella': 0.8789,
  'producto-dispensador': 0.8789,
}
