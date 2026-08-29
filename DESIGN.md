# Villa Fresh — DESIGN.md

Documento fuente de la identidad visual y de interfaz de Villa Fresh.
Describe **lo que está implementado**, no lo que sería deseable: cada valor de este
documento existe hoy en `assets/site.css`. Si algo cambia en el código, se cambia aquí.

| | |
|---|---|
| **Versión** | 3 — dirección "ficha técnica" |
| **Fecha** | 27 de agosto de 2026 |
| **Implementación** | `src/styles/site.css` · `src/components/` · `src/pages/` |
| **Sustituye a** | `stitch_boutique_de_agua_premium/design.md` (dirección clara/premium, descartada) |

---

## 1. Marca

Los componentes React son ahora la implementación de referencia de este sistema visual.

| Campo | Valor |
|---|---|
| Nombre | **Villa Fresh** (dos palabras, ambas capitalizadas) |
| Eslogan | *Pureza que refresca tu vida* |
| Categoría regulatoria | Agua de mesa |
| Producto | Bidón retornable de 20 L, sellado |
| Ámbito | Lima Metropolitana, Perú |
| Contacto único | WhatsApp **994 647 840** |

**Nunca** se escribe `VillaFresh`, `Villafresh`, `VILLAFRESH` en texto corrido ni se
sustituye por genéricos (`Agua Premium`, `Aqua`, `Mi Agua`). En mayúsculas de display
—titulares, etiquetas mono— se acepta `VILLA FRESH` por tratamiento tipográfico.

### Personalidad

La marca es **técnica, directa y verificable**. Habla como quien fabrica, no como quien
revende.

Es: precisa · transparente · sin adornos · confiable · cercana sin ser informal · peruana.

**No es:** aspiracional, lujosa, "wellness", ecologista de postal, ni startup.
No promete bienestar ni estilo de vida: promete un bidón sellado en tu puerta hoy,
con el pH impreso al costado.

### El diferencial que ordena todo el diseño

> **No revendemos agua. La fabricamos.**

Planta propia, sin intermediarios. Todo lo demás —el precio, la entrega el mismo día,
la certificación— se deriva de eso. Si una pantalla nueva no puede apoyarse en este
hecho, probablemente no debería existir.

---

## 2. Dirección visual: "ficha técnica"

El rubro del agua embotellada se ve siempre igual: fondo blanco, azul cielo, tipografía
ligera, botones píldora, un bidón flotando. La primera versión de este sitio caía
exactamente ahí y se sentía como una plantilla.

La dirección actual invierte el planteamiento: **el agua tratada se presenta como un
producto técnico**. Los datos son los elementos gráficos, no la decoración.

Cuatro recursos sostienen la identidad. Si se quitan, vuelve a ser una plantilla:

1. **Fondo azul noche dominante.** El color lo pone el producto y el dato, no el fondo.
2. **Los datos en tamaño editorial.** pH 8.3, 08 pasos, 20 L, 0 intermediarios, S/ 30.
   Un dato concreto no se puede copiar; "calidad premium" lo escribe cualquiera.
3. **Una sola banda de papel crudo** que interrumpe el azul para el precio. La única
   inversión de valor de toda la página, y por eso funciona.
4. **El motivo gota+montaña del isotipo** como marca de agua estructural, recortada
   y en gran escala. Es el único elemento gráfico que nadie más tiene.

### Regla de ritmo

Las bandas **no** se repiten idénticas. La secuencia es:

```
oscuro (hero) → cinta cian → PAPEL (precio) → oscuro (proceso)
→ panel elevado (planes) → oscuro (cobertura + preguntas) → CIAN (cierre) → oscuro (pie)
```

Nunca tres bandas seguidas del mismo fondo. Si una página nueva necesita más secciones,
alterna; no encadenes.

---

## 3. Logotipo y motivo

El isotipo es una **gota que contiene una montaña**, dentro de un círculo azul.

