import { NEGOCIO, urlWhatsApp } from '../../data/negocio'

export default function Cierre() {
  return (
    <section className="close band">
      <div className="wrap" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 36, flexWrap: 'wrap' }}>
        <div>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--sobre-acento-2)' }}>Pedidos por WhatsApp</span>
          <div className="num" style={{ marginTop: 14 }}><a href={urlWhatsApp()} style={{ color: 'inherit' }} target="_blank" rel="noopener">{NEGOCIO.telefonoVisible}</a></div>
        </div>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--sobre-acento-3)', maxWidth: '34ch', paddingBottom: 8 }}>Escribe la dirección y cuántos bidones. Nada de formularios, nada de esperar respuesta al día siguiente.</p>
      </div>
    </section>
  )
}
