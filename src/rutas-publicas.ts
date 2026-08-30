/** Base pública única para Vite, el router y los activos de GitHub Pages. */
export const BASE_PUBLICA = '/villa-fresh/'

/** Convierte una ruta de public/ en la URL que tendrá dentro del hosting. */
export function activo(ruta: string): string {
  const base = import.meta.env.BASE_URL ?? BASE_PUBLICA
  return `${base}${ruta.replace(/^\/+/, '')}`
}
