# Villa Fresh — Fase 1: activos visuales

| | |
|---|---|
| **Fecha** | 29 de agosto de 2026 |
| **Estado** | Aprobado — en ejecución |
| **Punto de partida** | commit `64d85cc` (migración a React terminada) |
| **Fases siguientes** | 2 — sistema de dos temas · 3 — movimiento |

---

## 1. Objetivo

Reunir y preparar los activos visuales que necesitan las fases 2 y 3: fotografía de
producto para el catálogo, imagen de portada, el vídeo de la secuencia sincronizada al
scroll, y una iconografía ampliada.

**No se toca el diseño en esta fase.** Los archivos se preparan y se aprueban; la
maquetación viene después. Animar o maquetar antes de tener los activos definitivos
obliga a rehacerlo.

---

## 2. Decisiones que vienen del brainstorming

| Decisión | Valor |
|---|---|
| Tema | **Claro por defecto**, oscuro como opción, respetando `prefers-color-scheme` |
| Animación | Movimiento fino **más una** secuencia protagonista sincronizada al scroll |
| Medio de la secuencia | **Vídeo de stock** con licencia, no ilustración vectorial |
| Origen de las imágenes | **Adobe Stock**, tarifa libre |

### Por qué no se generan con IA

No es una preferencia: es lo que hay. La clave de Google devuelve `limit: 0` para
`gemini-3-pro-image` (comprobado dos veces el 29/08/2026) y el conector de Adobe declara
la generación de imágenes deshabilitada en este entorno. Adobe Stock sí funciona, con
cuenta autenticada y material de tarifa libre.

Para un negocio que vende un producto físico, además, la fotografía con licencia es la
respuesta correcta.

---

## 3. Restricción de honestidad

Hereda la del proyecto (`README.md`, riesgo Indecopi) y la endurece, porque ahora hay
fotografías de por medio:

> Ninguna imagen puede presentarse como **la planta de Villa Fresh**, **su producto real**
> ni **su equipo**. Son fotografías genéricas con licencia.

En concreto:

- Nada de pies de foto del tipo "nuestra planta" o "nuestro proceso" sobre material de stock.
- El bidón fotografiado **no lleva** la etiqueta de Villa Fresh y no se le añade una falsa.
- Las fotos de planta o embotellado, si se usan, van como recurso atmosférico, nunca
  ilustrando una afirmación concreta sobre sus instalaciones.
- El pendiente del README —*"Fotos reales del producto y de la planta"*— **sigue abierto**
  después de esta fase. Estos activos son un puente, no su sustituto.

---

## 4. Activos a producir

| # | Activo | Uso | Formato |
|---|---|---|---|
| 1 | Bidón 20 L | Tarjeta `VF-B20`, `VF-B20X2`, `VF-R20`, `VF-EMP` | PNG con fondo recortado |
| 2 | Bidón vacío | Tarjeta `VF-EV20` | PNG con fondo recortado |
| 3 | Botella individual | Tarjeta `VF-BOT` | PNG con fondo recortado |
| 4 | Dispensador | Tarjeta `VF-DISP` | PNG con fondo recortado |
| 5 | Imagen de portada | Hero de la versión clara | JPEG |
| 6 | Vídeo de la secuencia | Fase 3, sincronizado al scroll | MP4 / MOV |
| 7 | Iconografía ampliada | Interfaz | SVG en línea |

**El fondo recortado no es un capricho:** la misma imagen tiene que funcionar sobre el
papel claro y sobre el azul noche. Una foto con fondo propio obliga a tener dos juegos.

### Iconografía

Hoy existen tres iconos en línea (`IconoWhatsApp`, `IconoCheck`, `IconoCarrito`), según
la regla de `DESIGN.md` §10: SVG en línea, retícula de 24, trazo 1.7, sin relleno, sin
librerías ni fuentes de iconos. Se amplía **con ese mismo trazo**, dibujados a mano, no
importados de un paquete: entrega, planta, pH, ozono, sello, filtro, empresa, teléfono.

Ninguna librería de iconos entra en el proyecto.

---

## 5. Presupuesto de peso

El canal de venta es WhatsApp y los clientes abren desde el móvil, con datos.

| Activo | Techo |
|---|---|
| Cada imagen de producto | 120 KB |
| Imagen de portada | 250 KB |
| Vídeo de la secuencia | **3 MB**, y sólo se carga cuando entra en pantalla |
| Iconos | irrelevante (SVG en línea) |
| **Total añadido a la primera carga** | **≤ 600 KB** — el vídeo no cuenta: es diferido |

Si un activo no cabe en su techo, se recomprime o se descarta. El techo manda sobre la
calidad de imagen, no al revés.

---

## 6. Procedimiento

1. `asset_search` con `entityScope: StockAsset` y `pricing: free`.
2. Hoja de contactos con las miniaturas → **aprobación del usuario**.
3. `asset_license_and_download_stock` sólo de lo aprobado.
4. `image_remove_background` en los cuatro productos.
5. Recorte y redimensionado a la proporción de la tarjeta.
6. Comprobación sobre fondo claro **y** oscuro.
7. Registro de licencias en `marca/LICENCIAS.md`: id de Stock, título, uso.

---

## 8. Verificación

- Cada archivo por debajo de su techo de peso, medido.
- Los cuatro productos, sobre `#f2f1ec` y sobre `#04101d`, sin halos ni bordes sucios.
- `marca/LICENCIAS.md` con una fila por activo licenciado.
- Las tarjetas del catálogo mantienen su retícula: la imagen cambia, la maqueta no.
- Ninguna imagen acompañada de texto que la presente como instalación o producto propio.

---

## 9. Fuera de alcance

Maquetación clara, conmutador de tema, animaciones, y cualquier cambio en
`src/styles/site.css`. Esta fase produce archivos y un registro de licencias; nada más.
