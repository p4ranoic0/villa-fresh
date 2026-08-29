import { Link } from 'react-router'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import WaFlotante from '../components/WaFlotante'
import BandaPrecio from './home/BandaPrecio'
import Cierre from './home/Cierre'
import Cinta from './home/Cinta'
import Cobertura from './home/Cobertura'
import Hero from './home/Hero'
import Planes from './home/Planes'
import Preguntas from './home/Preguntas'
import Proceso from './home/Proceso'

export default function Home() {
  return (
    <>
      <Nav accion={<Link className="btn btn-cyan btn-sm" to="/catalogo.html">Ver catálogo</Link>} />
      <Hero />
      <Cinta />
      <BandaPrecio />
      <Proceso />
      <Planes />
      <Cobertura />
      <Preguntas />
      <Cierre />
      <Footer />
      <WaFlotante />
    </>
  )
}
