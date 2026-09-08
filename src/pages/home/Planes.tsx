import { IconoCasa, IconoCheck, IconoCono, IconoEdificio } from '../../components/Icono'
import { activo } from '../../rutas-publicas'

export default function Planes() {
  return (
    <section className="band" id="planes" style={{ background: 'var(--panel)' }}>
      <div className="wrap">
        {/* Tres bidones para tres formas de pedir. No es un adorno: es el
            mismo objeto que se vende, y la foto que hay es justamente la de
            tres. Va marcada como decorativa porque el titular de al lado ya
            dice lo que hay que leer. */}
        <div className="banda-cabecera">
          <h2>Tres formas de pedir.</h2>
          <span className="objeto objeto-banda" aria-hidden="true">
            <img
              src={activo('/producto-bidones.webp')}
              alt=""
              width={668}
              height={547}
              loading="lazy"
            />
          </span>
        </div>
        <div className="cols3">
          <div className="plan-hogar">
            <span className="plan-etq lbl-cyan"><IconoCasa />Hogar</span>
            <h3>Deja de cargar bidones desde la bodega.</h3>
            <ul className="lista">
              <li><IconoCheck /><span>Bidón de 20 L con sello de seguridad</span></li>
              <li><IconoCheck /><span>Entrega el mismo día en tu domicilio</span></li>
              <li><IconoCheck /><span>Recarga con envase propio a precio especial</span></li>
            </ul>
            <p className="plan-cierre">S/ 30 <span>por bidón</span></p>
          </div>
          <div>
            <span className="plan-etq lbl-cyan"><IconoEdificio />Empresa</span>
            <h3>Que nunca falte agua en el dispensador.</h3>
            <ul className="lista">
              <li><IconoCheck /><span>Entregas programadas y reposición constante</span></li>
              <li><IconoCheck /><span>Precio por volumen</span></li>
              <li><IconoCheck /><span>Abastecimiento constante desde planta propia</span></li>
            </ul>
            <p className="plan-cierre">Precio por volumen</p>
          </div>
          <div>
            <span className="plan-etq lbl-cyan"><IconoCono />Obra</span>
            <h3>Hidratación para la cuadrilla, en el frente.</h3>
            <ul className="lista">
              <li><IconoCheck /><span>Tarifa especial por volumen alto</span></li>
              <li><IconoCheck /><span>Entregas que siguen el cronograma de obra</span></li>
              <li><IconoCheck /><span>Entrega directa desde planta, sin retrasos</span></li>
            </ul>
            <p className="plan-cierre">Tarifa por proyecto</p>
          </div>
        </div>
      </div>
    </section>
  )
}
