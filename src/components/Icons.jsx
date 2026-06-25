// Inline SVG icons used across the UI in place of emojis.
// Every icon draws with `currentColor` so it inherits text color,
// and takes an optional `size` (px).
function Svg({ size = 20, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function Basket(props) {
  return (
    <Svg {...props}>
      <path d="M4 9h16l-1.3 9.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8L4 9z" />
      <path d="M9 9 12 3.5 15 9" />
      <path d="M10 13v3M14 13v3" />
    </Svg>
  )
}

export function Search(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Svg>
  )
}

export function Receipt(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h12v18l-2.2-1.4L13.6 21 12 19.6 10.4 21 8.2 19.6 6 21V3z" />
      <path d="M9 8h6M9 12h6" />
    </Svg>
  )
}

export function Sprout(props) {
  return (
    <Svg {...props}>
      <path d="M12 20v-7" />
      <path d="M12 13c0-3.3 2.6-5.5 6.5-5.5 0 3.8-2.6 5.5-6.5 5.5z" />
      <path d="M12 15c0-2.8-2.2-4.7-5.5-4.7 0 3.2 2.2 4.7 5.5 4.7z" />
    </Svg>
  )
}

export function Pin(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </Svg>
  )
}

export function Plus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function Close(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function Check(props) {
  return (
    <Svg {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  )
}

export function Camera(props) {
  return (
    <Svg {...props}>
      <path d="M3 8h3.5L8 6h8l1.5 2H21v11H3z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </Svg>
  )
}

export function WhatsApp({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l.2.3-.7 2.6-2.7-.7-.3.2A8.2 8.2 0 1 1 12 3.8zm-3 3.5c-.2 0-.5 0-.7.4-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.2 2.4 1 2.9.8 3.4.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.4.1-.5l.5-.5c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5z" />
    </svg>
  )
}
