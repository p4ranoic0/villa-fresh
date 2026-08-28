# Villa Fresh — Migración a React + Bun · Plan de implementación

> **Para trabajadores agénticos:** SUB-SKILL REQUERIDA: usa
> `superpowers:subagent-driven-development` (recomendado) o
> `superpowers:executing-plans` para implementar este plan tarea por tarea.
> Los pasos usan casillas (`- [ ]`) para seguimiento.

**Objetivo:** migrar el sitio estático de Villa Fresh a React + TypeScript sobre Bun,
conservando diseño y comportamiento, y publicando HTML pre-renderizado.

**Arquitectura:** Vite compila dos veces —bundle de cliente y bundle de servidor— y
después un script propio corriendo en Bun renderiza cada ruta a string con
`renderToString` y escribe `dist/index.html` y `dist/catalogo/index.html` con el
contenido dentro. En el navegador, `hydrateRoot()` devuelve la interactividad. El
artefacto publicado sigue siendo HTML estático subible a cualquier hosting.

**Stack:** Bun · Vite · React · TypeScript · React Router (modo declarativo) ·
`react-dom/server` · `bun test`.

**Spec:** `docs/superpowers/specs/2026-08-28-villa-fresh-react-bun-design.md`

**Ejecución:** las tareas 1–10 y 12–13 las escribe **Codex**, una por invocación:

```bash
codex exec --sandbox workspace-write "$(cat tarea.md)"
```

Entre tareas: revisión de `git diff`, `bun test`, `bun run build` y reporte. La tarea 11
la ejecuta Claude con Playwright, no Codex.

---

## Restricciones globales

Aplican a **todas** las tareas. Valores copiados literalmente de la spec.

1. **El HTML publicado debe contener el texto de la página.** Un build que produzca
   `<div id="root"></div>` vacío es un build fallido y debe fallar ruidosamente.
2. **`data/productos.ts` es el único archivo que se edita para cambiar precios y
   productos.** Conserva su comentario de cabecera y su formato legible.
3. **El mensaje de WhatsApp se preserva carácter a carácter**, incluidos el guion largo
   `—`, la viñeta `•`, las líneas en blanco y el **espacio final** de `Mi dirección: ` y
   `Distrito: `.
4. **`DESIGN.md` manda sobre lo visual.** Radio cero (excepto badge del carrito y botones
   flotantes de WhatsApp); un solo acento `--cyan`; `--wa` sólo en botones que abren
   WhatsApp; sin degradados de fondo; tipografías **Archivo** e **IBM Plex Mono**
   únicamente — prohibidas Inter, Roboto, Montserrat, Poppins.
5. **Contenido verificado, literal.** Agua **purificada** (nunca "mineral de manantial"),
   pH 8.3, S/ 30 el bidón, S/ 50 dos bidones, WhatsApp 994 647 840, eslogan *"Pureza que
   refresca tu vida"*. No se inventan precios, presentaciones ni registro DIGESA.
6. **Los marcadores entre corchetes se publican a propósito** (`[ RAZÓN SOCIAL Y RUC ]`,
   `[ Distritos referenciales... ]`). No se borran ni se rellenan con datos inventados.
7. **Nada de dependencias nuevas** más allá de las que instala la Tarea 1. Si una tarea
   parece necesitar una librería, para y pregunta.
8. **Idioma del código:** nombres de variables, funciones y comentarios en español, como
   el código actual. Commits en español, en imperativo.

### Versiones fijadas (instaladas el 28/08/2026)

La spec pedía anotarlas al instalar en vez de darlas por sabidas. Resultaron ser:

| Paquete | Versión |
|---|---|
| bun | 1.4.0 |
| react · react-dom | 19.2.8 |
| **react-router** | **8.3.1** — v8, no v7. Verificado en `node_modules`: `StaticRouter`, `BrowserRouter`, `Routes`, `Route`, `Link` y `useLocation` se exportan todos desde la raíz del paquete, como asume el plan |
| vite | 8.2.2 |
| @vitejs/plugin-react | 6.1.1 |
| typescript | 7.0.2 |
| @types/react · @types/react-dom · @types/bun | 19.2.18 · 19.2.5 · 1.4.0 |

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `package.json` · `vite.config.ts` · `tsconfig.json` | Configuración del proyecto |
| `index.html` | Plantilla de Vite con los marcadores `<!--app-head-->` y `<!--app-html-->` |
| `scripts/prerender.ts` | Escribe el HTML final de cada ruta. Corre en Bun |
| `src/rutas.ts` | Lista de rutas con su `title` y `description`. La consumen el prerender y el `<title>` del cliente |
| `src/main.tsx` | Punto de entrada del navegador (`hydrateRoot`) |
| `src/entry-server.tsx` | Punto de entrada del servidor (`renderToString`) |
| `src/App.tsx` | Rutas y título del documento |
| `src/types.ts` | `Producto`, `CategoriaId`, `LineaPedido` |
| `src/data/productos.ts` | Catálogo y categorías |
| `src/data/negocio.ts` | Teléfono, redes, eslogan, constructor de URL de WhatsApp |
| `src/features/pedido/mensajeWhatsApp.ts` | Función pura: líneas de pedido → texto del mensaje |
| `src/features/pedido/pedido.ts` | Reducer y cálculos del pedido |
| `src/features/pedido/usePedido.ts` | Hook que envuelve el reducer |
| `src/features/catalogo/filtros.ts` | Filtrado y conteo por categoría |
| `src/components/*` | Piezas compartidas: `Isotipo`, `Icono`, `Boton`, `Nav`, `Footer`, `WaFlotante` |
| `src/pages/Home.tsx` + `src/pages/home/*` | Las 7 secciones de la portada |
| `src/pages/Catalogo.tsx` + `src/features/catalogo/*` | Filtros, grilla y cajón de pedido |
| `src/styles/site.css` | Hoja global migrada tal cual desde `legacy/assets/site.css` |
| `legacy/` | El sitio actual, congelado como referencia visual. Se borra en la Tarea 13 |
| `tests/*.test.ts` | Pruebas de lógica pura y del artefacto de build |

---

## Reglas de conversión HTML → JSX

Aplican a las tareas 7, 8, 9 y 10. **La conversión es mecánica: no se reescribe el
marcado, no se "mejora" la estructura y no se cambian nombres de clase.**

| HTML | JSX |
|---|---|
| `class="btn btn-wa"` | `className="btn btn-wa"` |
| `style="width:26px;stroke-width:6"` | `style={{ width: '26px', strokeWidth: 6 }}` |
| `stroke-width="1.7"` | `strokeWidth="1.7"` |
| `stroke-linejoin`, `stroke-linecap` | `strokeLinejoin`, `strokeLinecap` |
| `<br>` | `<br />` |
| `hidden` | `hidden={condición}` |
| `&nbsp;` | `&nbsp;` (JSX admite entidades en texto) |
| `viewBox`, `aria-*`, `role`, `d`, `fill`, `stroke` | igual |
| `href="catalogo.html"` | `<Link to="/catalogo">` |
| `href="index.html#proceso"` | `href="/#proceso"` (ancla: `<a>` normal, no `Link`) |

Los enlaces externos conservan `target="_blank" rel="noopener"`.

---

### Task 1: Herramientas, andamiaje y congelado del sitio actual

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`,
  `index.html`, `src/main.tsx`, `src/App.tsx`, `src/rutas.ts`,
  `src/pages/Home.tsx`, `src/pages/Catalogo.tsx`, `src/styles/site.css`
- Move: `index.html` · `catalogo.html` · `assets/` → `legacy/`
- Copy: SVGs y logos de `legacy/assets/` → `public/`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nada.
- Produces: `RUTAS: MetaRuta[]` desde `src/rutas.ts`; componente `App` por defecto desde
  `src/App.tsx`; scripts `bun run dev`, `bun run build`, `bun test`, `bun run typecheck`.

- [ ] **Step 1: Instalar Bun y dejar constancia de la versión**

```bash
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"
bun --version
```

Si `bun --version` no imprime nada, **para y reporta**. Todo el plan depende de esto.

- [ ] **Step 2: Congelar el sitio actual en `legacy/`**

```bash
mkdir -p legacy
git mv index.html catalogo.html legacy/
git mv assets legacy/assets
mkdir -p public
cp legacy/assets/*.svg legacy/assets/*.png legacy/assets/*.jpg public/
git add -A && git commit -m "Congelar el sitio estatico en legacy/ como referencia visual"
```

`legacy/` se conserva durante toda la migración para comparar capturas.

- [ ] **Step 3: Crear `package.json`**

```json
{
  "name": "villa-fresh",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && bun scripts/prerender.ts",
    "preview": "vite preview",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 4: Instalar dependencias y anotar las versiones resueltas**

No se escriben números de versión a mano: se instala y se deja que Bun los fije.

```bash
bun add react react-dom react-router
bun add -d vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/bun
bun pm ls
```

Copia la salida de `bun pm ls` en el mensaje de commit. Es el registro de qué versiones
quedaron fijadas.

- [ ] **Step 5: Crear `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
})
```

- [ ] **Step 6: Crear `tsconfig.json` y `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src", "scripts", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6b: Crear `src/vite-env.d.ts`**

Sin esto, `import.meta.env.PROD` (que usa `main.tsx`) no está tipado.

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 7: Crear `index.html`, la plantilla de Vite**

Los dos marcadores son los que rellena el prerender. **No añadas un `<title>` aquí:**
habría dos títulos en el HTML publicado. En desarrollo el título lo pone `App.tsx`.

```html
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="/bidon-20l.svg" type="image/svg+xml">
<!--app-head-->
</head>
<body>
<div id="root"><!--app-html--></div>
<script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 8: Crear `src/rutas.ts`**

Los `title` y `description` se copian **literales** de `legacy/index.html` y
`legacy/catalogo.html`. No se reescriben: están puestos para buscadores.

```ts
export interface MetaRuta {
  /** Ruta de React Router. */
  path: string
  /** Archivo que escribe el prerender, relativo a dist/. */
  archivo: string
  title: string
  description: string
}

