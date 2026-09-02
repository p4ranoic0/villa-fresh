/**
 * El revelado de las series al entrar en pantalla.
 *
 * POR QUÉ NO ES `animation-timeline: view()`. Lo era, y estaba mal por una
 * razón que no se ve leyendo el CSS: una línea de tiempo de scroll ata el
 * avance de la animación a la posición del dedo. Si alguien baja de un
 * manotazo, la animación se consume entera en dos cuadros y el elemento
 * aparece de golpe; si sube, se deshace y el texto se vuelve a esconder. No
 * hay ningún valor de `animation-range` que arregle eso, porque el problema no
 * es el recorrido sino quién manda en el reloj.
 *
 * Aquí manda el reloj del navegador: el observador decide CUÁNDO empieza y la
 * transición decide CUÁNTO dura. Bajes como bajes, el elemento tarda lo mismo.
 *
 * Y se revela UNA vez. Volver a esconder algo que ya se leyó no es ritmo, es
 * una pestaña de contenido que parpadea.
 */

/** Las series, y sólo las series. Un revelado por elemento sería un tic. */
const SERIES = [
  '.paso',
  '.precios > div',
  '.cols3 > div',
  '.distritos .dist',
  '.qa',
  '.split > div > h2',
].join(',')

/** Escalonado entre hermanos que entran juntos, y su tope. */
const RETARDO = 90
const RETARDO_MAXIMO = 5

/**
 * Arranca el revelado. Devuelve la función que lo desmonta.
 *
 * Nada de esto ocurre si el visitante pidió menos movimiento: en ese caso no
 * se esconde ni un elemento, que es distinto de esconderlo y enseñarlo sin
 * transición.
 */
export function revelar(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const elementos = [...document.querySelectorAll<HTMLElement>(SERIES)]
  if (elementos.length === 0) return () => {}

  // Se miden todos ANTES de tocar ninguno: leer y escribir alternando obliga al
  // navegador a recalcular la maqueta en cada vuelta.
  const alcance = window.innerHeight * 0.92
  const porEsconder = elementos.filter((el) => el.getBoundingClientRect().top > alcance)

  // Lo que ya se ve al cargar no se esconde nunca. Si se escondiera, habría un
  // parpadeo entre el primer pintado y la hidratación: el HTML publicado ya
  // trae el texto, y taparlo para volver a enseñarlo medio segundo después es
  // exactamente el defecto que este archivo intenta evitar.
  for (const el of porEsconder) el.setAttribute('data-revela', '')

  const observador = new IntersectionObserver(
    (entradas) => {
      // El escalonado se reparte entre los que entran EN LA MISMA tanda, en
      // orden de documento: una fila de tres precios entra como una cascada y
      // no como un bloque. Con tope, porque doce distritos a 90 ms serían más
      // de un segundo de espera para el último.
      const entrando = entradas
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))

      entrando.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i, RETARDO_MAXIMO) * RETARDO}ms`
        el.setAttribute('data-visible', '')
        observador.unobserve(el)

        // Al terminar, el elemento vuelve a ser un elemento normal. Si se
        // quedaran los atributos, se quedaría también el retardo, y el hover
        // de un distrito tardaría medio segundo en responder.
        el.addEventListener(
          'transitionend',
          () => {
            el.style.transitionDelay = ''
            el.removeAttribute('data-revela')
            el.removeAttribute('data-visible')
          },
          { once: true },
        )
      })
    },
    // Se dispara cuando el elemento ya ha entrado un poco, no cuando asoma el
    // primer píxel: revelar algo que todavía está en el borde se ve a medias.
    { rootMargin: '0px 0px -12% 0px' },
  )
  for (const el of porEsconder) observador.observe(el)

  return () => observador.disconnect()
}
