import { DISTRITOS } from '../../data/contenido'
import { urlWhatsApp } from '../../data/negocio'

export default function Cobertura() {
  return (
    <section id="cobertura" className="seccion seccion-blanca">
      <div className="contenedor cobertura">
        <div data-reveal="">
          <h2 className="titulo-seccion">Repartimos<br />en Lima.</h2>
          <p className="bajada">Distritos de referencia, no la lista cerrada. Consulta el tuyo y te confirmamos en el momento si llegamos y en qué horario.</p>
          <a href={urlWhatsApp('Hola, ¿llegan a mi distrito?')} target="_blank" rel="noopener" className="btn btn-lg cobertura-cta">¿Llegan a mi distrito?</a>
        </div>
        <div className="distritos">
          {DISTRITOS.map((nombre) => (
            <span key={nombre} data-reveal="" className="distrito">{nombre}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