export const RUTAS: MetaRuta[] = [
  {
    path: '/',
    archivo: 'index.html',
    title: 'Villa Fresh — Agua purificada a domicilio en Lima | Bidón 20 L S/30',
    description:
      'Bidón de 20 litros de agua purificada por ósmosis inversa, ozonizada y alcalinizada a pH 8.3. Planta propia, sin intermediarios. Entrega el mismo día en Lima Metropolitana. S/30 el bidón, 2 por S/50.',
  },
  {
    path: '/catalogo',
    archivo: 'catalogo/index.html',
    title: 'Catálogo — Villa Fresh | Bidones, recarga y accesorios en Lima',
    description:
      'Catálogo de Villa Fresh: bidón de 20 L a S/30, 2 por S/50, recarga, envase vacío, botellas y dispensador. Arma tu pedido y lo cierras por WhatsApp.',
  },
]
```

- [ ] **Step 9: Crear `src/App.tsx`**

```tsx
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import { RUTAS } from './rutas'

/** Mantiene el <title> al navegar en cliente; en el HTML publicado lo pone el prerender. */
function Titulo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const ruta = RUTAS.find((r) => r.path === pathname)
    if (ruta) document.title = ruta.title
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <Titulo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </>
  )
}
```

- [ ] **Step 10: Crear `src/main.tsx`**

En desarrollo no hay HTML del servidor que hidratar, así que se usa `createRoot`; en
producción sí lo hay y se usa `hydrateRoot`.

```tsx
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './styles/site.css'

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

const raiz = document.getElementById('root')!
if (import.meta.env.PROD) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
```

- [ ] **Step 11: Migrar la hoja de estilos y crear páginas provisionales**

```bash
cp legacy/assets/site.css src/styles/site.css
```

`src/styles/site.css` es una **copia literal**. No se toca en esta tarea.

Páginas provisionales, que las tareas 8 y 9 sustituyen:

```tsx
// src/pages/Home.tsx
export default function Home() {
  return <h1>Villa Fresh</h1>
}
```

```tsx
// src/pages/Catalogo.tsx
export default function Catalogo() {
  return <h1>Catálogo</h1>
}
```

- [ ] **Step 12: Ignorar los artefactos de build**

Añade a `.gitignore`:

```
dist-ssr/
.bun/
```

- [ ] **Step 13: Verificar que el andamiaje arranca**

```bash
bun run typecheck
bun run dev   # abre http://localhost:5173, confirma que carga y ciérralo
vite build    # sólo el bundle de cliente: el prerender aún no existe
```

Esperado: `tsc` sin errores y `vite build` generando `dist/index.html` + `dist/assets/`.
El script `bun run build` completo **todavía falla** porque falta `scripts/prerender.ts`:
es correcto, lo crea la Tarea 2.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "Andamiaje: Vite + React + TypeScript sobre Bun"
```

---

### Task 2: Pre-renderizado a HTML estático

Es la tarea que sostiene la restricción global 1. Se escribe antes que cualquier
contenido para que ningún avance posterior pueda romperla en silencio.

**Files:**
- Create: `src/entry-server.tsx`, `scripts/prerender.ts`, `tests/build.test.ts`
- Modify: `package.json` (script `test:build`)

**Interfaces:**
- Consumes: `RUTAS` de `src/rutas.ts`; `App` de `src/App.tsx`.
- Produces: `render(url: string): string` desde `src/entry-server.tsx`;
  `dist/index.html` y `dist/catalogo/index.html` con el contenido dentro.

- [ ] **Step 1: Escribir la prueba que falla**

```ts
// tests/build.test.ts
import { test, expect } from 'bun:test'
import { readFile } from 'node:fs/promises'

test('la home publicada lleva su título dentro del HTML', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('<title>Villa Fresh — Agua purificada a domicilio en Lima | Bidón 20 L S/30</title>')
})

test('la home publicada NO es un contenedor vacío', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).not.toContain('<div id="root"></div>')
  expect(html).not.toContain('<!--app-html-->')
})

test('el catálogo se publica en su propia carpeta, con su título', async () => {
  const html = await readFile('dist/catalogo/index.html', 'utf8')
  expect(html).toContain('<title>Catálogo — Villa Fresh | Bidones, recarga y accesorios en Lima</title>')
  expect(html).not.toContain('<div id="root"></div>')
})
```

- [ ] **Step 2: Ejecutar la prueba y ver que falla**

```bash
bun test tests/build.test.ts
```

Esperado: FALLA — `dist/catalogo/index.html` no existe y `dist/index.html` todavía
contiene `<!--app-html-->`.

- [ ] **Step 3: Crear `src/entry-server.tsx`**

```tsx
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

/** Renderiza una ruta a HTML. La llama scripts/prerender.ts en tiempo de build. */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
```

- [ ] **Step 4: Crear `scripts/prerender.ts`**

```ts
/* ==========================================================================
   Escribe el HTML final de cada ruta. Corre en Bun después de los dos builds
   de Vite. Si una ruta falla al renderizar, el proceso termina con código 1:
   preferimos un build roto a publicar una página vacía.
   ========================================================================== */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { RUTAS } from '../src/rutas'
// @ts-expect-error — lo genera `vite build --ssr` justo antes de este script
import { render } from '../dist-ssr/entry-server.js'

const DIST = join(import.meta.dir, '..', 'dist')

function escapar(texto: string): string {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function cabecera(title: string, description: string): string {
  return [
    `<title>${escapar(title)}</title>`,
    `<meta name="description" content="${escapar(description)}">`,
  ].join('\n')
}

// Se lee una sola vez, antes del bucle: dist/index.html es a la vez plantilla y salida.
const plantilla = await readFile(join(DIST, 'index.html'), 'utf8')

try {
  for (const ruta of RUTAS) {
    const html = render(ruta.path)
    if (!html.trim()) throw new Error(`${ruta.path} renderizó vacío`)

    const salida = plantilla
      .replace('<!--app-head-->', cabecera(ruta.title, ruta.description))
      .replace('<!--app-html-->', html)

    const destino = join(DIST, ruta.archivo)
    await mkdir(dirname(destino), { recursive: true })
    await writeFile(destino, salida, 'utf8')
    console.log(`✓ dist/${ruta.archivo}`)
  }
} catch (error) {
  console.error('✗ Falló el pre-renderizado. No se publica HTML incompleto.')
  console.error(error)
  process.exit(1)
}
```

- [ ] **Step 5: Añadir el script `test:build` a `package.json`**

```json
"test:build": "bun run build && bun test tests/build.test.ts"
```

- [ ] **Step 6: Ejecutar y verificar que pasa**

```bash
bun run test:build
```

Esperado: los tres tests en verde y en `dist/` aparecen `index.html` y
`catalogo/index.html`. Compruébalo también a ojo:

```bash
grep -c 'Villa Fresh' dist/index.html   # > 0
```

- [ ] **Step 7: Verificar que el build falla cuando debe fallar**

Es la mitad importante de esta tarea: comprobar que la red de seguridad **salta**.

```bash
# rompe la home a propósito
printf 'export default function Home(){ throw new Error("prueba") }\n' > src/pages/Home.tsx
bun run build; echo "código de salida: $?"
```

Esperado: código de salida **distinto de 0** y el mensaje *"No se publica HTML
incompleto"*. Después restaura la página:

```bash
git checkout src/pages/Home.tsx
bun run build   # vuelve a pasar
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Pre-renderizar cada ruta a HTML estatico con Bun"
```

---

### Task 3: Tipos y datos del catálogo

**Files:**
- Create: `src/types.ts`, `src/data/productos.ts`, `src/data/negocio.ts`,
  `tests/datos.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type CategoriaId = 'bidones' | 'envases' | 'botellas' | 'accesorios' | 'empresas'`
  - `interface Producto { sku, nombre, categoria, precio, unidad, etiqueta?, imagen, desc }`
  - `interface LineaPedido { sku: string; cantidad: number }`
  - `interface Categoria { id: CategoriaId; nombre: string }`
  - `PRODUCTOS: Producto[]`, `CATEGORIAS: Categoria[]` desde `src/data/productos.ts`
  - `NEGOCIO` y `urlWhatsApp(texto?: string): string` desde `src/data/negocio.ts`

