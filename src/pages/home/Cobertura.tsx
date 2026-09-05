import { urlWhatsApp } from '../../data/negocio'

/**
 * Distritos de referencia, no la ruta cerrada.
 *
 * Sólo Surquillo sale de las redes, y como pregunta de un cliente. Los once
 * restantes son referencia mientras el negocio confirma el reparto real, y por
 * eso la sección dice «consulta el tuyo» en vez de presentarlos como cobertura
 * garantizada. Ver contenido/verificacion.md, punto 03.
 */
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
            <h2 style={{ marginTop: 18 }}>Repartimos<br />en Lima.</h2>
          </div>
          <p className="lede" style={{ maxWidth: '46ch' }}>Repartimos en Lima Metropolitana. Estos son distritos de referencia, no la lista cerrada: <strong style={{ fontWeight: 600 }}>consulta el tuyo por WhatsApp</strong> y te confirmamos en el momento si llegamos y en qué horario.</p>
        </div>
        <div className="distritos">
          {DISTRITOS.map((distrito) => <div className="dist" key={distrito}>{distrito}</div>)}
        </div>
        {/* Aquí iba «ENTREGA EL MISMO DÍA · CONSULTA TU DISTRITO» en monoespaciada
            versalita: repetía palabra por palabra lo que la bajada de esta misma
            sección dice cinco líneas más arriba. Cero información y las tres
            señales del disfraz juntas. Queda el botón solo. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 24, flexWrap: 'wrap', marginTop: 32 }}>
          <a className="btn btn-cyan" href={urlWhatsApp('Hola, ¿llegan a mi distrito?')} target="_blank" rel="noopener">¿Llegan a mi distrito?</a>
        </div>
      </div>
    </section>
  )
}
