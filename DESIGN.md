# Villa Fresh — DESIGN.md

Documento fuente de la identidad visual y de interfaz de Villa Fresh.
Describe **lo que está implementado**, no lo que sería deseable: cada valor de este
documento existe hoy en `src/styles/site.css`. Si algo cambia en el código, se cambia aquí.

| | |
|---|---|
| **Versión** | 7 — fotografía de producto con la marca puesta |
| **Fecha** | 29 de agosto de 2026 |
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
con el pH y el proceso dichos sin adornos.

### El diferencial que ordena todo el diseño

> **No revendemos agua. La fabricamos.**

Planta propia, sin intermediarios. Todo lo demás —el precio, la entrega el mismo día,
la certificación— se deriva de eso. Si una pantalla nueva no puede apoyarse en este
hecho, probablemente no debería existir.

---

## 2. Dirección visual: del cartel a la conversación

El rubro del agua embotellada se ve siempre igual: fondo blanco, azul cielo, tipografía
ligera, botones píldora, un bidón flotando. La primera versión de este sitio caía
exactamente ahí y se sentía como una plantilla.

La respuesta fue irse al extremo contrario —**"ficha técnica"**: el agua tratada
presentada como producto industrial, los datos como elemento gráfico, todo en
versalitas de peso 800 y etiquetas en monoespaciada— y esa dirección resolvió el
problema de la plantilla creando otro. El cliente lo dijo tres veces con las mismas
palabras: *muy IA, no natural, no amigable*. Tenía razón, y las razones eran
concretas y contables:

- **Siete titulares consecutivos en versalitas negras**, todos con el mismo ritmo
  (titular gigante a la izquierda, párrafo gris a la derecha, filete, rejilla debajo).
  Repetido siete veces deja de ser voz y pasa a ser plantilla.
- **Veintiuna reglas con `text-transform:uppercase`**, quince de ellas de una sola
  clase (`.lbl`). La monoespaciada mayúscula muy espaciada es, hoy, la tipografía con
  la que se reconoce una maqueta generada.
- **Once filas de ficha técnica** —PRODUCTO, TRATAMIENTO, OZONIZADA, PASOS DE
  PURIFICACIÓN, GREMIO, COBERTURA…— en el sitio exacto donde alguien decide si compra.
- **Un titular que abría negando**: «NO REVENDEMOS AGUA. LA FABRICAMOS.» a 100 px.
  El dato es bueno; como primera frase respondía a una acusación que nadie hizo.
- **Una cinta corriendo** con lo que la página ya decía debajo, y **seis marcadores
  entre corchetes** repartidos como si fueran contenido.

La dirección actual conserva el rechazo a la plantilla del rubro y el respeto por el
dato concreto, pero **cambia el registro: la página habla en vez de anunciar**. Caja
normal en los titulares, etiquetas en castellano corriente, esquinas blandas donde
antes había ángulo recto y grises girados unos grados al cálido. Lo que se quitó no
fue información: fue el disfraz.

Los datos siguen siendo los elementos gráficos, no la decoración.

Cuatro recursos sostienen la identidad. Si se quitan, vuelve a ser una plantilla:

1. **Un fondo dominante sin ruido.** Azul noche en el tema oscuro, papel crudo en el
   claro. En los dos, el color lo pone el producto y el dato, nunca el fondo.
2. **Los datos en tamaño editorial.** pH 8.3, 08 pasos, 20 L, 0 intermediarios, S/ 30.
   Un dato concreto no se puede copiar; "calidad premium" lo escribe cualquiera.
3. **Una sola banda invertida** que rompe el fondo dominante para el precio: papel
   sobre azul en el tema oscuro, azul sobre papel en el claro. Es la única inversión
   de valor de toda la página, y por eso funciona.
4. **El motivo gota+montaña del isotipo** como marca de agua estructural, recortada
   y en gran escala. Es el único elemento gráfico que nadie más tiene.

### Regla de ritmo

Las bandas **no** se repiten idénticas. La secuencia es:

```
fondo (hero) → cinta de acento → INVERTIDA (precio) → fondo (proceso)
→ panel elevado (planes) → fondo (cobertura + preguntas) → ACENTO (cierre) → fondo (pie)
```

La secuencia es la misma en los dos temas porque está escrita en roles. Lo que cambia
es qué material ocupa cada papel.

Nunca tres bandas seguidas del mismo fondo. Si una página nueva necesita más secciones,
alterna; no encadenes.

---

## 3. Logotipo y motivo

El isotipo es una **gota que contiene una montaña**, dentro de un círculo azul.

Archivos: `marca/logo-villafresh-fondo-blanco.jpg` (positivo) y
`marca/logo-villafresh-slogan-fondo-negro.png` (con bajada, fondo oscuro).
Viven en `marca/` y no en `public/` porque la interfaz no los usa: `public/` se
copia entera al artefacto publicado, y ahí dentro eran 1,5 MB que ningún
visitante llegaba a pedir nunca. El favicon sí es de la web: `public/favicon.svg`.

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
deforma, se le cambia el color a otro que no sea `--acento` (interfaz) o los azules de
marca (piezas gráficas), ni se coloca sobre una imagen con detalle. El logotipo completo
con círculo se reserva para etiquetas de producto, redes y documentos, no para la web.

