import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { NEGOCIO } from '../data/negocio'
import BotonTema from './BotonTema'
import Isotipo from './Isotipo'

interface Props {
  /** Bloque de acción a la derecha: el botón del pedido. */
  accion: ReactNode
}

/**
 * Marca el documento en cuanto la barra deja de estar apoyada en el borde
 * superior de la página.
 *
 * La barra ya era `sticky`, pero se quedaba exactamente igual arriba del todo
 * que flotando sobre el contenido, y eso es lo que hace que una página se
 * sienta impresa: no acusa que la estás recorriendo. Con la marca, la barra se
 * estrecha y se despega del fondo, que es la única señal que da la página de
 * que hay alguien moviéndola.
 *
 * Es un testigo de un píxel y un observador, no un escuchador de scroll: el
 * scroll dispara muchísimas más veces de las que aquí hay algo que decidir.
 */
function useDesplazado(testigo: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const t = testigo.current
    if (!t) return
    const raiz = document.documentElement
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada) return
      if (entrada.isIntersecting) raiz.removeAttribute('data-desplazado')
      else raiz.setAttribute('data-desplazado', '')
    })
    observador.observe(t)
    return () => {
      observador.disconnect()
      raiz.removeAttribute('data-desplazado')
    }
  }, [testigo])
}

export default function Nav({ accion }: Props) {
  const testigo = useRef<HTMLDivElement>(null)
  useDesplazado(testigo)

  return (
    <>
      <div className="testigo-tope" ref={testigo} aria-hidden="true" />
      <nav className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#inicio">
            <Isotipo ancho={26} alto={31} />
            <span>
              <span className="brand-name">Villa Fresh</span>
              <span className="brand-tag">Agua de mesa · Lima</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#proceso">Proceso</a>
            <a href="#productos">Productos</a>
            <a href="#cobertura">Cobertura</a>
            <a href="#preguntas">Preguntas</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span className="nav-tel">{NEGOCIO.telefonoVisible}</span>
            <BotonTema />
            {accion}
          </div>
        </div>
      </nav>
    </>
  )
}
