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
import type { Producto } from '../types'
import { activo } from '../rutas-publicas'


export const PRODUCTOS: Producto[] = [
  {
    sku: 'VF-B20',
    nombre: 'Bidón 20 L',
    precio: 30,
    unidad: 'con envase',
    imagen: activo('/producto-bidon-20l.webp'),
    nota: 'Sellado en planta',
    desc: 'Ósmosis inversa, pH 8.3 y ozonizada. Envase sellado, entrega el mismo día.',
  },
  {
    sku: 'VF-B20X2',
    nombre: '2 Bidones 20 L',
    precio: 50,
    unidad: 'ahorras S/ 10',
    etiqueta: 'Promoción',
    imagen: activo('/producto-bidones.webp'),
    nota: 'Sellado en planta',
    desc: 'Dos bidones en una sola entrega, al precio de promoción.',
  },
  {
    sku: 'VF-R20',
    nombre: 'Recarga 20 L',
    precio: 20,
    unidad: 'con tu envase',
    imagen: activo('/producto-bidon-20l.webp'),
    nota: 'Envase por envase',
    desc: 'Cambias tu bidón vacío por uno lleno y sellado. Precio preferencial.',
  },
  {
    sku: 'VF-BOT',
    nombre: 'Botella personal',
    precio: null,
    unidad: 'presentación por confirmar',
    imagen: activo('/producto-botella.webp'),
    desc: 'La misma agua purificada en presentación individual, para llevar.',
  },
  {
    sku: 'VF-MARCA',
    nombre: 'Botellas con tu marca',
    precio: null,
    unidad: 'pedido especial',
    imagen: activo('/producto-botella.webp'),
    nota: 'Tu etiqueta, nuestra agua',
    desc: 'Con la etiqueta de tu empresa, evento u obra. Se cotiza según cantidad.',
  },
  {
    sku: 'VF-EMP',
    nombre: 'Plan de abastecimiento',
    precio: null,
    unidad: 'precio por volumen',
    etiqueta: 'A cotizar',
    imagen: activo('/producto-bidones.webp'),
    nota: 'Entregas programadas',
    desc: 'Oficina, negocio u obra: entregas programadas y precio por volumen.',
  },
]