- [ ] **Step 1: Escribir la prueba que falla**

```ts
// tests/datos.test.ts
import { test, expect } from 'bun:test'
import { CATEGORIAS, PRODUCTOS } from '../src/data/productos'
import { NEGOCIO, urlWhatsApp } from '../src/data/negocio'

test('no hay SKU repetidos', () => {
  const skus = PRODUCTOS.map((p) => p.sku)
  expect(new Set(skus).size).toBe(skus.length)
})

test('toda categoría usada por un producto existe en CATEGORIAS', () => {
  const ids = new Set(CATEGORIAS.map((c) => c.id))
  for (const p of PRODUCTOS) expect(ids.has(p.categoria)).toBe(true)
})

test('un precio es null o un número mayor que cero, nunca 0', () => {
  // El código antiguo trataba 0 como "sin precio" por comprobar con un truthy.
  // Aquí lo prohibimos: "sin precio" se escribe null y nada más.
  for (const p of PRODUCTOS) {
    if (p.precio !== null) expect(p.precio).toBeGreaterThan(0)
  }
})

test('los dos precios confirmados con las redes no cambiaron', () => {
  expect(PRODUCTOS.find((p) => p.sku === 'VF-B20')?.precio).toBe(30)
  expect(PRODUCTOS.find((p) => p.sku === 'VF-B20X2')?.precio).toBe(50)
})

test('todo producto apunta a una imagen bajo /', () => {
  for (const p of PRODUCTOS) expect(p.imagen.startsWith('/')).toBe(true)
})

test('urlWhatsApp arma el enlace con el texto codificado', () => {
  expect(urlWhatsApp('Hola Villa Fresh')).toBe(
    'https://wa.me/51994647840?text=Hola%20Villa%20Fresh',
  )
  expect(urlWhatsApp()).toBe('https://wa.me/51994647840')
  expect(NEGOCIO.telefonoVisible).toBe('994 647 840')
})
```

- [ ] **Step 2: Ejecutar la prueba y ver que falla**

```bash
bun test tests/datos.test.ts
```

Esperado: FALLA — no existen `src/data/productos.ts` ni `src/data/negocio.ts`.

- [ ] **Step 3: Crear `src/types.ts`**

```ts
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
  desc: string
}

export interface LineaPedido {
  sku: string
  cantidad: number
}
```

- [ ] **Step 4: Crear `src/data/negocio.ts`**

```ts
export const NEGOCIO = {
  telefono: '51994647840',
  telefonoVisible: '994 647 840',
  eslogan: 'Pureza que refresca tu vida',
  facebook: 'https://www.facebook.com/villafreshlima',
  instagram: 'https://www.instagram.com/villafresh.lima/',
} as const

/** Enlace de WhatsApp con el mensaje ya escrito. */
export function urlWhatsApp(texto?: string): string {
  const base = `https://wa.me/${NEGOCIO.telefono}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
```

- [ ] **Step 5: Crear `src/data/productos.ts`**

Porta los 7 productos y las 5 categorías desde `legacy/assets/productos.js`, **sin
cambiar ningún texto, precio ni SKU**. Cambian sólo tres cosas: los tipos, `window.VF_*`
pasa a `export const`, y las rutas de imagen pierden el prefijo `assets/` porque ahora
viven en `public/` (`assets/bidon-20l.svg` → `/bidon-20l.svg`).

Conserva el comentario de cabecera: este archivo lo edita quien lleva el negocio.

```ts
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
  // … los 6 restantes, portados literalmente desde legacy/assets/productos.js
]
```

- [ ] **Step 6: Ejecutar las pruebas y verificar que pasan**

```bash
bun test tests/datos.test.ts
bun run typecheck
```

Esperado: 6 tests en verde y `tsc` sin errores.

- [ ] **Step 7: Verificar que los 7 productos están completos**

```bash
grep -c "sku:" src/data/productos.ts   # debe imprimir 7
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Tipar el catalogo y los datos del negocio"
```

---

### Task 4: El mensaje de WhatsApp

La pieza donde un error cuesta dinero real: su salida la lee un cliente.

**Files:**
- Create: `src/features/pedido/mensajeWhatsApp.ts`, `tests/mensajeWhatsApp.test.ts`

**Interfaces:**
- Consumes: `Producto`, `LineaPedido` de `src/types.ts`.
- Produces:
  - `soles(n: number): string` — `30` → `'S/ 30.00'`
  - `mensajeWhatsApp(lineas: LineaPedido[], productos: Producto[]): string`

- [ ] **Step 1: Escribir la prueba que falla**

Las cadenas esperadas están escritas enteras a propósito: es la única forma de que un
cambio de formato se note.

```ts
// tests/mensajeWhatsApp.test.ts
import { test, expect } from 'bun:test'
import { mensajeWhatsApp, soles } from '../src/features/pedido/mensajeWhatsApp'
import type { Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', categoria: 'bidones', precio: 30, unidad: 'con envase', imagen: '/bidon-20l.svg', desc: '' },
  { sku: 'VF-R20', nombre: 'Recarga 20 L', categoria: 'bidones', precio: null, unidad: 'con tu envase', imagen: '/bidon-20l.svg', desc: '' },
]

test('soles siempre lleva dos decimales', () => {
  expect(soles(30)).toBe('S/ 30.00')
  expect(soles(0)).toBe('S/ 0.00')
  expect(soles(52.5)).toBe('S/ 52.50')
})

test('mezcla de precio y a cotizar: formato exacto', () => {
  const texto = mensajeWhatsApp(
    [{ sku: 'VF-B20', cantidad: 2 }, { sku: 'VF-R20', cantidad: 1 }],
    PRODUCTOS,
  )
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer este pedido:\n' +
    '\n' +
    '• 2 x Bidón 20 L (VF-B20) — S/ 60.00\n' +
    '• 1 x Recarga 20 L (VF-R20) — a cotizar\n' +
    '\n' +
    'Total de lo que tiene precio: S/ 60.00\n' +
    'Hay productos que necesito que me coticen.\n' +
    '\n' +
    'Mi dirección: \n' +
    'Distrito: ',
  )
})

test('sólo productos con precio: sin la línea de cotización', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer este pedido:\n' +
    '\n' +
    '• 1 x Bidón 20 L (VF-B20) — S/ 30.00\n' +
    '\n' +
    'Total de lo que tiene precio: S/ 30.00\n' +
    '\n' +
    'Mi dirección: \n' +
    'Distrito: ',
  )
})

test('sólo productos a cotizar: sin la línea de total', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-R20', cantidad: 1 }], PRODUCTOS)
  expect(texto).toBe(
    'Hola Villa Fresh, quiero hacer este pedido:\n' +
    '\n' +
    '• 1 x Recarga 20 L (VF-R20) — a cotizar\n' +
    '\n' +
    'Hay productos que necesito que me coticen.\n' +
    '\n' +
    'Mi dirección: \n' +
    'Distrito: ',
  )
})

