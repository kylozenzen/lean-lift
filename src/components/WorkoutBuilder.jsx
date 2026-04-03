import React from 'react'
import { Plus, Play, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'

export default function WorkoutBuilder({
  sketchCard, sketchInset, sketchButton, subtleText, dark,
  summary, workoutStarted, showBuilder, setShowBuilder,
  entries, startWorkout, selectedExerciseName, setSelectedExerciseName,
  query, setQuery, sortedExercises, settings, getExerciseTint, addExercise,
}) {
  return (
    <Card className={sketchCard}>
      <CardHeader>
        <CardTitle className="text-lg font-black">Build today’s workout</CardTitle>
        <CardDescription>Tap + to build your plan. Keep it light until you actually start.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Metric title="Exercises" value={summary.totalExercises} />
          <Metric title="Sets" value={summary.totalSets} />
          <Metric title="Focus" value={summary.muscles[0] || 'Not set'} />
        </div>

        {!workoutStarted && (
          <>
            <div className="flex flex-wrap gap-2">
              <button className={sketchButton} onClick={() => setShowBuilder((prev) => !prev)}>{showBuilder ? 'Hide builder' : 'Build today’s workout'}</button>
              {entries.length > 0 && <button className={sketchButton} onClick={startWorkout}><Play className="mr-2 inline h-4 w-4" /> Start workout</button>}
            </div>

            {entries.length > 0 && (
              <div className={`${sketchInset} p-3`}>
                <p className={`mb-2 text-xs uppercase tracking-wide ${subtleText}`}>Today’s plan</p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedExerciseName(entry.name)}
                      className={`rounded-xl border-2 ${selectedExerciseName === entry.name ? (dark ? 'border-neutral-100 bg-neutral-700' : 'border-neutral-900 bg-[#ffe98a]') : (dark ? 'border-neutral-100 bg-neutral-800' : 'border-neutral-900 bg-[#fff7cc]')} px-3 py-2 text-left text-sm font-semibold`}
                    >
                      {entry.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showBuilder && (
              <div className={`${sketchInset} space-y-3 p-3`}>
                <div className="relative">
                  <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${subtleText}`} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search exercises..." className={`w-full rounded-2xl ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'} px-9 py-2`} />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {sortedExercises.map((exercise) => {
                    const alreadyAdded = entries.some((entry) => entry.name === exercise.name)
                    const tint = getExerciseTint(exercise, settings.colorCoding, dark)
                    return (
                      <div key={exercise.name} className={`rounded-2xl border-2 ${dark ? 'border-neutral-100' : 'border-neutral-900'} ${tint} px-3 py-3 ${dark ? 'shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)]' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'}`}>
                        <p className="font-bold leading-tight">{exercise.name}</p>
                        <p className={`mt-1 text-xs ${subtleText}`}>{exercise.category} • {exercise.muscle}</p>
                        <button className={`${sketchButton} mt-3 w-full`} disabled={alreadyAdded} onClick={() => addExercise(exercise)}>
                          <Plus className="mr-1 inline h-4 w-4" /> {alreadyAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  function Metric({ title, value }) {
    return (
      <div className={`${sketchInset} p-3`}>
        <p className={`text-[11px] uppercase tracking-wide ${subtleText}`}>{title}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    )
  }
}
