import React from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Minus, Plus, SkipForward, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'

export default function ExerciseCard({
  entry,
  settings,
  expanded,
  onToggle,
  onRemove,
  quickAddSet,
  updateSet,
  updateNote,
  nudgeSet,
  toggleSetDone,
  copyPreviousSetValues,
  completeSetAndNext,
}) {
  return (
    <Card>
      <CardHeader className="card-header-tight">
        <div className="row-between" style={{ alignItems: 'flex-start' }}>
          <button onClick={onToggle} className="full-width" style={{ textAlign: 'left', background: 'transparent', border: 0, padding: 0 }}>
            <CardTitle>{entry.name}</CardTitle>
            <CardDescription>{entry.category} • {entry.muscle} • {entry.sets.length} sets planned</CardDescription>
          </button>
          <div className="row-wrap" style={{ gap: '0.2rem' }}>
            <button onClick={onToggle} className="icon-button" style={{ width: '2rem', height: '2rem' }}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
            <button onClick={onRemove} className="icon-button" style={{ width: '2rem', height: '2rem' }}><Trash2 size={15} /></button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="card-content-tight section-stack">
          {entry.sets.map((set, setIndex) => (
            <div key={`${entry.id}-${setIndex}`} className="card-inset">
              <div className="row-between" style={{ marginBottom: '0.45rem' }}>
                <p className="small-text muted-text" style={{ margin: 0, fontWeight: 700 }}>Set {setIndex + 1}</p>
                <button className="secondary-button" onClick={() => toggleSetDone(entry.id, setIndex)}>
                  <CheckCircle2 size={14} /> {set.done ? 'Done' : 'Mark done'}
                </button>
              </div>

              {entry.category === 'Strength' ? (
                <>
                  <div className="stat-grid-2">
                    <input value={set.weight} onChange={(e) => updateSet(entry.id, setIndex, 'weight', e.target.value)} placeholder={`Weight (${settings.weightUnit})`} className="input-shell" />
                    <input value={set.reps} onChange={(e) => updateSet(entry.id, setIndex, 'reps', e.target.value)} placeholder="Reps" className="input-shell" />
                  </div>
                  <div className="stat-grid-2" style={{ marginTop: '0.55rem' }}>
                    <button className="secondary-button" onClick={() => nudgeSet(entry.id, setIndex, 'weight', 5)}><Plus size={14} /> 5 lb</button>
                    <button className="secondary-button" onClick={() => nudgeSet(entry.id, setIndex, 'weight', -5)}><Minus size={14} /> 5 lb</button>
                    <button className="secondary-button" onClick={() => nudgeSet(entry.id, setIndex, 'reps', 1)}><Plus size={14} /> 1 rep</button>
                    <button className="secondary-button" onClick={() => nudgeSet(entry.id, setIndex, 'reps', -1)}><Minus size={14} /> 1 rep</button>
                  </div>
                </>
              ) : (
                <div className="stat-grid-2">
                  <input value={set.duration} onChange={(e) => updateSet(entry.id, setIndex, 'duration', e.target.value)} placeholder="Minutes" className="input-shell" />
                  <input value={set.distance} onChange={(e) => updateSet(entry.id, setIndex, 'distance', e.target.value)} placeholder={`Distance (${settings.distanceUnit})`} className="input-shell" />
                </div>
              )}

              <div className="stat-grid-2" style={{ marginTop: '0.55rem' }}>
                <button className="secondary-button" onClick={() => copyPreviousSetValues(entry.id, setIndex)}>
                  <Copy size={13} /> Same as last set
                </button>
                <button className="secondary-button" onClick={() => completeSetAndNext(entry.id, setIndex)}>
                  <SkipForward size={13} /> Complete & next
                </button>
              </div>
            </div>
          ))}

          <div className="row-wrap">
            <button className="primary-button" onClick={() => quickAddSet(entry.id)}><Plus size={14} /> Add set</button>
          </div>
          <input value={entry.note} onChange={(e) => updateNote(entry.id, e.target.value)} placeholder="Optional note" className="input-shell note-input" />
        </CardContent>
      )}
    </Card>
  )
}
