import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'

export default function AnalyticsView({ analytics, settings, suggestion, analyticsExpanded, setAnalyticsExpanded }) {
  function Stat({ title, value }) {
    return (
      <div className="card-shell card-content stat-card">
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    )
  }

  return (
    <div className="section-stack">
      <div className="stat-grid-3">
        <Stat title="Total workouts" value={analytics.totalWorkouts} />
        <Stat title="Total exercises" value={analytics.totalExercises} />
        <Stat title="Total sets" value={analytics.totalSets} />
      </div>

      {settings.smartMode && (
        <Card>
          <CardContent>
            <div className="row-wrap small-text" style={{ fontWeight: 700 }}><TrendingUp size={14} /> Smart dashboard</div>
            <p className="small-text muted-text" style={{ lineHeight: 1.5, marginBottom: 0 }}>{suggestion}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Top focus areas</CardTitle>
          <CardDescription>The obvious stuff first. Because that’s what people actually check.</CardDescription>
        </CardHeader>
        <CardContent className="section-stack">
          {analytics.topMuscles.length === 0 ? (
            <p className="small-text muted-text" style={{ margin: 0 }}>Complete a workout to unlock your dashboard.</p>
          ) : analytics.topMuscles.map(([muscle, count]) => (
            <div key={muscle} className="card-inset row-between"><span style={{ fontWeight: 600 }}>{muscle}</span><span className="badge-shell">{count} logs</span></div>
          ))}
        </CardContent>
      </Card>

      <button className="secondary-button full-width" onClick={() => setAnalyticsExpanded((value) => !value)}>
        <BarChart3 size={14} /> {analyticsExpanded ? 'Hide deep dive' : 'Open deep dive'}
      </button>

      {analyticsExpanded && (
        <Card>
          <CardHeader>
            <CardTitle>Exercise deep dive</CardTitle>
            <CardDescription>Your most-used lifts and cardio entries.</CardDescription>
          </CardHeader>
          <CardContent className="section-stack">
            {analytics.topExercises.length === 0 ? (
              <p className="small-text muted-text" style={{ margin: 0 }}>No workout history yet.</p>
            ) : analytics.topExercises.map(([name, count]) => (
              <div key={name} className="card-inset row-between"><span style={{ fontWeight: 600 }}>{name}</span><span className="badge-shell">{count} times</span></div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
