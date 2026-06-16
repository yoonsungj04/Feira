export default function Toasts({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span className="toast-emoji">{t.emoji || '✅'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
