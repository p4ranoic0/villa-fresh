import Marea from '../../components/Marea'
import { activo } from '../../rutas-publicas'
import { IconoWhatsApp } from '../../components/Icono'
import { urlWhatsApp } from '../../data/negocio'

export default function Hero() {
  return (
    <header className="hero band" id="inicio">
      {/* Aquí vivía la gota de la marca en trazo, cruzando la esquina superior
          derecha. Cuando era el único gráfico de la portada tenía sentido; con
          la foto del producto y la marea pasó a ser el tercero, y decía en
          línea lo que la marea ya dice con materia. Quitar un accesorio antes
          de salir. La marca sigue en la barra y en la etiqueta del bidón. */}
      <Marea />
      <div className="wrap hero-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Antes esto abría con «NO REVENDEMOS AGUA. LA FABRICAMOS.» en
              versalitas de 100px. El dato es bueno y sigue en la página, pero
              como primera frase abría negando algo que nadie había acusado, y
              a ese tamaño no sonaba a alguien hablando: sonaba a pancarta.
              Ahora la portada dice lo que la portada tiene que decir —qué
              vendemos y cuándo llega— y el diferencial va en la bajada. */}
          <h1>
            Hacemos el agua<br />y te la llevamos<br />el mismo día.
          </h1>
          <p className="lede" style={{ maxWidth: '46ch' }}>
            No se la compramos a nadie para revenderla: sale de nuestra planta en Lima,
            por ósmosis inversa, alcalinizada a pH 8.3 y ozonizada. De ahí a tu puerta,
            sin intermediarios.
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
            <a className="btn btn-ghost" href="#productos">Ver productos</a>
          </div>
        </div>

        <div className="hero-col">
          {/* La portada de una marca que vende un objeto no puede no
              enseñarlo. Hasta aquí el hero era texto y una tabla, y por eso
              se leía como un documento y no como una tienda. */}
          <img
            className="hero-foto"
            src={activo('/producto-bidon-20l.webp')}
            alt="Bidón de 20 litros de Villa Fresh, sellado"
            width={760}
            height={760}
            fetchPriority="high"
          />
          {/* Eran once filas en monoespaciada mayúscula: PRODUCTO, TRATAMIENTO,
              OZONIZADA, PASOS DE PURIFICACIÓN, GREMIO, COBERTURA… Una hoja de
              inventario en el sitio donde el visitante decide si compra. Quedan
              las cinco que alguien preguntaría de verdad antes de pedir, y en
              castellano corriente en vez de mayúsculas espaciadas. */}
          <aside className="ficha">
            <p className="ficha-titulo">El bidón de 20 litros</p>
            <div className="spec" style={{ borderTop: 0 }}><span>Tratamiento</span><b>Ósmosis inversa</b></div>
            <div className="spec"><span>pH</span><b style={{ color: 'var(--acento)' }}>8.3</b></div>
            <div className="spec"><span>Envase</span><b>Sellado en planta</b></div>
            <div className="spec"><span>Registro sanitario</span><b>DIGESA</b></div>
            <div className="spec"><span>Entrega</span><b>El mismo día</b></div>
          </aside>
        </div>
      </div>
    </header>
  )
}