---

## 4. Color

### Dos temas, un solo juego de nombres

La paleta ya no es una lista de colores: es una lista de **roles**. Cada token tiene
dos valores y el tema decide cuál se usa. `--acento` es azul profundo sobre papel y
cian sobre azul noche; es el mismo rol en los dos casos.

- **Claro por defecto.** Es lo que ve quien no ha pedido nada.
- **Oscuro cuando el sistema lo pide** (`prefers-color-scheme: dark`).
- **Y oscuro o claro cuando el visitante lo elige**, con `data-tema` en `<html>`.
  La elección manual gana siempre, y se recuerda.

Los tres se resuelven en `src/styles/site.css`, en un único bloque al principio del
archivo. **Debajo de ese bloque no hay ni un color escrito a mano**: un literal ahí
abajo es un tema a medio hacer, y se vería bien en uno de los dos y mal en el otro.
Hay una prueba que lo comprueba (`tests/build.test.ts`).

### La temperatura del tema claro

Durante dos versiones el tema claro fue **papel templado**: beige, `#f4f2ee`, con los
grises girados unos grados hacia el cálido. Era coherente consigo mismo y estaba mal.
El producto es agua fría y el material de la página decía panadería; ninguna cantidad
de tipografía arregla que el fondo contradiga lo que se vende.

Los neutros claros son ahora **el azul de marca diluido**: el mismo ángulo de matiz que
`#0157b4` en CIELAB, con el croma bajado a ~3. No son un gris frío cualquiera (que es
el otro sitio adonde se va por defecto) — son la misma agua, aguada.

La conversión se hizo **conservando L\***, así que el contraste medido no se movió ni
un punto al cambiar la temperatura: la tabla de §4 «Contraste» sigue siendo válida sin
volver a medir. Hay una prueba que falla si algún neutro claro vuelve a tener más rojo
que azul.

### Los roles

| Token | Claro | Oscuro | Para qué |
|---|---|---|---|
| `--ground` | `#f1f2f8` | `#04101d` | fondo dominante |
| `--panel` | `#e2e3ea` | `#0a1c30` | bandas y tarjetas |
| `--panel-2` | `#dadbe3` | `#0d2338` | tarjeta sobre panel |
| `--ink` | `#0a1622` | `#eaf2f8` | titulares |
| `--ink-2` | `#3d4c5a` | `#a6bccd` | párrafos |
| `--ink-3` | `#4a5865` | `#bcd0e0` | bajadas (`.lede`) |
| `--dim` | `#55636f` | `#8ba3ba` | etiquetas mono, metadatos |
| `--line` / `--line-2` | tinta al 16 / 34 % | gris azulado al 22 / 42 % | separadores y bordes |
| `--acento` | `#0157b4` | `#3ec1ff` | **el acento único** |
| `--acento-alto` | `#013f80` | `#8ed8ff` | estado hover del acento |
| `--acento-suave` | acento al 8 % | acento al 10 % | tinte de la cinta |
| `--sobre-acento` | `#f2f1ec` | `#04101d` | texto encima del acento |
| `--nav-fondo` | papel al 92 % | azul noche al 92 % | barra superior translúcida |
| `--ficha-fondo` | papel hundido al 55 % | azul al 55 % | la ficha técnica del hero |
| `--velo` | tinta al 55 % | negro azulado al 72 % | fondo del cajón del pedido |
| `--peligro` | `#b0202a` | `#ff7a7a` | quitar una línea del pedido |

Y la **banda invertida**, que es la única sección que va contra el fondo dominante:

| Token | Claro | Oscuro |
|---|---|---|
| `--inv` | `#04101d` | `#f2f1ec` |
| `--inv-ink` | `#eaf2f8` | `#0a1622` |
| `--inv-p` | `#a6bccd` | `#3d4c5a` |
| `--inv-dim` | `#8ba3ba` | `#5b6a78` |
| `--inv-line` | claro al 18 % | tinta al 18 % |
| `--inv-realce` | cian al 12 % | cian al 10 % |
| `--inv-btn` / `--inv-btn-ink` | `#f2f1ec` / `#04101d` | `#04101d` / `#f2f1ec` |

Fuera del tema, porque no dependen de él:

```css
--wa:#25d366   /* color del canal WhatsApp, no de marca */
--wa-alto:#43e07d
--sobre-wa:#04101d
--brand-deep:#0157b4    /* azules literales del logotipo, para piezas gráficas */
--brand-bright:#02b5ff
```

### El acento cambia de valor, no de papel

En claro, el acento es `#0157b4`: **el azul literal del logotipo**. No es una
decisión estética sino aritmética. `#3ec1ff` sobre papel da 1.7:1 y es ilegible;
cualquier texto, icono o etiqueta en cian sobre `#f2f1ec` sería inaccesible.

Esto matiza la regla que decía que `--brand-deep` se reservaba para piezas gráficas
porque mezclar los dos azules "ensucia los dos". La regla sigue en pie con una
precisión: **lo que ensucia es usar los dos como tinta en la misma vista**. En el tema
claro solo hay un azul, el profundo, y hace de tinta y de relleno. En el oscuro solo
hay uno, el cian. Nunca conviven.

