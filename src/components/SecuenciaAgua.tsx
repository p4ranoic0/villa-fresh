import { useEffect, useRef } from 'react'

/** Ancho a partir del cual vale la pena traerse el vídeo. */
const ANCHO_MINIMO = '(min-width: 900px)'

/**
 * El vídeo de la sección de proceso, sincronizado con el scroll.
 *
 * Es progresivo de arriba a abajo. Lo que viaja en el HTML publicado es el
 * póster: una imagen de 17 KB que ya cuenta lo mismo. El vídeo (570 KB) solo
 * se pide cuando se cumplen las tres condiciones de abajo, y aun entonces
 * solo cuando la sección se acerca a la ventana. En un móvil con datos
 * limitados esta pieza no cuesta un solo byte de más.
 *
 * El HTML que renderiza el servidor y el que hidrata el navegador son el
 * mismo: el `src` no está en el JSX, se pone después de decidir. Sin eso, el
 * pre-render y la hidratación no coincidirían.
 */
export default function SecuenciaAgua() {
  const bloque = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    const b = bloque.current
    if (!v || !b) return

    // Tres razones para no traerse el vídeo, y ninguna es discutible:
    // la pantalla es estrecha, el visitante pidió menos movimiento, o el
    // sistema operativo dice que está ahorrando datos.
    const conexion = (navigator as { connection?: { saveData?: boolean } }).connection
    if (
      !window.matchMedia(ANCHO_MINIMO).matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      conexion?.saveData === true
    ) {
      return
    }

    let cuadro = 0
    let posicion = 0

    /**
     * Avanza el vídeo según lo que le falta al bloque para cruzar la ventana.
     *
     * Corre en requestAnimationFrame y no escuchando el scroll: el scroll
     * dispara muchas más veces de las que hay cuadros, y aquí no hay nada que
     * hacer entre cuadro y cuadro. El bucle solo existe mientras el bloque
     * está a la vista; lo arranca y lo para el observador de abajo.
     */
    function avanzar() {
      const v = video.current
      const b = bloque.current
      if (!v || !b) return
      cuadro = requestAnimationFrame(avanzar)

      // Hasta que no hay metadatos, `duration` es NaN. Sin esta guarda el
      // primer cuadro mete NaN en `posicion` y ya no sale nunca: el vídeo se
      // queda clavado en el primer fotograma para el resto de la visita.
      if (!Number.isFinite(v.duration) || v.readyState < 2) return

      const caja = b.getBoundingClientRect()
      const recorrido = caja.height + window.innerHeight
      const avance = Math.min(1, Math.max(0, (window.innerHeight - caja.top) / recorrido))

      // El destino se persigue, no se copia. Sin esta interpolación el vídeo
      // va clavado al dedo y se siente mecánico; con ella el agua parece
      // llevar su propia inercia.
      const destino = avance * Math.max(0, v.duration - 0.05)
      posicion += (destino - posicion) * 0.18
      if (Math.abs(v.currentTime - posicion) > 0.01) v.currentTime = posicion
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada) return
        if (entrada.isIntersecting) {
          if (!v.src) {
            v.preload = 'auto'
            v.src = '/proceso-agua.mp4'
          }
          if (!cuadro) cuadro = requestAnimationFrame(avanzar)
        } else if (cuadro) {
          cancelAnimationFrame(cuadro)
          cuadro = 0
        }
      },
      // Se adelanta media ventana para que el vídeo llegue cargado.
      { rootMargin: '50% 0px' },
    )
    observador.observe(b)

    return () => {
      observador.disconnect()
      if (cuadro) cancelAnimationFrame(cuadro)
    }
  }, [])

  return (
    <figure className="visor" ref={bloque}>
      <video
        ref={video}
        className="visor-video"
        poster="/proceso-agua.webp"
        preload="none"
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />
      <figcaption className="lbl visor-pie">Agua en movimiento · Imagen de archivo con licencia</figcaption>
    </figure>
  )
}
