/**
 * Todo lo que la web todavía no puede afirmar, junto y fuera del diseño.
 *
 * Antes vivía repartido: tres recuadros de línea discontinua metidos dentro
 * de las secciones y tres corchetes más en el pie. Seis marcadores sueltos
 * leídos como si fueran contenido, que era justo lo que hacía que la página
 * pareciera un borrador a medio generar.
 *
 * Siguen aquí porque cumplen una función real —son las preguntas que Villa
 * Fresh tiene que responder para que el sitio pueda salir— pero ahora se
 * presentan como lo que son: una nota al margen, no una sección de la web.
 */
const PENDIENTES = [
  ['Datos de la empresa', 'Razón social, RUC, dirección de la planta y horario de atención.'],
  ['Registro sanitario', 'El N.º de DIGESA y el desglose completo de los 8 pasos de purificación.'],
  ['Reparto', 'Los distritos que aparecen son de referencia: falta la ruta real.'],
  ['Catálogo', 'Presentaciones de botella y tarifa de los pedidos con marca propia.'],
  ['Yape', 'El logotipo oficial, para no escribir el nombre a mano.'],
  ['Fotografía', 'Fotos reales del producto, del reparto y de la planta.'],
]

export default function PorConfirmar() {
  return (
    <section className="nota-band" aria-label="Pendiente de confirmar">
      <div className="wrap">
        <div className="nota-caja">
          <p className="nota-titulo">Nota para Villa Fresh · no forma parte de la web</p>
          <p className="nota-intro">
            Esto es lo único que falta por confirmar. Hasta que llegue, la web no lo
            afirma: preferimos un hueco a un dato inventado.
          </p>
          <ul className="nota-lista">
            {PENDIENTES.map(([titulo, detalle]) => (
              <li key={titulo}>
                <b>{titulo}.</b> {detalle}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
