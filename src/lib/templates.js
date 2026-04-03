export const STARTER_TEMPLATES = [
  {
    name: 'Push',
    source: 'starter',
    exercises: ['Smith Machine Bench Press', 'Incline Chest Press', 'Shoulder Press Machine', 'Triceps Pushdown'],
  },
  {
    name: 'Pull',
    source: 'starter',
    exercises: ['Lat Pulldown', 'Seated Row', 'Rear Delt Fly Machine', 'Cable Curl'],
  },
  {
    name: 'Legs',
    source: 'starter',
    exercises: ['Leg Press', 'Seated Leg Curl', 'Leg Extension', 'Standing Calf Raise'],
  },
  {
    name: 'Upper',
    source: 'starter',
    exercises: ['Smith Machine Bench Press', 'Lat Pulldown', 'Shoulder Press Machine', 'Cable Curl', 'Triceps Pushdown'],
  },
  {
    name: 'Lower',
    source: 'starter',
    exercises: ['Hack Squat', 'Seated Leg Curl', 'Leg Extension', 'Glute Drive Machine', 'Standing Calf Raise'],
  },
  {
    name: 'Full body',
    source: 'starter',
    exercises: ['Smith Machine Squat', 'Smith Machine Bench Press', 'Seated Row', 'Shoulder Press Machine', 'Ab Crunch Machine'],
  },
  {
    name: 'Cardio day',
    source: 'starter',
    exercises: ['Treadmill', 'Rowing Machine', 'Elliptical'],
  },
]

export function dedupeExerciseNames(exerciseNames = []) {
  return [...new Set(exerciseNames.filter(Boolean))]
}

export function mergeTemplateExercisesIntoPlan(currentEntries, template, allExercises, createEntryFromExercise) {
  const existingNames = new Set(currentEntries.map((entry) => entry.name))
  const templateNames = dedupeExerciseNames(template?.exercises || [])

  const additions = templateNames
    .map((exerciseName) => allExercises.find((exercise) => exercise.name === exerciseName))
    .filter(Boolean)
    .filter((exercise) => !existingNames.has(exercise.name))
    .map((exercise) => createEntryFromExercise(exercise))

  return [...currentEntries, ...additions]
}
