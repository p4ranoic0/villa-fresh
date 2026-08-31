import { activo } from '../../rutas-publicas'
import { IconoWhatsApp } from '../../components/Icono'
import { urlWhatsApp } from '../../data/negocio'

export default function Hero() {
  return (
    <header className="hero band" id="inicio">
      <svg className="motif" viewBox="0 0 100 120" aria-hidden="true">
        <path d="M50 5C50 5 9 52 9 78a41 41 0 0 0 82 0C91 52 50 5 50 5z" />
        <path d="M23 91L45 62l13 17 10-11 16 21" />
      </svg>
      <div className="wrap hero-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span className="lbl lbl-cyan">Planta propia · Sin intermediarios · Lima</span>
          <h1>
            No revendemos<br />agua.<br />La fabricamos.
          </h1>
          <p className="lede" style={{ maxWidth: '46ch' }}>
            Ósmosis inversa, alcalinización a pH 8.3 y ozonización, en nuestra propia planta
            en Lima. De la planta a tu puerta el mismo día, sin un solo intermediario en el
            camino.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              className="btn btn-wa"
              href={urlWhatsApp('Hola Villa Fresh, quiero pedir un bidón de 20L')}
              target="_blank"
              rel="noopener"
            >
              <IconoWhatsApp />
              Pedir por WhatsApp
            </a>
            <a className="btn btn-ghost" href="#productos">Ver productos</a>
          </div>
        </div>

        <div className="hero-col">
          {/* La portada de una marca que vende un objeto no puede no
              enseñarlo. Hasta aquí el hero era texto y una tabla, y por eso
              se leía como un documento y no como una tienda. */}
          <img
            className="hero-foto"
            src={activo('/producto-bidon-20l.webp')}
            alt="Bidón de 20 litros de Villa Fresh, sellado"
            width={760}
            height={760}
            fetchPriority="high"
          />
          <aside className="ficha">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <span className="lbl lbl-cyan">Ficha técnica</span>
            <span className="lbl" style={{ fontSize: '9.5px' }}>Bidón 20 L</span>
          </div>
          <div className="spec" style={{ borderTop: 0 }}><span>Producto</span><b>Agua de mesa</b></div>
          <div className="spec"><span>Tratamiento</span><b>Ósmosis inversa</b></div>
          <div className="spec"><span>pH</span><b style={{ color: 'var(--acento)', fontSize: '15px' }}>8.3</b></div>
          <div className="spec"><span>Ozonizada</span><b>Sí</b></div>
          <div className="spec"><span>Pasos de purificación</span><b>08</b></div>
          <div className="spec"><span>Contenido neto</span><b>20 L</b></div>
          <div className="spec"><span>Envase</span><b>Sellado</b></div>
          <div className="spec"><span>Registro sanitario</span><b>DIGESA</b></div>
          <div className="spec"><span>Gremio</span><b>Asociado a la CCL</b></div>
          <div className="spec"><span>Entrega</span><b>Mismo día</b></div>
          <div className="spec"><span>Cobertura</span><b>Lima Metrop.</b></div>
          </aside>
        </div>
      </div>
    </header>
  )
}
