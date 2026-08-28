import { urlWhatsApp } from '../data/negocio'
import { IconoWhatsApp } from './Icono'

export default function WaFlotante() {
  return (
    <a
      className="btn btn-wa wa-float"
      href={urlWhatsApp()}
      target="_blank"
      rel="noopener"
      aria-label="Pedir por WhatsApp"
    >
      <IconoWhatsApp />
      Pedir
    </a>
  )
}
