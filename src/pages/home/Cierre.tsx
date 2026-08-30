import { IconoFacebook, IconoInstagram } from '../../components/Icono'
import { NEGOCIO, urlWhatsApp } from '../../data/negocio'

export default function Cierre() {
  return (
    <section className="close band">
      <div className="wrap" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 36, flexWrap: 'wrap' }}>
        <div>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--sobre-acento-2)' }}>Pedidos por WhatsApp</span>
          <div className="num" style={{ marginTop: 14 }}><a href={urlWhatsApp()} style={{ color: 'inherit' }} target="_blank" rel="noopener">{NEGOCIO.telefonoVisible}</a></div>
        </div>
        <div style={{ maxWidth: '38ch', paddingBottom: 8 }}>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--sobre-acento-3)' }}>Escribe la dirección y cuántos bidones. Nada de formularios, nada de esperar respuesta al día siguiente.</p>
          {/* Las redes son donde el negocio publica de verdad: promociones,
              piezas nuevas y respuestas en comentarios. Hasta ahora sólo
              estaban en el pie, donde casi nadie llega. */}
          <div className="redes redes-cierre" style={{ marginTop: 22 }}>
            <a href={NEGOCIO.facebook} target="_blank" rel="noopener"><IconoFacebook />Facebook</a>
            <a href={NEGOCIO.instagram} target="_blank" rel="noopener"><IconoInstagram />Instagram</a>
          </div>
        </div>
      </div>
    </section>
  )
}
