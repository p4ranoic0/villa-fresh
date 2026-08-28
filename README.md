# Villa Fresh — sitio web

Sitio estático de **Villa Fresh**, agua de mesa purificada con reparto a domicilio en
Lima Metropolitana. Sin build, sin dependencias: se abre con doble clic y se publica
subiendo la carpeta.

---

## Cómo se usa

```bash
# ver el sitio en local (cualquiera de las dos)
open index.html
python3 -m http.server 8000     # http://localhost:8000
```

Para publicarlo: sube la carpeta tal cual a Netlify, Vercel, GitHub Pages o cualquier
hosting. No hay paso de compilación.

---

## Estructura

```
villa-fresh/
├─ index.html                  Home
├─ catalogo.html               Catálogo con filtros y pedido por WhatsApp
├─ assets/
│  ├─ site.css                 Todos los estilos del sitio
│  ├─ site.js                  Filtros + carrito + armado del mensaje de WhatsApp
│  ├─ productos.js             ← PRODUCTOS Y PRECIOS. Es el único archivo a editar.
│  ├─ bidon-20l.svg            Ilustraciones de producto (vectoriales)
│  ├─ bidon-vacio.svg
│  ├─ botella-600.svg
│  ├─ dispensador.svg
│  └─ logo-villafresh-*.jpg/png
├─ design/                     Sistema de diseño (tokens, hoja visual, notas)
│  ├─ tokens.css               Variables --vf-*
│  ├─ tokens.json              Los mismos valores para herramientas
│  ├─ tailwind.config.js       Por si algún día se usa Tailwind
│  ├─ preview.html             Hoja visual de tokens
│  ├─ README.md                Decisiones de diseño y por qué
│  └─ alternativas/            La versión "editorial claro" descartada
└─ contenido/
   └─ redes-sociales-villafresh.md   Copy real extraído de Facebook e Instagram
```

---

## Editar productos y precios

Todo vive en `assets/productos.js`. Cada producto es un objeto:

```js
{
  sku: 'VF-B20',
  nombre: 'Bidón 20 L',
  categoria: 'bidones',        // debe existir en VF_CATEGORIAS
  precio: 30,                  // null → la web muestra "A cotizar"
  unidad: 'con envase',
  etiqueta: 'Más vendido',     // opcional, aparece como chip sobre la imagen
  imagen: 'assets/bidon-20l.svg',
  desc: '...'
}
```

Guardas el archivo, recargas el navegador y ya está. No hay build.

---

## Cómo funciona el pedido

No hay backend ni pasarela de pago. El catálogo arma el pedido en el navegador
(en memoria: se pierde al recargar, y está bien mientras se cierre por WhatsApp) y
el botón **Enviar pedido** abre `wa.me/51994647840` con el mensaje ya escrito:
productos, cantidades, subtotales, total y dos líneas en blanco para la dirección y
el distrito.

Los productos con `precio: null` viajan en el mensaje como *"a cotizar"*.

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
- [ ] Precio de **recarga**, **envase vacío**, **botellas** y **dispensador** → cargarlos en `assets/productos.js`
- [ ] Presentaciones reales de botella (¿500 ml, 625 ml, 1 L?)
- [ ] N.° de registro sanitario **DIGESA**
- [ ] Desglose real de los **8 pasos** de purificación (hoy se muestran las 4 etapas documentadas)
- [ ] Correo corporativo y dominio
- [ ] Libro de Reclamaciones (obligatorio en Perú para venta al consumidor)
- [ ] Fotos reales del producto y de la planta para reemplazar las ilustraciones vectoriales

Los pendientes aparecen en la web entre corchetes, a propósito, para que se vean y
no se olviden.

---

## Diseño

Dirección visual: **ficha técnica** — el agua tratada como producto técnico. Fondo azul
noche, tipografía de datos en monoespaciada, una sola banda de papel crudo para el
precio, y el motivo gota+montaña del isotipo como firma gráfica.

- Tipografías: **Archivo** (titulares, 800) e **IBM Plex Mono** (datos y etiquetas).
- El sistema completo y el porqué de cada decisión están en `design/README.md`.
- La versión anterior, más luminosa y convencional, quedó archivada en
  `design/alternativas/` por si alguna vez hace falta compararlas.

---

## Por qué HTML y no React

Con siete SKUs, sin login, sin pagos en línea y con el cierre de pedido por WhatsApp,
React sólo agregaría un paso de build, un bundle de JavaScript y peor SEO local — que
es exactamente lo que este negocio necesita bien (búsquedas tipo *"agua a domicilio
Lima"*). El catálogo entero son ~200 líneas de JavaScript sin dependencias.

**Migrar cuando aparezca alguna de estas:** stock real que cambia, pagos en línea,
panel de administración de pedidos, cuentas de cliente, o más de una persona editando
contenido a la vez. En ese momento **Astro** es el salto natural (componentes, cero JS
por defecto, mismo SEO); React con Vite solo si además hay una aplicación detrás.
