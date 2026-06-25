import { Check } from './Icons.jsx'

export default function Toasts({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.image
            ? <span className="toast-thumb" style={{ backgroundImage: `url(${t.image})` }} />
            : <span className="toast-emoji"><Check size={16} /></span>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
