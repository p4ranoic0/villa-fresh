import Pagos from '../../components/Pagos'
export default function BandaPrecio() {
  return (
    <section className="inv band" id="precio">
      <div className="wrap">
        <div className="split">
          <div>
            <h2 style={{ marginTop: 18 }}>Lo que cuesta<br />es lo que cuesta.</h2>
          </div>
          <p style={{ fontSize: '17px', lineHeight: 1.65, maxWidth: '44ch' }}>
            Sin distribuidor, sin comisión de por medio y sin “precio de promoción” que sube al mes siguiente. El bidón de 20 litros cuesta lo mismo hoy que la próxima semana.
          </p>
        </div>

        <div className="precios">
          <div>
            <span className="lbl">Un bidón</span>
            <div className="amt"><sup>S/</sup><b>30</b></div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, marginTop: 18, maxWidth: '28ch' }}>Bidón de 20 L sellado, entregado en tu puerta el mismo día.</p>
          </div>
          <div style={{ background: 'var(--inv-realce)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="lbl" style={{ color: 'var(--inv-ink)' }}>Dos bidones</span>
              <span className="mono" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', background: 'var(--inv-ink)', color: 'var(--inv)', padding: '4px 8px' }}>AHORRAS S/10</span>
            </div>
            <div className="amt"><sup>S/</sup><b>50</b></div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, marginTop: 18, maxWidth: '28ch' }}>Dos bidones en una sola entrega, al precio de promoción.</p>
          </div>
          <div>
            <span className="lbl">Recarga</span>
            <div className="amt"><sup>S/</sup><b>20</b></div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, marginTop: 18, maxWidth: '28ch' }}>Cambias tu bidón vacío por uno lleno y sellado. Para empresa y obra, el precio baja por volumen.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', borderTop: '1px solid var(--inv-line)', paddingTop: 30 }}>
          <Pagos />
          <a className="btn btn-inv" href="#productos">Ver todos los productos</a>
        </div>
      </div>
    </section>
  )
}
