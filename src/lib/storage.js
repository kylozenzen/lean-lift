export const defaultSet = () => ({ reps: '', weight: '', duration: '', distance: '', done: false })

export const STORAGE_KEYS = {
  current: 'lean-tracker-current',
  history: 'lean-tracker-history',
  settings: 'lean-tracker-settings',
  templates: 'lean-tracker-templates',
}

export function getStored(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function persist(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getStoredTemplates() {
  return getStored(STORAGE_KEYS.templates, [])
}

export function persistTemplates(templates) {
  persist(STORAGE_KEYS.templates, templates)
}

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}
