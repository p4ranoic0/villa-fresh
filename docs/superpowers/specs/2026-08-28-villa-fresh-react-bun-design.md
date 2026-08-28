# Villa Fresh — Migración a React + Bun

| | |
|---|---|
| **Fecha** | 28 de agosto de 2026 |
| **Estado** | Diseño aprobado — pendiente de plan de implementación |
| **Punto de partida** | commit `d24b4a4` (sitio estático) |
| **Sustituye a** | Nada. `DESIGN.md` sigue vigente y manda sobre lo visual. |

---

## 1. Objetivo

Migrar el sitio de Villa Fresh de HTML/CSS/JS sin build a **React + TypeScript sobre
Bun**, conservando el diseño y el comportamiento actuales, y publicando **HTML
pre-renderizado** para no perder el posicionamiento local que hoy sostiene el negocio.

El motivo es de mantenibilidad, no de producto: el alcance funcional del sitio **no
cambia**. Sigue sin backend, sin pagos y sin cuentas de usuario, y el pedido se cierra
por WhatsApp.

### Qué NO es este proyecto

Fuera de alcance, de forma explícita: pasarela de pagos, stock real, panel de
administración, autenticación, suscripciones, CMS, i18n y rediseño visual. Si algo de
eso aparece, es un proyecto nuevo con su propia spec.

---

## 2. Restricción que ordena la arquitectura

Villa Fresh se encuentra por búsquedas del tipo *"agua a domicilio Lima"* y por enlaces
compartidos en WhatsApp y Facebook. Hoy el sitio entrega HTML completo y eso funciona.

Una SPA de React entrega un `<div id="root">` vacío. Google acabaría indexándolo, pero
más lento y peor; y los previsualizadores de WhatsApp y Facebook **no ejecutan
JavaScript**, así que cada enlace compartido —el canal principal de este negocio— se
vería sin título ni descripción.

> **Regla dura:** el artefacto que se sube a producción debe contener el texto de la
> página dentro del HTML. Un build que produzca HTML vacío es un build fallido, y así
> debe fallar: ruidosamente, no en silencio.

