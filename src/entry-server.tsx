import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

/** Renderiza una ruta a HTML. La llama scripts/prerender.ts en tiempo de build. */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
