import { useState } from 'react'
import ImageUpload from './ImageUpload.jsx'
import { produceLibrary } from '../data.js'
import { Close } from './Icons.jsx'

export default function PostProductModal({ onClose, onPost }) {
  const [form, setForm] = useState({
    name: '',
    photo: produceLibrary[0].image,
    color: produceLibrary[0].color,
    category: 'Frutas',
    pricePerKg: '',
    available: '',
    harvestedDaysAgo: '0',
    description: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const valid = form.name && form.pricePerKg && form.available

  // Ao escolher um item pronto: usa a foto e a cor dele e já sugere nome/categoria.
  const pickProduce = (item) =>
    setForm((f) => ({
      ...f,
      photo: item.image,
      color: item.color,
      category: item.category,
      name: f.name || item.name,
    }))

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    onPost({
      name: form.name,
      photo: form.photo,
      color: form.color || '#2f9e44',
      category: form.category,
      pricePerKg: Number(form.pricePerKg),
      available: Number(form.available),
      unit: 'kg',
      harvestedDaysAgo: Number(form.harvestedDaysAgo),
      description: form.description || 'Colhido fresquinho e pronto pra levar.',
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <header className="modal-head">
          <div>
            <h2>Anunciar um produto</h2>
            <p className="muted">Um anúncio rapidinho — escolha a foto, diga quando colheu e a quantidade.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar"><Close /></button>
        </header>

        <span className="field-label">Adicione uma foto</span>
        <ImageUpload
          value={form.photo}
          onChange={(photo) => setForm((f) => ({ ...f, photo }))}
          hint="Envie uma foto de verdade do seu produto — ou escolha uma das imagens abaixo."
        />

        <span className="field-label">…ou escolha uma imagem</span>
        <div className="emoji-pick">
          {produceLibrary.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`emoji-chip photo ${form.photo === item.image ? 'active' : ''}`}
              style={{ backgroundImage: `url(${item.image})`, '--tint': item.color }}
              onClick={() => pickProduce(item)}
              title={item.name}
              aria-label={item.name}
            />
          ))}
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Nome do produto *</span>
            <input value={form.name} onChange={set('name')} placeholder="ex.: Abacate Hass" />
          </label>
          <label className="field">
            <span>Categoria</span>
            <select value={form.category} onChange={set('category')}>
              <option>Frutas</option>
              <option>Verduras</option>
              <option>Raízes</option>
            </select>
          </label>
        </div>

        <div className="grid-3">
          <label className="field">
            <span>Preço por kg *</span>
            <input type="number" min="0" step="0.5" value={form.pricePerKg} onChange={set('pricePerKg')} placeholder="R$" />
          </label>
          <label className="field">
            <span>Quantidade (kg) *</span>
            <input type="number" min="1" value={form.available} onChange={set('available')} placeholder="ex.: 50" />
          </label>
          <label className="field">
            <span>Colhido</span>
            <select value={form.harvestedDaysAgo} onChange={set('harvestedDaysAgo')}>
              <option value="0">Hoje</option>
              <option value="1">Ontem</option>
              <option value="2">Há 2 dias</option>
              <option value="3">Há 3 dias</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Descreva um pouquinho</span>
          <textarea rows={2} value={form.description} onChange={set('description')} placeholder="Sabor, variedade, como foi cultivado..." />
        </label>

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={!valid}>Publicar na feira</button>
        </footer>
      </form>
    </div>
  )
}
