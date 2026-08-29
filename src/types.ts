/** Unión cerrada a propósito: una categoría inexistente deja de compilar
 *  en vez de dejar un producto invisible en el catálogo. */
export type CategoriaId = 'bidones' | 'envases' | 'botellas' | 'accesorios' | 'empresas'

export interface Categoria {
  id: CategoriaId
  nombre: string
}

export interface Producto {
  sku: string
  nombre: string
  categoria: CategoriaId
  /** null → la web muestra "A cotizar" y el producto se pide igual. */
  precio: number | null
  unidad: string
  etiqueta?: string
  imagen: string
  /** Dato que la foto no puede dar. Un bidon lleno y uno vacio son
   *  indistinguibles en fotografia: el plastico es transparente y no hay
   *  linea de agua. Sin esta etiqueta, VF-EV20 y VF-B20 serian la misma
   *  tarjeta. Es informacion, no decoracion. */
  nota?: string
  desc: string
}

export interface LineaPedido {
  sku: string
  cantidad: number
}