test('las dos últimas líneas terminan en espacio, para que el cliente escriba encima', () => {
  const texto = mensajeWhatsApp([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)
  expect(texto.endsWith('Mi dirección: \nDistrito: ')).toBe(true)
})

test('una línea con SKU inexistente se ignora sin romper el mensaje', () => {
  const texto = mensajeWhatsApp(
    [{ sku: 'NO-EXISTE', cantidad: 1 }, { sku: 'VF-B20', cantidad: 1 }],
    PRODUCTOS,
  )
  expect(texto).toContain('• 1 x Bidón 20 L (VF-B20) — S/ 30.00')
  expect(texto).not.toContain('NO-EXISTE')
})
```

- [ ] **Step 2: Ejecutar la prueba y ver que falla**

```bash
bun test tests/mensajeWhatsApp.test.ts
```

Esperado: FALLA con "Cannot find module '../src/features/pedido/mensajeWhatsApp'".

- [ ] **Step 3: Escribir la implementación**

```ts
import type { LineaPedido, Producto } from '../../types'

export function soles(n: number): string {
  return `S/ ${n.toFixed(2)}`
}

/** Arma el texto del pedido. Función pura: sin React, sin DOM, sin efectos.
 *  El formato lo lee un cliente en WhatsApp — no se cambia sin actualizar los tests. */
export function mensajeWhatsApp(lineas: LineaPedido[], productos: Producto[]): string {
  const porSku = (sku: string) => productos.find((p) => p.sku === sku)
  const presentes = lineas.flatMap((l) => {
    const producto = porSku(l.sku)
    return producto ? [{ linea: l, producto }] : []
  })

  const total = presentes.reduce(
    (suma, { linea, producto }) =>
      producto.precio !== null ? suma + producto.precio * linea.cantidad : suma,
    0,
  )
  const hayPendientes = presentes.some(({ producto }) => producto.precio === null)

  const partes: string[] = ['Hola Villa Fresh, quiero hacer este pedido:', '']

  for (const { linea, producto } of presentes) {
    const importe =
      producto.precio !== null ? soles(producto.precio * linea.cantidad) : 'a cotizar'
    partes.push(`• ${linea.cantidad} x ${producto.nombre} (${producto.sku}) — ${importe}`)
  }

  partes.push('')
  if (total > 0) partes.push(`Total de lo que tiene precio: ${soles(total)}`)
  if (hayPendientes) partes.push('Hay productos que necesito que me coticen.')
  partes.push('', 'Mi dirección: ', 'Distrito: ')

  return partes.join('\n')
}
```

- [ ] **Step 4: Ejecutar las pruebas y verificar que pasan**

```bash
bun test tests/mensajeWhatsApp.test.ts
```

Esperado: 6 tests en verde.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Armar el mensaje de WhatsApp como funcion pura, con tests del formato exacto"
```

---

### Task 5: Estado del pedido

**Files:**
- Create: `src/features/pedido/pedido.ts`, `src/features/pedido/usePedido.ts`,
  `tests/pedido.test.ts`

**Interfaces:**
- Consumes: `LineaPedido`, `Producto` de `src/types.ts`.
- Produces:
  - `type AccionPedido` — `{tipo:'agregar'|'incrementar'|'decrementar'|'quitar', sku:string} | {tipo:'limpiar'}`
  - `reducirPedido(estado: LineaPedido[], accion: AccionPedido): LineaPedido[]`
  - `totalUnidades(lineas: LineaPedido[]): number`
  - `totalSoles(lineas: LineaPedido[], productos: Producto[]): number`
  - `hayPendientes(lineas: LineaPedido[], productos: Producto[]): boolean`
  - `usePedido()` → `{ lineas, unidades, total, pendientes, agregar, incrementar, decrementar, quitar, limpiar }`

- [ ] **Step 1: Escribir la prueba que falla**

```ts
// tests/pedido.test.ts
import { test, expect } from 'bun:test'
import { hayPendientes, reducirPedido, totalSoles, totalUnidades } from '../src/features/pedido/pedido'
import type { LineaPedido, Producto } from '../src/types'

const PRODUCTOS: Producto[] = [
  { sku: 'VF-B20', nombre: 'Bidón 20 L', categoria: 'bidones', precio: 30, unidad: '', imagen: '/b.svg', desc: '' },
  { sku: 'VF-R20', nombre: 'Recarga 20 L', categoria: 'bidones', precio: null, unidad: '', imagen: '/b.svg', desc: '' },
]

test('agregar un SKU nuevo crea la línea con cantidad 1', () => {
  expect(reducirPedido([], { tipo: 'agregar', sku: 'VF-B20' })).toEqual([
    { sku: 'VF-B20', cantidad: 1 },
  ])
})

test('agregar un SKU que ya está suma cantidad, no duplica la línea', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 1 }]
  expect(reducirPedido(estado, { tipo: 'agregar', sku: 'VF-B20' })).toEqual([
    { sku: 'VF-B20', cantidad: 2 },
  ])
})

test('decrementar por debajo de 1 elimina la línea entera', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 1 }]
  expect(reducirPedido(estado, { tipo: 'decrementar', sku: 'VF-B20' })).toEqual([])
})

test('el reducer no muta el estado que recibe', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 1 }]
  reducirPedido(estado, { tipo: 'incrementar', sku: 'VF-B20' })
  expect(estado).toEqual([{ sku: 'VF-B20', cantidad: 1 }])
})

test('quitar elimina sólo el SKU indicado', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-B20', cantidad: 3 },
    { sku: 'VF-R20', cantidad: 1 },
  ]
  expect(reducirPedido(estado, { tipo: 'quitar', sku: 'VF-B20' })).toEqual([
    { sku: 'VF-R20', cantidad: 1 },
  ])
})

test('limpiar deja el pedido vacío', () => {
  const estado: LineaPedido[] = [{ sku: 'VF-B20', cantidad: 3 }]
  expect(reducirPedido(estado, { tipo: 'limpiar' })).toEqual([])
})

test('el total suma sólo lo que tiene precio', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-B20', cantidad: 2 },
    { sku: 'VF-R20', cantidad: 5 },
  ]
  expect(totalSoles(estado, PRODUCTOS)).toBe(60)
})

test('las unidades cuentan todo, tenga precio o no', () => {
  const estado: LineaPedido[] = [
    { sku: 'VF-B20', cantidad: 2 },
    { sku: 'VF-R20', cantidad: 5 },
  ]
  expect(totalUnidades(estado)).toBe(7)
})

test('hayPendientes detecta productos sin precio', () => {
  expect(hayPendientes([{ sku: 'VF-R20', cantidad: 1 }], PRODUCTOS)).toBe(true)
  expect(hayPendientes([{ sku: 'VF-B20', cantidad: 1 }], PRODUCTOS)).toBe(false)
})
```

- [ ] **Step 2: Ejecutar la prueba y ver que falla**

```bash
bun test tests/pedido.test.ts
```

Esperado: FALLA con "Cannot find module '../src/features/pedido/pedido'".

- [ ] **Step 3: Escribir `src/features/pedido/pedido.ts`**

```ts
import type { LineaPedido, Producto } from '../../types'

export type AccionPedido =
  | { tipo: 'agregar'; sku: string }
  | { tipo: 'incrementar'; sku: string }
  | { tipo: 'decrementar'; sku: string }
  | { tipo: 'quitar'; sku: string }
  | { tipo: 'limpiar' }

export function reducirPedido(estado: LineaPedido[], accion: AccionPedido): LineaPedido[] {
  switch (accion.tipo) {
    case 'agregar':
    case 'incrementar': {
      const existe = estado.some((l) => l.sku === accion.sku)
      return existe
        ? estado.map((l) => (l.sku === accion.sku ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...estado, { sku: accion.sku, cantidad: 1 }]
    }
    case 'decrementar':
      return estado.flatMap((l) =>
        l.sku !== accion.sku ? [l] : l.cantidad > 1 ? [{ ...l, cantidad: l.cantidad - 1 }] : [],
      )
    case 'quitar':
      return estado.filter((l) => l.sku !== accion.sku)
    case 'limpiar':
      return []
  }
}

export function totalUnidades(lineas: LineaPedido[]): number {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0)
}

export function totalSoles(lineas: LineaPedido[], productos: Producto[]): number {
  return lineas.reduce((suma, l) => {
    const producto = productos.find((p) => p.sku === l.sku)
    // Comprobación explícita contra null: un precio 0 sería un precio, no una ausencia.
    return producto && producto.precio !== null ? suma + producto.precio * l.cantidad : suma
  }, 0)
}

export function hayPendientes(lineas: LineaPedido[], productos: Producto[]): boolean {
  return lineas.some((l) => productos.find((p) => p.sku === l.sku)?.precio === null)
}
```

- [ ] **Step 4: Escribir `src/features/pedido/usePedido.ts`**

```ts
import { useCallback, useMemo, useReducer } from 'react'
import { PRODUCTOS } from '../../data/productos'
import type { LineaPedido } from '../../types'
import { hayPendientes, reducirPedido, totalSoles, totalUnidades } from './pedido'

const VACIO: LineaPedido[] = []

export function usePedido() {
  const [lineas, despachar] = useReducer(reducirPedido, VACIO)

  const agregar = useCallback((sku: string) => despachar({ tipo: 'agregar', sku }), [])
  const incrementar = useCallback((sku: string) => despachar({ tipo: 'incrementar', sku }), [])
  const decrementar = useCallback((sku: string) => despachar({ tipo: 'decrementar', sku }), [])
  const quitar = useCallback((sku: string) => despachar({ tipo: 'quitar', sku }), [])
  const limpiar = useCallback(() => despachar({ tipo: 'limpiar' }), [])

  const unidades = useMemo(() => totalUnidades(lineas), [lineas])
  const total = useMemo(() => totalSoles(lineas, PRODUCTOS), [lineas])
  const pendientes = useMemo(() => hayPendientes(lineas, PRODUCTOS), [lineas])

  return { lineas, unidades, total, pendientes, agregar, incrementar, decrementar, quitar, limpiar }
}
```

- [ ] **Step 5: Ejecutar las pruebas y verificar que pasan**

```bash
bun test tests/pedido.test.ts
bun run typecheck
```

Esperado: 9 tests en verde.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Reducer del pedido con tests, y hook usePedido"
```

---

### Task 6: Filtros del catálogo

**Files:**
- Create: `src/features/catalogo/filtros.ts`, `tests/filtros.test.ts`

**Interfaces:**
- Consumes: `Producto`, `CategoriaId` de `src/types.ts`.
- Produces:
  - `filtrarPorCategorias(productos: Producto[], activas: ReadonlySet<CategoriaId>): Producto[]`
  - `contarPorCategoria(productos: Producto[], id: CategoriaId): number`
  - `alternar(activas: ReadonlySet<CategoriaId>, id: CategoriaId): Set<CategoriaId>`

- [ ] **Step 1: Escribir la prueba que falla**

```ts
// tests/filtros.test.ts
import { test, expect } from 'bun:test'
import { alternar, contarPorCategoria, filtrarPorCategorias } from '../src/features/catalogo/filtros'
import type { CategoriaId, Producto } from '../src/types'

const p = (sku: string, categoria: CategoriaId): Producto => ({
  sku, nombre: sku, categoria, precio: 1, unidad: '', imagen: '/x.svg', desc: '',
})

const PRODUCTOS = [p('A', 'bidones'), p('B', 'bidones'), p('C', 'botellas')]

test('sin ninguna categoría marcada se muestra el catálogo completo', () => {
  expect(filtrarPorCategorias(PRODUCTOS, new Set())).toEqual(PRODUCTOS)
})

test('con una categoría marcada se muestran sólo sus productos', () => {
  expect(filtrarPorCategorias(PRODUCTOS, new Set<CategoriaId>(['botellas']))).toEqual([p('C', 'botellas')])
})

test('con varias marcadas se muestra la unión', () => {
  const r = filtrarPorCategorias(PRODUCTOS, new Set<CategoriaId>(['bidones', 'botellas']))
  expect(r).toHaveLength(3)
})

test('una categoría marcada sin productos deja la lista vacía', () => {
  expect(filtrarPorCategorias(PRODUCTOS, new Set<CategoriaId>(['empresas']))).toEqual([])
})

test('contarPorCategoria cuenta los productos de esa categoría', () => {
  expect(contarPorCategoria(PRODUCTOS, 'bidones')).toBe(2)
  expect(contarPorCategoria(PRODUCTOS, 'empresas')).toBe(0)
})

test('alternar marca y desmarca sin mutar el conjunto original', () => {
  const inicial = new Set<CategoriaId>()
  const marcado = alternar(inicial, 'bidones')
  expect(marcado.has('bidones')).toBe(true)
  expect(inicial.size).toBe(0)
  expect(alternar(marcado, 'bidones').has('bidones')).toBe(false)
})
```

- [ ] **Step 2: Ejecutar la prueba y ver que falla**

```bash
bun test tests/filtros.test.ts
```

Esperado: FALLA con "Cannot find module '../src/features/catalogo/filtros'".

- [ ] **Step 3: Escribir la implementación**

```ts
import type { CategoriaId, Producto } from '../../types'

/** Conjunto vacío = catálogo completo. Es el comportamiento del sitio actual. */
export function filtrarPorCategorias(
  productos: Producto[],
  activas: ReadonlySet<CategoriaId>,
): Producto[] {
  if (activas.size === 0) return productos
  return productos.filter((p) => activas.has(p.categoria))
}

export function contarPorCategoria(productos: Producto[], id: CategoriaId): number {
  return productos.filter((p) => p.categoria === id).length
}

export function alternar(
  activas: ReadonlySet<CategoriaId>,
  id: CategoriaId,
): Set<CategoriaId> {
  const siguiente = new Set(activas)
  if (siguiente.has(id)) siguiente.delete(id)
  else siguiente.add(id)
  return siguiente
}
```

- [ ] **Step 4: Ejecutar las pruebas y verificar que pasan**

```bash
bun test tests/filtros.test.ts
```

Esperado: 6 tests en verde.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Filtrado por categorias con tests"
```

---

### Task 7: Componentes compartidos

Aplica las **reglas de conversión HTML → JSX**. Marcado portado, no reinventado.

**Files:**
- Create: `src/components/Isotipo.tsx`, `src/components/Icono.tsx`,
  `src/components/Nav.tsx`, `src/components/Footer.tsx`, `src/components/WaFlotante.tsx`
- Fuente a portar: `legacy/index.html` (nav líneas ~16–40, pie ~262–296, flotante al final)

**Interfaces:**
- Consumes: `NEGOCIO`, `urlWhatsApp` de `src/data/negocio.ts`.
- Produces:
  - `<Isotipo ancho={26} alto={31} />` — gota+montaña en trazo `#3ec1ff`
  - `<IconoWhatsApp />`, `<IconoCheck />`, `<IconoCarrito />`
  - `<Nav>` con prop opcional `accion?: ReactNode` (la Home pone el botón "Ver catálogo",
    el Catálogo pone el botón del carrito)
  - `<Footer />`, `<WaFlotante />`

- [ ] **Step 1: Crear `src/components/Isotipo.tsx`**

El motivo del isotipo, según `DESIGN.md` §3. Nunca se rota ni se le cambia el color.

```tsx
interface Props {
  ancho: number
  alto: number
}

export default function Isotipo({ ancho, alto }: Props) {
  return (
    <svg
      viewBox="0 0 100 120"
      style={{
        width: `${ancho}px`,
        height: `${alto}px`,
        flex: 'none',
        fill: 'none',
        stroke: '#3ec1ff',
        strokeWidth: 6,
        strokeLinejoin: 'round',
      }}
      aria-hidden="true"
    >
      <path d="M50 5C50 5 9 52 9 78a41 41 0 0 0 82 0C91 52 50 5 50 5z" />
      <path d="M23 91L45 62l13 17 10-11 16 21" />
    </svg>
  )
}
```

- [ ] **Step 2: Crear `src/components/Icono.tsx`**

SVG en línea, sin librerías (`DESIGN.md` §10). Los `d` se copian de `legacy/index.html`
y `legacy/catalogo.html`.

```tsx
export function IconoWhatsApp() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.6A8 8 0 0 1 13 4a8 8 0 0 1 8 8z" />
    </svg>
  )
}

export function IconoCheck() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  )
}

export function IconoCarrito() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
    </svg>
  )
}
```

- [ ] **Step 3: Crear `src/components/Nav.tsx`**

```tsx
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { NEGOCIO } from '../data/negocio'
import Isotipo from './Isotipo'

interface Props {
  /** Bloque de acción a la derecha: botón de catálogo o botón del carrito. */
  accion: ReactNode
  /** Marca "Catálogo" como página actual. */
  enCatalogo?: boolean
}

export default function Nav({ accion, enCatalogo }: Props) {
  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link className="brand" to="/">
          <Isotipo ancho={26} alto={31} />
          <span>
            <span className="brand-name">Villa Fresh</span>
            <span className="brand-tag">Agua de mesa · Lima</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="/#proceso">Proceso</a>
          <Link to="/catalogo" aria-current={enCatalogo ? 'page' : undefined}>
            Catálogo
          </Link>
          <a href="/#cobertura">Cobertura</a>
          <a href="/#preguntas">Preguntas</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="nav-tel">{NEGOCIO.telefonoVisible}</span>
          {accion}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Crear `src/components/Footer.tsx` y `src/components/WaFlotante.tsx`**

Porta el pie de `legacy/index.html` **literalmente**, incluidos los tres marcadores entre
corchetes (`[ RAZÓN SOCIAL Y RUC ]`, `[ DIRECCIÓN DE PLANTA ]`, `[ HORARIO DE ATENCIÓN ]`)
y la línea inferior con el copyright y "Libro de reclamaciones". Usa `<Isotipo ancho={22}
alto={26} />` y `NEGOCIO.facebook` / `NEGOCIO.instagram` / `urlWhatsApp()`.

`WaFlotante` es el enlace `.btn .btn-wa .wa-float` del final de ambas páginas, con
`<IconoWhatsApp />` y el texto `Pedir`, `aria-label="Pedir por WhatsApp"`.

- [ ] **Step 5: Verificar**

```bash
bun run typecheck
bun run build
```

Esperado: sin errores. Los componentes aún no se usan en ninguna página: es correcto.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Componentes compartidos: isotipo, iconos, barra superior, pie y boton flotante"
```

---

### Task 8: Portada

Migración **1:1**. Ninguna mejora en esta tarea: si algo se ve distinto, es un defecto.
Fuente: `legacy/index.html`.

**Files:**
- Create: `src/pages/home/Hero.tsx`, `Cinta.tsx`, `BandaPrecio.tsx`, `Proceso.tsx`,
  `Planes.tsx`, `Cobertura.tsx`, `Preguntas.tsx`, `Cierre.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `tests/build.test.ts` (añadir la comprobación del titular)

**Interfaces:**
- Consumes: `Nav`, `Footer`, `WaFlotante`, `Isotipo`, `IconoWhatsApp`, `IconoCheck`;
  `urlWhatsApp`, `NEGOCIO`.
- Produces: `Home` por defecto desde `src/pages/Home.tsx`.

El orden de bandas es el de `DESIGN.md` §2 y **no se altera**:

```
hero (oscuro) → cinta cian → precio (PAPEL) → proceso (oscuro)
→ planes (panel elevado) → cobertura (oscuro) → preguntas (oscuro) → cierre (CIAN) → pie
```

- [ ] **Step 1: Escribir la prueba que falla**

Añade a `tests/build.test.ts`:

```ts
test('el titular del hero viaja dentro del HTML publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('No revendemos')
  expect(html).toContain('La fabricamos.')
})

