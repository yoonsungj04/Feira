import { formatPrice } from '../utils.js'

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrdersModal({ orders, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <h2>Your orders</h2>
            <p className="muted">Everything you've ordered through Feira.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span>🧾</span>
            <p>No orders yet. Fill your basket and check out to see them here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order" key={order.id}>
                <div className="order-head">
                  <strong>{formatDate(order.date)}</strong>
                  <span className="order-total">{formatPrice(order.total)}</span>
                </div>
                {order.groups.map((g) => (
                  <div className="order-group" key={g.producerName}>
                    <div className="order-group-name">{g.producerAvatar} {g.producerName}</div>
                    <ul>
                      {g.lines.map((l, i) => (
                        <li key={i}>
                          <span>{l.emoji} {l.qty} {l.unit} · {l.name}</span>
                          <span>{formatPrice(l.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
