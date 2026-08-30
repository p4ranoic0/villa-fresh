/* ==========================================================================
   VILLA FRESH — catálogo
   Este archivo es el único lugar donde se editan productos y precios.
   precio: null  →  la web muestra "A cotizar" y el producto se pide igual,
                    como cotización por WhatsApp.
   Confirmados: bidón S/30, 2 bidones S/50 y recarga S/20. IGV incluido.
   Salieron del catálogo el envase vacío y el dispensador: el contraste de
   contenido (contenido/verificacion.md) no encontró una sola publicación que
   respaldara que se vendan. Vuelven cuando el negocio lo confirme.
   ========================================================================== */
import type { Categoria, Producto } from '../types'

export const CATEGORIAS: Categoria[] = [
  { id: 'bidones', nombre: 'Bidones y recarga' },
  { id: 'envases', nombre: 'Envases' },
  { id: 'botellas', nombre: 'Botellas' },
  { id: 'accesorios', nombre: 'Accesorios' },
  { id: 'empresas', nombre: 'Empresas y obra' },
]

export const PRODUCTOS: Producto[] = [
  {
    sku: 'VF-B20',
    nombre: 'Bidón 20 L',
    categoria: 'bidones',
    precio: 30,
    unidad: 'con envase',
    etiqueta: 'Más vendido',
    imagen: '/producto-bidon-20l.webp',
    nota: 'Sellado en planta',
    desc: 'Agua purificada por ósmosis inversa, alcalinizada a pH 8.3 y ozonizada. Envase sellado, entrega el mismo día.',
  },
  {
    sku: 'VF-B20X2',
    nombre: '2 Bidones 20 L',
    categoria: 'bidones',
    precio: 50,
    unidad: 'ahorras S/ 10',
    etiqueta: 'Promoción',
    imagen: '/producto-bidones.webp',
    nota: 'Sellado en planta',
    desc: 'Dos bidones en una sola entrega, al precio de promoción permanente. La forma más conveniente de pedir.',
  },
  {
    sku: 'VF-R20',
    nombre: 'Recarga 20 L',
    categoria: 'bidones',
    precio: 20,
    unidad: 'con tu envase',
    imagen: '/producto-bidon-20l.webp',
    nota: 'Cambias envase por envase',
    desc: 'Cambias tu bidón vacío por uno lleno y sellado. Precio preferencial de recarga.',
  },
  {
    sku: 'VF-BOT',
    nombre: 'Botella personal',
    categoria: 'botellas',
    precio: null,
    unidad: 'presentación por confirmar',
    imagen: '/producto-botella.webp',
    desc: 'La misma agua purificada en presentación individual, para llevar. Consulta presentaciones disponibles.',
  },
  {
    sku: 'VF-MARCA',
    nombre: 'Botellas con tu marca',
    categoria: 'botellas',
    precio: null,
    unidad: 'pedido especial',
    imagen: '/producto-botella.webp',
    nota: 'Tu etiqueta, nuestra agua',
    desc: 'La misma agua purificada con la etiqueta de tu empresa, tu evento o tu obra. Se cotiza según cantidad y presentación.',
  },
  {
    sku: 'VF-EMP',
    nombre: 'Plan de abastecimiento',
    categoria: 'empresas',
    precio: null,
    unidad: 'precio por volumen',
    etiqueta: 'A cotizar',
    imagen: '/producto-bidones.webp',
    nota: 'Entregas programadas',
    desc: 'Oficina, negocio u obra: entregas programadas, reposición constante y precio según consumo mensual.',
  },
]
