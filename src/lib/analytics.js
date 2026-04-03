export function getSuggestion(history, currentWorkout) {
  if (!history.length) return 'Start simple. Beat it next time by a rep, a little weight, or a few more minutes.'
  const lastWorkout = history[0]
  const recentMuscles = new Set(lastWorkout.entries.map((entry) => entry.muscle))
  const currentStrength = currentWorkout.find(
    (entry) => entry.category === 'Strength' && entry.sets.some((set) => Number(set.reps) && Number(set.weight))
  )
  if (currentStrength) {
    const completed = currentStrength.sets.filter((set) => Number(set.reps) && Number(set.weight))
    const lastSet = completed[completed.length - 1]
    if (lastSet && Number(lastSet.reps) >= 10) {
      return `You hit ${lastSet.reps} reps on ${currentStrength.name}. You may be ready to increase weight slightly next time.`
    }
  }
  if (recentMuscles.has('Chest') && recentMuscles.has('Back')) {
    return 'You trained chest and back recently. A smart next move is legs, shoulders, or cardio.'
  }
  return 'A balanced next focus could be a muscle group you skipped last session or a cardio day.'
}

export function getAnalytics(history) {
  const totalWorkouts = history.length
  const totalExercises = history.reduce((acc, workout) => acc + workout.entries.length, 0)
  const totalSets = history.reduce((acc, workout) => acc + workout.entries.reduce((setAcc, entry) => setAcc + entry.sets.length, 0), 0)
  const muscleCounts = {}
  const exerciseCounts = {}
  history.forEach((workout) => {
    workout.entries.forEach((entry) => {
      muscleCounts[entry.muscle] = (muscleCounts[entry.muscle] || 0) + 1
      exerciseCounts[entry.name] = (exerciseCounts[entry.name] || 0) + 1
    })
  })
  return {
    totalWorkouts,
    totalExercises,
    totalSets,
    topMuscles: Object.entries(muscleCounts).sort((a, b) => b[1] - a[1]).slice(0, 4),
    topExercises: Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1]).slice(0, 6),
  }
}

export function getExerciseHistory(history, exerciseName, limit = 5) {
  if (!exerciseName) return []
  const rows = []
  history.forEach((workout) => {
    workout.entries.forEach((entry) => {
      if (entry.name !== exerciseName) return
      if (entry.category === 'Strength') {
        rows.push({
          date: workout.date,
          type: 'Strength',
          ...computeStrengthSessionBests(entry.sets),
        })
      } else {
        rows.push({
          date: workout.date,
          type: 'Cardio',
          ...computeCardioSessionBests(entry.sets),
        })
      }
    })
  })

  const sorted = rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recentRows = sorted.slice(0, limit)
  return recentRows.map((row, index) => ({
    ...row,
    trendLabel: getTrendLabel(row, recentRows[index + 1]),
  }))
}

export function computeStrengthSessionBests(sets = []) {
  let bestWeight = 0
  let bestReps = 0
  let bestVolume = 0
  sets.forEach((set) => {
    const weight = Number(set.weight || 0)
    const reps = Number(set.reps || 0)
    const volume = weight * reps
    bestWeight = Math.max(bestWeight, weight)
    bestReps = Math.max(bestReps, reps)
    bestVolume = Math.max(bestVolume, volume)
  })
  return { bestWeight, bestReps, bestVolume }
}

export function computeCardioSessionBests(sets = []) {
  let bestDuration = 0
  let bestDistance = 0
  sets.forEach((set) => {
    bestDuration = Math.max(bestDuration, Number(set.duration || 0))
    bestDistance = Math.max(bestDistance, Number(set.distance || 0))
  })
  return { bestDuration, bestDistance }
}

export function getStrengthTrend(current, previous) {
  if (!previous) return 'Same as last time'
  const currentVolume = Number(current.bestVolume || 0)
  const previousVolume = Number(previous.bestVolume || 0)
  if (currentVolume > previousVolume) return 'Up from last time'
  if (currentVolume < previousVolume) return 'Down from last time'

  const currentWeight = Number(current.bestWeight || 0)
  const previousWeight = Number(previous.bestWeight || 0)
  if (currentWeight > previousWeight) return 'Up from last time'
  if (currentWeight < previousWeight) return 'Down from last time'
  return 'Same as last time'
}

export function getCardioTrend(current, previous) {
  if (!previous) return 'Same as last time'
  const distanceDiff = Number(current.bestDistance || 0) - Number(previous.bestDistance || 0)
  const durationDiff = Number(current.bestDuration || 0) - Number(previous.bestDuration || 0)

  if (Math.abs(distanceDiff) >= Math.abs(durationDiff) && distanceDiff !== 0) {
    return distanceDiff > 0 ? 'Up from last time' : 'Down from last time'
  }
  if (durationDiff !== 0) {
    return durationDiff > 0 ? 'Up from last time' : 'Down from last time'
  }
  return 'Same as last time'
}

export function getTrendLabel(current, previous) {
  if (!current || !previous) return 'Same as last time'
  if (current.type === 'Strength') return getStrengthTrend(current, previous)
  return getCardioTrend(current, previous)
}

export function getExerciseTint(exercise, enabled, darkMode) {
  if (!enabled) return darkMode ? 'bg-[#181818]' : 'bg-white'
  const map = {
    Chest: darkMode ? 'bg-rose-950/60' : 'bg-rose-100',
    Back: darkMode ? 'bg-sky-950/60' : 'bg-sky-100',
    Legs: darkMode ? 'bg-amber-950/60' : 'bg-amber-100',
    Shoulders: darkMode ? 'bg-violet-950/60' : 'bg-violet-100',
    Arms: darkMode ? 'bg-emerald-950/60' : 'bg-emerald-100',
    Core: darkMode ? 'bg-orange-950/60' : 'bg-orange-100',
    Glutes: darkMode ? 'bg-fuchsia-950/60' : 'bg-fuchsia-100',
    Cardio: darkMode ? 'bg-cyan-950/60' : 'bg-cyan-100',
  }
  return map[exercise.muscle] || (darkMode ? 'bg-[#181818]' : 'bg-white')
}
