# Piezas de marca

Imágenes de marca de Villa Fresh, compuestas con el mismo sistema visual de la web
(`DESIGN.md` v3, dirección "ficha técnica"): azul noche `#04101d`, un solo acento cian
`#3ec1ff`, Archivo 800 e IBM Plex Mono, radio cero y sin degradados de fondo.

| Archivo | Medida | Para qué |
|---|---|---|
| `villafresh-og-1200x630.jpg` | 1200 × 630 | Previsualización de enlaces en WhatsApp, Facebook y buscadores. Es la copia que consume la web desde `public/og-villafresh.jpg` |
| `villafresh-cuadrado.jpg` | 1080 × 1080 | Publicaciones de Instagram y Facebook |
| `og-1200x630.html` · `cuadrado-1080x1080.html` | — | El código fuente de cada pieza |

## Por qué son HTML y no imágenes generadas

La dirección visual es plana y tipográfica: color liso, monoespaciada, filetes de 1px,
esquinas rectas. Un generador de imágenes por IA introduce degradados, brillos y errores
de ortografía en castellano ("Ósmosis inversa", "pH 8.3"), justo lo que este sistema
prohíbe. Componerlas en HTML da los tokens exactos, las dos tipografías reales y el
logotipo original, con texto nítido a cualquier tamaño.

## Cómo regenerarlas

El logotipo va incrustado en base64 dentro de cada HTML, así que el archivo es
autosuficiente. Para volver a exportarlas:

```bash
python3 -m http.server 8100 -d marca      # servirlas por HTTP (file:// no vale)
# abrir la pieza en el navegador al tamaño exacto del lienzo y capturar
```

El lienzo se declara en `body { width; height }` de cada archivo. Al editar textos,
respeta lo verificado: agua **purificada** (nunca "mineral de manantial"), S/ 30 el
bidón, S/ 50 dos bidones, pH 8.3, WhatsApp 994 647 840.
