import React from 'react'
import { Flame, Timer, Trophy, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { formatDate } from '../lib/storage'

const trendStyle = {
  'Up from last time': 'var(--success)',
  'Down from last time': '#cb4d6d',
  'Same as last time': 'var(--muted)',
}

export default function ExerciseHistoryPanel({ selectedExerciseName, selectedHistory, setSelectedExerciseName }) {
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
    <Card>
      <CardHeader>
        <div className="row-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <CardTitle>{selectedExerciseName} progress</CardTitle>
            <CardDescription>Last 5 sessions with simple trend tracking.</CardDescription>
          </div>
          <button onClick={() => setSelectedExerciseName('')} className="secondary-button">Close</button>
        </div>
      </CardHeader>
      <CardContent className="section-stack">
        {latest?.type === 'Strength' ? (
          <div className="stat-grid-3">
            <Metric icon={<Trophy size={14} />} label="Best weight" value={bestWeight || '—'} />
            <Metric icon={<Trophy size={14} />} label="Best reps" value={bestReps || '—'} />
            <Metric icon={<Flame size={14} />} label="Best volume" value={bestVolume || '—'} />
          </div>
        ) : (
          <div className="stat-grid-2">
            <Metric icon={<Timer size={14} />} label="Best duration" value={bestDuration || '—'} />
            <Metric icon={<Trophy size={14} />} label="Best distance" value={bestDistance || '—'} />
          </div>
        )}

        {latest && (
          <div className="card-inset row-between">
            <span className="label-text">Latest trend</span>
            <span className="small-text" style={{ color: trendStyle[latest.trendLabel], fontWeight: 700 }}>
              {latest.trendLabel === 'Up from last time' ? <TrendingUp size={14} /> : latest.trendLabel === 'Down from last time' ? <TrendingDown size={14} /> : null}
              {' '}{latest.trendLabel}
            </span>
          </div>
        )}

        {selectedHistory.length === 0 ? (
          <p className="small-text muted-text" style={{ margin: 0 }}>No saved history yet for this exercise.</p>
        ) : (
          <div className="list-stack">
            {selectedHistory.map((row, idx) => (
              <div key={`${row.date}-${idx}`} className="card-inset">
                <div className="row-between">
                  <span style={{ fontWeight: 600 }}>{formatDate(row.date)}</span>
                  <span className="small-text" style={{ color: trendStyle[row.trendLabel], fontWeight: 600 }}>{row.trendLabel}</span>
                </div>
                <p className="small-text muted-text" style={{ margin: '0.25rem 0 0' }}>
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

function Metric({ icon, label, value }) {
  return (
    <div className="card-inset stat-card">
      <div className="label-text" style={{ marginBottom: '0.3rem' }}>{icon} <span>{label}</span></div>
      <div className="stat-card-value">{value}</div>
    </div>
  )
}
