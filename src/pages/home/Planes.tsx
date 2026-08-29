import { IconoCasa, IconoCheck, IconoCono, IconoEdificio } from '../../components/Icono'

export default function Planes() {
  return (
    <section className="band" id="planes" style={{ background: 'var(--panel)' }}>
      <div className="wrap">
        <span className="lbl lbl-cyan">Para quién</span>
        <h2 style={{ margin: '18px 0 44px' }}>Tres formas de pedir.</h2>
        <div className="cols3">
          <div>
            <span className="plan-etq mono lbl-cyan"><IconoCasa />Hogar</span>
            <h3 style={{ fontSize: 'clamp(22px,2.4vw,30px)', marginTop: 14 }}>Deja de cargar bidones desde la bodega.</h3>
            <ul className="lista">
              <li><IconoCheck /><span>Bidón de 20 L con sello de seguridad</span></li>
              <li><IconoCheck /><span>Entrega el mismo día en tu domicilio</span></li>
              <li><IconoCheck /><span>Recarga con envase propio a precio especial</span></li>
            </ul>
            <div className="mono" style={{ fontSize: '22px', fontWeight: 600, marginTop: 26 }}>S/ 30 <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--dim)' }}>/ bidón</span></div>
          </div>
          <div>
            <span className="plan-etq mono lbl-cyan"><IconoEdificio />Empresa</span>
            <h3 style={{ fontSize: 'clamp(22px,2.4vw,30px)', marginTop: 14 }}>Que nunca falte agua en el dispensador.</h3>
            <ul className="lista">
              <li><IconoCheck /><span>Entregas programadas y reposición constante</span></li>
              <li><IconoCheck /><span>Precio por volumen según consumo mensual</span></li>
              <li><IconoCheck /><span>Un solo contacto para todo el abastecimiento</span></li>
            </ul>
            <div className="mono" style={{ fontSize: '16px', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 26 }}>Precio por volumen</div>
          </div>
          <div>
            <span className="plan-etq mono lbl-cyan"><IconoCono />Obra</span>
            <h3 style={{ fontSize: 'clamp(22px,2.4vw,30px)', marginTop: 14 }}>Hidratación para la cuadrilla, en el frente.</h3>
            <ul className="lista">
              <li><IconoCheck /><span>Tarifa especial por volumen alto</span></li>
              <li><IconoCheck /><span>Entregas que siguen el cronograma de obra</span></li>
              <li><IconoCheck /><span>Atención directa, sin call center</span></li>
            </ul>
            <div className="mono" style={{ fontSize: '16px', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 26 }}>Tarifa por proyecto</div>
          </div>
        </div>
      </div>
    </section>
  )
}
