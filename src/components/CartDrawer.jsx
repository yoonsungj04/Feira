import { formatPrice } from '../utils.js'
import { Basket, Close } from './Icons.jsx'

export default function CartDrawer({ open, lines, total, onClose, onChangeQty, onRemove, onCheckout }) {
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="drawer-head">
          <h2>Seu cesto</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar cesto"><Close /></button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <span className="drawer-empty-emoji"><Basket size={54} /></span>
            <p>Seu cesto está vazio.</p>
            <small>Adicione uns produtos fresquinhos pra começar.</small>
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
                />
                <div className="line-info">
                  <strong>{line.product.name}</strong>
                  <small>{line.producer.name}</small>
                  <div className="line-price">{formatPrice(line.product.pricePerKg)}/{line.product.unit}</div>
                </div>
                <div className="line-actions">
                  <div className="stepper">
                    <button onClick={() => onChangeQty(line.product.id, line.qty - 1)} aria-label="Menos">−</button>
                    <span>{line.qty} {line.product.unit}</span>
                    <button onClick={() => onChangeQty(line.product.id, line.qty + 1)} aria-label="Mais">+</button>
                  </div>
                  <button className="line-remove" onClick={() => onRemove(line.product.id)}>Remover</button>
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
              Seu pedido é separado por produtor — cada um recebe a própria mensagem no WhatsApp.
            </p>
            <button className="btn btn-primary btn-block" onClick={onCheckout}>
              Fechar pedido no WhatsApp
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}
