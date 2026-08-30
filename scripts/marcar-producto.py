#!/usr/bin/env python3
"""Coloca el logotipo real de Villa Fresh sobre las fotografías de producto.

    python3 scripts/marcar-producto.py

Lee los recortes sin marca de `marca/sin-marca/`, les pone el logotipo y
escribe el resultado en `public/`. Es reproducible: si hay que rehacer una
foto, se cambia aquí la posición y se vuelve a ejecutar.

Lo que este script NO hace, a propósito: no dibuja una etiqueta. Usa el
archivo de marca tal cual, sin añadirle una sola palabra. La referencia que
inspiró esto llevaba botellas rotuladas «NATURAL ALPINE WATER», que además de
ser una etiqueta inventada es falso: Villa Fresh vende agua de mesa purificada
por ósmosis inversa, no agua de manantial. Cualquier texto sobre el envase
tendría que salir de `src/data/`, no de aquí.
"""
from PIL import Image, ImageFilter
import numpy as np
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
LOGO = Image.open(RAIZ / 'marca' / 'logo-villafresh-circulo.png')

# (cx, cy, ancho) en fracción de la caja visible del objeto, no del lienzo.
PLAN = {
    'producto-bidon-20l': [(0.50, 0.44, 0.58)],
    'producto-bidones': [(0.17, 0.45, 0.20), (0.50, 0.47, 0.22), (0.83, 0.50, 0.21)],
    'producto-botella': [(0.50, 0.52, 0.52)],
    'producto-dispensador': [(0.50, 0.17, 0.34)],
}


def caja_visible(im):
    """Los límites de lo que no es transparente."""
    a = np.asarray(im.getchannel('A'))
    ys, xs = np.where(a > 8)
    return xs.min(), ys.min(), xs.max(), ys.max()


def marcar(im, cx, cy, ancho, curva=0.10, fuerza_brillo=0.55, umbral=244):
    x0, y0, x1, y1 = caja_visible(im)
    ow = x1 - x0
    d = max(8, int(ow * ancho))

    logo = LOGO.resize((d, d), Image.LANCZOS)
    # El envase es un cilindro: una etiqueta plana sobre un cilindro se ve más
    # estrecha de lo que es.
    logo = logo.resize((int(d * (1 - curva)), d), Image.LANCZOS)

    capa = Image.new('RGBA', im.size, (0, 0, 0, 0))
    capa.paste(logo, (int(x0 + ow * cx - logo.width / 2),
                      int(y0 + (y1 - y0) * cy - logo.height / 2)), logo)
    salida = Image.alpha_composite(im, capa)

    # Los reflejos del plástico vuelven por encima del logotipo. Es el único
    # detalle que separa una etiqueta puesta de una etiqueta pegada.
    #
    # Sólo los especulares. Con el umbral bajo entra el brillo general, y como
    # la botella entera es clara la máscara se dispara y se come el logotipo.
    base = np.asarray(im.convert('RGBA')).astype(float)
    lum = base[..., :3].max(axis=2) * (base[..., 3] / 255.0)
    alto = np.clip((lum - umbral) / (255.0 - umbral), 0, 1) * fuerza_brillo
    mascara = Image.fromarray((alto * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
    return Image.composite(im, salida, mascara)


if __name__ == '__main__':
    for nombre, puntos in PLAN.items():
        im = Image.open(RAIZ / 'marca' / 'sin-marca' / f'{nombre}.webp').convert('RGBA')
        for cx, cy, an in puntos:
            im = marcar(im, cx, cy, an)
        destino = RAIZ / 'public' / f'{nombre}.webp'
        im.save(destino, 'WEBP', quality=84, method=6)
        print(f'{nombre}  {destino.stat().st_size // 1024} KB')