Archivos: `assets/logo-villafresh-fondo-blanco.jpg` (positivo) y
`assets/logo-villafresh-slogan-fondo-negro.png` (con bajada, fondo oscuro).

En la interfaz **no se usa el logotipo completo**: se usa el motivo redibujado como
trazo, sin círculo ni fondo, en `stroke: #3ec1ff`:

```html
<svg viewBox="0 0 100 120" fill="none" stroke="#3ec1ff" stroke-width="6" stroke-linejoin="round">
  <path d="M50 5C50 5 9 52 9 78a41 41 0 0 0 82 0C91 52 50 5 50 5z"></path>
  <path d="M23 91L45 62l13 17 10-11 16 21"></path>
</svg>
```

| Uso | Tamaño | Grosor de trazo |
|---|---|---|
| Barra superior | 26 × 31 px | 6 |
| Pie de página | 22 × 26 px | 6 |
| Marca de agua de sección | 40–58 % del ancho | 1.1, opacidad .15 |
| Etiqueta dentro de una ilustración | escala .20 | 6 |

**Reglas.** Espacio libre mínimo alrededor: la altura de la gota. Nunca se rota, se
deforma, se le cambia el color a otro que no sea `--cyan` (interfaz) o los azules de
marca (piezas gráficas), ni se coloca sobre una imagen con detalle. El logotipo completo
con círculo se reserva para etiquetas de producto, redes y documentos, no para la web.

---

## 4. Color

### Paleta

```css
--ground:     #04101d   /* fondo dominante */
--panel:      #0a1c30   /* bandas y superficies elevadas */
--panel-2:    #0d2338   /* tarjeta sobre panel */
--ink:        #eaf2f8   /* titulares y texto fuerte */
--ink-2:      #a6bccd   /* párrafos */
--dim:        #8ba3ba   /* etiquetas mono, metadatos */
--line:       rgba(139,163,186,.22)   /* separadores */
--line-2:     rgba(139,163,186,.42)   /* bordes de bloque */
--cyan:       #3ec1ff   /* acento único de interfaz */
--cyan-soft:  rgba(62,193,255,.10)
--paper:      #f2f1ec   /* la banda de precio */
--paper-ink:  #0a1622
--paper-dim:  #5b6a78
--wa:         #25d366   /* WhatsApp — color de canal, no de marca */
--brand-deep: #0157b4   /* azules literales del logotipo */
--brand-bright:#02b5ff
```

### Reglas de uso

- **Un solo acento.** `--cyan` es el único color de interfaz. Si aparece un segundo
  acento, la pieza está mal.
- **`--wa` no es color de marca.** Es el color del canal de WhatsApp y sólo se usa en
  botones que abren WhatsApp. Nunca como fondo, borde o texto decorativo.
- **`--brand-deep` y `--brand-bright`** salieron del PNG del logotipo. Se reservan para
  el isotipo, sellos y degradados de piezas gráficas. El azul del logo es más oscuro y
  saturado que el de la interfaz; mezclarlos ensucia los dos.
- **Blancos y negros templados.** Nunca `#fff` ni `#000` puros. El papel es cálido
  (`#f2f1ec`), el fondo es azulado (`#04101d`). Esa tensión frío/cálido es parte del
  carácter.
- **Cian sobre papel: sólo como tinte al 10 %** (`rgba(62,193,255,.10)`), para destacar
  la celda de "2 bidones". Nunca cian sólido sobre papel.
- **Sin degradados de fondo.** El único degradado permitido es el del isotipo en piezas
  gráficas (`140deg`, bright → deep).

### Contraste — medido, no estimado

