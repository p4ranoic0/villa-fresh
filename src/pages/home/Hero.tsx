import type { CSSProperties } from 'react'
import { MENSAJE_PEDIR } from '../../components/Nav'
import { urlWhatsApp } from '../../data/negocio'
import { activo } from '../../rutas-publicas'

/** Los cuatro datos que aparecen a los lados del bidón. */
const DATOS = [
  { lado: 'izq', top: '30%', inicio: 0.55, rotulo: 'Tratamiento', valor: 'Ósmosis inversa' },
  { lado: 'izq', top: '58%', inicio: 0.65, rotulo: 'Envase', valor: 'Sellado en planta' },
  { lado: 'der', top: '33%', inicio: 0.6, rotulo: 'Alcalina', valor: 'pH 8.3', acento: true },
  { lado: 'der', top: '61%', inicio: 0.7, rotulo: 'Entrega', valor: 'El mismo día' },
] as const

/**
 * La portada se queda fija mientras se recorren 260vh: el titular se aleja,
 * el bidón sube y crece, y los datos entran por los lados. Todo cuelga de una
 * sola variable, --p (0 → 1), que escribe animaciones.ts.
 */
export default function Hero() {
  return (
    <header id="inicio" className="hero" data-escena="hero">
      <div className="escena-fija hero-fija">
        <div className="hero-texto">
          <span data-enter="" className="rotulo">Agua de mesa purificada · Lima</span>
          <h1 data-enter="" className="hero-titulo">
            <span>Hacemos el agua.</span>
            <span className="hero-titulo-2">Te la llevamos hoy.</span>
          </h1>
          <p data-enter="" className="hero-bajada">Planta propia en Lima. Ósmosis inversa, pH 8.3 y ozonización. De ahí a tu puerta, sin intermediarios.</p>
          <div data-enter="" className="hero-acciones">
            <a href={urlWhatsApp(MENSAJE_PEDIR)} target="_blank" rel="noopener" className="btn btn-lg">Pedir por WhatsApp</a>
            <a href="#precio" className="enlace-lg">Ver precios ›</a>
          </div>
        </div>

        <div className="hero-bidon">
          <div data-enter="bidon" className="hero-bidon-in">
            <div className="hero-sombra" />
            <img src={activo('/producto-bidon-20l.webp')} alt="Bidón de 20 litros de Villa Fresh, sellado" />
          </div>
        </div>

        <div className="hero-datos" aria-hidden="true">
          {DATOS.map((d) => (
            <div
              key={d.rotulo}
              className={`hero-dato hero-dato-${d.lado}`}
              style={{ top: d.top, '--inicio': d.inicio } as CSSProperties}
            >
              <div className="rotulo-sm">{d.rotulo}</div>
              <div className={'acento' in d ? 'hero-dato-valor acento' : 'hero-dato-valor'}>{d.valor}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
