import { useState } from 'react'
import ImageUpload from './ImageUpload.jsx'
import { avatarLibrary } from '../data.js'
import { Close } from './Icons.jsx'

export default function SignUpModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    farmer: '',
    name: '',
    location: '',
    whatsapp: '',
    bio: '',
    photo: avatarLibrary[0],
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const valid = form.farmer && form.name && form.location

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    onCreate({ ...form, since: new Date().getFullYear() })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <header className="modal-head">
          <div>
            <h2>Monte sua barraca</h2>
            <p className="muted">Conte pra quem compra quem é você e de onde vêm seus produtos.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar"><Close /></button>
        </header>

        <span className="field-label">Sua foto</span>
        <ImageUpload
          value={form.photo}
          onChange={(photo) => setForm((f) => ({ ...f, photo }))}
          shape="circle"
          hint="Um rostinho amigável passa confiança — ou escolha uma foto abaixo."
        />

        <span className="field-label">…ou escolha uma foto</span>
        <div className="avatar-pick">
          {avatarLibrary.map((a) => (
            <button
              type="button"
              key={a}
              className={`avatar-chip photo ${form.photo === a ? 'active' : ''}`}
              style={{ backgroundImage: `url(${a})` }}
              onClick={() => setForm((f) => ({ ...f, photo: a }))}
              aria-label="Escolher esta foto"
            />
          ))}
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Seu nome *</span>
            <input value={form.farmer} onChange={set('farmer')} placeholder="ex.: Ana Costa" />
          </label>
          <label className="field">
            <span>Nome da barraca / sítio *</span>
            <input value={form.name} onChange={set('name')} placeholder="ex.: Sítio das Frutas" />
          </label>
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Onde você fica? *</span>
            <input value={form.location} onChange={set('location')} placeholder="Cidade, região" />
          </label>
          <label className="field">
            <span>Número de WhatsApp</span>
            <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="55 11 9 9999 0000" />
          </label>
        </div>

        <label className="field">
          <span>Um pouco sobre você e sua roça</span>
          <textarea
            rows={3}
            value={form.bio}
            onChange={set('bio')}
            placeholder="O que você planta? Como você cultiva? O que faz seu produto ser especial?"
          />
        </label>

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={!valid}>Criar minha barraca</button>
        </footer>
      </form>
    </div>
  )
}
