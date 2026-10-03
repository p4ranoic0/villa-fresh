import { PASOS } from '../../data/contenido'
import { activo } from '../../rutas-publicas'

/** La sección queda fija y avanza por las cuatro etapas con el scroll. */
export default function Proceso() {
  return (
    <section id="proceso" className="proceso" data-escena="proceso">
      <div className="escena-fija proceso-fija">
        <div className="proceso-grid">
          <div>
            <div className="rotulo rotulo-oscuro">Proceso</div>
            <h2 className="proceso-titulo">De la planta<br />a tu vaso.</h2>
            <div className="pasos">
              {PASOS.map((paso) => (
                <div key={paso.n} className="paso" data-step="">
                  <span className="paso-n">{paso.n}</span>
                  <div>
                    <h3>{paso.titulo}</h3>
                    <p>{paso.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figure className="proceso-foto">
            <img src={activo('/proceso-agua.webp')} alt="" />
            <div className="proceso-barra"><div /></div>
            <div className="proceso-pie">
              <span className="proceso-contador" data-counter="">1</span>
              <span className="rotulo-sm">de 4 etapas</span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
