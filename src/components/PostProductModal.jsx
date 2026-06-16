import { useState } from 'react'

const produceEmojis = ['🥑', '🍊', '🍠', '🍅', '🥬', '🌽', '🍋', '🥔', '🍓', '🫑', '🥕', '🍆', '🍇', '🧅']
const tints = {
  '🥑': '#2f9e44', '🍊': '#f08c00', '🍠': '#e8590c', '🍅': '#e03131',
  '🥬': '#37b24d', '🌽': '#f0a000', '🍋': '#f5d000', '🥔': '#a9844f',
  '🍓': '#e64980', '🫑': '#2b8a3e', '🥕': '#e8590c', '🍆': '#7048e8',
  '🍇': '#9c36b5', '🧅': '#d9a066',
}

export default function PostProductModal({ onClose, onPost }) {
  const [form, setForm] = useState({
    name: '',
    emoji: '🥑',
    category: 'Fruit',
    pricePerKg: '',
    available: '',
    harvestedDaysAgo: '0',
    description: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const valid = form.name && form.pricePerKg && form.available

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    onPost({
      name: form.name,
      emoji: form.emoji,
      color: tints[form.emoji] || '#2f9e44',
      category: form.category,
      pricePerKg: Number(form.pricePerKg),
      available: Number(form.available),
      unit: 'kg',
      harvestedDaysAgo: Number(form.harvestedDaysAgo),
      description: form.description || 'Freshly harvested and ready to go.',
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <header className="modal-head">
          <div>
            <h2>Post a product</h2>
            <p className="muted">A quick listing — pick a photo, say when you picked it, set the amount.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <span className="field-label">Pick a picture</span>
        <div className="emoji-pick">
          {produceEmojis.map((e) => (
            <button
              type="button"
              key={e}
              className={`emoji-chip ${form.emoji === e ? 'active' : ''}`}
              style={form.emoji === e ? { '--tint': tints[e] } : undefined}
              onClick={() => setForm((f) => ({ ...f, emoji: e }))}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Product name *</span>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Hass Avocado" />
          </label>
          <label className="field">
            <span>Category</span>
            <select value={form.category} onChange={set('category')}>
              <option>Fruit</option>
              <option>Vegetables</option>
              <option>Roots</option>
            </select>
          </label>
        </div>

        <div className="grid-3">
          <label className="field">
            <span>Price per kg *</span>
            <input type="number" min="0" step="0.5" value={form.pricePerKg} onChange={set('pricePerKg')} placeholder="R$" />
          </label>
          <label className="field">
            <span>Amount (kg) *</span>
            <input type="number" min="1" value={form.available} onChange={set('available')} placeholder="e.g. 50" />
          </label>
          <label className="field">
            <span>Harvested</span>
            <select value={form.harvestedDaysAgo} onChange={set('harvestedDaysAgo')}>
              <option value="0">Today</option>
              <option value="1">Yesterday</option>
              <option value="2">2 days ago</option>
              <option value="3">3 days ago</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Describe it a little</span>
          <textarea rows={2} value={form.description} onChange={set('description')} placeholder="Taste, variety, how it was grown..." />
        </label>

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!valid}>Post to marketplace</button>
        </footer>
      </form>
    </div>
  )
}
