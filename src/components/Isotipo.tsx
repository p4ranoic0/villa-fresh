interface Props {
  ancho: number
  alto: number
}

export default function Isotipo({ ancho, alto }: Props) {
  return (
    <svg
      viewBox="0 0 100 120"
      style={{
        width: `${ancho}px`,
        height: `${alto}px`,
        flex: 'none',
        fill: 'none',
        stroke: '#3ec1ff',
        strokeWidth: 6,
        strokeLinejoin: 'round',
      }}
      aria-hidden="true"
    >
      <path d="M50 5C50 5 9 52 9 78a41 41 0 0 0 82 0C91 52 50 5 50 5z" />
      <path d="M23 91L45 62l13 17 10-11 16 21" />
    </svg>
  )
}
