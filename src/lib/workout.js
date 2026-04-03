import { defaultSet } from './storage'

export function getSetValuePatch(category, sourceSet = {}) {
  if (category === 'Strength') {
    return {
      weight: sourceSet.weight || '',
      reps: sourceSet.reps || '',
    }
  }

  return {
    duration: sourceSet.duration || '',
    distance: sourceSet.distance || '',
  }
}

export function createCopiedSet(category, sourceSet = {}) {
  return {
    ...defaultSet(),
    ...getSetValuePatch(category, sourceSet),
  }
}

export function getLastExerciseSetFromHistory(history, exerciseName) {
  for (const workout of history) {
    const matchingEntry = workout.entries.find((entry) => entry.name === exerciseName)
    if (!matchingEntry) continue

    const reversedSets = [...matchingEntry.sets].reverse()
    const setWithValues = reversedSets.find((set) => {
      const hasStrengthValue = Number(set.weight || 0) || Number(set.reps || 0)
      const hasCardioValue = Number(set.duration || 0) || Number(set.distance || 0)
      return hasStrengthValue || hasCardioValue
    })

    if (setWithValues) return setWithValues
  }

  return null
}

export function completeSetAndGetNextEntryId(entries, entryId, setIndex) {
  const currentIndex = entries.findIndex((entry) => entry.id === entryId)
  if (currentIndex < 0) return { updatedEntries: entries, nextExpandedId: entryId }

  const updatedEntries = entries.map((entry, index) => {
    if (index !== currentIndex) return entry

    return {
      ...entry,
      sets: entry.sets.map((set, idx) => (idx === setIndex ? { ...set, done: true } : set)),
    }
  })

  const currentEntry = updatedEntries[currentIndex]
  const allSetsDone = currentEntry.sets.every((set) => set.done)
  const nextExpandedId = allSetsDone && updatedEntries[currentIndex + 1]
    ? updatedEntries[currentIndex + 1].id
    : entryId

  return { updatedEntries, nextExpandedId }
}
