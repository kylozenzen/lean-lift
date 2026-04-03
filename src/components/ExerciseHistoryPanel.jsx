import React from 'react'
import { Flame, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { formatDate } from '../lib/storage'

export default function ExerciseHistoryPanel({ selectedExerciseName, selectedHistory, sketchCard, sketchInset, dark, subtleText, setSelectedExerciseName }) {
  if (!selectedExerciseName) return null
  const strengthRows = selectedHistory.filter((r) => r.type === 'Strength')
  const cardioRows = selectedHistory.filter((r) => r.type === 'Cardio')
  const bestWeight = Math.max(0, ...strengthRows.map((r) => r.bestWeight || 0))
  const bestVolume = Math.max(0, ...strengthRows.map((r) => r.bestVolume || 0))
  const bestDuration = Math.max(0, ...cardioRows.map((r) => r.bestDuration || 0))
  return (
    <Card className={`${sketchCard} mt-4`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-black">{selectedExerciseName} progress</CardTitle>
            <CardDescription>Your recent history for this exercise.</CardDescription>
          </div>
          <button onClick={() => setSelectedExerciseName('')} className="text-sm underline">Close</button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Metric icon={<Trophy className="h-4 w-4" />} label="Best weight" value={bestWeight || '—'} />
          <Metric icon={<Flame className="h-4 w-4" />} label="Best volume" value={bestVolume || '—'} />
          <Metric icon={<Trophy className="h-4 w-4" />} label="Best duration" value={bestDuration || '—'} />
        </div>
        {selectedHistory.length === 0 ? (
          <p className={`text-sm ${subtleText}`}>No saved history yet for this exercise.</p>
        ) : (
          <div className="space-y-2">
            {selectedHistory.map((row, idx) => (
              <div key={`${row.date}-${idx}`} className={`${sketchInset} flex items-center justify-between p-3`}>
                <span className="font-bold">{formatDate(row.date)}</span>
                <span className={`${dark ? 'text-neutral-200' : 'text-neutral-700'} text-sm`}>
                  {row.type === 'Strength'
                    ? `${row.bestWeight} lb • ${row.bestReps} reps • vol ${row.bestVolume}`
                    : `${row.bestDuration} min • ${row.bestDistance} dist`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  function Metric({ icon, label, value }) {
    return (
      <div className={`${sketchInset} p-3`}>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500">{icon}<span>{label}</span></div>
        <div className="text-lg font-black">{value}</div>
      </div>
    )
  }
}
