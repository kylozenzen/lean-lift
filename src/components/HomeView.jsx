import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { RefreshCw } from 'lucide-react'

export default function HomeView({
  analytics,
  summary,
  homeExpanded,
  setHomeExpanded,
  starterSteps,
  settings,
  suggestion,
  history,
  formatDate,
  setActiveTab,
  movieQuote,
  nextQuote,
}) {
  return (
    <div className="section-stack">
      <div className="stat-grid-3">
        <Stat title="Workouts" value={analytics.totalWorkouts} />
        <Stat title="Sets" value={analytics.totalSets} />
        <Stat title="Focus" value={summary.muscles[0] || 'Ready'} />
      </div>

      <Card>
        <button onClick={() => setHomeExpanded((prev) => !prev)} className="full-width" style={{ textAlign: 'left', background: 'transparent', border: 0, padding: 0 }}>
          <CardHeader className="card-header-tight">
            <div className="row-between">
              <div>
                <CardTitle>Getting started</CardTitle>
                <CardDescription>Your clean setup, guidance, and recent activity.</CardDescription>
              </div>
              <span className="muted-text">{homeExpanded ? '−' : '+'}</span>
            </div>
          </CardHeader>
        </button>

        {homeExpanded && (
          <CardContent className="card-content-tight section-stack">
            {starterSteps.map((step, index) => (
              <div key={step} className="card-inset row-wrap" style={{ alignItems: 'flex-start' }}>
                <div className="badge-shell" style={{ minWidth: '1.7rem', fontWeight: 700 }}>{index + 1}</div>
                <p className="small-text" style={{ margin: '0.15rem 0 0' }}>{step}</p>
              </div>
            ))}

            {settings.smartMode && <p className="card-inset small-text" style={{ margin: 0 }}>{suggestion}</p>}

            <div>
              <p className="small-text" style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>Recent activity</p>
              {history.length === 0 ? (
                <p className="small-text muted-text" style={{ margin: 0 }}>No workouts saved yet.</p>
              ) : (
                <div className="list-stack">
                  {history.slice(0, 3).map((workout) => (
                    <div key={workout.id} className="card-inset row-between">
                      <p style={{ margin: 0, fontWeight: 600 }}>{formatDate(workout.date)}</p>
                      <span className="badge-shell">{workout.entries.length} exercises</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="row-wrap">
              <button className="primary-button" onClick={() => setActiveTab('workout')}>Build today’s workout</button>
              <button className="secondary-button" onClick={() => setActiveTab('analytics')}>View analytics</button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movie quote mode</CardTitle>
          <CardDescription>Notebook energy, blockbuster pep talk.</CardDescription>
        </CardHeader>
        <CardContent className="section-stack">
          <p className="small-text" style={{ lineHeight: 1.55, margin: 0 }}>{movieQuote}</p>
          <button className="secondary-button" onClick={nextQuote}><RefreshCw size={14} /> New quote</button>
        </CardContent>
      </Card>
    </div>
  )

  function Stat({ title, value }) {
    return (
      <div className="card-shell stat-card card-content">
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    )
  }
}
