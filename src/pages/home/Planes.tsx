import { IconoCheck } from '../../components/Iconos'
import { PLANES } from '../../data/contenido'
import { activo } from '../../rutas-publicas'

export default function Planes() {
  return (
    <section id="planes" className="seccion seccion-oscura planes">
      <div className="contenedor">
        <div data-reveal="" className="encabezado-centro">
          <div className="rotulo rotulo-oscuro">Hogar · Empresa · Obra</div>
          <h2 className="titulo-seccion titulo-con-rotulo">Tres formas de pedir.</h2>
        </div>
        <div data-zoom="" className="planes-foto">
          <img src={activo('/producto-bidones.webp')} alt="" />
        </div>
        <div className="planes-grid">
          {PLANES.map((plan) => (
            <div key={plan.tipo} data-reveal="" className="plan">
              <span className="rotulo plan-tipo">{plan.tipo}</span>
              <h3>{plan.titulo}</h3>
              <div className="plan-items">
                {plan.items.map((item) => (
                  <div key={item} className="plan-item">
                    <IconoCheck />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="plan-cierre">{plan.cierre}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
