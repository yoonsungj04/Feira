export function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function harvestLabel(daysAgo) {
  if (daysAgo <= 0) return 'Colhido hoje'
  if (daysAgo === 1) return 'Colhido ontem'
  return `Colhido há ${daysAgo} dias`
}

// Monta a mensagem de pedido que o comprador envia para um produtor no WhatsApp.
export function buildWhatsAppMessage({ buyerName, producer, lines, total }) {
  const greeting = `Oi, ${producer.farmer}! Achei sua barraca na *Feira* e queria fazer um pedido:`
  const items = lines
    .map((l) => `• ${l.qty} ${l.unit} de ${l.name} — ${formatPrice(l.qty * l.pricePerKg)}`)
    .join('\n')
  const footer = `\n*Total: ${formatPrice(total)}*\n\nQuando eu poderia buscar? Obrigado!`
  const from = buyerName ? `\n\n— ${buyerName}` : ''
  return `${greeting}\n\n${items}\n${footer}${from}`
}

export function waLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
