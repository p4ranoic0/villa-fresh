import { urlWhatsApp } from '../../data/negocio'

const DISTRITOS = [
  'Surquillo',
  'Miraflores',
  'San Isidro',
  'Barranco',
  'Surco',
  'San Borja',
  'La Molina',
  'Lince',
  'Jesús María',
  'Magdalena',
  'Pueblo Libre',
  'San Miguel',
]

export default function Cobertura() {
  return (
    <section className="band" id="cobertura">
      <div className="wrap">
        <div className="split">
          <div>
            <span className="lbl lbl-cyan">Cobertura</span>
            <h2 style={{ marginTop: 18 }}>Repartimos<br />en Lima.</h2>
          </div>
          <p className="lede" style={{ maxWidth: '46ch' }}>Ruta diaria por Lima Metropolitana. Si tu distrito no está en la lista, escríbenos igual: se coordina según la ruta del día.</p>
        </div>
        <p className="ph" style={{ marginBottom: 22 }}>[ Distritos referenciales — confirmar la ruta real de reparto ]</p>
        <div className="distritos">
          {DISTRITOS.map((distrito) => <div className="dist" key={distrito}>{distrito}</div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginTop: 32 }}>
          <span className="mono" style={{ fontSize: '12px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)' }}>Ruta diaria · Entrega el mismo día</span>
          <a className="btn btn-ghost" href={urlWhatsApp('Hola, ¿llegan a mi distrito?')} target="_blank" rel="noopener">¿Llegan a mi distrito?</a>
        </div>
      </div>
    </section>
  )
}
