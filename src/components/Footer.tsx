import { NEGOCIO, urlWhatsApp } from '../data/negocio'
import Isotipo from './Isotipo'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 36,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Isotipo ancho={22} alto={26} />
            <span>
              <span className="brand-name">Villa Fresh</span>
              <span className="brand-tag">Pureza que refresca tu vida</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href={NEGOCIO.facebook} target="_blank" rel="noopener">
              Facebook
            </a>
            <a href={NEGOCIO.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
            <a href={urlWhatsApp()} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
        </div>
        <div
          className="lbl"
          style={{
            fontSize: '10px',
            marginTop: 36,
            paddingTop: 20,
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <span>© 2026 Villa Fresh · Lima, Perú</span>
          <span>Libro de reclamaciones</span>
        </div>
      </div>
    </footer>
  )
}
