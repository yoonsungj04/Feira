import { useState, useEffect } from 'react'

// A useState that mirrors its value into localStorage so the demo
// survives a page refresh. Falls back to `initial` if storage is empty
// or unreadable (e.g. private mode).
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable — keep running in-memory.
    }
  }, [key, value])

  return [value, setValue]
}
