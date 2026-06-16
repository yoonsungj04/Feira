import { formatPrice } from '../utils.js'

export default function CartDrawer({ open, lines, total, onClose, onChangeQty, onRemove, onCheckout }) {
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="drawer-head">
          <h2>Your basket</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close basket">✕</button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <span className="drawer-empty-emoji">🧺</span>
            <p>Your basket is empty.</p>
            <small>Add some fresh produce to get started.</small>
          </div>
        ) : (
          <div className="drawer-list">
            {lines.map((line) => (
              <div className="line" key={line.product.id}>
                <span
                  className={`line-emoji ${line.product.photo ? 'photo' : ''}`}
                  style={
                    line.product.photo
                      ? { backgroundImage: `url(${line.product.photo})` }
                      : { background: line.product.color }
                  }
                >
                  {!line.product.photo && line.product.emoji}
                </span>
                <div className="line-info">
                  <strong>{line.product.name}</strong>
                  <small>{line.producer.name}</small>
                  <div className="line-price">{formatPrice(line.product.pricePerKg)}/{line.product.unit}</div>
                </div>
                <div className="line-actions">
                  <div className="stepper">
                    <button onClick={() => onChangeQty(line.product.id, line.qty - 1)} aria-label="Less">−</button>
                    <span>{line.qty} {line.product.unit}</span>
                    <button onClick={() => onChangeQty(line.product.id, line.qty + 1)} aria-label="More">+</button>
                  </div>
                  <button className="line-remove" onClick={() => onRemove(line.product.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {lines.length > 0 && (
          <footer className="drawer-foot">
            <div className="drawer-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="drawer-note">
              Your order is split by farmer — each one gets their own WhatsApp message.
            </p>
            <button className="btn btn-primary btn-block" onClick={onCheckout}>
              Checkout on WhatsApp
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}
