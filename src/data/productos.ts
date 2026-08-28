/* ==========================================================================
   VILLA FRESH — catálogo
   Este archivo es el único lugar donde se editan productos y precios.
   precio: null  →  la web muestra "A cotizar" y el producto se pide igual,
                    como cotización por WhatsApp.
   Confirmados con las redes: bidón S/30 y 2 bidones S/50. El resto, pendiente.
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
    imagen: '/bidon-20l.svg',
    desc: 'Agua purificada por ósmosis inversa, alcalinizada a pH 8.3 y ozonizada. Envase sellado, entrega el mismo día.',
  },
  {
    sku: 'VF-B20X2',
    nombre: '2 Bidones 20 L',
    categoria: 'bidones',
    precio: 50,
    unidad: 'ahorras S/ 10',
    etiqueta: 'Promoción',
    imagen: '/bidon-20l.svg',
    desc: 'Dos bidones en una sola entrega, al precio de promoción permanente. La forma más conveniente de pedir.',
  },
  {
    sku: 'VF-R20',
    nombre: 'Recarga 20 L',
    categoria: 'bidones',
    precio: null,
    unidad: 'con tu envase',
    imagen: '/bidon-20l.svg',
    desc: 'Cambias tu bidón vacío por uno lleno y sellado. Precio preferencial de recarga.',
  },
  {
    sku: 'VF-EV20',
    nombre: 'Envase vacío 20 L',
    categoria: 'envases',
    precio: null,
    unidad: 'compra única',
    imagen: '/bidon-vacio.svg',
    desc: 'Para quien empieza sin bidón. Se compra una sola vez y después solo pagas la recarga.',
  },
  {
    sku: 'VF-BOT',
    nombre: 'Botella personal',
    categoria: 'botellas',
    precio: null,
    unidad: 'presentación por confirmar',
    imagen: '/botella-600.svg',
    desc: 'La misma agua purificada en presentación individual, para llevar. Consulta presentaciones disponibles.',
  },
  {
    sku: 'VF-DISP',
    nombre: 'Dispensador para bidón',
    categoria: 'accesorios',
    precio: null,
    unidad: 'consultar stock',
    imagen: '/dispensador.svg',
    desc: 'Bomba o dispensador para servir del bidón de 20 L sin cargarlo. Consulta modelos y disponibilidad.',
  },
  {
    sku: 'VF-EMP',
    nombre: 'Plan de abastecimiento',
    categoria: 'empresas',
    precio: null,
    unidad: 'precio por volumen',
    etiqueta: 'A cotizar',
    imagen: '/bidon-20l.svg',
    desc: 'Oficina, negocio u obra: entregas programadas, reposición constante y precio según consumo mensual.',
  },
]