| Par | Ratio | WCAG |
|---|---|---|
| `--ink` sobre `--ground` | 16.9 | AAA |
| `--ink-2` sobre `--ground` | 9.8 | AAA |
| `--dim` sobre `--ground` | 7.3 | AAA |
| `--cyan` sobre `--ground` | 9.4 | AAA |
| `--ink-2` sobre `--panel` | 8.8 | AAA |
| `--dim` sobre `--panel` | 6.6 | AA |
| `--paper-ink` sobre `--paper` | 16.1 | AAA |
| `--paper-dim` sobre `--paper` | 4.9 | AA |
| `--ground` sobre `--cyan` (botón) | 9.4 | AAA |
| `--ground` sobre `--wa` (botón) | 9.7 | AAA |

Cualquier par nuevo debe llegar a **4.5:1** en texto normal y **3:1** en texto ≥ 24 px.
`--dim` es el gris más claro permitido para texto; por debajo de eso no hay nada.

---

## 5. Tipografía

Dos familias, ambas de Google Fonts, con roles que no se cruzan.

```css
--disp: 'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif;   /* voz */
--mono: 'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;  /* datos */
```

- **Archivo** — titulares y texto corrido. Grotesca de terminaciones planas, con
  carácter propio a peso 800 y tamaño grande. Pesos usados: 400, 500, 600, 700, 800.
- **IBM Plex Mono** — números, etiquetas, SKU, precios, teléfono, especificaciones.
  Es lo que hace que la página se lea como una ficha y no como un folleto.
  Pesos usados: 400, 500, 600.

**Prohibidas:** Inter, Roboto, Montserrat, Poppins y cualquier sans genérica. Si Archivo
no carga, la cascada cae en Helvetica; no se añaden más familias.

### Escala

Todos los tamaños grandes son fluidos con `clamp()`; no hay saltos por breakpoint.

| Rol | Valor | Peso | Interletrado | Interlínea |
|---|---|---|---|---|
| `h1` | `clamp(2.4rem, 6.4vw, 6.25rem)` | 800 | −.035em | .94 |
| `h2` | `clamp(1.9rem, 4.6vw, 4.25rem)` | 800 | −.035em | .94 |
| `h3` | 20–30 px | 700 | −.02em | 1.1 |
| `.lede` (bajada) | `clamp(16px, 1.35vw, 19px)` | 400 | 0 | 1.62 |
| Párrafo | 15–16 px | 400 | 0 | 1.55–1.65 |
| `.lbl` (etiqueta mono) | 11 px | 500 | **.2em** | 1 |
| SKU | 10 px mono | 400 | .18em | 1 |
| Precio en tarjeta | 20 px mono | 600 | −.01em | 1.25 |
| Precio grande | `clamp(64px, 8vw, 104px)` | 800 | −.05em | .86 |
| Cifra de cierre | `clamp(2.4rem, 6.5vw, 5.5rem)` mono | 600 | −.03em | 1 |

### Reglas de titular

- **Siempre en versalitas** (`text-transform: uppercase`) y con interletrado negativo.
  El peso 800 con tracking cerrado es la firma; sin eso pierde carácter.
- **Los cortes de línea se escriben a mano** con `<br>` en los titulares del hero y de
  sección. No se deja al navegador partir "No revendemos / agua. / La fabricamos."
- Nunca más de **cuatro palabras por línea** en `h1`.
- Los titulares terminan en **punto**. Es una decisión de voz: afirman, no invitan.

### Etiquetas mono

Toda etiqueta de sección usa la clase `.lbl`: 11 px, peso 500, `letter-spacing: .2em`,
mayúsculas, color `--dim` (o `--cyan` con `.lbl-cyan` cuando abre sección).
El interletrado de .2em es lo que las hace legibles a ese tamaño; no se reduce.

---

## 6. Espaciado y ritmo

Base de 4 px. La página se organiza por **bandas**, no por márgenes sueltos.

```css
--pad:  clamp(20px, 5vw, 96px);   /* padding lateral del contenedor */
--band: clamp(56px, 7vw, 96px);   /* padding vertical de cada banda */
--max:  1440px;                    /* ancho máximo del contenido */
```

