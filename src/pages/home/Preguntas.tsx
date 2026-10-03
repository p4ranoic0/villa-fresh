import { useState } from 'react'
import { PREGUNTAS } from '../../data/contenido'

export default function Preguntas() {
  // La primera viene abierta, como en el diseño.
  const [abierta, setAbierta] = useState(0)

  return (
    <section id="preguntas" className="seccion">
      <div className="contenedor contenedor-angosto">
        <h2 data-reveal="" className="titulo-seccion preguntas-titulo">Lo que más<br />nos preguntan.</h2>
        {PREGUNTAS.map((p, i) => {
          const abierto = abierta === i
          return (
            <div key={p.q} data-reveal="" className="qa">
              <button
                type="button"
                className="qa-boton"
                aria-expanded={abierto}
                onClick={() => setAbierta(abierto ? -1 : i)}
              >
                <span className="qa-pregunta">{p.q}</span>
                <span className="qa-signo" aria-hidden="true">+</span>
              </button>
              {abierto && <p className="qa-respuesta">{p.a}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
