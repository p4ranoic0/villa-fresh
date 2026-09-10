import { useEffect, useRef } from 'react'
import { activo } from '../rutas-publicas'

/**
 * Las medidas viven juntas porque describen una sola coreografía. Cambiar sólo
 * una distancia en CSS separaría el fotograma del paso que pretende explicar.
 */
const SECUENCIA = {
  // Ancho Y ALTO. Fijar una escena que no cabe de alto esconde contenido sin
  // dejar forma de alcanzarlo: medido a 912x570 se perdian 4 px del cuarto
  // paso, y en una ventana mas baja se perderia el paso entero. A 900 px de
  // ancho la escena necesita 589 px desde el borde superior; 640 deja aire.
  escritorio: '(min-width: 900px) and (min-height: 640px)',
  movimientoReducido: '(prefers-reduced-motion: reduce)',
  distanciaScroll: 2400,
  numeroPasos: 4,
  suavizado: { activo: false, proporcion: 0.18 },
  margenPrecarga: '50% 0px',
  topeFijo: 96,
  tramoRevelado: 0.18,
  desplazamientoPaso: 30,
  margenFinalVideo: 0.05,
  umbralFotograma: 0.01,
} as const

const limitar = (valor: number) => Math.min(1, Math.max(0, valor))

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
    const videoEncontrado = video.current
    const bloqueEncontrado = bloque.current
    const cuerpoEncontrado = bloqueEncontrado?.closest<HTMLElement>('.proceso-cuerpo')
    const pasosEncontrados = cuerpoEncontrado
      ? [...cuerpoEncontrado.querySelectorAll<HTMLElement>('.paso')]
      : []
    if (
      !videoEncontrado ||
      !bloqueEncontrado ||
      !cuerpoEncontrado ||
      pasosEncontrados.length !== SECUENCIA.numeroPasos
    ) return
    const v = videoEncontrado
    const cuerpo = cuerpoEncontrado
    const pasos = pasosEncontrados

    const pantallaEscritorio = window.matchMedia(SECUENCIA.escritorio)
    const movimientoReducido = window.matchMedia(SECUENCIA.movimientoReducido)
    const conexion = (navigator as { connection?: { saveData?: boolean } }).connection
    let cuadro: number | null = null
    let observadorCarga: IntersectionObserver | null = null
    let observadorVista: IntersectionObserver | null = null
    let posicionPintada = 0
    let falloVideo = false

    /**
     * El borde superior recorre una distancia declarada y produce un valor
     * exacto entre cero y uno. Esa posición manda tanto en texto como en vídeo:
     * no queda estado acumulado que cambie al volver por el mismo sitio.
     *
     * Corre en requestAnimationFrame y no escuchando el scroll: el scroll
     * dispara muchas más veces de las que hay cuadros, y aquí no hay nada que
     * hacer entre cuadro y cuadro. El bucle solo existe mientras el bloque
     * está a la vista; lo arranca y lo para el observador de abajo.
     */
    function pintarPosicionNativa() {
      const caja = cuerpo.getBoundingClientRect()
      const avance = limitar((SECUENCIA.topeFijo - caja.top) / SECUENCIA.distanciaScroll)
      pasos.forEach((paso, indice) => {
        // El primer paso abre la escena; los siguientes entran al comenzar su
        // cuarto del vídeo, no después de que la imagen ya lo haya contado.
        const avancePaso = indice === 0
          ? 1
          : limitar((avance * SECUENCIA.numeroPasos - indice) / SECUENCIA.tramoRevelado)
        paso.style.setProperty('--paso-opacidad', String(avancePaso))
        paso.style.setProperty(
          '--paso-desplazamiento',
          `${(1 - avancePaso) * SECUENCIA.desplazamientoPaso}px`,
        )
        const actual = Math.min(
          SECUENCIA.numeroPasos - 1,
          Math.floor(avance * SECUENCIA.numeroPasos),
        )
        paso.toggleAttribute('data-paso-actual', indice === actual)
      })

      // Hasta que no hay metadatos, `duration` es NaN. Sin esta guarda el
      // primer cuadro mete NaN en la posición y ya no sale nunca: el vídeo se
      // queda clavado en el primer fotograma para el resto de la visita.
      if (!Number.isFinite(v.duration) || v.readyState < 2) return

      const posicionExacta = avance * Math.max(0, v.duration - SECUENCIA.margenFinalVideo)
      posicionPintada = SECUENCIA.suavizado.activo
        ? posicionPintada + (posicionExacta - posicionPintada) * SECUENCIA.suavizado.proporcion
        : posicionExacta
      if (Math.abs(v.currentTime - posicionPintada) > SECUENCIA.umbralFotograma) {
        v.currentTime = posicionPintada
      }
    }

    function avanzar() {
      if (!video.current || !bloque.current || !cuerpo.hasAttribute('data-secuencia-activa')) return
      cuadro = requestAnimationFrame(avanzar)
      pintarPosicionNativa()
    }

    function detenerCuadro() {
      if (cuadro !== null) {
        cancelAnimationFrame(cuadro)
        cuadro = null
      }
    }

    function desactivar() {
      detenerCuadro()
      observadorCarga?.disconnect()
      observadorVista?.disconnect()
      observadorCarga = null
      observadorVista = null
      cuerpo.removeAttribute('data-secuencia-activa')
      cuerpo.style.removeProperty('--distancia-proceso')
      cuerpo.style.removeProperty('--tope-proceso')
      pasos.forEach((paso) => {
        paso.removeAttribute('data-paso-actual')
        // Si el revelado general alcanzó a observar la lista antes de un
        // cambio de ancho, sus marcas no pueden ocultarla al volver a móvil.
        paso.removeAttribute('data-revela')
        paso.removeAttribute('data-visible')
        paso.style.removeProperty('transition-delay')
        paso.style.removeProperty('--paso-opacidad')
        paso.style.removeProperty('--paso-desplazamiento')
      })
    }

    function activar() {
      cuerpo.style.setProperty('--distancia-proceso', `${SECUENCIA.distanciaScroll}px`)
      cuerpo.style.setProperty('--tope-proceso', `${SECUENCIA.topeFijo}px`)
      cuerpo.setAttribute('data-secuencia-activa', '')
      pintarPosicionNativa()

      observadorCarga = new IntersectionObserver(
        ([entrada]) => {
          if (!entrada?.isIntersecting || v.src) return
          v.preload = 'auto'
          v.src = activo('/proceso-agua.mp4')
          observadorCarga?.disconnect()
          observadorCarga = null
        },
        // Una ventana y media deja margen a la red sin pagar el vídeo al abrir.
        { rootMargin: SECUENCIA.margenPrecarga },
      )
      observadorCarga.observe(cuerpo)

      observadorVista = new IntersectionObserver(([entrada]) => {
        if (entrada?.isIntersecting) {
          if (cuadro === null) cuadro = requestAnimationFrame(avanzar)
        } else {
          detenerCuadro()
        }
      })
      observadorVista.observe(cuerpo)
    }

    function conciliarModo() {
      desactivar()
      // En cualquiera de estos casos la versión completa es el flujo HTML:
      // no se fija la sección y el archivo de vídeo no llega a solicitarse.
      if (
        pantallaEscritorio.matches &&
        !movimientoReducido.matches &&
        conexion?.saveData !== true &&
        !falloVideo
      ) {
        activar()
      }
    }

    function alFallarVideo() {
      falloVideo = true
      desactivar()
    }

    pantallaEscritorio.addEventListener('change', conciliarModo)
    movimientoReducido.addEventListener('change', conciliarModo)
    v.addEventListener('error', alFallarVideo)
    conciliarModo()

    return () => {
      pantallaEscritorio.removeEventListener('change', conciliarModo)
      movimientoReducido.removeEventListener('change', conciliarModo)
      v.removeEventListener('error', alFallarVideo)
      desactivar()
    }
  }, [])

  return (
    <figure className="visor" ref={bloque}>
      <video
        ref={video}
        className="visor-video"
        poster={activo('/proceso-agua.webp')}
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
