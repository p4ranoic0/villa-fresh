import { NEGOCIO } from '../data/negocio'

export default function Footer() {
  return (
    <footer className="pie">
      <div className="pie-in">
        <span>© 2026 {NEGOCIO.nombre} · {NEGOCIO.eslogan} · Lima, Perú</span>
        <span>Libro de reclamaciones</span>
      </div>
    </footer>
  )
}
