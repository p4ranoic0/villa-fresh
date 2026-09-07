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


def caja_visible_incl(im):
    """La misma caja, con el borde derecho e inferior exclusivos, que es lo
    que espera Image.crop. `caja_visible` devuelve el ultimo pixel opaco."""
    x0, y0, x1, y1 = caja_visible(im)
    return x0, y0, x1 + 1, y1 + 1


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


def escribir_escalas(escalas):
    """Vuelca la escala medida a un modulo de TypeScript.

    Se genera aqui y no se escribe a mano porque es una medida de los archivos:
    si manana llega una foto nueva, el numero cambia solo al volver a ejecutar
    el script. Un valor a mano se quedaria viejo sin que nadie se enterara.
    """
    lineas = [
        '/* ==========================================================================',
        '   GENERADO POR scripts/marcar-producto.py — no editar a mano.',
        '',
        '   Cuanto ocupaba de alto cada producto dentro del lienzo cuadrado comun de',
        '   los archivos de marca. Casi todos lo llenan (0.879): el bidon y la botella',
        '   salen a la misma altura y solo cambia la silueta. El que dice algo es el',
        '   de la foto de grupo (0.720): tres bidones en fila tienen que caber a lo',
        '   ancho, y por eso van mas bajos. Sin ese numero, cada bidon del grupo se',
        '   veria mas grande que el bidon suelto de la tarjeta de al lado.',
        '',
        '   Vivia escondido como aire transparente dentro de cada .webp. Ahora las',
        '   fotos van recortadas al objeto —una sola por foto, sin descargar la misma',
        '   imagen dos veces— y el encuadre viaja aparte, donde se puede leer.',
        '   ========================================================================== */',
        'export const ESCALA_FOTO: Record<string, number> = {',
    ]
    for nombre in sorted(escalas):
        lineas.append(f"  '{nombre}': {escalas[nombre]:.4f},")
    lineas += ['}', '']
    destino = RAIZ / 'src' / 'data' / 'escala-fotos.ts'
    destino.write_text('\n'.join(lineas), encoding='utf-8')
    print(f'escala-fotos.ts  {len(escalas)} fotos')


if __name__ == '__main__':
    escalas = {}
    for nombre, puntos in PLAN.items():
        im = Image.open(RAIZ / 'marca' / 'sin-marca' / f'{nombre}.webp').convert('RGBA')
        for cx, cy, an in puntos:
            im = marcar(im, cx, cy, an)
        # UN ARCHIVO POR FOTO, RECORTADO AL OBJETO, Y LA ESCALA COMO DATO.
        #
        # Los originales de marca vienen en un lienzo cuadrado de 760x760 con el
        # producto flotando en medio. Ese aire transparente llevaba dentro dos
        # cosas a la vez, y por eso costo separarlas:
        #
        #   1. ENCUADRE. Casi todas las fotos llenan el alto del lienzo (0.879),
        #      asi que el bidon y la botella salen a la MISMA altura y solo se
        #      diferencian en la silueta —el 47 % contra el 24 % de ancho es lo
        #      gordo que es cada uno, no lo grande. La excepcion es la foto de
        #      grupo: tres bidones en fila tienen que caber a lo ancho, asi que
        #      solo ocupan el 0.720 del alto. Ese numero SI dice algo —mantiene
        #      cada bidon del grupo del tamano del bidon suelto de al lado— y es
        #      lo unico que se perderia al recortar todo a su caja.
        #   2. RUIDO. Para una foto colocada sola —la portada, un titular de
        #      banda— el aire solo hace que la medida mienta: pedir 390 px de
        #      imagen daba 183 px de bidon.
        #
        # Se probo servir las dos versiones, cuadrada y recortada. Funcionaba,
        # pero el visitante se descargaba las mismas dos fotos dos veces: 114 KB
        # de mas. Ahora se escribe UNA sola, recortada, y la escala sale por
        # separado a src/data/escala-fotos.ts, que es donde se puede leer y
        # discutir en vez de vivir dentro de un PNG.
        #
        # El aire no hacia falta para la sombra: la pone CSS con
        # filter:drop-shadow, que dibuja fuera de la caja del elemento.
        caja = caja_visible_incl(im)
        # Cuanto del lienzo comun ocupaba de alto. Es una medida, no una
        # estimacion: sale de los pixeles opacos del archivo de marca. En la
        # practica solo hay dos valores, y el que importa es el de la foto de
        # grupo.
        escalas[nombre] = (caja[3] - caja[1]) / im.height
        im = im.crop(caja)
        destino = RAIZ / 'public' / f'{nombre}.webp'
        im.save(destino, 'WEBP', quality=84, method=6)
        print(f'{nombre}  {im.width}x{im.height}  escala {escalas[nombre]:.3f}  '
              f'{destino.stat().st_size // 1024} KB')

    escribir_escalas(escalas)
