import { useState } from 'react'
import { formatPrice, buildWhatsAppMessage, waLink } from '../utils.js'

// Groups the basket by producer and produces one WhatsApp message per farmer.
export default function CheckoutModal({ groups, buyerName, onClose }) {
  const [name, setName] = useState(buyerName || '')
  const [sent, setSent] = useState({})

  const send = (group) => {
    const message = buildWhatsAppMessage({
      buyerName: name,
      producer: group.producer,
      lines: group.lines.map((l) => ({
        name: l.product.name,
        qty: l.qty,
        unit: l.product.unit,
        pricePerKg: l.product.pricePerKg,
      })),
      total: group.total,
    })
    window.open(waLink(group.producer.whatsapp, message), '_blank', 'noopener')
    setSent((s) => ({ ...s, [group.producer.id]: true }))
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <h2>Send your orders</h2>
            <p className="muted">
              You're ordering from {groups.length} farmer{groups.length > 1 ? 's' : ''}. Each one gets a
              separate WhatsApp message with just their items.
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <label className="field">
          <span>Your name (optional)</span>
          <input
            type="text"
            value={name}
            placeholder="So the farmer knows who's ordering"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="checkout-groups">
          {groups.map((group) => (
            <div className="checkout-group" key={group.producer.id}>
              <div className="checkout-group-head">
                <span className="card-producer-avatar">{group.producer.avatar}</span>
                <div>
                  <strong>{group.producer.name}</strong>
                  <small>{group.producer.farmer} · {group.producer.location}</small>
                </div>
              </div>
              <ul className="checkout-items">
                {group.lines.map((l) => (
                  <li key={l.product.id}>
                    <span>{l.product.emoji} {l.qty} {l.product.unit} · {l.product.name}</span>
                    <span>{formatPrice(l.qty * l.product.pricePerKg)}</span>
                  </li>
                ))}
              </ul>
              <div className="checkout-group-foot">
                <span className="checkout-subtotal">Subtotal {formatPrice(group.total)}</span>
                <button className="btn btn-whatsapp" onClick={() => send(group)}>
                  {sent[group.producer.id] ? '✓ Message opened' : `Message ${group.producer.farmer.split(' ')[0]}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="checkout-hint">
          💡 In this mock-up the buttons open WhatsApp with a ready-to-send order. Numbers are fake demo data.
        </p>
      </div>
    </div>
  )
}
