import type { CategoriaId, Producto } from '../../types'

/** Conjunto vacío = catálogo completo. Es el comportamiento del sitio actual. */
export function filtrarPorCategorias(
  productos: Producto[],
  activas: ReadonlySet<CategoriaId>,
): Producto[] {
  if (activas.size === 0) return productos
  return productos.filter((p) => activas.has(p.categoria))
}

export function contarPorCategoria(productos: Producto[], id: CategoriaId): number {
  return productos.filter((p) => p.categoria === id).length
}

export function alternar(
  activas: ReadonlySet<CategoriaId>,
  id: CategoriaId,
): Set<CategoriaId> {
  const siguiente = new Set(activas)
  if (siguiente.has(id)) siguiente.delete(id)
  else siguiente.add(id)
  return siguiente
}
