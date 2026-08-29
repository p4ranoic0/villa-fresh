# Registro de licencias — Adobe Stock

Licencias adquiridas el **29 de agosto de 2026** con la cuenta de Adobe de Villa Fresh.
Todas de tarifa libre (`pricing: free`).

| Archivo en `public/` | ID de Stock | Título original | Uso previsto |
|---|---|---|---|
| `producto-bidon-20l.webp` | `418799784` | *complete photograph of a container of purified water on a white background* | Tarjetas `VF-B20` y `VF-R20` |
| `producto-bidones.webp` | `562216431` | *Bottles of clean water on white background* | Tarjetas `VF-B20X2` y `VF-EMP` |
| `producto-botella.webp` | `315018097` | *Plastic pure water bottle isolated on white background* | Tarjeta `VF-BOT` |
| `portada-bidones.webp` | `317781462` | *Big plastic bottle potable water isolated on a white background* | Imagen de portada |
| `producto-dispensador.webp` | `477288227` | *Close up of water dispenser used for refreshment in business office* | Tarjeta `VF-DISP` |

Los originales a resolución completa se recuperan en Adobe Stock con esos identificadores:
la licencia está en la cuenta, así que no hace falta versionarlos aquí.

## Tratamiento aplicado

1. Licencia y descarga a resolución completa.
2. Fondo recortado con `image_remove_background` (Photoshop API) en las tres de producto.
3. Recorte al contenido útil, encaje en lienzo cuadrado de 760 px con 6 % de margen.
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
