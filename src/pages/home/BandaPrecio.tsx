import { Link } from 'react-router'

export default function BandaPrecio() {
  return (
    <section className="inv band" id="precio">
      <div className="wrap">
        <div className="split">
          <div>
            <span className="lbl">Precio directo de planta</span>
            <h2 style={{ marginTop: 18 }}>Lo que cuesta<br />es lo que cuesta.</h2>
          </div>
          <p style={{ fontSize: '17px', lineHeight: 1.65, maxWidth: '44ch' }}>
            Sin distribuidor, sin comisión de por medio y sin “precio de promoción” que sube al mes siguiente. El bidón de 20 litros cuesta lo mismo hoy que la próxima semana.
          </p>
        </div>

        <div className="precios">
          <div>
            <span className="lbl">01 · Un bidón</span>
            <div className="amt"><sup>S/</sup><b>30</b></div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, marginTop: 18, maxWidth: '28ch' }}>Bidón de 20 L sellado, entregado en tu puerta el mismo día.</p>
          </div>
          <div style={{ background: 'var(--inv-realce)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="lbl" style={{ color: 'var(--inv-ink)' }}>02 · Dos bidones</span>
              <span className="mono" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', background: 'var(--inv-ink)', color: 'var(--inv)', padding: '4px 8px' }}>AHORRAS S/10</span>
            </div>
            <div className="amt"><sup>S/</sup><b>50</b></div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, marginTop: 18, maxWidth: '28ch' }}>Dos bidones en una sola entrega, al precio de promoción permanente.</p>
          </div>
          <div>
            <span className="lbl">03 · Volumen y recarga</span>
            <div style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05, marginTop: 20 }}>Precio<br />preferencial</div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, marginTop: 18, maxWidth: '28ch' }}>Oficina, negocio u obra: el precio baja según el consumo mensual. Se cotiza en el momento.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', borderTop: '1px solid var(--inv-line)', paddingTop: 30 }}>
          <span className="mono" style={{ fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--inv-dim)' }}>Pago con Yape, efectivo o transferencia al recibir</span>
          <Link className="btn btn-inv" to="/catalogo.html">Ver catálogo completo</Link>
        </div>
      </div>
    </section>
  )
}
