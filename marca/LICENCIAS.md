# Registro de licencias — Adobe Stock

Licencias adquiridas el **29 de agosto de 2026** con la cuenta de Adobe de Villa Fresh.
Todas de tarifa libre (`pricing: free`). Cinco fotografías y un vídeo.

| Archivo en `public/` | ID de Stock | Título original | Uso previsto |
|---|---|---|---|
| `producto-bidon-20l.webp` | `418799784` | *complete photograph of a container of purified water on a white background* | Tarjetas `VF-B20` y `VF-R20` |
| `producto-bidones.webp` | `562216431` | *Bottles of clean water on white background* | Tarjetas `VF-B20X2` y `VF-EMP` |
| `producto-botella.webp` | `315018097` | *Plastic pure water bottle isolated on white background* | Tarjeta `VF-BOT` |
| `marca/portada-bidones.webp` | `317781462` | *Big plastic bottle potable water isolated on a white background* | **Sin colocar.** Se licenció para la portada, pero el hero es de texto y ficha técnica, y meterle una foto cambiaría la dirección visual. Vive en `marca/` para no publicarse sin uso |
| `producto-dispensador.webp` | `477288227` | *Close up of water dispenser used for refreshment in business office* | Tarjeta `VF-DISP` |
| `proceso-agua.mp4` · `proceso-agua.webp` | `444039087` | *Slow motion close up air bubbles in water rising up to the surface on isolated black background* | Secuencia sincronizada con el scroll en la sección de proceso |

Los originales a resolución completa se recuperan en Adobe Stock con esos identificadores:
la licencia está en la cuenta, así que no hace falta versionarlos aquí.

**Las cuatro de producto llevan ahora el logotipo puesto.** Dejan de ser fotografías
genéricas y pasan a representar el producto de Villa Fresh. Lo que no cambia: el envase
de la foto no es el envase que se entrega, y si el bidón real lleva otra etiqueta hay
que rehacerlas con fotografía propia. El detalle está en `DESIGN.md` §11.

## Tratamiento aplicado

1. Licencia y descarga a resolución completa.
2. Fondo recortado con `image_remove_background` (Photoshop API) en las tres de producto.
3. Recorte al contenido útil, encaje en lienzo cuadrado de 760 px con 6 % de margen.
3b. **Logotipo de Villa Fresh colocado sobre el envase** con
    `scripts/marcar-producto.py`. Se usa el archivo de marca tal cual, sin añadirle
    texto. Los recortes sin marca quedan en `marca/sin-marca/` como fuente.
4. Exportación a **WebP**. La spec pedía PNG; se cambió porque el mismo recorte pesa
   296 KB en PNG y 48 KB en WebP, con transparencia y sin pérdida visible. WebP con canal
   alfa está soportado en todos los navegadores actuales.

## Peso

| Archivo | Peso | Techo de la spec |
|---|---|---|
| `producto-bidon-20l.webp` | 48 KB | 120 KB |
| `producto-botella.webp` | 24 KB | 120 KB |
| `producto-dispensador.webp` | 25 KB | 120 KB |
| `producto-bidones.webp` | 65 KB | 120 KB |
| `portada-bidones.webp` | 47 KB | 250 KB |
| **Total** | **209 KB** | 600 KB |

## Restricción de uso

Son fotografías **genéricas con licencia**, no del producto ni de la planta de Villa Fresh.
No pueden acompañarse de texto que las presente como instalaciones, equipo o producto
propios. El pendiente del `README.md` —*"Fotos reales del producto y de la planta"*—
sigue abierto.

## Las dos tarjetas difíciles

**`VF-DISP` — Dispensador.** Resuelto. La foto de stock estaba tomada en una oficina,
contra una pared de ladrillo y con plantas y archivadores al fondo: chocaba de frente con
la dirección "ficha técnica". El problema era el fondo, no el producto, así que se recortó
igual que las demás. Se retiró además la pila de vasos de papel del lado derecho.

**`VF-EV20` — Envase vacío 20 L.** No tiene solución fotográfica, y la razón es del
producto, no del catálogo de Stock: **un bidón lleno y uno vacío son indistinguibles en
una foto.** Son ambos plástico transparente y no hay línea de agua visible. Por eso Stock
no ofrece "bidón vacío": no es un objeto visualmente distinto.

Se usa por tanto la misma fotografía que en `VF-B20`, y la distinción la aporta una
etiqueta monoespaciada sobre la imagen, dentro del componente de la tarjeta.

Es exactamente lo que hacían las ilustraciones anteriores, que rotulaban `SELLADO` en el
lleno y `VACÍO` en el vacío. Eso no era decoración: era información que la fotografía no
puede transmitir, y se conserva.


## El vídeo (`444039087`)

Original: 1920 × 1080, 25 fps, 23 s, 35 MB. De ahí sale un fragmento de **6 segundos**
(de t=1 s a t=7 s), que es donde está el arco completo: la erupción, la caída y el
asentamiento. A partir de t≈11 s el plano se queda negro.

Tratamiento con ffmpeg:

```
-ss 1 -t 6 -vf fps=12,scale=960:540:flags=lanczos
-c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 -crf 32 -preset veryslow
-movflags +faststart -an
```

`-g 1` es lo que hace que **cada fotograma sea clave**. Sin eso, mover `currentTime`
salta al fotograma clave más cercano y la secuencia va a tirones en vez de fluir.
Es también la razón de que 6 segundos ocupen 570 KB: un H.264 normal pesaría una
fracción, pero no se podría recorrer con el scroll.

El póster es el fotograma de t=4 s, donde la superficie ya es una banda de espuma y
las burbujas caen. Se eligió ese y no el de la erupción para que la imagen fija no
sea un chapoteo congelado, que es el cliché del rubro.

## Peso de lo que se publica

`public/` se copia entera al artefacto, así que dentro sólo está lo que un visitante
puede llegar a pedir. Los logotipos de marca y la portada sin colocar viven en `marca/`.

| Archivo | Peso | Cuándo se descarga |
|---|---|---|
| `proceso-agua.mp4` | 570 KB | Sólo en pantallas ≥ 900 px, sin `prefers-reduced-motion` ni ahorro de datos, y sólo al acercarse la sección |
| `og-villafresh.jpg` | 85 KB | Nunca por la página: lo piden los previsualizadores de enlaces |
| Las cuatro fotos de producto | 165 KB | En el catálogo, en diferido |
| `proceso-agua.webp` | 17 KB | Siempre, en la portada |
| `favicon.svg` | 1 KB | Siempre |

La portada carga **18 KB** de imagen. El vídeo es la excepción, y es opcional por diseño.
