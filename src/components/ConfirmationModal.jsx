import { formatPrice } from '../utils.js'
import { Check } from './Icons.jsx'

export default function ConfirmationModal({ order, onClose, onViewOrders }) {
  const many = order.groups.length > 1
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-narrow confetti" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-check"><Check size={40} /></div>
        <h2 className="confirm-title">Pedido feito!</h2>
        <p className="muted confirm-sub">
          {order.groups.length} produtor{many ? 'es' : ''} {many ? 'receberam' : 'recebeu'} sua
          mensagem. {many ? 'Eles vão' : 'Ele vai'} confirmar a retirada ou a entrega no WhatsApp.
        </p>

        <div className="confirm-summary">
          {order.groups.map((g) => (
            <div className="confirm-row" key={g.producerName}>
              <span className="ck-item">
                {g.producerPhoto && <span className="ck-thumb round" style={{ backgroundImage: `url(${g.producerPhoto})` }} />}
                {g.producerName}
              </span>
              <span>{formatPrice(g.total)}</span>
            </div>
          ))}
          <div className="confirm-row confirm-grand">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onViewOrders}>Ver meus pedidos</button>
          <button className="btn btn-primary" onClick={onClose}>Continuar comprando</button>
        </div>
      </div>
    </div>
  )
}
