import { dedupeExerciseNames } from './templates'

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

function normalizeCustomTemplate(template) {
  const name = template?.name?.trim()
  if (!name) return null

  return {
    name,
    source: 'custom',
    exercises: dedupeExerciseNames(template.exercises || []),
  }
}

export function getStoredTemplates() {
  const templates = getStored(STORAGE_KEYS.templates, [])
  if (!Array.isArray(templates)) return []
  return templates.map(normalizeCustomTemplate).filter(Boolean)
}

export function persistTemplates(templates) {
  const normalized = (templates || []).map(normalizeCustomTemplate).filter(Boolean)
  persist(STORAGE_KEYS.templates, normalized)
}

export function saveCustomTemplate(existingTemplates, name, exerciseNames) {
  const nextTemplate = normalizeCustomTemplate({ name, exercises: exerciseNames, source: 'custom' })
  if (!nextTemplate) return existingTemplates

  const remaining = existingTemplates.filter(
    (template) => template.name.toLowerCase() !== nextTemplate.name.toLowerCase()
  )

  return [nextTemplate, ...remaining]
}

export function deleteCustomTemplate(existingTemplates, templateName) {
  return existingTemplates.filter((template) => template.name !== templateName)
}

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}