### La inversión se invierte

La banda de precio es la única que va contra el fondo. En oscuro es **papel sobre azul
noche**; en claro es **azul noche sobre papel**. Se invierte el material, no la idea:
sigue siendo la única ruptura de la página y sigue estando en el precio.

Por eso las clases se llaman `.inv` y `.btn-inv`, y no `.paper` y `.btn-dark`. El
nombre viejo mentía en la mitad de los casos.

### Reglas de uso

- **Un solo acento por tema.** Si aparece un segundo, la pieza está mal.
- **`--wa` no es color de marca.** Es el color del canal de WhatsApp y sólo se usa en
  botones que abren WhatsApp. Nunca como fondo, borde o texto decorativo.
- **`--peligro` no es un acento**, es un estado: sólo el hover de quitar una línea.
- **Blancos y negros templados.** Nunca `#fff` ni `#000` puros. El papel es cálido
  (`#f2f1ec`), el azul es frío (`#04101d`). Esa tensión frío/cálido es parte del
  carácter, y se conserva en los dos temas: el claro no es un gris neutro.
- **Sin degradados de fondo.** El único degradado permitido es el del isotipo en piezas
  gráficas (`140deg`, bright → deep).

### Contraste — medido, no estimado

No es una tabla escrita a mano. `contraste.mjs` recorre los **210 nodos de texto** de
las dos páginas publicadas, resuelve las transparencias contra el fondo que les toca y
compara con el mínimo que corresponde a su tamaño. Los dos temas pasan **WCAG AA**
enteros.

| Par | Claro | Oscuro | WCAG |
|---|---|---|---|
| `--ink` sobre `--ground` | 16.1 | 16.9 | AAA |
| `--ink-2` sobre `--ground` | 7.8 | 9.8 | AAA |
| `--dim` sobre `--ground` | 5.5 | 7.3 | AA |
| `--acento` sobre `--ground` | 6.2 | 9.4 | AA / AAA |
| `--sobre-acento` sobre `--acento` (botón) | 6.2 | 9.4 | AA / AAA |
| `--sobre-wa` sobre `--wa` (botón) | 9.7 | 9.7 | AAA |
| `--inv-ink` sobre `--inv` | 16.9 | 16.1 | AAA |
| `--inv-dim` sobre `--inv` | 7.3 | 4.9 | AA |

Cualquier par nuevo debe llegar a **4.5:1** en texto normal y **3:1** en texto ≥ 24 px,
**en los dos temas**. `--dim` es el gris más claro permitido para texto.

> La medición encontró un fallo que llevaba tiempo publicado: la etiqueta de 12 px
> del cierre daba 4.38:1 en oscuro, por debajo del mínimo, aunque esta tabla afirmaba
> lo contrario. Se corrigió subiendo la opacidad de `--sobre-acento-2`. Es la razón por
> la que la tabla ahora se genera midiendo y no estimando.

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
| Precio sin cifra | `clamp(26px, 3.2vw, 42px)` mono | 600 | −.02em | 1 |
| Cifra de cierre | `clamp(2.4rem, 6.5vw, 5.5rem)` mono | 600 | −.03em | 1 |

### Reglas de titular

- **Nunca en versalitas.** Peso 700, `letter-spacing: -.022em`, `line-height: 1.05`.
  Era peso 800 en mayúsculas a `line-height: .94`, y una prueba lo impide ahora: es el
  cambio que hizo que la página dejara de sonar a pancarta.
- **Los cortes de línea se escriben a mano** con `<br>` en los titulares del hero y de
  sección. No se deja al navegador partir "No revendemos / agua. / La fabricamos."
- Nunca más de **cuatro palabras por línea** en `h1`.
- Los titulares terminan en **punto**. Es una decisión de voz: afirman, no invitan.

### La celda sin cifra

La banda de precio tiene tres celdas y sólo dos precios confirmados. El tercero **no se
inventa**, pero la celda tiene que pesar lo mismo o la fila deja de ser una serie.

La solución es tipográfica: la celda ocupa el mismo alto que la caja de la cifra y se
apoya en la misma línea, pero en mono y en `--inv-dim`. Así comparte el ritmo sin
fingir que es un precio, y el párrafo de las tres arranca a la misma altura.

Dice **«A cotizar»**, que es exactamente lo que muestra el catálogo cuando `precio` es
`null`. Una sola forma de decirlo en todo el sitio.

### Etiquetas mono

Toda etiqueta usa `.lbl`, y ya **no es mono ni va en mayúsculas**: 13 px, peso 600,
sin interletrado, color `--dim` (o `--acento` con `.lbl-cyan`). Aparecía quince veces
—6 PRODUCTOS, PAGO AL RECIBIR, UN BIDÓN, HOGAR, PEDIDOS POR WHATSAPP…— y quince
letreros iguales eran la mitad del problema. Lo que etiquetan sigue siendo útil.

La monoespaciada queda para lo que de verdad es tabular: el teléfono, los precios de
las tarjetas, el número de orden de los pasos del proceso.

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
- `2px solid var(--inv-ink)` — sólo la apertura de la tabla de precios, dentro de la banda invertida.
- `1px dashed var(--line-2)` — **exclusivo** de los marcadores entre corchetes.

