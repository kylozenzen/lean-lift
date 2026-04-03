import React from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, Minus, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'

export default function ExerciseCard({
  entry, sketchCard, sketchInset, sketchButton, subtleText, dark,
  settings, expanded, onToggle, onRemove, quickAddSet,
  updateSet, updateNote, nudgeSet, toggleSetDone,
}) {
  return (
    <Card className={sketchCard}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <button onClick={onToggle} className="flex-1 text-left">
            <CardTitle className="text-lg font-black">{entry.name}</CardTitle>
            <CardDescription>{entry.category} • {entry.muscle} • {entry.sets.length} sets planned</CardDescription>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={onToggle}>{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
            <button onClick={onRemove}><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3">
          {entry.sets.map((set, setIndex) => (
            <div key={`${entry.id}-${setIndex}`} className={`${sketchInset} p-3`}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className={`text-sm font-bold ${subtleText}`}>Set {setIndex + 1}</p>
                <button className={`${sketchButton} px-3 py-1 text-xs`} onClick={() => toggleSetDone(entry.id, setIndex)}>
                  <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> {set.done ? 'Done' : 'Mark done'}
                </button>
              </div>

              {entry.category === 'Strength' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={set.weight} onChange={(e) => updateSet(entry.id, setIndex, 'weight', e.target.value)} placeholder={`Weight (${settings.weightUnit})`} className={`rounded-2xl ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'} px-3 py-2`} />
                    <input value={set.reps} onChange={(e) => updateSet(entry.id, setIndex, 'reps', e.target.value)} placeholder="Reps" className={`rounded-2xl ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'} px-3 py-2`} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className={sketchButton} onClick={() => nudgeSet(entry.id, setIndex, 'weight', 5)}><Plus className="mr-1 inline h-4 w-4" /> 5 lb</button>
                    <button className={sketchButton} onClick={() => nudgeSet(entry.id, setIndex, 'weight', -5)}><Minus className="mr-1 inline h-4 w-4" /> 5 lb</button>
                    <button className={sketchButton} onClick={() => nudgeSet(entry.id, setIndex, 'reps', 1)}><Plus className="mr-1 inline h-4 w-4" /> 1 rep</button>
                    <button className={sketchButton} onClick={() => nudgeSet(entry.id, setIndex, 'reps', -1)}><Minus className="mr-1 inline h-4 w-4" /> 1 rep</button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input value={set.duration} onChange={(e) => updateSet(entry.id, setIndex, 'duration', e.target.value)} placeholder="Minutes" className={`rounded-2xl ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'} px-3 py-2`} />
                  <input value={set.distance} onChange={(e) => updateSet(entry.id, setIndex, 'distance', e.target.value)} placeholder={`Distance (${settings.distanceUnit})`} className={`rounded-2xl ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'} px-3 py-2`} />
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <button className={sketchButton} onClick={() => quickAddSet(entry.id)}><Plus className="mr-2 inline h-4 w-4" /> Add set</button>
          </div>
          <input value={entry.note} onChange={(e) => updateNote(entry.id, e.target.value)} placeholder="Optional note" className={`w-full rounded-2xl ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'} px-3 py-2`} />
        </CardContent>
      )}
    </Card>
  )
}
