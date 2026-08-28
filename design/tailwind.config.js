/**
 * Villa Fresh — configuración de Tailwind alineada a design/tokens.css
 * Base: variante "villafresh_claridad_editorial_desktop" (Light Editorial).
 *
 * Los colores apuntan a las variables CSS, de modo que el modo oscuro
 * funciona cambiando solo la clase `dark` en <html>, sin duplicar la paleta.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--vf-color-primary)',
        'primary-hover': 'var(--vf-color-primary-hover)',
        'primary-active': 'var(--vf-color-primary-active)',
        'on-primary': 'var(--vf-color-on-primary)',
        'primary-container': 'var(--vf-color-primary-container)',
        'on-primary-container': 'var(--vf-color-on-primary-container)',
        background: 'var(--vf-color-background)',
        surface: 'var(--vf-color-surface)',
        'surface-variant': 'var(--vf-color-surface-variant)',
        'on-surface': 'var(--vf-color-on-surface)',
        'on-surface-variant': 'var(--vf-color-on-surface-variant)',
        'text-muted': 'var(--vf-color-text-muted)',
        'border-subtle': 'var(--vf-color-border-subtle)',
        'border-strong': 'var(--vf-color-border-strong)',
        success: 'var(--vf-color-success)',
        warning: 'var(--vf-color-warning)',
        danger: 'var(--vf-color-danger)',
        whatsapp: 'var(--vf-color-whatsapp)',
        'brand-deep': '#0157b4',
        'brand-bright': '#02b5ff',
      },
      fontFamily: {
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['4.5rem', { lineHeight: '1.1', fontWeight: '300' }],
        'hero-sm': ['3rem', { lineHeight: '1.1', fontWeight: '300' }],
        h2: ['3.75rem', { lineHeight: '1.1', fontWeight: '300' }],
        'h2-alt': ['3rem', { lineHeight: '1.1', fontWeight: '300' }],
        lead: ['1.25rem', { lineHeight: '1.7', fontWeight: '300' }],
      },
      letterSpacing: {
        tightest: '-0.02em',
        widest: '0.1em',
      },
      maxWidth: { container: '1440px' },
      spacing: {
        navbar: '6rem',
        section: '8rem',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'vf-sm': 'var(--vf-shadow-sm)',
        'vf-md': 'var(--vf-shadow-md)',
        'vf-primary': 'var(--vf-shadow-primary)',
        'vf-card': 'var(--vf-shadow-card)',
      },
      aspectRatio: {
        hero: '4 / 3',
        product: '3 / 4',
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
      zIndex: {
        navbar: '50',
        whatsapp: '90',
        modal: '100',
        toast: '120',
      },
    },
  },
  plugins: [],
};