test('la ficha técnica y el precio viajan dentro del HTML publicado', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('8.3')
  expect(html).toContain('Ósmosis inversa')
})

test('los marcadores pendientes se publican a propósito', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  expect(html).toContain('RAZÓN SOCIAL Y RUC')
  expect(html).toContain('Distritos referenciales')
})
```

- [ ] **Step 2: Ejecutar y ver que falla**

```bash
bun run build && bun test tests/build.test.ts
```

Esperado: FALLAN los tres nuevos — la Home todavía es el `<h1>Villa Fresh</h1>` provisional.

- [ ] **Step 3: Portar el hero**

Es el modelo de conversión para las demás secciones. Copia `legacy/index.html:42-82`
aplicando las reglas de la tabla, sin cambiar textos ni clases.

```tsx
// src/pages/home/Hero.tsx
import { Link } from 'react-router'
import { IconoWhatsApp } from '../../components/Icono'
import { urlWhatsApp } from '../../data/negocio'

export default function Hero() {
  return (
    <header className="hero band" id="inicio">
      <svg className="motif" viewBox="0 0 100 120" aria-hidden="true">
        <path d="M50 5C50 5 9 52 9 78a41 41 0 0 0 82 0C91 52 50 5 50 5z" />
        <path d="M23 91L45 62l13 17 10-11 16 21" />
      </svg>
      <div className="wrap hero-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span className="lbl lbl-cyan">Planta propia · Sin intermediarios · Lima</span>
          <h1>
            No revendemos<br />agua.<br />La fabricamos.
          </h1>
          <p className="lede" style={{ maxWidth: '46ch' }}>
            Ósmosis inversa, alcalinización a pH 8.3 y ozonización, en nuestra propia planta
            en Lima. De la planta a tu puerta el mismo día, sin un solo intermediario en el
            camino.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              className="btn btn-wa"
              href={urlWhatsApp('Hola Villa Fresh, quiero pedir un bidón de 20L')}
              target="_blank"
              rel="noopener"
            >
              <IconoWhatsApp />
              Pedir por WhatsApp
            </a>
            <Link className="btn btn-ghost" to="/catalogo">
              Ver catálogo
            </Link>
          </div>
        </div>

        <aside className="ficha">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <span className="lbl lbl-cyan">Ficha técnica</span>
            <span className="lbl" style={{ fontSize: '9.5px' }}>Bidón 20 L</span>
          </div>
          <div className="spec" style={{ borderTop: 0 }}><span>Producto</span><b>Agua de mesa</b></div>
          <div className="spec"><span>Tratamiento</span><b>Ósmosis inversa</b></div>
          <div className="spec"><span>pH</span><b style={{ color: 'var(--cyan)', fontSize: '15px' }}>8.3</b></div>
          <div className="spec"><span>Ozonizada</span><b>Sí</b></div>
          <div className="spec"><span>Pasos de purificación</span><b>08</b></div>
          <div className="spec"><span>Contenido neto</span><b>20 L</b></div>
          <div className="spec"><span>Envase</span><b>Sellado</b></div>
          <div className="spec"><span>Registro sanitario</span><b>DIGESA</b></div>
          <div className="spec"><span>Entrega</span><b>Mismo día</b></div>
          <div className="spec"><span>Cobertura</span><b>Lima Metrop.</b></div>
        </aside>
      </div>
    </header>
  )
}
```

**Nota sobre el enlace de WhatsApp:** el HTML original lleva el texto ya codificado a mano
(`Hola%20Villa%20Fresh%2C...`). Aquí se escribe en claro y lo codifica `urlWhatsApp`. El
resultado es el mismo; compruébalo en el paso 8.

- [ ] **Step 4: Portar las seis secciones restantes, una por archivo**

Mismas reglas, mismo criterio: copiar, no reescribir.

| Componente | Fuente en `legacy/index.html` | Qué contiene |
|---|---|---|
| `Cinta.tsx` | `div.ribbon` | Texto **duplicado** para que el bucle no muestre vacío, `aria-hidden="true"` |
| `BandaPrecio.tsx` | `section#precio` | Banda de papel, las 3 celdas de precio (30 / 50 con tinte cian / preferencial), la línea de pago |
| `Proceso.tsx` | `section#proceso` | Los 4 pasos numerados y el marcador `[ Estas son las 4 etapas documentadas… ]` |
| `Planes.tsx` | `section#planes` | Hogar / Empresa / Obra, con `<IconoCheck />` en cada `li` |
| `Cobertura.tsx` | `section#cobertura` | El marcador de distritos, los 12 `div.dist`, el botón "¿Llegan a mi distrito?" |
| `Preguntas.tsx` | `section#preguntas` | Las 4 preguntas, incluida *"¿Es agua mineral de manantial?" → No.* |
| `Cierre.tsx` | `section.close` | Banda cian con el teléfono enlazado a WhatsApp |

