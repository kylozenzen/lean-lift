import React from 'react'
import { Flame, Timer, Trophy, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { formatDate } from '../lib/storage'

const trendStyle = {
  'Up from last time': 'text-emerald-600',
  'Down from last time': 'text-rose-600',
  'Same as last time': 'text-amber-600',
}

export default function ExerciseHistoryPanel({ selectedExerciseName, selectedHistory, sketchCard, sketchInset, dark, subtleText, setSelectedExerciseName }) {
  if (!selectedExerciseName) return null

  const latest = selectedHistory[0]
  const strengthRows = selectedHistory.filter((r) => r.type === 'Strength')
  const cardioRows = selectedHistory.filter((r) => r.type === 'Cardio')
  const bestWeight = Math.max(0, ...strengthRows.map((r) => r.bestWeight || 0))
  const bestReps = Math.max(0, ...strengthRows.map((r) => r.bestReps || 0))
  const bestVolume = Math.max(0, ...strengthRows.map((r) => r.bestVolume || 0))
  const bestDuration = Math.max(0, ...cardioRows.map((r) => r.bestDuration || 0))
  const bestDistance = Math.max(0, ...cardioRows.map((r) => r.bestDistance || 0))

  return (
    <Card className={`${sketchCard} mt-4`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-black">{selectedExerciseName} progress</CardTitle>
            <CardDescription>Last 5 sessions with simple trend tracking.</CardDescription>
          </div>
          <button onClick={() => setSelectedExerciseName('')} className="text-sm underline">Close</button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {latest?.type === 'Strength' ? (
          <div className="grid grid-cols-3 gap-3">
            <Metric sketchInset={sketchInset} icon={<Trophy className="h-4 w-4" />} label="Best weight" value={bestWeight || '—'} />
            <Metric sketchInset={sketchInset} icon={<Trophy className="h-4 w-4" />} label="Best reps" value={bestReps || '—'} />
            <Metric sketchInset={sketchInset} icon={<Flame className="h-4 w-4" />} label="Best volume" value={bestVolume || '—'} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Metric sketchInset={sketchInset} icon={<Timer className="h-4 w-4" />} label="Best duration" value={bestDuration || '—'} />
            <Metric sketchInset={sketchInset} icon={<Trophy className="h-4 w-4" />} label="Best distance" value={bestDistance || '—'} />
          </div>
        )}

        {latest && (
          <div className={`${sketchInset} flex items-center justify-between p-3`}>
            <span className={`text-xs uppercase tracking-wide ${subtleText}`}>Latest trend</span>
            <span className={`text-sm font-bold ${trendStyle[latest.trendLabel] || subtleText}`}>
              {latest.trendLabel === 'Up from last time' ? <TrendingUp className="mr-1 inline h-4 w-4" /> : latest.trendLabel === 'Down from last time' ? <TrendingDown className="mr-1 inline h-4 w-4" /> : null}
              {latest.trendLabel}
            </span>
          </div>
        )}

        {selectedHistory.length === 0 ? (
          <p className={`text-sm ${subtleText}`}>No saved history yet for this exercise.</p>
        ) : (
          <div className="space-y-2">
            {selectedHistory.map((row, idx) => (
              <div key={`${row.date}-${idx}`} className={`${sketchInset} p-3`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{formatDate(row.date)}</span>
                  <span className={`text-xs font-semibold ${trendStyle[row.trendLabel] || subtleText}`}>{row.trendLabel}</span>
                </div>
                <p className={`${dark ? 'text-neutral-200' : 'text-neutral-700'} mt-1 text-sm`}>
                  {row.type === 'Strength'
                    ? `${row.bestWeight} lb • ${row.bestReps} reps • vol ${row.bestVolume}`
                    : `${row.bestDuration} min • ${row.bestDistance} dist`}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Metric({ icon, label, value, sketchInset }) {
  return (
    <div className={`${sketchInset} p-3`}>
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500">{icon}<span>{label}</span></div>
      <div className="text-lg font-black">{value}</div>
    </div>
  )
}