Las tarjetas del catálogo no llevan borde propio: la grilla usa `gap: 1px` y cada
tarjeta pinta con `box-shadow` **su lado derecho y su lado de abajo**. El arriba y el
izquierda del marco los pone la grilla; sus otros dos lados van transparentes, para
reservar el sitio sin pintarlo dos veces. Eso da una retícula continua, no una
colección de cajas.

> Hasta la v3 las líneas eran el fondo de la grilla (`--line`) asomando por los huecos.
> Funcionaba, pero rellenaba también las celdas sobrantes de la última fila: con siete
> productos en tres columnas quedaban dos celdas pintadas. Sobre azul noche apenas se
> veía; sobre papel era un bloque gris. Con la sombra en la tarjeta, donde no hay
> tarjeta no hay nada. Cada tarjeta pinta un solo lado porque con las cuatro caras dos
> sombras contiguas caían en el mismo hueco de 1 px y la línea salía el doble de oscura.

### Sombras

Casi no hay. La profundidad viene del contraste de fondo, no del desenfoque.
Las únicas permitidas son las del botón flotante de WhatsApp y las líneas de la
retícula del catálogo. La del botón flotante usa `--wa-sombra`, que **sí cambia con el
tema**: sobre azul noche el halo verde se lee como brillo, y sobre papel se leía como
una mancha, así que en el tema claro pasa a ser una sombra neutra.

---

## 9. Componentes

### Botones

Altura mínima **52 px** (40 px en la variante `.btn-sm`). Siempre mono, 13 px, peso 600,
`letter-spacing: .14em`, mayúsculas, sin radio.

| Clase | Uso | Aspecto |
|---|---|---|
| `.btn-wa` | Acción principal de pedido | Fondo `--wa`, texto `--ground` |
| `.btn-cyan` | Acción principal de interfaz (agregar, consultar) | Fondo `--acento`, texto `--sobre-acento` |
| `.btn-inv` | Acción principal **dentro de la banda invertida** | Fondo `--inv-btn`, texto `--inv-btn-ink` |
| `.tema-btn` | Conmutador de tema, en la barra superior | Cuadrado de 40 px (44 en móvil), borde `--line-2`, trazo `--dim`; hover al acento |
| `.btn-ghost` | Acción secundaria | Transparente, borde `--line-2` |

**Una sola acción principal por pantalla**, repetida a lo largo de la página. Si hay dos
botones juntos, uno es fantasma. `:hover` cambia fondo o borde, nunca desplaza el
elemento más de 1 px. `:focus-visible` es `2px solid var(--acento)` con `offset: 3px`.

### Ficha técnica

El componente identitario. Bloque con borde `--line-2`, fondo `rgba(10,28,48,.55)`, y
filas `.spec` de dos columnas: etiqueta a la izquierda en `--dim`, valor a la derecha en
`--ink` peso 600. Todo en mono, 12 px, mayúsculas.

El pH se destaca en `--acento` a 15 px. Es el único valor con tratamiento especial.

Nunca se añaden filas que no estén verificadas. Una ficha con datos inventados destruye
justamente lo que la ficha existe para transmitir.

### Cinta

Banda de 14 px de alto entre bordes del acento, fondo `--acento-suave`, texto mono de 12 px con
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

**SVG en línea, siempre.** Sin fuentes de iconos y sin emoji.

