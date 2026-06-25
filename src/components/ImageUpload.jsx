import { useRef, useState } from 'react'
import { fileToScaledDataURL } from '../image.js'
import { Camera } from './Icons.jsx'

// Controle de foto: clique pra enviar, com pré-visualização. Usado para a foto
// do produto e a foto do perfil. Mostra `fallback` (um ícone) quando vazio.
export default function ImageUpload({ value, onChange, fallback, shape = 'rect', hint }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const dataUrl = await fileToScaledDataURL(file)
      onChange(dataUrl)
    } catch {
      setError('Não consegui carregar essa imagem')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="uploader">
      <button
        type="button"
        className={`upload-zone ${shape}`}
        onClick={() => inputRef.current?.click()}
        style={value ? { backgroundImage: `url(${value})` } : undefined}
      >
        {!value && <span className="upload-fallback">{busy ? '…' : (fallback || <Camera size={30} />)}</span>}
        {value && <span className="upload-edit">Trocar</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
      <div className="upload-side">
        {hint && <small className="muted">{hint}</small>}
        {value && (
          <button type="button" className="link-btn" onClick={() => onChange(null)}>
            Remover foto
          </button>
        )}
        {error && <small className="upload-error">{error}</small>}
      </div>
    </div>
  )
}
