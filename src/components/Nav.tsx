import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { NEGOCIO } from '../data/negocio'
import BotonTema from './BotonTema'
import Isotipo from './Isotipo'

interface Props {
  /** Bloque de acción a la derecha: el botón del pedido. */
  accion: ReactNode
}

export default function Nav({ accion }: Props) {
  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link className="brand" to="/">
          <Isotipo ancho={26} alto={31} />
          <span>
            <span className="brand-name">Villa Fresh</span>
            <span className="brand-tag">Agua de mesa · Lima</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="/#proceso">Proceso</a>
          <a href="/#productos">Productos</a>
          <a href="/#cobertura">Cobertura</a>
          <a href="/#preguntas">Preguntas</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="nav-tel">{NEGOCIO.telefonoVisible}</span>
          <BotonTema />
          {accion}
        </div>
      </div>
    </nav>
  )
}
