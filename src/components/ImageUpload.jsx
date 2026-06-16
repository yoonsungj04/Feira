import { useRef, useState } from 'react'
import { fileToScaledDataURL } from '../image.js'

// A click-to-upload photo control with preview. Used for product photos
// and farm profile photos. Shows `fallback` (an emoji) when empty.
export default function ImageUpload({ value, onChange, fallback = '📷', shape = 'rect', hint }) {
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
      setError("Couldn't load that image")
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
        {!value && <span className="upload-fallback">{busy ? '…' : fallback}</span>}
        {value && <span className="upload-edit">Change</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
      <div className="upload-side">
        {hint && <small className="muted">{hint}</small>}
        {value && (
          <button type="button" className="link-btn" onClick={() => onChange(null)}>
            Remove photo
          </button>
        )}
        {error && <small className="upload-error">{error}</small>}
      </div>
    </div>
  )
}
