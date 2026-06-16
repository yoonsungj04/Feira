import { formatPrice, harvestLabel } from '../utils.js'

export default function ProductCard({ product, producer, inCartQty, onAdd, onOpenProducer }) {
  const low = product.available <= 30
  return (
    <article className="card">
      <div className="card-photo" style={{ '--tint': product.color }}>
        <span className="card-emoji">{product.emoji}</span>
        <span className="card-harvest">{harvestLabel(product.harvestedDaysAgo)}</span>
        {low && <span className="card-low">Only {product.available} {product.unit} left</span>}
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
          <span className="card-producer-avatar">{producer.avatar}</span>
          <span>
            <strong>{producer.name}</strong>
            <small>{producer.location}</small>
          </span>
        </button>

        <button className="btn btn-add" onClick={() => onAdd(product)}>
          {inCartQty > 0 ? `In cart · ${inCartQty} ${product.unit}` : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
