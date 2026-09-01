/* Aquí vivían `CategoriaId` y `Categoria`. Servían a la página de catálogo,
   que tenía filtros; cuando todo se unificó en la portada, los filtros se
   fueron y las categorías se quedaron: cinco, dos de ellas —«envases» y
   «accesorios»— sin un solo producto, y ninguna pintada en ninguna parte.
   Lo único que las usaba era una prueba que comprobaba que concordaban entre
   sí: se validaba sola sin afirmar nada sobre el sitio. */

export interface Producto {
  sku: string
  nombre: string
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