Con una excepción que se ganó a base de equivocarse: **las marcas de terceros no se
dibujan**. WhatsApp, Facebook e Instagram usan sus trazados oficiales de
[Simple Icons](https://simpleicons.org) (CC0), copiados al repositorio, no traídos
de un CDN. Un icono de línea aproximando un logotipo conocido no se lee como la
marca: se lee como un dibujo genérico, y era una de las cosas que hacían que la
página no pareciera real. Van rellenas y con la clase `.marca-ico`, al revés que
los iconos propios, que van en trazo.

La regla, entonces: **lo que es de Villa Fresh se dibuja; lo que es de otro se usa
tal cual.**

```css
.ico { width:17px; height:17px; fill:none; stroke:currentColor;
       stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
```

Retícula de 24 px, trazo de 1.7, sin relleno, heredando el color del texto. Los iconos
decorativos llevan `aria-hidden="true"`.

### El juego completo

Doce, y cada uno existe porque distingue algo. Un icono que no distingue, decora.

| Icono | Dónde | Qué separa |
|---|---|---|
| `IconoWhatsApp` | Botones de WhatsApp | El canal |
| `IconoCheck` | Listas de los tres planes | Lo que incluye cada plan |
| `IconoCarrito` | Barra superior del catálogo | El pedido en curso |
| `IconoSol` · `IconoLuna` | Conmutador de tema | El tema que se ofrece |
| `IconoFiltro` | Paso 01 | Filtrado y sedimentación |
| `IconoMembrana` | Paso 02 | Ósmosis inversa |
| `IconoNivel` | Paso 03 | Alcalinización |
| `IconoBurbujas` | Paso 04 | Ozonización |
| `IconoCasa` · `IconoEdificio` · `IconoCono` | Los tres planes | Hogar, empresa, obra |

**Obra es un cono y no un casco.** El casco se probó dos veces: a 22 px es una cúpula
sobre una línea y se lee como un puente. Un icono que hay que explicar no está limpio,
y el dibujo correcto es el que se reconoce, no el más literal.

Los cuatro del proceso tienen que distinguirse **entre sí** antes que parecerse a lo
que nombran. Hay una prueba que falla si dos pasos comparten dibujo.

El conmutador de tema usa los dos únicos iconos que no acompañan a un texto: un sol
y una luna, en la misma retícula y el mismo trazo. **Los dos viajan siempre en el
HTML** y es el CSS quien decide cuál se ve, a partir del mismo `data-tema` que pinta
la página. Así el pre-render y la hidratación dibujan exactamente lo mismo.

Se usa una fuente de iconos externa **nunca**: en la primera versión los iconos de
Material Symbols aparecieron como las palabras `chat`, `verified`, `check` cuando Google
Fonts no cargó. Un icono que puede convertirse en texto suelto no entra al sitio.

---

## 11. Imagen de producto

Fotografía con licencia de Adobe Stock, recortada sobre fondo transparente:
`producto-bidon-20l.webp`, `producto-bidones.webp`, `producto-botella.webp`,
`producto-dispensador.webp` y `portada-bidones.webp`. Sustituyen a las ilustraciones
SVG que hubo hasta la versión 3. El detalle de cada licencia está en `marca/LICENCIAS.md`.

### Qué son exactamente estas imágenes

Fotografía de archivo con licencia, recortada, **con el logotipo real de Villa Fresh
colocado encima**. Eso las convierte en una representación del producto de Villa Fresh,
no en una foto de él.

La regla anterior decía que ninguna imagen podía presentarse como el producto real. Al
poner la marca, esa regla deja de cumplirse y no tiene sentido fingir lo contrario. Lo
que sigue en pie, y es lo que de verdad importa:

- **La planta y el equipo no se representan nunca.** Ahí no hay nada que colocar: una
  nave o unas personas de archivo serían otra planta y otra gente.
- **Sobre el envase no se escribe nada** que no sea el logotipo tal cual está en
  `marca/`. Ni una palabra añadida.
- **El envase de la foto no es el envase que se entrega.** Si el bidón real lleva otra
  etiqueta, estas fotos hay que rehacerlas con una foto propia.

`scripts/marcar-producto.py` deja el proceso repetible: cambia la posición y se
regenera. Los recortes sin marca se conservan en `marca/sin-marca/`.

### La etiqueta inventada sigue prohibida

El mockup que originó esto llevaba botellas rotuladas **«NATURAL ALPINE WATER»**. Eso
no es sólo una etiqueta inventada: es falso. Villa Fresh vende **agua de mesa
purificada por ósmosis inversa**, no agua de manantial, y esa distinción es
precisamente el argumento de la página entera.

Colocar el logotipo real es branding. Escribir una categoría de producto que la marca
no vende es otra cosa. Cualquier texto que aparezca sobre un envase tiene que salir de
`src/data/`, donde está el contenido verificado.

### Lo que la fotografía no puede decir

Un bidón lleno y uno vacío son **la misma fotografía**: el plástico es transparente y
no hay línea de agua. Por eso Stock no tiene "bidón vacío", y por eso las ilustraciones
antiguas rotulaban `SELLADO` y `VACÍO` dentro del dibujo: no era decoración, era
información.

Esa información se conserva como **etiqueta mono al pie del encuadre** (`.card .nota`),
sobre el fondo del panel y no sobre la foto. Sin ella, `VF-EV20` y `VF-B20` serían la
misma tarjeta.

### El vídeo de proceso

`proceso-agua.mp4` y su póster `proceso-agua.webp`: burbujas subiendo hasta la
superficie, sobre negro. Se eligió por lo que **no** es. No es una jarra sirviendo agua
en una cocina soleada, que es la imagen que usa todo el rubro y que esta guía prohíbe
explícitamente. Es un proceso ocurriendo dentro de un recipiente, abstracto y técnico,
y encaja con la sección que lo acompaña.

El encuadre es oscuro en los dos temas porque el material es oscuro. **Es una imagen
dentro de un marco, no una sección invertida**: la banda de precio sigue siendo la
única inversión de la página.

A partir de 1040 px **el vídeo y los cuatro pasos comparten bloque**: el vídeo se queda
fijo en su columna mientras los pasos le pasan por delante, así que el agua se va
asentando conforme se lee. Antes iba suelto encima de la sección y era una caja negra
sin relación con lo que tenía alrededor. Por debajo de ese ancho se apilan, y el vídeo
ni se descarga.

Lleva al pie una etiqueta mono que dice lo que es: *imagen de archivo con licencia*.
No es un crédito decorativo, es la misma honestidad que rige el resto de la
fotografía, escrita donde se ve.

Prohibido: etiquetas inventadas, texto añadido sobre el envase, y cualquier imagen
generada que muestre una etiqueta que no es la de Villa Fresh.

---

## 12. Movimiento

Discreto no es lo mismo que invisible, y esa confusión costó una versión entera.

### El fallo que había que ver

La versión anterior **sí tenía animaciones** y aun así el sitio se leía como una
captura de pantalla. Es un fallo más difícil de detectar que no tener ninguna, porque
el inventario estaba lleno y todo pasaba las pruebas. Dos causas:

1. **El recorrido no llegaba al ojo.** El revelado desplazaba las filas 12 px
   repartidos a lo largo de media pantalla de scroll. El ojo empieza a leer
   desplazamiento a partir de unos 20 px; por debajo, el navegador gasta cuadros en
   algo que no llega a nadie.
2. **Nada se movía solo.** Todo el movimiento dependía de que alguien hiciera scroll o
   pasara el cursor. Una página que sólo se mueve cuando la mueven no contesta a la
   primera pregunta que hace cualquiera al abrirla, que no es «¿qué vendéis?» sino
   **«¿esto está vivo?»**.

### Las tres preguntas

Cada movimiento de la página contesta a una y sólo a una:

| Pregunta | Qué la contesta |
|---|---|
| ¿Está viva? | La **marea** de la portada. Continua, lenta, sin fin. |
| ¿Me oye? | El hover y la pulsación de cada control, y la barra que se estrecha al bajar. |
| ¿Por dónde voy? | El revelado de las series al entrar en pantalla, a duración fija. |

Si un movimiento nuevo no contesta a ninguna de las tres, no entra.

### La marea

Es lo único que se mueve sin que nadie toque nada, y existe por la causa 2 de arriba.
No informa de nada —no tiene que hacerlo—, sólo evita que la portada parezca impresa.

- **Una onda, no un degradado a la deriva.** El degradado en movimiento es mobiliario
  de plantilla y no dice agua, dice «efecto». Una superficie ondulando dice agua y no
  dice nada más.
- **Dos capas a velocidades distintas** (38 s y 24 s). La diferencia entre las dos es
  lo que da profundidad; una sola capa se lee como un adorno recortado.
- **Lentas a propósito.** Una marea rápida es una animación; una marea lenta es agua.
- **`linear`.** Una superficie de agua no acelera ni frena al desplazarse.
- **El empalme.** El trazo mide el doble de ancho que su marco y contiene ocho periodos
  completos; la animación lo desplaza exactamente la mitad, que son cuatro periodos. Al
  reiniciar, la curva cae encima de sí misma y el ciclo no tiene costura. Si el
  desplazamiento no cayera en un múltiplo del periodo, cada vuelta daría un salto.

Ver `src/components/Marea.tsx`.

### La pregunta antes de animar

Antes de mover nada: **¿cuántas veces al día va a ver esto el visitante?** Lo que se
repite mucho no se anima, porque la animación convierte en lento algo que era
instantáneo. Lo que ocurre una vez por visita puede permitirse un recorrido.

Por eso el conmutador de tema **no** hace una transición de color de toda la página.
Un cambio de tema con 40 propiedades transicionando a la vez llega a destino por
partes y se lee como un fallo de carga. Cambia de golpe, que es lo correcto.

### Curvas

Las curvas de serie de CSS son demasiado blandas. Estas están en los tokens:

```css
--sal:cubic-bezier(.23,1,.32,1);       /* entradas y salidas */
--vaiven:cubic-bezier(.77,0,.175,1);   /* movimiento dentro de la pantalla */
--cajon:cubic-bezier(.32,.72,0,1);     /* el cajón del pedido */
```

**`ease-in` no se usa nunca.** Arranca lento justo en el instante en que el visitante
está mirando, y hace que la misma duración se sienta más lenta. Hay una prueba que
falla si aparece uno.

### Inventario completo

| Qué | Duración | Curva | Por qué existe |
|---|---|---|---|
| Pulsación de botón | 160 ms | `--sal` | Respuesta: el elemento acusa el dedo |
| Color de botón, borde, texto | 200 ms | `ease` | Evita el salto de color |
| Fondo de tarjeta | 250 ms | `ease` | Señala qué tarjeta está bajo el cursor |
| Escala de imagen en hover | 400 ms | `--sal` | Sólo con puntero fino |
| Cajón del pedido | 380 ms | `--cajon` | Entra por donde se va: hace legible el gesto |
| Velo del cajón | 300 ms | `ease` | Sin él, el fondo se oscurece de golpe |
| Pulso del carrito | 450 ms | `ease` | Confirma que la línea se añadió |
| Levantar el botón en hover | 160 ms | `--sal` | 1 px: el control se ofrece antes de pulsarlo |
| Barra al bajar | 300 ms | `--sal` | Se estrecha y se despega: acusa que la estás recorriendo |
| Entrada de la portada | 620 ms, +62 ms por pieza | `--sal` | Se ve una vez: da un orden de lectura |
| Crecida de la marea | 1,4 s | `--sal` | El agua se llena desde abajo al cargar |
| Marea, capa de fondo | 38 s en bucle | lineal | ¿Está viva? |
| Marea, capa de cara | 24 s en bucle | lineal | La diferencia con la de fondo es la profundidad |
| Revelado de las series | 800 ms, +90 ms por hermano | `--sal` | Pasos, precios, planes, distritos, preguntas y titulares |
| Secuencia de agua | según scroll | lineal | Ver abajo |

Nada más. No hay parallax, ni contadores animados, ni cinta corriendo.

### La entrada de la portada

Lo único que se mueve sin que el visitante haga nada. Etiqueta, titular, bajada y
botones entran escalonados cada 62 ms, y la ficha técnica cierra. Más separación entre
piezas y deja de leerse como una cascada para sentirse lento.

Se ve una vez por visita, que es exactamente el tipo de momento que puede permitirse
movimiento.

### El revelado de las series

Sólo donde hay **series**: los cuatro pasos, las tres celdas de precio, los tres planes,
los distritos, las preguntas y los titulares de sección. Un revelado en cada elemento de
la página deja de ser ritmo y pasa a ser un tic; ésa es la diferencia entre pacing y
andamiaje.

**No es `animation-timeline: view()`.** Lo fue, y estaba mal por una razón que no se ve
leyendo el CSS: una línea de tiempo de scroll ata el avance de la animación a la
posición del dedo. Bajando de un manotazo la animación se consume en dos cuadros y el
elemento aparece de golpe; subiendo, se deshace y el texto se vuelve a esconder. Ningún
valor de `animation-range` arregla eso, porque el problema no es el recorrido sino quién
manda en el reloj.

Ahora manda el reloj del navegador: un `IntersectionObserver` decide **cuándo** empieza y
una transición CSS decide **cuánto** dura. Bajes como bajes, tarda lo mismo.

| | |
|---|---|
| Recorrido | 30 px |
| Duración | 800 ms |
| Curva | `--sal` |
| Escalonado | 90 ms entre hermanos que entran juntos, tope de 5 |
| Repetición | Ninguna: se revela una vez y se deja de observar |

800 ms es largo para un control y corto para un texto que aparece. Aquí lo que se mueve
es contenido y se quiere ver llegar; el tope del escalonado existe porque doce distritos
a 90 ms serían más de un segundo de espera para el último.

**Transición y no fotogramas**, siguiendo a Sonner: una transición se puede interrumpir y
retomar desde donde estaba; unos fotogramas reempiezan desde cero.

Ver `src/revelado.ts`.

#### La regla lleva `:root` delante, y no es decoración

`:root [data-revela]` sube la especificidad a (0,1,1). Sin eso, `.dist{transition:color
.2s}` —declarado más abajo para su hover, con la misma especificidad— se llevaba por
delante el revelado de los doce distritos: se encendían de golpe. El CSS era correcto
leído regla a regla y ninguna prueba estática lo veía; sólo apareció midiendo
`transitionProperty` en el navegador. Hay una prueba que falla si vuelve a aparecer un
`[data-revela]` sin blindar.

**El estado base es el estado final**, y esto vale para la entrada y para el revelado.
Un navegador sin líneas de tiempo de scroll, o una carga en la que el CSS llegue tarde,
muestran el texto ya visible. La animación sólo puede quitar; nunca es lo que hace
aparecer el contenido. Hay pruebas que lo comprueban en los dos casos.

En el revelado esto se sostiene de una forma concreta: **nada se esconde desde el CSS**.
El atributo `data-revela` lo pone el observador, y sólo en lo que todavía no se ve. Sin
JavaScript no hay atributo, no hay regla que aplique y la página se lee entera. Y lo que
ya está en pantalla al cargar no se esconde nunca: taparlo para volver a enseñarlo medio
segundo después sería un parpadeo entre el pintado y la hidratación.

Queda `@media print`, porque al imprimir tampoco hay observador que revele nada.

### La secuencia de agua

El vídeo de la sección de proceso avanza con el scroll: el bloque cruza la ventana y
el agua pasa de agitada a asentada. Es lo que dice la sección, contado con imagen.

- **El destino se persigue, no se copia.** El fotograma va detrás de la posición del
  scroll con una interpolación del 18 % por cuadro. Clavado 1:1 se siente mecánico.
- **Sin escuchar el scroll.** Un `requestAnimationFrame` que sólo vive mientras el
  bloque está a la vista, arrancado y parado por un `IntersectionObserver`. El scroll
  dispara muchas más veces de las que hay cuadros.
- **El vídeo está codificado con todos los fotogramas clave.** Sin eso, mover
  `currentTime` salta al fotograma clave más cercano y la secuencia va a tirones.
  Es la razón de que un clip de 6 s a 12 fps ocupe 570 KB.
- **No se descarga casi nunca.** Lo que viaja en el HTML es el póster de 17 KB. El
  vídeo se pide sólo si la pantalla mide 900 px o más, nadie ha pedido menos
  movimiento y el sistema no está ahorrando datos; y aun entonces, sólo cuando la
  sección se acerca. En un móvil esta pieza cuesta cero bytes de más.

### `prefers-reduced-motion`

`reduce` desactiva todo: la marea, la entrada, el revelado, el `scroll-behavior: smooth`
y la descarga del vídeo, que ni siquiera se pide. Queda el póster.

El revelado se apaga **desde JavaScript**, no desde el CSS. Apagar sólo la transición
dejaría el elemento escondido hasta que el observador lo enseñara de golpe, que es peor
que no animarlo: con `reduce` no se esconde ni un elemento.

Lo que **no** se apaga es el estado de los controles: el color de hover, el borde de
foco y la escala de pulsación siguen ahí. Quien pide menos movimiento sigue necesitando
saber qué está tocando; lo que sobra es el recorrido, no la respuesta.

---

## 13. Accesibilidad

- Contraste verificado y documentado en la sección 4. Ningún par nuevo por debajo de 4.5:1.
- **Objetivo táctil mínimo 44 px**; los botones son de 52 px, los pequeños de 40 px y
  sólo se usan junto a otro objetivo mayor.
- Foco visible en todo elemento interactivo: `2px solid var(--acento)`, `offset: 3px`.
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
3. Los precios sólo se editan en `src/data/productos.ts`. Nunca escritos a mano en el JSX.
4. Los colores, tipos y espacios salen de las variables de `src/styles/site.css`. Ningún
   hex suelto en el marcado.

---

## 17. Arquitectura

```
villa-fresh/
├─ index.html                         Plantilla de Vite para el pre-render
├─ package.json · bun.lock            Scripts y versiones fijadas
├─ vite.config.ts · tsconfig.json     Configuración de Vite y TypeScript
├─ scripts/
│  └─ prerender.ts                    Escribe dist/index.html
├─ src/
│  ├─ main.tsx · entry-server.tsx     Hidratación y renderizado de servidor
│  ├─ App.tsx · rutas.ts              Rutas, títulos y metaetiquetas por página
│  ├─ components/                     Navegación, pie, isotipo e iconos compartidos
│  ├─ pages/                          La portada, que es todo el sitio
│  ├─ features/catalogo/              Grilla y tarjetas de producto
│  ├─ features/pedido/                Estado, persistencia y mensaje de WhatsApp
│  ├─ data/productos.ts               Productos y precios; único archivo a editar
│  ├─ data/negocio.ts                 Teléfono, redes y datos del negocio
│  └─ styles/site.css                 Implementación del sistema visual
├─ public/                             Fotografía de producto, logotipos, favicon y OG
├─ tests/                              Pruebas puras y del HTML publicado
├─ marca/                              Piezas de marca y su código fuente HTML
├─ design/                             Tokens y variante Light Editorial descartada
├─ contenido/                          Copy real extraído de las redes
└─ dist/                               Sitio generado; se publica esta carpeta
```

Stack: **React sobre Bun, pre-renderizado a HTML estático**. `bun run build` compila
el cliente, compila el servidor y `scripts/prerender.ts` escribe cada ruta con su
contenido dentro del HTML. Lo que se publica es `dist/`, y su texto tiene que estar
en el HTML: un build que produzca un contenedor vacío es un build fallido.

---

## 18. Checklist de QA

Antes de publicar cualquier cambio, **en los dos temas**:

- [ ] Sin scroll horizontal a 390, 768, 1024 y 1440 px
- [ ] Consola del navegador sin errores
- [ ] Ningún par de color nuevo por debajo de 4.5:1, medido en claro y en oscuro
- [ ] Ningún color escrito a mano fuera del bloque de tokens
- [ ] Todo token nuevo tiene sus dos valores; ninguno queda definido en un solo tema
- [ ] Foco visible al recorrer la página con Tab
- [ ] Los iconos son SVG en línea, no una fuente
- [ ] Cero radios redondeados nuevos
- [ ] Un solo acento por tema; el verde sólo en botones de WhatsApp
- [ ] Ningún dato sin verificar presentado como cierto
- [ ] Los corchetes pendientes siguen visibles hasta que el dato exista
- [ ] Todos los precios vienen de `src/data/productos.ts`
- [ ] Los enlaces de WhatsApp llevan el mensaje precargado correcto
- [ ] `prefers-reduced-motion` detiene la cinta, el revelado y la descarga del vídeo
- [ ] Ninguna animación nueva usa `ease-in`
- [ ] Ningún revelado es lo que hace visible el contenido: el estado base es el final
- [ ] El hover que cambia tamaño está detrás de `(hover:hover) and (pointer:fine)`
- [ ] `public/` sólo contiene lo que se publica: se copia entera al artefacto

---

## 19. Guardarraíles

Lo que **rompe** esta identidad, aunque se vea bien en aislado:

- Azul cielo claro como base, o un tema claro que sea gris neutro en vez de papel
  cálido: la tensión frío/cálido entre `#f2f1ec` y `#04101d` es parte del carácter.
- Un color escrito a mano fuera del bloque de tokens. Se vería bien en un tema y mal
  en el otro, y nadie lo notaría hasta que alguien cambie de tema.
- Una sección que invierta el fondo por decoración. La banda invertida es una sola y
  está en el precio.
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

1. **`src/styles/site.css`** es la implementación. Ante una discrepancia, el código manda y
   este documento se corrige. La tabla de contraste no se escribe a mano: se mide sobre
   las páginas publicadas, y ya corrigió una vez a este documento.
2. **Este documento** manda sobre cualquier mockup, incluido el canvas de exploración y
   el `design.md` original de Stitch, que queda archivado como referencia histórica.
3. **`contenido/redes-sociales-villafresh.md`** manda sobre cualquier texto de mockup.
4. **`src/data/productos.ts`** manda sobre cualquier precio escrito en otro sitio.

Cuando esta versión cambie, se sube el número de versión de la cabecera y se anota qué
cambió en `design/README.md`.
