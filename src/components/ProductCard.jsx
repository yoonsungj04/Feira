import { formatPrice, harvestLabel } from '../utils.js'

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
        {!product.photo && <span className="card-emoji">{product.emoji}</span>}
        <span className="card-harvest">{harvestLabel(product.harvestedDaysAgo)}</span>
        {soldOut ? (
          <span className="card-out-badge">Sold out</span>
        ) : (
          low && <span className="card-low">Only {product.available} {product.unit} left</span>
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
          >
            {!producerPhoto && producer.avatar}
          </span>
          <span>
            <strong>{producer.name}</strong>
            <small>{producer.location}</small>
          </span>
        </button>

        <button className="btn btn-add" onClick={() => onAdd(product)} disabled={soldOut}>
          {soldOut
            ? 'Sold out'
            : inCartQty > 0
              ? `In basket · ${inCartQty} ${product.unit}`
              : 'Add to basket'}
        </button>
      </div>
    </article>
  )
}
