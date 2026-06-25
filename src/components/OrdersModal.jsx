import { formatPrice } from '../utils.js'
import { Close, Receipt } from './Icons.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
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
            <h2>Seus pedidos</h2>
            <p className="muted">Tudo o que você já pediu pela Feira.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar"><Close /></button>
        </header>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span><Receipt size={46} /></span>
            <p>Nenhum pedido ainda. Encha o cesto e finalize pra ver os pedidos aqui.</p>
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
                    <div className="order-group-name ck-item">
                      {g.producerPhoto && <span className="ck-thumb round" style={{ backgroundImage: `url(${g.producerPhoto})` }} />}
                      {g.producerName}
                    </div>
                    <ul>
                      {g.lines.map((l, i) => (
                        <li key={i}>
                          <span className="ck-item">
                            {l.image && <span className="ck-thumb" style={{ backgroundImage: `url(${l.image})` }} />}
                            {l.qty} {l.unit} · {l.name}
                          </span>
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
