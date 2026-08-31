import { useCallback, useState } from 'react'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import WaFlotante from '../components/WaFlotante'
import BotonCarrito from '../features/pedido/BotonCarrito'
import CajonPedido from '../features/pedido/CajonPedido'
import { usePedido } from '../features/pedido/usePedido'
import BandaPrecio from './home/BandaPrecio'
import Cierre from './home/Cierre'
import Cobertura from './home/Cobertura'
import PorConfirmar from './home/PorConfirmar'
import Hero from './home/Hero'
import Planes from './home/Planes'
import Preguntas from './home/Preguntas'
import Proceso from './home/Proceso'
import Productos from './home/Productos'

export default function Home() {
  const [abierto, setAbierto] = useState(false)
  const pedido = usePedido()
  const abrirCajon = useCallback(() => setAbierto(true), [])
  const cerrarCajon = useCallback(() => setAbierto(false), [])

  return (
    <>
      <Nav accion={<BotonCarrito unidades={pedido.unidades} onAbrir={abrirCajon} />} />
      <main>
        <Hero />
        <BandaPrecio />
        <Productos onAgregar={pedido.agregar} />
        <Proceso />
        <Planes />
        <Cobertura />
        <Preguntas />
        <Cierre />
        <PorConfirmar />
      </main>
      <Footer />
      <CajonPedido abierto={abierto} onCerrar={cerrarCajon} pedido={pedido} />
      <WaFlotante />
    </>
  )
}
