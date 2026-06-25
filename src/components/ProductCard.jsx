import { formatPrice, harvestLabel } from '../utils.js'
import { Sprout, Pin } from './Icons.jsx'

export default function ProductCard({ product, producer, inCartQty, onAdd, onOpenProducer }) {
  const soldOut = product.available <= 0
  const low = !soldOut && product.available <= 30
  const fresh = product.harvestedDaysAgo <= 0
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

        <div className="card-top">
          <span className={`pill pill-harvest ${fresh ? 'fresh' : ''}`}>
            {fresh && <span className="dot" />}{harvestLabel(product.harvestedDaysAgo)}
          </span>
          {soldOut ? (
            <span className="pill pill-out">Esgotado</span>
          ) : (
            low && <span className="pill pill-low">restam {product.available} {product.unit}</span>
          )}
        </div>

        <button className="card-producer" onClick={() => onOpenProducer(producer)}>
          <span
            className={`card-producer-avatar ${producerPhoto ? 'photo' : ''}`}
            style={producerPhoto ? { backgroundImage: `url(${producerPhoto})` } : undefined}
          />
          <span className="card-producer-text">
            <strong>{producer.name}</strong>
            <small className="with-pin"><Pin size={12} /> {producer.location}</small>
          </span>
        </button>
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
