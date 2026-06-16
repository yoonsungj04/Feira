import { useState } from 'react'
import ImageUpload from './ImageUpload.jsx'

const avatars = ['👨🏽‍🌾', '👩🏼‍🌾', '🧑🏻‍🌾', '👨🏿‍🌾', '👩🏽‍🌾', '🧑🏾‍🌾']

export default function SignUpModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    farmer: '',
    name: '',
    location: '',
    whatsapp: '',
    bio: '',
    avatar: avatars[0],
    photo: null,
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
            <h2>Set up your farm stand</h2>
            <p className="muted">Tell buyers who you are and where your produce comes from.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <span className="field-label">Your photo</span>
        <ImageUpload
          value={form.photo}
          onChange={(photo) => setForm((f) => ({ ...f, photo }))}
          fallback="🧑‍🌾"
          shape="circle"
          hint="A friendly face builds trust — or pick an avatar below."
        />

        <span className="field-label">…or pick an avatar</span>
        <div className="avatar-pick">
          {avatars.map((a) => (
            <button
              type="button"
              key={a}
              className={`avatar-chip ${form.avatar === a ? 'active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, avatar: a }))}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Your name *</span>
            <input value={form.farmer} onChange={set('farmer')} placeholder="e.g. Ana Costa" />
          </label>
          <label className="field">
            <span>Farm / stand name *</span>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Sítio das Frutas" />
          </label>
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Where are you? *</span>
            <input value={form.location} onChange={set('location')} placeholder="City, region" />
          </label>
          <label className="field">
            <span>WhatsApp number</span>
            <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="55 11 9 9999 0000" />
          </label>
        </div>

        <label className="field">
          <span>A little about you and your farm</span>
          <textarea
            rows={3}
            value={form.bio}
            onChange={set('bio')}
            placeholder="What do you grow? How do you farm? What makes your produce special?"
          />
        </label>

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!valid}>Create my stand</button>
        </footer>
      </form>
    </div>
  )
}
