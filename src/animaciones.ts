/**
 * El movimiento de la portada: GSAP con ScrollTrigger para lo que sigue al
 * scroll, y Lenis para que el propio scroll tenga inercia.
 *
 * Todo se engancha a atributos del marcado, no a clases de estilo:
 *   data-escena="hero|frase|proceso"  secciones fijas que avanzan con el scroll
 *   data-enter                        entrada en cascada de la portada
 *   data-w                            palabras de la frase que se iluminan
 *   data-step / data-counter          etapas del proceso
 *   data-zoom                         la foto de los planes que se acerca
 *   data-reveal                       bloques que suben al entrar en pantalla
 *   data-count                        cifras que cuentan hacia arriba
 *
 * El HTML publicado ya trae cada elemento en su estado final. Lo único que se
 * esconde antes de que cargue el JavaScript es la entrada de la portada, y lo
 * hace el script de index.html con la clase `vf-entrada`, que se retira sola a
 * los tres segundos si esto no llegara a arrancar.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/** Alto de la barra fija: los anclajes se detienen debajo de ella. */
const ALTO_NAV = 52

let lenis: Lenis | null = null

/** Detiene el scroll de la página (la bolsa abierta) o lo devuelve. */
export function pausarScroll(pausar: boolean): void {
  document.body.style.overflow = pausar ? 'hidden' : ''
  if (lenis) pausar ? lenis.stop() : lenis.start()
}

/** Lleva la página a una sección, con el mismo recorrido suave del menú. */
export function irA(id: string): void {
  const destino = document.getElementById(id)
  if (!destino) return
  if (lenis) lenis.scrollTo(destino, { offset: id === 'inicio' ? 0 : -ALTO_NAV, duration: 1.4 })
  else window.scrollTo({ top: destino.getBoundingClientRect().top + window.scrollY - ALTO_NAV, behavior: 'smooth' })
}

/** El pequeño salto del contador de la bolsa al agregar un producto. */
export function saltarContador(contador: HTMLElement | null): void {
  if (!contador || movimientoReducido()) return
  gsap.fromTo(contador, { scale: 1.5 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' })
}

function movimientoReducido(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Arranca todo. Devuelve la función que lo desmonta. */
export function iniciarAnimaciones(): () => void {
  gsap.registerPlugin(ScrollTrigger)
  const reducido = movimientoReducido()
  const raiz = document.documentElement
  const escena = (nombre: string) => document.querySelector<HTMLElement>(`[data-escena="${nombre}"]`)
  const hero = escena('hero')
  const frase = escena('frase')
  const proceso = escena('proceso')

  // Desplazamiento suave. Con «reducir movimiento» se queda el scroll nativo.
  let alPulsarAncla: ((e: MouseEvent) => void) | null = null
  let latidoLenis: ((tiempo: number) => void) | null = null
  if (!reducido) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    latidoLenis = (tiempo) => lenis?.raf(tiempo * 1000)
    gsap.ticker.add(latidoLenis)
    gsap.ticker.lagSmoothing(0)
    alPulsarAncla = (e) => {
      const ancla = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!ancla) return
      const id = ancla.getAttribute('href')!.slice(1)
      if (!document.getElementById(id)) return
      e.preventDefault()
      irA(id)
    }
    document.addEventListener('click', alPulsarAncla)
  }

  let ultimoPaso = -1
  const pintarPasos = (progreso: number) => {
    if (!proceso) return
    const activo = Math.min(3, Math.floor(progreso * 4))
    if (activo === ultimoPaso) return
    ultimoPaso = activo
    proceso.querySelectorAll<HTMLElement>('[data-step]').forEach((paso, i) => {
      paso.style.opacity = i === activo ? '1' : '0.3'
    })
    const contador = proceso.querySelector<HTMLElement>('[data-counter]')
    if (contador) {
      contador.textContent = String(activo + 1)
      if (!reducido) gsap.fromTo(contador, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' })
    }
  }

  const contexto = gsap.context(() => {
    if (!reducido) {
      const textos = gsap.utils.toArray<HTMLElement>('[data-enter]').filter((el) => el.dataset.enter !== 'bidon')
      gsap.fromTo(textos, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.1 })
      gsap.fromTo('[data-enter="bidon"]', { opacity: 0, y: 80, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: 'expo.out', delay: 0.45 })
    }
    // Ya hay estilos en línea mandando; la clase de espera puede irse.
    raiz.classList.remove('vf-entrada')

    const arrastre = reducido ? true : 0.8
    if (hero) {
      gsap.set(hero, { '--p': 0 })
      gsap.to(hero, { '--p': 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: arrastre } })
    }
    if (frase) {
      const palabras = frase.querySelectorAll('[data-w]')
      gsap.set(palabras, { opacity: 0.16 })
      gsap.to(palabras, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: frase, start: 'top top', end: 'bottom bottom', scrub: reducido ? true : 0.6 } })
    }
    if (proceso) {
      gsap.set(proceso, { '--p': 0 })
      gsap.to(proceso, {
        '--p': 1, ease: 'none',
        scrollTrigger: { trigger: proceso, start: 'top top', end: 'bottom bottom', scrub: arrastre, onUpdate: (st) => pintarPasos(st.progress) },
      })
      pintarPasos(0)
    }
    gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el) => {
      gsap.fromTo(el, { '--z': 0 }, { '--z': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: arrastre } })
    })
    if (!reducido) {
      gsap.set('[data-reveal]', { opacity: 0, y: 40 })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%', once: true,
        onEnter: (tanda) => gsap.to(tanda, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, overwrite: true }),
      })
    }
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const hasta = Number(el.dataset.count)
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          const cifra = { v: 0 }
          gsap.to(cifra, { v: hasta, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(cifra.v)) } })
        },
      })
    })
  })
  ScrollTrigger.refresh()

  // Si el reloj de GSAP no avanza (pestaña en segundo plano, captura, impresión)
  // nada de lo escondido se quedaría escondido: se enseña todo tal cual.
  const cuadroInicial = gsap.ticker.frame
  const salvavidas = window.setTimeout(() => {
    if (gsap.ticker.frame - cuadroInicial >= 3) return
    gsap.set('[data-enter],[data-reveal]', { opacity: 1, y: 0, scale: 1, clearProps: 'transform' })
    gsap.set('[data-w]', { opacity: 1 })
  }, 1500)

  // Las fuentes cambian el alto del texto, y con él dónde empieza cada escena.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return () => {
    window.clearTimeout(salvavidas)
    contexto.revert()
    if (alPulsarAncla) document.removeEventListener('click', alPulsarAncla)
    if (latidoLenis) gsap.ticker.remove(latidoLenis)
    lenis?.destroy()
    lenis = null
  }
}