Los 12 distritos y las 4 preguntas se pueden mapear desde un array local al componente,
siempre que el HTML resultante sea idéntico.

- [ ] **Step 5: Componer `src/pages/Home.tsx`**

```tsx
import { Link } from 'react-router'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import WaFlotante from '../components/WaFlotante'
import BandaPrecio from './home/BandaPrecio'
import Cierre from './home/Cierre'
import Cinta from './home/Cinta'
import Cobertura from './home/Cobertura'
import Hero from './home/Hero'
import Planes from './home/Planes'
import Preguntas from './home/Preguntas'
import Proceso from './home/Proceso'

export default function Home() {
  return (
    <>
      <Nav accion={<Link className="btn btn-cyan btn-sm" to="/catalogo">Ver catálogo</Link>} />
      <Hero />
      <Cinta />
      <BandaPrecio />
      <Proceso />
      <Planes />
      <Cobertura />
      <Preguntas />
      <Cierre />
      <Footer />
      <WaFlotante />
    </>
  )
}
```

- [ ] **Step 6: Ejecutar las pruebas y verificar que pasan**

```bash
bun run build && bun test
bun run typecheck
```

Esperado: todo en verde.

- [ ] **Step 7: Verificar que no hay avisos de hidratación**

```bash
bun run preview   # abre http://localhost:4173
```

Abre la consola del navegador. **No debe haber ningún aviso de hydration mismatch.** Si lo
hay, para y reporta antes de seguir: es exactamente el fallo que este plan intenta evitar.

- [ ] **Step 8: Verificar el enlace de WhatsApp del hero**

```bash
grep -o 'wa.me/51994647840?text=[^"]*' dist/index.html | head -1
```

Esperado: el texto codificado con `%20` y `%2C`, equivalente al de `legacy/index.html`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Portar la portada a componentes React, sin cambios visuales"
```

---

### Task 9: Catálogo — filtros y grilla

Migración 1:1 de `legacy/catalogo.html` y de la parte de grilla y filtros de
`legacy/assets/site.js`.

**Files:**
- Create: `src/features/catalogo/Filtros.tsx`, `src/features/catalogo/TarjetaProducto.tsx`,
  `src/features/catalogo/Grilla.tsx`
- Modify: `src/pages/Catalogo.tsx`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: `PRODUCTOS`, `CATEGORIAS`; `filtrarPorCategorias`, `contarPorCategoria`,
  `alternar`; `soles`; `usePedido`.
- Produces:
  - `<Filtros activas onAlternar />`
  - `<TarjetaProducto producto onAgregar />`
  - `<Grilla productos onAgregar />`

- [ ] **Step 1: Escribir la prueba que falla**

Añade a `tests/build.test.ts`:

```ts
test('el catálogo publica los 7 productos dentro del HTML, sin depender de JavaScript', async () => {
  const html = await readFile('dist/catalogo/index.html', 'utf8')
  for (const sku of ['VF-B20', 'VF-B20X2', 'VF-R20', 'VF-EV20', 'VF-BOT', 'VF-DISP', 'VF-EMP']) {
    expect(html).toContain(sku)
  }
})

test('los 5 productos sin precio se publican como "A cotizar"', async () => {
  // Cuenta exacta en vez de buscar "S/ 0.00": el total del cajón vacío ES "S/ 0.00",
  // y React separa textos contiguos con <!-- --> al renderizar en servidor, así que
  // afirmar sobre el fragmento "S/ 0.00 <small>" sería frágil.
  const html = await readFile('dist/catalogo/index.html', 'utf8')
  expect(html.split('A cotizar').length - 1).toBe(5)
})
```

- [ ] **Step 2: Ejecutar y ver que falla**

```bash
bun run build && bun test tests/build.test.ts
```

Esperado: FALLAN — el catálogo sigue siendo el provisional.

- [ ] **Step 3: Crear `TarjetaProducto.tsx`**

Estructura idéntica a la que generaba `pintarGrilla()` en `legacy/assets/site.js`.

```tsx
import { soles } from '../pedido/mensajeWhatsApp'
import type { Producto } from '../../types'

interface Props {
  producto: Producto
  onAgregar: (sku: string) => void
}

