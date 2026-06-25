import { formatPrice, harvestLabel } from '../utils.js'
import { Sprout } from './Icons.jsx'

export default function ProductCard({ product, producer, inCartQty, onAdd, onOpenProducer }) {
  const soldOut = product.available <= 0
  const low = !soldOut && product.available <= 30
  const producerPhoto = producer.photo

  return (
    <article className={`card ${soldOut ? 'card-out' : ''}`}>
      <div
        className={`card-photo ${product.photo ? 'has-photo' : ''}`}
        style={
          product.photo
            ? { backgroundImage: `url(${product.photo})` }
            : { '--tint': product.color }
        }
      >
        {!product.photo && <span className="card-emoji"><Sprout size={56} /></span>}
        <span className="card-harvest">{harvestLabel(product.harvestedDaysAgo)}</span>
        {soldOut ? (
          <span className="card-out-badge">Esgotado</span>
        ) : (
          low && <span className="card-low">Só restam {product.available} {product.unit}</span>
        )}
      </div>

      <div className="card-body">
        <div className="card-head">
          <h3>{product.name}</h3>
          <div className="card-price">
            {formatPrice(product.pricePerKg)}
            <span>/{product.unit}</span>
          </div>
        </div>

        <p className="card-desc">{product.description}</p>

        <button className="card-producer" onClick={() => onOpenProducer(producer)}>
          <span
            className={`card-producer-avatar ${producerPhoto ? 'photo' : ''}`}
            style={producerPhoto ? { backgroundImage: `url(${producerPhoto})` } : undefined}
          />
          <span>
            <strong>{producer.name}</strong>
            <small>{producer.location}</small>
          </span>
        </button>

        <button className="btn btn-add" onClick={() => onAdd(product)} disabled={soldOut}>
          {soldOut
            ? 'Esgotado'
            : inCartQty > 0
              ? `No cesto · ${inCartQty} ${product.unit}`
              : 'Adicionar ao cesto'}
        </button>
      </div>
    </article>
  )
}