**Corolario sobre las URL (28/08/2026, tras verificarlo en el navegador).** El catálogo
se publica como **`/catalogo.html`**, un archivo literal, no como `/catalogo/index.html`.
La forma de carpeta obliga a que el hosting resuelva `/catalogo` → `/catalogo/`: Netlify
y Vercel lo hacen, `vite preview` no, y ahí el fallback SPA sirve el HTML de la Home. El
servidor pinta entonces un contenido y el cliente otro, y React aborta la hidratación
(error #418). Un archivo literal se comporta igual en todos los hosts y en local, y es
además la URL que ya usa el sitio actual, así que ningún enlace existente se rompe.

Todo lo demás en este documento se deriva de esa restricción.

---

## 3. Decisiones

| Decisión | Elegido | Por qué |
|---|---|---|
| Runtime y gestor de paquetes | **Bun** | Pedido explícito. Además ejecuta TypeScript directo, así el script de pre-render no necesita compilarse aparte. |
| Framework de build | **Vite + React** | Estándar, sin sorpresas. Las versiones exactas se fijan y se anotan al instalar, no se dan por sabidas. |
| Lenguaje | **TypeScript** | El catálogo tipado convierte un precio o una categoría mal escritos en un error de build, no en una página rota en producción. |
| Pre-renderizado | **Script propio con `react-dom/server`** | Dos rutas. `renderToString` ya viene con React: resolver esto con una dependencia externa sería atarse a un mantenedor para ahorrar 40 líneas. |
| Enrutado | **React Router (modo declarativo)** | Dos rutas, sin loaders ni convenciones de archivos. |
| Estado | **`useState` + `useReducer` locales** | Siete SKUs y un carrito. Redux, Zustand o Context global aquí sobran. |
| Estilos | **CSS global existente + CSS Modules para lo nuevo** | Ver §7. |
| Hosting | **Estático** (Netlify / Vercel / Pages) | Igual que hoy: sin servidor que mantener ni pagar. |

### Descartado

- **SPA sin pre-render** — rompe los previews de WhatsApp, que es el canal de venta.
- **SSR con `Bun.serve`** — obliga a un servidor 24/7 para un sitio de dos páginas.
- **`vite-react-ssg`** y **React Router v7 framework mode** — resuelven el problema, pero
  con más dependencia o más maquinaria de la que este tamaño justifica.
- **Astro**, que el `README.md` recomendaba — decisión del dueño del proyecto: React.

---

## 4. Arquitectura

Build en dos pasos encadenados:

```
bun run build
   ├─ 1. vite build              → dist/assets/*.js, *.css   (bundle de cliente)
   └─ 2. bun scripts/prerender.ts
          para cada ruta:
            renderToString(<App url=ruta/>)
            inyecta el HTML y las metaetiquetas en la plantilla
            escribe dist/index.html  y  dist/catalogo.html
```

En el navegador, `hydrateRoot()` toma ese HTML ya pintado y le devuelve la interactividad
(filtros, carrito, cajón). El usuario ve el contenido antes de que cargue el JavaScript;
el buscador y el previsualizador de enlaces nunca necesitan ejecutarlo.

```
productos.ts ──> Catalogo ──> useState(filtros) ──> lista visible
                     │
                     └──────> useReducer(pedido) ──> mensajeWhatsApp(items)
                                                            │
                                                  wa.me/51994647840?text=…
```

---

## 5. Estructura de archivos

```
villa-fresh/
├─ package.json · bun.lock · tsconfig.json · vite.config.ts
├─ index.html                      plantilla de Vite (no es la página publicada)
├─ scripts/prerender.ts            pre-renderizado, corre en Bun
├─ public/                         SVGs, logos, robots.txt, sitemap.xml, favicon
├─ src/
│  ├─ main.tsx                     hydrateRoot()
│  ├─ entry-server.tsx             renderToString() por ruta
│  ├─ App.tsx                      rutas: "/" y "/catalogo.html"
│  ├─ types.ts                     Producto · Categoria · LineaPedido
│  ├─ data/
│  │  ├─ productos.ts              ← EL archivo de contenido (precios y SKUs)
│  │  └─ negocio.ts                teléfono, redes, eslogan, datos verificados
│  ├─ styles/
│  │  ├─ tokens.css                variables (de DESIGN.md §4–§8)
│  │  └─ site.css                  hoja global migrada tal cual
│  ├─ components/
│  │  ├─ Nav.tsx · Footer.tsx · Isotipo.tsx
│  │  ├─ Boton.tsx                 variantes wa · cyan · dark · ghost
│  │  ├─ Banda.tsx · Cinta.tsx · FichaTecnica.tsx · Marcador.tsx
│  │  └─ Icono.tsx                 SVG en línea, sin librerías
│  ├─ features/pedido/
│  │  ├─ usePedido.ts              reducer del carrito
│  │  ├─ mensajeWhatsApp.ts        función pura → string
│  │  ├─ CajonPedido.tsx
│  │  └─ TarjetaProducto.tsx · Filtros.tsx
│  └─ pages/
│     ├─ Home.tsx                  Hero · BandaPrecio · Proceso · Planes ·
│     │                            Cobertura · Preguntas · Cierre
│     └─ Catalogo.tsx
├─ legacy/                         el sitio HTML actual, como referencia visual
└─ docs/superpowers/specs/         este documento
```

`legacy/` se conserva durante toda la migración para comparar capturas, y se borra en un
commit propio al terminar.

---

## 6. Contratos

### `types.ts`

```ts
export type CategoriaId = 'bidones' | 'envases' | 'botellas' | 'accesorios' | 'empresas';

export interface Producto {
  sku: string;
  nombre: string;
  categoria: CategoriaId;   // unión cerrada: una categoría inexistente no compila
  precio: number | null;    // null → "A cotizar"
  unidad: string;
  etiqueta?: string;
  imagen: string;
  desc: string;
}

export interface LineaPedido { sku: string; cantidad: number; }
```

`categoria` como unión cerrada es deliberado: es el error que hoy dejaría un producto
invisible en el catálogo sin que nadie se entere.

### `data/productos.ts`

Sigue siendo **el único archivo que se edita para cambiar precios y productos**, tal como
promete el `README.md`. Se mantiene su comentario de cabecera y su formato legible: lo
edita quien lleva el negocio, no sólo quien programa.

### `mensajeWhatsApp.ts`

Función pura, sin React ni DOM. Es la pieza donde un error cuesta dinero real, porque su
salida la lee un cliente. **El formato actual se preserva carácter a carácter:**

```
Hola Villa Fresh, quiero hacer este pedido:
                                              ← línea en blanco
• 2 x Bidón 20 L (VF-B20) — S/ 60.00
• 1 x Recarga 20 L (VF-R20) — a cotizar
                                              ← línea en blanco
Total de lo que tiene precio: S/ 60.00        ← sólo si el total > 0
Hay productos que necesito que me coticen.    ← sólo si hay algún precio null
                                              ← línea en blanco
Mi dirección:                                 ← con espacio final
Distrito:                                     ← con espacio final
```

Detalles no negociables: importes con `S/ ` + dos decimales; viñeta `•`; guion largo `—`;
las dos líneas finales existen para que el cliente escriba encima en WhatsApp, y su
espacio final es intencional.

### `usePedido.ts`

Reducer con las acciones que ya existen: `agregar` · `incrementar` · `decrementar` ·
`quitar` · `limpiar`. Reglas heredadas del comportamiento actual:

- Agregar un SKU que ya está en el pedido **suma cantidad**, no duplica la línea.
- Bajar de 1 elimina la línea entera.
- El total suma **sólo** los productos con precio; los `null` no aportan.
- Agregar **no abre el cajón** — hace pulsar el botón del carrito 450 ms. Abrirlo en cada
  clic estorba cuando se agregan varios productos (`DESIGN.md` §9).

---

## 7. Estilos: dos tiempos, con una verificación en medio

Se pidió conservar el diseño **y** pulirlo. Se hacen en ese orden, separados por un
control, porque mezclarlos impide distinguir una mejora de un descuido.

**Tiempo 1 — migración 1:1.** `assets/site.css` se traslada íntegro como hoja global y los
componentes usan sus mismas clases. Objetivo: capturas **idénticas** a 375, 768 y 1440 px.
Cualquier diferencia es un defecto que se corrige, no una mejora que se acepta.

**Tiempo 2 — pulido**, ya sobre base verificada:

- `:hover` y `:focus-visible` consistentes (`2px solid var(--cyan)`, `offset: 3px`).
- Repaso responsive del catálogo; **cero scroll horizontal a 390 px** (`DESIGN.md` §7).
- Carrito persistido en `localStorage` (hoy se pierde al recargar).
- Metaetiquetas Open Graph por ruta, para que los enlaces compartidos por WhatsApp
  muestren título, descripción e imagen.
- Accesibilidad: foco visible, `aria-label` en los controles de cantidad, `aria-hidden`
  en lo decorativo, respeto de `prefers-reduced-motion` en la cinta.

Lo nuevo va en CSS Modules por componente; los tokens siguen siendo variables globales.
**`DESIGN.md` manda:** radio cero, un solo acento cian, `--wa` sólo en botones de
WhatsApp, sin degradados de fondo, sin Inter/Roboto/Montserrat/Poppins.

---

## 8. Casos borde

Heredados y obligatorios de preservar:

| Caso | Comportamiento |
|---|---|
| `precio: null` | La tarjeta muestra **"A cotizar"** (nunca `S/ 0.00` ni vacío) y el producto se pide igual |
| Pedido vacío | Botón de enviar deshabilitado, con el motivo escrito |
| Ningún filtro marcado | Se muestra el catálogo completo, y se dice explícitamente |
| Filtro sin resultados | *"Ningún producto en esa selección"* |
| Cerrar el cajón | Botón, velo o `Escape`; con el cajón abierto, `body { overflow: hidden }` |
| Datos del negocio sin confirmar | Siguen publicándose entre corchetes, a propósito |

Nuevos, propios del pre-renderizado:

| Caso | Comportamiento |
|---|---|
| Una ruta lanza al renderizar | **El build falla.** No se publica HTML incompleto |
| `localStorage` | Se lee en un efecto tras montar, **nunca** durante el render: leerlo antes desalinearía el HTML del servidor con el del cliente |
| Sin JavaScript | El catálogo se lee completo y el botón directo de WhatsApp funciona; sólo el carrito queda inerte. Hoy ocurre lo mismo: no es una regresión |
| Imagen que no carga | Espacio reservado, sin salto de layout |

---

## 9. Verificación

Nada se da por bueno sin comprobarlo.

**`bun test`** — lógica pura, sin navegador:
- `mensajeWhatsApp`: formato exacto, subtotales, total, productos a cotizar, pedido de un
  solo ítem, mezcla de precios con y sin valor.
- `usePedido`: sumar cantidad al repetir SKU, borrar al bajar de 1, total que ignora los
  `null`, limpiar.
- Filtros: sin marcar → todos; marcados → intersección; conteo por categoría.

**Build:** un test que comprueba que `dist/index.html` contiene el texto del hero
(*"No revendemos"*). Es la prueba de que el pre-renderizado ocurrió y no estamos
publicando una SPA vacía sin notarlo.

**Visual:** capturas con Playwright a 375, 768 y 1440 px, comparadas contra `legacy/`.

**Manual antes de publicar:** enviar un pedido real de prueba por WhatsApp y leer el
mensaje recibido.

---

## 10. Fases

| Fase | Entrega | Se considera hecha cuando |
|---|---|---|
| **0** | `git init` + commit del sitio actual + instalar Bun | ✅ commit `d24b4a4`; falta Bun |
| **1** | Andamiaje: Vite, React, TS, rutas, pre-render | `bun run build` produce HTML con texto dentro |
| **2** | Datos y lógica: `types`, `productos`, `usePedido`, `mensajeWhatsApp` + tests | `bun test` en verde |
| **3** | Home: 7 secciones, migración 1:1 | Capturas idénticas a `legacy/` en 3 anchos |
| **4** | Catálogo: filtros, tarjetas, cajón, envío | Pedido de prueba llega correcto por WhatsApp |
| **5** | Pulido (§7 tiempo 2) | Sin scroll horizontal a 390 px; foco visible; OG por ruta |
| **6** | Limpieza: borrar `legacy/`, actualizar `README.md` y `DESIGN.md` | La documentación describe lo que hay |

Las fases 1–5 las escribe **Codex** (`codex exec --sandbox workspace-write`), una tarea
por invocación. Tras cada una: revisión del `git diff`, `bun test`, build, y reporte. Una
desviación se corrige antes de lanzar la siguiente tarea, no se arrastra.

---

## 11. Riesgos

| Riesgo | Mitigación |
|---|---|
| Deriva visual silenciosa al portar el CSS | Capturas comparadas contra `legacy/` en la fase 3, antes de cualquier mejora |
| Publicar una SPA vacía sin darse cuenta | El test de build que busca el texto del hero |
| Desalineación de hidratación por `localStorage` | Lectura sólo en efecto tras montar (§8) |
| El mensaje de WhatsApp cambia de formato | Tests con el string exacto esperado (§6) |
| Bun sin instalar en la máquina | Fase 0 lo instala y fija la versión en `package.json` |
| Codex se desvía del diseño | Una tarea por invocación, revisión de diff entre tareas |

---

## 12. Lo que no se toca

El contenido está verificado contra las redes de Villa Fresh y **se migra literal**:
agua **purificada** (ósmosis inversa → alcalinización a pH 8.3 → ozonización), planta
propia, S/ 30 el bidón y S/ 50 dos bidones, WhatsApp 994 647 840, eslogan *"Pureza que
refresca tu vida"*.

No se escribe "agua mineral de manantial" ni se inventan precios, presentaciones ni el
número de registro DIGESA. Los pendientes del negocio (RUC, distritos reales, horarios,
Libro de Reclamaciones) siguen visibles entre corchetes hasta que exista el dato real.