| Uso | Valor |
|---|---|
| Separación entre elementos de un grupo | 10–14 px |
| Separación entre bloques dentro de una sección | 22–32 px |
| Titular → contenido de sección | 40–60 px |
| Entre bandas | `--band` (56 → 96 px) |
| Alto de la barra superior | 20 px de padding vertical (≈ 84 px) |

El espacio en blanco es el recurso principal. Ante la duda, **más aire y menos palabras**,
nunca al revés.

---

## 7. Layout

```css
.wrap { max-width: 1440px; margin-inline: auto; padding-inline: var(--pad); }
```

Grillas usadas, todas con `gap` (nunca márgenes por elemento ni espacios en el HTML):

| Patrón | Composición | Punto de quiebre |
|---|---|---|
| Hero | `1fr 360px` | 960 px |
| Titular + bajada (`.split`) | `1.3fr 1fr` | 900 px |
| Tres columnas (`.cols3`) | `repeat(3, 1fr)` con divisores | 900 px |
| Precios (`.precios`) | `repeat(3, 1fr)` | 820 px |
| Catálogo (`.cat-layout`) | `230px 1fr` | 960 px |
| Tarjetas (`.grid`) | 1 → 2 → 3 columnas | 640 / 1180 px |
| Distritos | 2 → 4 columnas | 760 px |
| Preguntas (`.qas`) | `1fr 1fr` | 900 px |

**Diseño móvil primero en el resultado, aunque se escriba en escritorio.** Toda grilla
colapsa a una columna por debajo de su quiebre. La página no debe producir scroll
horizontal en **ningún** ancho: se verifica a 390 px antes de publicar.

Breakpoints usados: **640 · 760 · 820 · 900 · 960 · 1000 · 1180 px**. No son un sistema
teórico: cada uno está donde un contenido concreto se rompía.

---

## 8. Bordes, líneas y sombras

### Radio: cero

**Nada tiene esquinas redondeadas**, con dos excepciones: el badge de conteo del carrito
y los botones flotantes de WhatsApp (heredan la forma del canal). Esto es deliberado —
el radio redondeado es la marca del rubro y de la plantilla. Las esquinas rectas son
mitad del carácter.

### Líneas

La línea es el separador principal, no la sombra ni la caja.

- `1px solid var(--line)` — filas de tabla, separadores internos, filas de ficha.
- `1px solid var(--line-2)` — borde de bloque, apertura de sección, tarjeta de ficha.
- `2px solid var(--paper-ink)` — sólo la apertura de la tabla de precios en papel.
- `1px dashed var(--line-2)` — **exclusivo** de los marcadores entre corchetes.

Las tarjetas del catálogo no llevan borde propio: la grilla usa `gap: 1px` sobre un fondo
`--line`, y las líneas que se ven son el fondo asomando. Eso da una retícula continua,
no una colección de cajas.

### Sombras

Casi no hay. La profundidad viene del contraste de fondo, no del desenfoque.
Las únicas permitidas son las de los botones de WhatsApp
(`0 10px 25px -5px rgba(37,211,102,.35)`), porque son elementos flotantes reales.

---

## 9. Componentes

### Botones

Altura mínima **52 px** (40 px en la variante `.btn-sm`). Siempre mono, 13 px, peso 600,
`letter-spacing: .14em`, mayúsculas, sin radio.

| Clase | Uso | Aspecto |
|---|---|---|
| `.btn-wa` | Acción principal de pedido | Fondo `--wa`, texto `--ground` |
| `.btn-cyan` | Acción principal de interfaz (agregar, consultar) | Fondo `--cyan`, texto `--ground` |
| `.btn-dark` | Acción principal **sobre papel** | Fondo `--ground`, texto `--paper` |
| `.btn-ghost` | Acción secundaria | Transparente, borde `--line-2` |

**Una sola acción principal por pantalla**, repetida a lo largo de la página. Si hay dos
botones juntos, uno es fantasma. `:hover` cambia fondo o borde, nunca desplaza el
elemento más de 1 px. `:focus-visible` es `2px solid var(--cyan)` con `offset: 3px`.

