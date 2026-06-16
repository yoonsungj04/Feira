import { formatPrice } from '../utils.js'

export default function ConfirmationModal({ order, onClose, onViewOrders }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-narrow confetti" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-check">🎉</div>
        <h2 className="confirm-title">Order placed!</h2>
        <p className="muted confirm-sub">
          {order.groups.length} farmer{order.groups.length > 1 ? 's' : ''} got your message
          {order.groups.length > 1 ? 's' : ''}. They'll confirm pickup or delivery on WhatsApp.
        </p>

        <div className="confirm-summary">
          {order.groups.map((g) => (
            <div className="confirm-row" key={g.producerName}>
              <span>{g.producerAvatar} {g.producerName}</span>
              <span>{formatPrice(g.total)}</span>
            </div>
          ))}
          <div className="confirm-row confirm-grand">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onViewOrders}>View my orders</button>
          <button className="btn btn-primary" onClick={onClose}>Keep shopping</button>
        </div>
      </div>
    </div>
  )
}
