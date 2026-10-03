import { useEffect, useRef } from 'react'
import { saltarContador } from '../animaciones'
import { urlWhatsApp } from '../data/negocio'
import { IconoBolsa, IconoGota } from './Iconos'

export const MENSAJE_PEDIR = 'Hola Villa Fresh, quiero pedir un bidón de 20L'

const ENLACES = [
  ['proceso', 'Proceso'],
  ['precio', 'Precios'],
  ['productos', 'Productos'],
  ['cobertura', 'Cobertura'],
  ['preguntas', 'Preguntas'],
] as const

interface Props {
  unidades: number
  onAbrirBolsa: () => void
}

export default function Nav({ unidades, onAbrirBolsa }: Props) {
  const contador = useRef<HTMLSpanElement>(null)
  const previas = useRef(unidades)

  useEffect(() => {
    if (unidades > previas.current) saltarContador(contador.current)
    previas.current = unidades
  }, [unidades])

  return (
    <nav className="nav">
      <div className="nav-in">
        <a href="#inicio" className="nav-marca">
          <IconoGota />
          <span>Villa Fresh</span>
        </a>
        <div className="nav-enlaces">
          {ENLACES.map(([id, rotulo]) => (
            <a key={id} href={`#${id}`}>{rotulo}</a>
          ))}
        </div>
        <div className="nav-acciones">
          <button type="button" className="nav-bolsa" onClick={onAbrirBolsa} aria-label="Ver bolsa">
            <IconoBolsa />
            {unidades > 0 && <span ref={contador} className="nav-contador">{unidades}</span>}
          </button>
          <a href={urlWhatsApp(MENSAJE_PEDIR)} target="_blank" rel="noopener" className="btn btn-sm">Pedir</a>
        </div>
      </div>
    </nav>
  )
}
