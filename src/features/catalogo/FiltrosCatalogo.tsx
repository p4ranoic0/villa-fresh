import { CATEGORIAS, PRODUCTOS } from '../../data/productos'
import type { CategoriaId } from '../../types'
import { contarPorCategoria } from './filtros'

interface Props {
  activas: ReadonlySet<CategoriaId>
  onAlternar: (id: CategoriaId) => void
}

export default function FiltrosCatalogo({ activas, onAlternar }: Props) {
  return (
    <div id="vf-filtros">
      {CATEGORIAS.map((categoria) => {
        const n = contarPorCategoria(PRODUCTOS, categoria.id)
        if (n === 0) return null
        return (
          <label className="chk" key={categoria.id}>
            <input
              type="checkbox"
              value={categoria.id}
              checked={activas.has(categoria.id)}
              onChange={() => onAlternar(categoria.id)}
            />
            <span>{categoria.nombre}</span>
            <span className="n">{n}</span>
          </label>
        )
      })}
    </div>
  )
}
