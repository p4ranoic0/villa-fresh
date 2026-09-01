import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Renderiza la página a HTML. La llama scripts/prerender.ts en tiempo de build.
 *
 * Recibe la url para no cambiar la firma que usa el prerender, pero ya no la
 * mira: hay una sola página y no hay router al que decirle dónde está.
 */
export function render(_url: string): string {
  return renderToString(<App />)
}
