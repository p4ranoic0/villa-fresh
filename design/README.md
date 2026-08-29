> Este documento describe la variante *Light Editorial* descartada; la dirección vigente es la de `DESIGN.md`.

# Villa Fresh — Sistema de variables (Design Tokens)

Base visual: **`villafresh_claridad_editorial_desktop`** — la variante *Light Editorial*
que elegiste del lote generado con Google Stitch.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `tokens.css` | Fuente de verdad. Variables CSS (`--vf-*`) + base y modo oscuro. Importar primero. |
| `tokens.json` | Los mismos valores en formato máquina (Figma Tokens, Style Dictionary, scripts). |
| `tailwind.config.js` | Config de Tailwind que apunta a las variables CSS. |
| `preview.html` | Hoja visual de todos los tokens. Abrir en el navegador. |

## Cómo se usa

```html
<link rel="stylesheet" href="/design/tokens.css">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

**Regla:** los componentes consumen solo variables *semánticas*
(`--vf-color-primary`, `--vf-space-6`, `--vf-radius-full`). Los primitivos
(`--vf-blue-500`, `--vf-neutral-200`) existen únicamente para definir a los semánticos.
Así, cambiar la marca o activar el modo oscuro no obliga a tocar componentes.

## Decisiones heredadas de la variante elegida

| Decisión | Valor | Por qué |
|---|---|---|
| Fondo | Blanco puro `#ffffff` | El estilo editorial vive del aire; el color lo pone el producto. |
| Primario | `#0a9de0` | Celeste de agua, más luminoso que el azul del logo. |
| Tipografía | Manrope, una sola familia | Titulares en **300 (light)** a 48–72px; cuerpo en 400. El contraste es de tamaño, no de familia. |
| Botones | `border-radius: 9999px` | Píldora completa — es la firma de la variante. |
| Grilla | 12 columnas, gutter 24px, ancho máx. 1440px | Permite el ritmo asimétrico 5/7 del hero. |
| Aire entre secciones | 128px | El espacio en blanco es el principal recurso de "premium" aquí. |
| Sombras | Teñidas de azul, nunca grises | Sombras grises ensucian el blanco y matan la sensación de limpieza. |
| Iconos | Material Symbols Outlined | Trazo fino, acompaña el peso light. |

## Lo que agregué sobre la variante original

Stitch entregó una paleta plana de 12 colores sin escala ni estados. Se completó con:

- **Escala completa** de azul (50–900) y neutros (0–900), para hover, bordes, deshabilitados y fondos.
- **Azules literales del logotipo** (`--vf-brand-deep #0157b4`, `--vf-brand-bright #02b5ff`),
  muestreados del PNG oficial. Úsalos solo para el isotipo y sellos: el logo es más oscuro
  y saturado que el primario de la interfaz, y mezclarlos ensucia ambos.
- **Estados** de éxito, advertencia y error (una tienda necesita "sin stock", "pedido confirmado", "zona no cubierta").
- **Color de WhatsApp** (`#25d366`) como token propio: es el canal real de venta de Villa Fresh,
  no un adorno.
- **Modo oscuro** completo (la variante no lo traía, pero la config de Stitch ya declaraba `darkMode: "class"`).
- **Tokens de movimiento, capas y breakpoints**, incluida una capa reservada para el botón flotante de pedido.
- `prefers-reduced-motion` y `:focus-visible` en la base, por accesibilidad.

## Advertencia de contenido (importante antes de maquetar)

La variante de Stitch trae **texto y precios inventados** que contradicen lo que Villa Fresh
comunica realmente en sus redes (ver `contenido/redes-sociales-villafresh.md`):

| En el diseño de Stitch | Lo real |
|---|---|
| "Agua **mineral de manantial**", "extraída de manantiales andinos" | Agua **purificada** por ósmosis inversa, alcalinizada (pH 8.3) y ozonizada, en **planta propia** |
| Bidón 20L a **S/ 15.00** | Bidón 20L a **S/ 30**; 2 bidones **S/ 50** |
| Pack 12x botellas 500ml, botella de vidrio 1L, dispensador eléctrico | Hoy solo se comunica el **bidón de 20 L** |
| Suscripción con 15% de dcto. y envío prioritario gratis | No existe programa de suscripción publicado |
| "Del origen a tu mesa" | Eslogan real: **"Pureza que refresca tu vida"** |

El *layout* sirve tal cual; el **contenido hay que reemplazarlo íntegro**. Publicar el
reclamo "agua mineral de manantial" sobre un producto purificado en planta es, además de
falso, un riesgo frente a Indecopi y a la etiqueta sanitaria de DIGESA.

## Pendiente

- [ ] Confirmar si la línea de productos se amplía (botellas, dispensador) o la web se
      centra solo en el bidón de 20 L.
- [ ] Reemplazar las imágenes de Stitch (URLs de `googleusercontent`, temporales) por fotos
      propias del producto y de la planta.
- [ ] Definir el token de precio tachado / precio promocional si se mantiene la oferta 2x S/50.

---

## v2 — Cómo se sale del look de plantilla

La variante de Stitch se sentía genérica por razones concretas, no por gusto:
tipografía light + blanco + un azul cielo + botones píldora es el esqueleto de
cualquier plantilla DTC. Cambiando las fotos podría ser una marca de skincare.

Cuatro correcciones, todas en `index.html` y en la extensión v2 de `tokens.css`:

1. **Ritmo, no monotonía.** La página ya no es una sucesión de bandas blancas de
   128px. Ahora alterna claro → franja de datos → **banda oscura** (`--vf-color-night`)
   → claro → tinte. La banda oscura es el "momento planta": es lo que la competencia
   de barrio no puede mostrar.
2. **Especificidad en lugar de adjetivos.** Los diferenciales reales ocupan el lugar
   que antes tenía el relleno: pH 8.3, 8 pasos, 20 L, 0 intermediarios, en tamaño
   editorial (`--vf-text-stat`). Un dato concreto es imposible de copiar; "calidad
   premium" lo escribe cualquiera.
3. **Firma gráfica propia.** El motivo gota+montaña del isotipo (`--vf-motif-drop`)
   aparece como marca de agua en el hero y en la banda oscura. Es el único elemento
   de la marca que nadie más tiene.
4. **Sin dependencia de iconos externos.** Se reemplazó Material Symbols por un
   sprite SVG en línea. La página carga una sola fuente (Manrope) y ningún icono
   queda como texto suelto si Google Fonts falla.

El hero se armó alrededor del **precio**, que fue la decisión tomada: S/ 30 y
2 x S/ 50 en tarjeta propia con el botón de WhatsApp. Es la pregunta que más se
repite en los comentarios de Facebook, y hoy no tenía respuesta en la web.

---

## v3 — El sitio vive ahora en `src/styles/site.css`

A partir del 27/08/2026 el sitio publicado usa la dirección **"ficha técnica"** (azul
noche + tipografía de datos). Los estilos que realmente se sirven están en
`src/styles/site.css`; este directorio conserva el sistema de tokens original, la hoja
visual (`preview.html`) y, en `alternativas/`, la home anterior en estilo editorial
claro por si hace falta compararlas.

Si tocas colores o tipografía, hazlo en `src/styles/site.css`. `tokens.css` queda como
referencia del sistema, no como archivo servido.
