import { formatPrice } from '../utils.js'

export default function ProducerModal({ producer, products, onClose, onAdd }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close-float" onClick={onClose} aria-label="Close">✕</button>
        <div className="producer-hero">
          <span className="producer-hero-avatar">{producer.avatar}</span>
          <div>
            <h2>{producer.name}</h2>
            <p className="muted">{producer.farmer} · 📍 {producer.location}</p>
            <span className="badge">Selling since {producer.since}</span>
          </div>
        </div>

        {producer.bio && <p className="producer-bio">{producer.bio}</p>}

        <h3 className="producer-section">In season now</h3>
        <div className="producer-products">
          {products.map((p) => (
            <div className="mini-product" key={p.id}>
              <span className="mini-emoji" style={{ background: p.color }}>{p.emoji}</span>
              <div className="mini-info">
                <strong>{p.name}</strong>
                <small>{formatPrice(p.pricePerKg)}/{p.unit} · {p.available} {p.unit} left</small>
              </div>
              <button className="btn btn-add btn-sm" onClick={() => onAdd(p)}>Add</button>
            </div>
          ))}
          {products.length === 0 && <p className="muted">No active listings right now.</p>}
        </div>
      </div>
    </div>
  )
}
