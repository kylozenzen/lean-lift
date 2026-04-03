import React from 'react'
import { Plus, Play, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import TemplatePicker from './TemplatePicker'

export default function WorkoutBuilder({
  summary,
  workoutStarted,
  showBuilder,
  setShowBuilder,
  entries,
  startWorkout,
  selectedExerciseName,
  setSelectedExerciseName,
  query,
  setQuery,
  sortedExercises,
  settings,
  getExerciseTint,
  addExercise,
  starterTemplates,
  customTemplates,
  applyTemplate,
  saveCurrentTemplate,
  deleteTemplate,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workoutStarted ? 'Workout in progress' : 'Build today’s workout'}</CardTitle>
        <CardDescription>{workoutStarted ? 'Logging mode is live. Stay focused and finish strong.' : 'Tap + to build your plan. Keep it light until you actually start.'}</CardDescription>
      </CardHeader>
      <CardContent className="section-stack">
        <div className="stat-grid-3">
          <Metric title="Exercises" value={summary.totalExercises} />
          <Metric title="Sets" value={summary.totalSets} />
          <Metric title="Focus" value={summary.muscles[0] || 'Not set'} />
        </div>

        {!workoutStarted && (
          <>
            <TemplatePicker
              entries={entries}
              starterTemplates={starterTemplates}
              customTemplates={customTemplates}
              onApplyTemplate={applyTemplate}
              onSaveCurrentTemplate={saveCurrentTemplate}
              onDeleteTemplate={deleteTemplate}
            />

            <div className="row-wrap">
              <button className="secondary-button" onClick={() => setShowBuilder((prev) => !prev)}>{showBuilder ? 'Hide builder' : 'Build today’s workout'}</button>
              {entries.length > 0 && <button className="primary-button" onClick={startWorkout}><Play size={14} /> Start workout</button>}
            </div>

            {entries.length > 0 && (
              <div className="card-inset">
                <p className="label-text" style={{ margin: '0 0 0.4rem' }}>Today’s plan</p>
                <div className="grid-list-2" style={{ maxHeight: '10rem', overflowY: 'auto' }}>
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedExerciseName(entry.name)}
                      className={`${selectedExerciseName === entry.name ? 'primary-button' : 'secondary-button'} full-width`}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {entry.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showBuilder && (
              <div className="card-inset section-stack">
                <div className="search-wrap">
                  <Search size={15} className="search-icon muted-text" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search exercises..." className="input-shell search-input" />
                </div>

                <div className="grid-list-2" style={{ maxHeight: '24rem', overflowY: 'auto' }}>
                  {sortedExercises.map((exercise) => {
                    const alreadyAdded = entries.some((entry) => entry.name === exercise.name)
                    const tint = getExerciseTint(exercise, settings.colorCoding)
                    return (
                      <div key={exercise.name} className={`card-inset ${tint}`}>
                        <p style={{ margin: 0, fontWeight: 700, lineHeight: 1.25 }}>{exercise.name}</p>
                        <p className="small-text muted-text" style={{ margin: '0.25rem 0 0' }}>{exercise.category} • {exercise.muscle}</p>
                        <button className="secondary-button full-width" style={{ marginTop: '0.5rem' }} disabled={alreadyAdded} onClick={() => addExercise(exercise)}>
                          <Plus size={14} /> {alreadyAdded ? 'Added' : 'Add'}
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
      <div className="card-inset stat-card">
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    )
  }
}
