import { useState } from 'react'
import { formatPrice, buildWhatsAppMessage, waLink } from '../utils.js'
import { Close, Check, WhatsApp } from './Icons.jsx'

// Agrupa o cesto por produtor e gera uma mensagem de WhatsApp para cada um.
export default function CheckoutModal({ groups, buyerName, onClose, onConfirm }) {
  const [name, setName] = useState(buyerName || '')
  const [sent, setSent] = useState({})
  const total = groups.reduce((s, g) => s + g.total, 0)
  const anySent = Object.keys(sent).length > 0

  const send = (group) => {
    const message = buildWhatsAppMessage({
      buyerName: name,
      producer: group.producer,
      lines: group.lines.map((l) => ({
        name: l.product.name,
        qty: l.qty,
        unit: l.product.unit,
        pricePerKg: l.product.pricePerKg,
      })),
      total: group.total,
    })
    window.open(waLink(group.producer.whatsapp, message), '_blank', 'noopener')
    setSent((s) => ({ ...s, [group.producer.id]: true }))
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <h2>Enviar seus pedidos</h2>
            <p className="muted">
              Você está comprando de {groups.length} produtor{groups.length > 1 ? 'es' : ''}. Cada um
              recebe uma mensagem separada no WhatsApp, só com os itens dele.
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar"><Close /></button>
        </header>

        <label className="field">
          <span>Seu nome (opcional)</span>
          <input
            type="text"
            value={name}
            placeholder="Pra o produtor saber quem está pedindo"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="checkout-groups">
          {groups.map((group) => (
            <div className="checkout-group" key={group.producer.id}>
              <div className="checkout-group-head">
                <span
                  className={`card-producer-avatar ${group.producer.photo ? 'photo' : ''}`}
                  style={group.producer.photo ? { backgroundImage: `url(${group.producer.photo})` } : undefined}
                />
                <div>
                  <strong>{group.producer.name}</strong>
                  <small>{group.producer.farmer} · {group.producer.location}</small>
                </div>
              </div>
              <ul className="checkout-items">
                {group.lines.map((l) => (
                  <li key={l.product.id}>
                    <span className="ck-item">
                      <span className="ck-thumb" style={{ backgroundImage: `url(${l.product.photo})` }} />
                      {l.qty} {l.product.unit} · {l.product.name}
                    </span>
                    <span>{formatPrice(l.qty * l.product.pricePerKg)}</span>
                  </li>
                ))}
              </ul>
              <div className="checkout-group-foot">
                <span className="checkout-subtotal">Subtotal {formatPrice(group.total)}</span>
                <button className="btn btn-whatsapp btn-icon" onClick={() => send(group)}>
                  {sent[group.producer.id]
                    ? <><Check size={16} /> Mensagem aberta</>
                    : <><WhatsApp size={16} /> Chamar {group.producer.farmer.split(' ')[0]}</>}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-place">
          <div className="checkout-grand">
            <span>Total do pedido</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={() => onConfirm({ buyerName: name, groups })}
          >
            {anySent ? 'Pronto — confirmar pedido' : 'Confirmar pedido'}
          </button>
        </div>

        <p className="checkout-hint">
          Nesta demonstração, os botões do WhatsApp abrem um pedido pronto pra enviar (os números são
          fictícios). “Confirmar pedido” salva no seu histórico e atualiza o estoque de cada produtor.
        </p>
      </div>
    </div>
  )
}
