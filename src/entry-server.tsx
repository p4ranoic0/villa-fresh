import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { activo, BASE_PUBLICA } from './rutas-publicas'

/** Renderiza una ruta a HTML. La llama scripts/prerender.ts en tiempo de build. */
export function render(url: string): string {
  return renderToString(
    <StaticRouter basename={BASE_PUBLICA} location={activo(url)}>
      <App />
    </StaticRouter>,
  )
}
