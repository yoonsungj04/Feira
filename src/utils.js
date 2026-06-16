export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function harvestLabel(daysAgo) {
  if (daysAgo <= 0) return 'Harvested today'
  if (daysAgo === 1) return 'Harvested yesterday'
  return `Harvested ${daysAgo} days ago`
}

// Build the WhatsApp order message that a buyer sends to a single producer.
export function buildWhatsAppMessage({ buyerName, producer, lines, total }) {
  const greeting = `Hi ${producer.farmer}! 👋 I found your stand on *Feira* and I'd like to order:`
  const items = lines
    .map((l) => `• ${l.qty} ${l.unit} of ${l.name} — ${formatPrice(l.qty * l.pricePerKg)}`)
    .join('\n')
  const footer = `\n*Total: ${formatPrice(total)}*\n\nWhen could I pick this up? Thank you!`
  const from = buyerName ? `\n\n— ${buyerName}` : ''
  return `${greeting}\n\n${items}\n${footer}${from}`
}

export function waLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
