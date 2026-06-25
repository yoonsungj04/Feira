import { formatPrice } from '../utils.js'
import { Close, Pin } from './Icons.jsx'

export default function ProducerModal({ producer, products, onClose, onAdd }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close-float" onClick={onClose} aria-label="Fechar"><Close /></button>
        <div className="producer-hero">
          <span
            className={`producer-hero-avatar ${producer.photo ? 'photo' : ''}`}
            style={producer.photo ? { backgroundImage: `url(${producer.photo})` } : undefined}
          />
          <div>
            <h2>{producer.name}</h2>
            <p className="muted with-pin">{producer.farmer} · <Pin size={14} /> {producer.location}</p>
            <span className="badge">Na feira desde {producer.since}</span>
          </div>
        </div>

        {producer.bio && <p className="producer-bio">{producer.bio}</p>}

        <h3 className="producer-section">Da estação, agora</h3>
        <div className="producer-products">
          {products.map((p) => (
            <div className="mini-product" key={p.id}>
              <span
                className={`mini-emoji ${p.photo ? 'photo' : ''}`}
                style={p.photo ? { backgroundImage: `url(${p.photo})` } : { background: p.color }}
              />
              <div className="mini-info">
                <strong>{p.name}</strong>
                <small>{formatPrice(p.pricePerKg)}/{p.unit} · restam {p.available} {p.unit}</small>
              </div>
              <button className="btn btn-add btn-sm" onClick={() => onAdd(p)}>Adicionar</button>
            </div>
          ))}
          {products.length === 0 && <p className="muted">Nenhum anúncio ativo no momento.</p>}
        </div>
      </div>
    </div>
  )
}
