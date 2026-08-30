# Villa Fresh — sitio web

Sitio de **Villa Fresh**, agua de mesa purificada con reparto a domicilio en Lima
Metropolitana. Está construido con React y TypeScript sobre Bun, y Vite lo
pre-renderiza como HTML estático listo para publicar.

---

## Cómo se usa

```bash
bun install
bun run dev          # desarrollo: http://localhost:5173
bun run build        # genera el sitio estático en dist/
bun run preview      # comprueba dist/ en http://localhost:4173
bun test             # comprueba la lógica pura
bun run test:build   # construye y comprueba también el HTML publicado
bun run typecheck
```

Antes de publicar, ejecuta `bun run test:build`: construye el sitio y verifica el HTML
publicado. Después, sube **el contenido de `dist/`** a Netlify,
Vercel, GitHub Pages o cualquier hosting estático. El servidor no necesita Bun, Node,
React ni un backend.

---

## Estructura

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
│  ├─ data/productos.ts               ← PRODUCTOS Y PRECIOS; único archivo a editar
│  ├─ data/negocio.ts                 Teléfono, redes y datos del negocio
│  └─ styles/site.css                 Implementación del sistema visual
├─ public/                             Archivos copiados al artefacto publicado
│  ├─ og-villafresh.jpg               Imagen de compartir en WhatsApp y Facebook
│  ├─ producto-*.webp                 Fotografía con licencia (ver marca/LICENCIAS.md)
│  ├─ proceso-agua.mp4 · .webp        Secuencia sincronizada con el scroll y su póster
│  └─ favicon.svg                     Isotipo
│                                      Sólo lo que se publica: public/ se copia entera
├─ tests/                              Pruebas puras y del HTML publicado
├─ marca/                              Logotipos, piezas de marca y licencias
├─ design/                             Tokens y variante Light Editorial descartada
├─ contenido/                          Copy real extraído de las redes
└─ dist/                               Sitio generado; se publica esta carpeta
```

---

## Editar productos y precios

Todo vive en `src/data/productos.ts`. Cada producto es un objeto tipado:

```ts
{
  sku: 'VF-B20',
  nombre: 'Bidón 20 L',
  categoria: 'bidones',        // debe existir en CATEGORIAS
  precio: 30,                  // null → la web muestra "A cotizar"
  unidad: 'con envase',
  etiqueta: 'Más vendido',     // opcional, aparece como chip sobre la imagen
  imagen: '/producto-bidon-20l.webp',
  nota: 'Sellado en planta',   // opcional, al pie del encuadre; ver abajo
  desc: '...'
}
```

`nota` existe porque la fotografía tiene un límite: **un bidón lleno y uno vacío son
la misma foto**. El plástico es transparente y no hay línea de agua. Sin esa etiqueta,
`VF-EV20` y `VF-B20` serían la misma tarjeta. Es información, no adorno.

```
```

Es el único archivo que se edita para cambiar productos o precios. Una categoría o un
tipo inválido falla durante `bun run typecheck` en vez de dejar silenciosamente un
producto fuera del catálogo. Después de editarlo, vuelve a ejecutar `bun run build`.

---

## Cómo funciona el pedido

No hay backend ni pasarela de pago. La sección de productos arma el pedido en el navegador
(persistido en `localStorage`) y el botón **Enviar pedido** abre `wa.me/51994647840`
con el mensaje ya escrito: productos, cantidades, subtotales, total y dos líneas para
la dirección y el distrito.

Los productos con `precio: null` viajan en el mensaje como *"a cotizar"*. Al restaurar
un pedido se descartan datos inválidos y SKU que ya no existan.

---

## Datos verificados del negocio

Extraídos de Facebook e Instagram el 27/08/2026 — detalle completo en
`contenido/redes-sociales-villafresh.md`.

| Dato | Valor |
|---|---|
| Producto | Bidón de agua de mesa, 20 L, envase sellado |
| Tratamiento | Ósmosis inversa → alcalinización a **pH 8.3** → ozonización |
| Producción | **Planta propia**, sin intermediarios |
| Certificación | DIGESA (N.° de registro pendiente) |
| Precio | **S/ 30** el bidón · **S/ 50** dos bidones · recarga y volumen a precio preferencial |
| Entrega | El mismo día, Lima Metropolitana |
| WhatsApp | **994 647 840** |
| Pago | Yape, efectivo o transferencia al recibir |
| Eslogan | *Pureza que refresca tu vida* |
| Redes | facebook.com/villafreshlima · instagram.com/villafresh.lima |

**Ojo:** el producto es agua **purificada / de mesa**, no agua mineral de manantial.
Los mockups originales de Google Stitch afirmaban lo contrario y ponían el bidón a
S/ 15; nada de eso se usó. Publicar "agua mineral de manantial" sobre un producto
tratado en planta es falso y expone frente a Indecopi y a la etiqueta sanitaria.

---

## Pendientes antes de publicar

- [ ] Razón social y **RUC**
- [ ] Dirección de la planta / punto de atención
- [ ] Horario de atención y de reparto
- [ ] **Distritos reales** de cobertura (los que están hoy son referenciales) y costo de delivery por zona
- [ ] Precio de **envase vacío**, **botellas** y **dispensador** → cargarlos en `src/data/productos.ts`
- [ ] Presentaciones reales de botella (¿500 ml, 625 ml, 1 L?)
- [ ] N.° de registro sanitario **DIGESA**
- [ ] Confirmar la asociación a la **CCL** (aparece con sello en las redes; se
      publica en la ficha técnica del hero)
- [ ] Desglose real de los **8 pasos** de purificación (hoy se muestran las 4 etapas documentadas)
- [ ] Correo corporativo y dominio
- [ ] Libro de Reclamaciones (obligatorio en Perú para venta al consumidor)
- [ ] Fotos reales del producto y de la planta. Hoy hay fotografía de archivo con
      licencia **con el logotipo puesto encima** (`scripts/marcar-producto.py`), que
      representa el producto pero no es el envase que se entrega. La planta y el
      equipo no se representan en absoluto. Detalle en `marca/LICENCIAS.md`

Los pendientes aparecen en la web entre corchetes, a propósito, para que se vean y
no se olviden.

---

## Diseño

Dirección visual: **ficha técnica** — el agua tratada como producto técnico. Un fondo
dominante sin ruido, tipografía de datos en monoespaciada, una sola banda invertida
para el precio, y el motivo gota+montaña del isotipo como firma gráfica.

**Dos temas.** Claro por defecto, oscuro cuando lo pide el sistema
(`prefers-color-scheme`) y claro u oscuro cuando lo elige el visitante con el
conmutador de la barra superior, que se recuerda. La dirección visual es la misma en
los dos: lo que se invierte es el material, no la idea. La banda de precio sigue siendo
la única ruptura, papel sobre azul en el oscuro y azul sobre papel en el claro.

El tema se resuelve en un script en línea de `index.html`, antes del primer pintado,
para que no haya parpadeo y para que el conmutador responda sin esperar al bundle.

**Iconografía.** Doce iconos SVG en línea, dibujados a mano en una retícula de 24 con
trazo 1.7. Sin librería y sin fuente de iconos: en la primera versión del sitio los
iconos eran una fuente y, cuando Google Fonts no cargó, salieron impresos como las
palabras `chat` y `check`.

**Movimiento.** Una entrada escalonada al cargar la portada, el revelado de las series
al pasar por ellas, y el vídeo de proceso que avanza con el scroll. Todo se apaga con
`prefers-reduced-motion`, y en ningún caso la animación es lo que hace visible el
contenido: el estado base es siempre el final.

- Tipografías: **Archivo** (titulares, 800) e **IBM Plex Mono** (datos y etiquetas).
- El sistema vigente y el porqué de cada decisión están en `DESIGN.md`.
- `design/README.md` y sus tokens documentan la variante *Light Editorial* descartada.
- Las piezas exportadas y su código fuente viven en `marca/`; la imagen que consume la
  web para compartir enlaces es `public/og-villafresh.jpg`.

---

## Por qué React pre-renderizado

React permite dividir la portada y el pedido en componentes tipados y
probados sin convertir el sitio publicado en una aplicación vacía que dependa de
JavaScript para mostrar contenido. Vite genera el bundle del navegador y otro de
servidor; después `scripts/prerender.ts` renderiza cada ruta y escribe HTML completo en
`dist/index.html`. En el navegador, React hidrata ese HTML para devolverle el carrito
y la persistencia.

El pre-render **no es opcional**. Los previsualizadores de WhatsApp y Facebook no
ejecutan JavaScript, y WhatsApp es el canal de venta del negocio. Sin texto, título y
metaetiquetas dentro del HTML publicado, un enlace compartido perdería precisamente la
información que debe convencer al cliente antes de abrir la página. El build falla si
una ruta renderiza vacía, y `tests/build.test.ts` comprueba el artefacto final.

El sitio es **una sola página**. Hubo un catálogo aparte en `/catalogo.html` hasta el
29/08/2026: con seis productos era un clic de más para llegar a lo mismo, y un filtro por
categorías que nunca iba a tener nada que filtrar. Los productos viven ahora en
`#productos`, en la misma página donde se lee el precio.

React conoce además la ruta `/index.html`, porque cualquier servidor estático sirve la
portada en las dos direcciones y sin ese alias la página no monta al entrar por la
segunda.