### Ficha técnica

El componente identitario. Bloque con borde `--line-2`, fondo `rgba(10,28,48,.55)`, y
filas `.spec` de dos columnas: etiqueta a la izquierda en `--dim`, valor a la derecha en
`--ink` peso 600. Todo en mono, 12 px, mayúsculas.

El pH se destaca en `--cyan` a 15 px. Es el único valor con tratamiento especial.

Nunca se añaden filas que no estén verificadas. Una ficha con datos inventados destruye
justamente lo que la ficha existe para transmitir.

### Cinta

Banda de 14 px de alto entre bordes cian, fondo `--cyan-soft`, texto mono de 12 px con
`letter-spacing: .26em`, desplazándose 46 s en bucle. El contenido se escribe **duplicado**
para que el bucle no muestre vacío. Respeta `prefers-reduced-motion`.

Es decorativa: lleva `aria-hidden="true"` y nunca información que no esté en otro sitio.

### Tarjeta de producto

```
[ imagen cuadrada sobre --panel, con chip de etiqueta opcional ]
SKU (mono 10 px, --dim)
Nombre (h3, 21 px)
Descripción (14.5 px, --ink-2, crece para igualar alturas)
───────────────────────────────
Precio (mono 20 px)        [ Agregar ]
```

Sin sombra, sin borde propio, sin radio. En `:hover` el fondo pasa a `--panel` y la
imagen escala 1.04 en 400 ms. El precio ausente se muestra como **"A cotizar"** en mono
10.5 px, mayúsculas, `--dim` — nunca como `S/ 0.00` ni vacío.

### Filtros

Casillas cuadradas de 15 px, dibujadas con `appearance: none`; marcadas se llenan de cian
con el check en `--ground`. Cada fila lleva el conteo de productos a la derecha en `--dim`.
Sin ninguna marcada se muestra el catálogo completo — y se dice explícitamente debajo.

### Cajón de pedido

Panel derecho de `min(420px, 100%)`, fondo `--panel`, borde izquierdo `--line-2`.
Cabecera con título y cerrar, cuerpo con scroll, pie fijo con total y acción.

**No se abre solo al agregar**: agregar hace pulsar el botón del carrito (450 ms) y
actualiza el contador. Abrirlo en cada clic estorba cuando se agregan varios productos.

Se cierra con el botón, con el velo o con `Escape`. Mientras está abierto,
`body { overflow: hidden }`.

### Marcadores entre corchetes

```html
<p class="ph">[ Distritos referenciales — confirmar la ruta real de reparto ]</p>
```

Mono 11 px, mayúsculas, `--dim`, borde **punteado**. Marcan información que todavía no
está confirmada y **se publican a propósito**: es preferible que un dato pendiente se vea
a que se invente uno. Se retiran sólo cuando el dato real ocupa su lugar.

---

## 10. Iconografía

**SVG en línea, siempre.** Sin librerías, sin fuentes de iconos, sin emoji.

```css
.ico { width:17px; height:17px; fill:none; stroke:currentColor;
       stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
```

Retícula de 24 px, trazo de 1.7, sin relleno, heredando el color del texto. Los iconos
decorativos llevan `aria-hidden="true"`.

Se usa una fuente de iconos externa **nunca**: en la primera versión los iconos de
Material Symbols aparecieron como las palabras `chat`, `verified`, `check` cuando Google
Fonts no cargó. Un icono que puede convertirse en texto suelto no entra al sitio.

---

## 11. Ilustración de producto

Mientras no haya fotografía propia, los productos se dibujan en SVG:
`bidon-20l.svg`, `bidon-vacio.svg`, `botella-600.svg`, `dispensador.svg`.

Reglas: `viewBox` de 200 × 300 (120 × 300 en botella), degradado vertical de cuerpo
frío, estrías horizontales al 22 % de opacidad, un realce vertical a la izquierda, tapa
con sello estriado, y **etiqueta legible con el isotipo, el nombre y "CONT. NETO 20 L"**.