export default function TarjetaProducto({ producto, onAgregar }: Props) {
  return (
    <article className="card">
      <div className="shot">
        {producto.etiqueta && <span className="tag">{producto.etiqueta}</span>}
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
      </div>
      <div className="sku">{producto.sku}</div>
      <h3>{producto.nombre}</h3>
      <p className="desc">{producto.desc}</p>
      <div className="foot-row">
        {producto.precio !== null ? (
          <div className="price">
            {soles(producto.precio)} <small>{producto.unidad}</small>
          </div>
        ) : (
          <div className="price pending">A cotizar</div>
        )}
        <button
          className="btn btn-cyan btn-sm"
          type="button"
          onClick={() => onAgregar(producto.sku)}
        >
          Agregar
        </button>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Crear `Grilla.tsx`**

Reproduce el estado vacío del sitio actual: cuando no hay resultados, el contenedor
**pierde** la clase `grid` y muestra `div.empty`.

```tsx
import TarjetaProducto from './TarjetaProducto'
import type { Producto } from '../../types'

interface Props {
  productos: Producto[]
  onAgregar: (sku: string) => void
}

export default function Grilla({ productos, onAgregar }: Props) {
  if (productos.length === 0) {
    return <div className="empty">Ningún producto en esa selección</div>
  }
  return (
    <div className="grid">
      {productos.map((p) => (
        <TarjetaProducto key={p.sku} producto={p} onAgregar={onAgregar} />
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Crear `Filtros.tsx`**

Casillas con conteo, como `pintarFiltros()`. Las categorías sin productos no se muestran.

```tsx
import { CATEGORIAS, PRODUCTOS } from '../../data/productos'
import type { CategoriaId } from '../../types'
import { contarPorCategoria } from './filtros'

interface Props {
  activas: ReadonlySet<CategoriaId>
  onAlternar: (id: CategoriaId) => void
}

export default function Filtros({ activas, onAlternar }: Props) {
  return (
    <div id="vf-filtros">
      {CATEGORIAS.map((categoria) => {
        const n = contarPorCategoria(PRODUCTOS, categoria.id)
        if (n === 0) return null
        return (
          <label className="chk" key={categoria.id}>
            <input
              type="checkbox"
              value={categoria.id}
              checked={activas.has(categoria.id)}
              onChange={() => onAlternar(categoria.id)}
            />
            <span>{categoria.nombre}</span>
            <span className="n">{n}</span>
          </label>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Componer `src/pages/Catalogo.tsx`**

Porta la cabecera, el `aside.filters` con su `fieldset`/`legend`, el `div.cat-head` con el
conteo y "Precios en soles · IGV incluido", y el marcador `[ Precios de recarga, envase,
botellas y dispensador… ]` — actualizando esa última frase para que apunte a
`src/data/productos.ts` en vez de a `assets/productos.js`.

El estado vive aquí:

```tsx
const [activas, setActivas] = useState<ReadonlySet<CategoriaId>>(new Set())
const visibles = filtrarPorCategorias(PRODUCTOS, activas)
const pedido = usePedido()
```

El texto del conteo conserva su singular y plural:

```tsx
<span className="lbl" id="vf-cuenta">
  {visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}
</span>
```

El botón del carrito va en la prop `accion` del `Nav`; el cajón lo añade la Tarea 10.

- [ ] **Step 7: Ejecutar las pruebas y verificar que pasan**

```bash
bun run build && bun test
bun run typecheck
```

- [ ] **Step 8: Verificar los filtros a mano**

```bash
bun run preview
```

Comprueba: sin marcar nada se ven 7 productos; marcando "Botellas" se ve 1; marcando sólo
categorías vacías aparece "Ningún producto en esa selección"; el conteo dice "1 producto"
en singular. Consola sin avisos de hidratación.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Catalogo en React: filtros, grilla y tarjetas de producto"
```

---

### Task 10: Cajón de pedido y envío por WhatsApp

**Files:**
- Create: `src/features/pedido/CajonPedido.tsx`, `src/features/pedido/BotonCarrito.tsx`
- Modify: `src/pages/Catalogo.tsx`

**Interfaces:**
- Consumes: `usePedido`, `mensajeWhatsApp`, `soles`, `urlWhatsApp`, `PRODUCTOS`.
- Produces: `<CajonPedido abierto onCerrar pedido />`, `<BotonCarrito unidades onAbrir />`

Comportamiento heredado, **obligatorio** (`DESIGN.md` §9 y `legacy/assets/site.js`):

1. Agregar **no abre el cajón**: hace pulsar el botón del carrito 450 ms y actualiza el
   contador. Abrirlo en cada clic estorba cuando se agregan varios productos.
2. El cajón se cierra con el botón, con el velo o con `Escape`.
3. Con el cajón abierto, `body { overflow: hidden }`.
4. El badge de conteo está oculto (`hidden`) cuando hay 0 unidades.
5. "Enviar pedido" está deshabilitado con el pedido vacío.
6. El aviso *"Hay productos sin precio publicado…"* aparece sólo si hay pendientes.

- [ ] **Step 1: Crear `BotonCarrito.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import { IconoCarrito } from '../../components/Icono'

interface Props {
  unidades: number
  onAbrir: () => void
}

export default function BotonCarrito({ unidades, onAbrir }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const previas = useRef(unidades)

  // Pulso de 450 ms al agregar. Reinicia la animación forzando un reflow,
  // igual que hacía pulso() en el sitio actual.
  useEffect(() => {
    if (unidades > previas.current && ref.current) {
      const boton = ref.current
      boton.classList.remove('pulse')
      void boton.offsetWidth
      boton.classList.add('pulse')
    }
    previas.current = unidades
  }, [unidades])

  return (
    <button className="cart-btn" id="vf-abrir" type="button" onClick={onAbrir} ref={ref}>
      <IconoCarrito />
      Pedido{' '}
      <span className="count" id="vf-count" hidden={unidades === 0}>
        {unidades}
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Crear `CajonPedido.tsx`**

Marcado portado de `div.drawer` en `legacy/catalogo.html`. El panel se abre con el
atributo `open` en el contenedor, igual que hoy.

Puntos a respetar:

```tsx
// Abierto/cerrado: atributo `open`, como en el CSS actual.
<div className="drawer" id="vf-drawer" role="dialog" aria-modal="true" aria-label="Tu pedido" {...(abierto ? { open: true } : {})}>

// Escape cierra, y el scroll del body se bloquea mientras está abierto.
useEffect(() => {
  if (!abierto) return
  const alPulsar = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar() }
  document.addEventListener('keydown', alPulsar)
  document.body.style.overflow = 'hidden'
  return () => {
    document.removeEventListener('keydown', alPulsar)
    document.body.style.overflow = ''
  }
}, [abierto, onCerrar])

// Envío: abre WhatsApp con el mensaje ya armado.
const enviar = () => {
  if (pedido.lineas.length === 0) return
  window.open(urlWhatsApp(mensajeWhatsApp(pedido.lineas, PRODUCTOS)), '_blank', 'noopener')
}
```

Cuerpo vacío: `<p className="note" style={{ padding: '28px 0' }}>Tu pedido está vacío.
Agrega productos del catálogo y los enviamos juntos por WhatsApp.</p>`

Cada línea reproduce la estructura de `pintarCarrito()`: `div.line` con `div.nm` (nombre +
`div.sku`), `div.pr` (subtotal o `A cotizar`), `div.qty` (`−` / cantidad / `+`, con
`aria-label="Quitar uno"` y `aria-label="Agregar uno"`) y `button.rm` "Quitar".

- [ ] **Step 3: Conectar el cajón en `src/pages/Catalogo.tsx`**

```tsx
const [abierto, setAbierto] = useState(false)
// …
<Nav enCatalogo accion={<BotonCarrito unidades={pedido.unidades} onAbrir={() => setAbierto(true)} />} />
// …
<CajonPedido abierto={abierto} onCerrar={() => setAbierto(false)} pedido={pedido} />
```

- [ ] **Step 4: Verificar el build y los tipos**

```bash
bun run build && bun test
bun run typecheck
```

- [ ] **Step 5: Verificar el pedido de punta a punta**

```bash
bun run preview
```

Recorrido obligatorio, comprobando cada punto:

1. Agregar "Bidón 20 L" dos veces → el badge marca **2**, el cajón **no** se abre y el
   botón pulsa.
2. Abrir el cajón → una sola línea, cantidad 2, subtotal **S/ 60.00**, total **S/ 60.00**.
3. Agregar "Recarga 20 L" → su subtotal dice **A cotizar**, el total sigue en S/ 60.00 y
   aparece el aviso de productos sin precio.
4. Pulsar `−` hasta 0 en el bidón → la línea desaparece.
5. `Escape` cierra el cajón. Con el cajón abierto, la página de fondo no hace scroll.
6. "Vaciar pedido" → botón de enviar deshabilitado y mensaje de pedido vacío.
7. Con un pedido real, pulsar **Enviar pedido**: se abre WhatsApp. **Lee el mensaje** y
   compáralo con la salida esperada de `tests/mensajeWhatsApp.test.ts`.

Si algo no coincide, para y reporta antes de commitear.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Cajon de pedido y cierre por WhatsApp"
```

---

### Task 11: Verificación visual contra `legacy/` — *la ejecuta Claude, no Codex*

Es la puerta entre la migración 1:1 y el pulido. **No se abre la Tarea 12 hasta que esta
pase.**

- [ ] **Step 1: Servir las dos versiones**

```bash
bun run build && bun run preview           # React, http://localhost:4173
python3 -m http.server 8000 -d legacy      # original, http://localhost:8000
```

- [ ] **Step 2: Capturar ambas en tres anchos**

Con Playwright: `/` y `/catalogo` contra `index.html` y `catalogo.html`, a **375**, **768**
y **1440 px** de ancho, página completa.

- [ ] **Step 3: Comparar y clasificar cada diferencia**

Toda diferencia es un **defecto que se corrige**, no una mejora que se acepta. Se anotan
en una lista y se corrigen en esta tarea, no en la siguiente.

Diferencias esperadas y admisibles, sólo estas dos:
- La URL del catálogo (`/catalogo` en vez de `/catalogo.html`).
- El orden de los atributos en el HTML generado.

- [ ] **Step 4: Verificar que no hay scroll horizontal a 390 px**

`DESIGN.md` §7 lo exige. Comprueba en ambas rutas que
`document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 5: Reportar al usuario**

Capturas lado a lado y la lista de diferencias corregidas. **Aquí se pide aprobación
antes de continuar con el pulido.**

---

### Task 12: Pulido

Sólo después de que la Tarea 11 haya pasado. Cada mejora va en su propio commit para poder
revertirla sola.

**Files:**
- Modify: `src/features/pedido/usePedido.ts`, `src/rutas.ts`, `scripts/prerender.ts`,
  `src/styles/site.css`
- Create: `src/features/pedido/almacenamiento.ts`, `tests/almacenamiento.test.ts`

- [ ] **Step 1: Persistir el pedido, sin romper la hidratación**

La regla es la de la spec §8: **se lee en un efecto tras montar, nunca durante el
render.** Leerlo antes desalinearía el HTML del servidor con el del cliente.

```ts
// src/features/pedido/almacenamiento.ts
import type { LineaPedido } from '../../types'

const CLAVE = 'villafresh:pedido'

/** Devuelve [] ante cualquier fallo: modo privado, cuota llena o JSON corrupto.
 *  Un pedido perdido es molesto; una página que no carga es peor. */
export function leerPedido(): LineaPedido[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return []
    const dato: unknown = JSON.parse(crudo)
    if (!Array.isArray(dato)) return []
    return dato.filter(
      (l): l is LineaPedido =>
        typeof l === 'object' && l !== null &&
        typeof (l as LineaPedido).sku === 'string' &&
        typeof (l as LineaPedido).cantidad === 'number' &&
        (l as LineaPedido).cantidad > 0,
    )
  } catch {
    return []
  }
}

export function guardarPedido(lineas: LineaPedido[]): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lineas))
  } catch {
    /* sin persistencia, el pedido sigue funcionando en memoria */
  }
}
```

Tests: JSON corrupto → `[]`; array con basura → sólo las líneas válidas; cantidad 0 o
negativa → descartada; ida y vuelta de un pedido válido.

Amplía `AccionPedido` en `src/features/pedido/pedido.ts` con el caso que falta —en la
Tarea 5 no existía porque aún no había persistencia:

```ts
export type AccionPedido =
  | { tipo: 'agregar'; sku: string }
  | { tipo: 'incrementar'; sku: string }
  | { tipo: 'decrementar'; sku: string }
  | { tipo: 'quitar'; sku: string }
  | { tipo: 'limpiar' }
  | { tipo: 'restaurar'; lineas: LineaPedido[] }
```

En `reducirPedido`, `case 'restaurar': return accion.lineas`. Añade a `tests/pedido.test.ts`
que restaurar sustituye el estado completo.

En `usePedido`, dos efectos: uno que despacha `restaurar` **una sola vez al montar** —
nunca durante el render— y otro que llama a `guardarPedido(lineas)` cuando `lineas`
cambia.

- [ ] **Step 2: Verificar que la persistencia no rompe la hidratación**

```bash
bun run build && bun run preview
```

Agrega productos, recarga: el pedido sigue ahí y **la consola no muestra ningún aviso de
hidratación**. Prueba también en ventana privada.

- [ ] **Step 3: Metaetiquetas Open Graph**

Añade `imagenOg` a `MetaRuta` y las etiquetas en `cabecera()` de `scripts/prerender.ts`:
`og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `twitter:card`.

`og:image` y `og:url` necesitan el dominio, que es un **pendiente del negocio** ("Correo
corporativo y dominio", `README.md`). Declara la constante y déjala marcada:

```ts
// [ DOMINIO PENDIENTE — cambiar cuando exista el dominio real ]
export const SITIO_URL = 'https://villafresh.pe'
```

Verifica: `grep 'og:title' dist/index.html dist/catalogo/index.html`.

- [ ] **Step 4: Foco y estados**

`:focus-visible` ya está en `site.css` como `2px solid var(--cyan)` con `offset: 3px`.
Recorre la página entera **sólo con el teclado** y confirma que el foco se ve en: enlaces
de la barra, botones "Agregar", casillas de filtro, botón del carrito, controles de
cantidad y botones del cajón. Al abrir el cajón, el foco pasa a su primer control.

- [ ] **Step 5: Responsive del catálogo**

Comprueba a 375 y 390 px: la grilla en una columna, el cajón a ancho completo, sin scroll
horizontal, y ningún botón por debajo de 44 px de alto táctil.

- [ ] **Step 6: Commits separados**

```bash
git commit -m "Persistir el pedido en localStorage sin romper la hidratacion"
git commit -m "Metaetiquetas Open Graph por ruta"
git commit -m "Foco visible y repaso responsive del catalogo"
```

---

### Task 13: Limpieza y documentación

**Files:**
- Delete: `legacy/`
- Modify: `README.md`, `DESIGN.md`, `design/README.md`

- [ ] **Step 1: Confirmar que `legacy/` ya no hace falta**

La Tarea 11 aprobada es el requisito. `grep -r "legacy/" src scripts tests` no debe
devolver nada.

- [ ] **Step 2: Borrar `legacy/`**

```bash
git rm -r legacy
git commit -m "Retirar el sitio estatico de referencia"
```

Sigue en el historial: `git show d24b4a4` lo recupera entero.

- [ ] **Step 3: Reescribir `README.md`**

Qué cambia y qué no:

- **Estructura**: la nueva.
- **Cómo se usa**: `bun install`, `bun run dev`, `bun run build`, `bun test`.
- **Editar productos y precios**: ahora `src/data/productos.ts`. Sigue siendo el único
  archivo a editar, y ahora un error de categoría o de tipo **falla en el build**.
- **Publicar**: subir `dist/`. Sigue siendo hosting estático.
- **La sección "Por qué HTML y no React"**: se sustituye por **"Por qué React
  pre-renderizado"**, explicando la decisión y por qué el pre-render no es opcional —
  los previews de WhatsApp no ejecutan JavaScript.
- **Datos verificados del negocio** y **Pendientes antes de publicar**: se conservan
  **intactos**. Nada de eso cambió.

- [ ] **Step 4: Actualizar `DESIGN.md`**

Sólo la tabla de cabecera: `Implementación` pasa a apuntar a `src/styles/site.css` y
`src/components/`, `src/pages/`. **El sistema visual no cambia**, así que el resto del
documento se queda como está. Añade una línea en §1 diciendo que los componentes React son
ahora la implementación de referencia.

- [ ] **Step 5: Nota en `design/README.md`**

Una línea al principio aclarando que ese documento describe la variante *Light Editorial*
descartada y que la dirección vigente es la de `DESIGN.md`. Es información que hoy se
presta a confusión y que un desarrollador nuevo leería primero.

- [ ] **Step 6: Verificación final completa**

```bash
bun install
bun run typecheck
bun test
bun run build
bun run preview
```

Todo en verde, y una última pasada manual por las dos páginas.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Actualizar documentacion a la implementacion en React"
```

---

## Cobertura de la spec

| Requisito de la spec | Tarea |
|---|---|
| §2 HTML pre-renderizado, build que falla ruidosamente | 2 |
| §3 Bun, Vite, TypeScript, React Router declarativo | 1 |
| §4 Build en dos pasos e hidratación | 1, 2 |
| §5 Estructura de archivos | 1–10 |
| §6 `types.ts` con unión cerrada | 3 |
| §6 `productos.ts` único archivo editable | 3, 13 |
| §6 `mensajeWhatsApp` carácter a carácter | 4 |
| §6 Reglas del reducer del pedido | 5, 10 |
| §7 Tiempo 1: migración 1:1 | 7, 8, 9, 10 |
| §7 Verificación por capturas | 11 |
| §7 Tiempo 2: pulido | 12 |
| §8 Casos borde heredados | 5, 9, 10 |
| §8 Casos borde del pre-renderizado | 2, 12 |
| §9 `bun test` de lógica pura | 3, 4, 5, 6, 12 |
| §9 Test del artefacto de build | 2, 8, 9 |
| §9 Prueba manual del pedido real | 10 |
| §10 Fases 0–6 | 1–13 |
| §12 Contenido verificado y marcadores | Restricciones globales 5 y 6 |