La ilustración **no finge ser una fotografía**. Es honesta sobre lo que es y por eso
puede convivir con el resto sin pedir disculpas. Cuando lleguen las fotos reales de
producto y de planta, se reemplazan; la ilustración no es una aspiración permanente.

Prohibido: renders de banco de imágenes, bidones genéricos con etiquetas inventadas,
y cualquier imagen generada que muestre una etiqueta que no es la de Villa Fresh.

---

## 12. Movimiento

Discreto. El agua se mueve; la interfaz no compite.

| Transición | Duración |
|---|---|
| Color de botón, borde, texto | 200 ms |
| Fondo de tarjeta | 250 ms |
| Escala de imagen en hover | 400 ms |
| Pulso del carrito | 450 ms |
| Cinta | 46 s en bucle lineal |

Sin animaciones de entrada al hacer scroll, sin parallax, sin contadores animados.
`prefers-reduced-motion: reduce` desactiva todo, incluido el `scroll-behavior: smooth`.

---

## 13. Accesibilidad

- Contraste verificado y documentado en la sección 4. Ningún par nuevo por debajo de 4.5:1.
- **Objetivo táctil mínimo 44 px**; los botones son de 52 px, los pequeños de 40 px y
  sólo se usan junto a otro objetivo mayor.
- Foco visible en todo elemento interactivo: `2px solid var(--cyan)`, `offset: 3px`.
  Nunca `outline: none` sin reemplazo.
- Cuerpo de texto largo nunca por debajo de **14 px**. Las etiquetas mono cortas pueden
  bajar a 10–11 px porque son etiquetas, no lectura.
- Un solo `h1` por página; jerarquía de encabezados sin saltos.
- `lang="es"` en `<html>`. Toda imagen con `alt` descriptivo; los SVG decorativos con
  `aria-hidden="true"`.
- El cajón de pedido es `role="dialog"` con `aria-modal="true"` y cierra con `Escape`.
- El catálogo funciona sin JavaScript hasta el punto de mostrar el contenido base; la
  vía de pedido siempre disponible es el enlace directo a WhatsApp.

---

## 14. Voz y redacción

Español peruano, tuteo, frases cortas. Se afirma; no se seduce.

**Sí:**
> Ósmosis inversa, alcalinización a pH 8.3 y ozonización, en nuestra propia planta en Lima.
> Escribe la dirección y cuántos bidones. Nada de formularios.
> Si el sello está roto, no lo recibas.

**No:**
> Descubre la experiencia de hidratación que tu familia merece.
> Comprometidos con la excelencia y la satisfacción del cliente.
> Agua mineral de manantial de los Andes.

Reglas concretas:

- **Cero relleno.** Si una frase podría describir a cualquier empresa, se borra.
- **Ningún dato inventado.** Precio, distrito, certificación, número de registro,
  dirección: o está verificado, o va entre corchetes.
- **Nunca "agua mineral" ni "de manantial".** El producto es agua **purificada / de mesa**.
  Afirmar lo contrario es falso y expone frente a Indecopi y a la etiqueta sanitaria.
- Precios siempre `S/ 30` con espacio en texto corrido; en tratamiento tipográfico grande,
  el `S/` va en mono a un tamaño menor y separado del número.
- Los pendientes se escriben en mayúsculas entre corchetes: `[ RAZÓN SOCIAL Y RUC ]`.

---

## 15. Contexto peruano

| Elemento | Tratamiento |
|---|---|
| Moneda | `S/` antes del número, con espacio: `S/ 30`, `S/ 50.00` |
| Pagos | Yape, efectivo o transferencia **al recibir**. No hay pasarela en línea |
| Autoridad sanitaria | **DIGESA** — se nombra tal cual; el N.° de registro está pendiente |
| Cobertura | "Lima Metropolitana" y lista de distritos (hoy referencial) |
| Canal de venta | WhatsApp. No hay formulario de contacto, y es deliberado |
| Legal | **Libro de Reclamaciones** es obligatorio y debe enlazarse antes de publicar |

---

## 16. Reglas de contenido para pantallas nuevas

Antes de escribir una línea de una pantalla nueva:

1. El dato sale de `contenido/redes-sociales-villafresh.md` o de algo que el negocio
   confirmó. **El mockup original de Stitch no es fuente**: traía precios y afirmaciones
   ficticias.
2. Si el dato no existe, va entre corchetes visibles. No se rellena con un valor plausible.
3. Los precios sólo se editan en `assets/productos.js`. Nunca escritos a mano en el HTML.
4. Los colores, tipos y espacios salen de las variables de `assets/site.css`. Ningún
   hex suelto en el marcado.

---

## 17. Arquitectura

```
villa-fresh/
├─ DESIGN.md          ← este documento: fuente de la verdad visual
├─ README.md          Cómo correrlo, datos del negocio, pendientes
├─ index.html         Home
├─ catalogo.html      Catálogo
├─ assets/
│  ├─ site.css        Implementación del sistema
│  ├─ site.js         Filtros, pedido, mensaje de WhatsApp
│  ├─ productos.js    Productos y precios (único archivo de datos)
│  └─ *.svg / logos
├─ design/            Tokens, hoja visual, decisiones previas, alternativas descartadas
└─ contenido/         Copy real extraído de las redes
```

Stack: **HTML estático sin build**. La decisión y su condición de salida están
argumentadas en `README.md`. Cuando llegue Astro, este documento no cambia: cambia
dónde vive la implementación.

---

## 18. Checklist de QA

Antes de publicar cualquier cambio:

- [ ] Sin scroll horizontal a 390, 768, 1024 y 1440 px
- [ ] Consola del navegador sin errores
- [ ] Ningún par de color nuevo por debajo de 4.5:1
- [ ] Foco visible al recorrer la página con Tab
- [ ] Los iconos son SVG en línea, no una fuente
- [ ] Cero radios redondeados nuevos
- [ ] Un solo acento cian; el verde sólo en botones de WhatsApp
- [ ] Ningún dato sin verificar presentado como cierto
- [ ] Los corchetes pendientes siguen visibles hasta que el dato exista
- [ ] Todos los precios vienen de `productos.js`
- [ ] Los enlaces de WhatsApp llevan el mensaje precargado correcto
- [ ] `prefers-reduced-motion` detiene la cinta

---

## 19. Guardarraíles

Lo que **rompe** esta identidad, aunque se vea bien en aislado:

- Fondo blanco dominante o azul cielo claro como base.
- Esquinas redondeadas, tarjetas con sombra difusa, degradados de fondo.
- Un segundo color de acento.
- Inter, Roboto, Montserrat, Poppins.
- Emoji en la interfaz, iconos de fuente externa.
- Fotografía de banco de imágenes de gente bebiendo agua al amanecer.
- Titulares en caja baja con peso ligero.
- Cifras inventadas para llenar una retícula ("+500 clientes", "99 % de satisfacción").
- Tres bandas seguidas del mismo fondo.
- Sustituir el dato concreto por el adjetivo: "premium", "de la más alta calidad",
  "experiencia superior".

---

## 20. Fuente de la verdad

1. **`assets/site.css`** es la implementación. Ante una discrepancia, el código manda y
   este documento se corrige.
2. **Este documento** manda sobre cualquier mockup, incluido el canvas de exploración y
   el `design.md` original de Stitch, que queda archivado como referencia histórica.
3. **`contenido/redes-sociales-villafresh.md`** manda sobre cualquier texto de mockup.
4. **`assets/productos.js`** manda sobre cualquier precio escrito en otro sitio.

Cuando esta versión cambie, se sube el número de versión de la cabecera y se anota qué
cambió en `design/README.md`.
