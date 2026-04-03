import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'

export default function AnalyticsView({ analytics, sketchCard, sketchInset, sketchButton, subtleText, settings, suggestion, analyticsExpanded, setAnalyticsExpanded, dark }) {
  function Stat({ title, value }) {
    return <Card className={sketchCard}><CardContent className="p-4"><p className={`text-xs uppercase tracking-wide ${subtleText}`}>{title}</p><p className="text-2xl font-black">{value}</p></CardContent></Card>
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat title="Total workouts" value={analytics.totalWorkouts} />
        <Stat title="Total exercises" value={analytics.totalExercises} />
        <Stat title="Total sets" value={analytics.totalSets} />
      </div>
      {settings.smartMode && (
        <Card className={sketchCard}>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold"><TrendingUp className="h-4 w-4" /> Smart dashboard</div>
            <p className={`text-sm leading-6 ${dark ? 'text-neutral-200' : 'text-neutral-700'}`}>{suggestion}</p>
          </CardContent>
        </Card>
      )}
      <Card className={sketchCard}>
        <CardHeader><CardTitle className="font-black">Top focus areas</CardTitle><CardDescription>The obvious stuff first. Because that’s what people actually check.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {analytics.topMuscles.length === 0 ? <p className={`text-sm ${subtleText}`}>Complete a workout to unlock your dashboard.</p> : analytics.topMuscles.map(([muscle, count]) => (
            <div key={muscle} className={`${sketchInset} flex items-center justify-between p-3`}><span className="font-bold">{muscle}</span><span className="rounded-full border px-2 py-1 text-xs">{count} logs</span></div>
          ))}
        </CardContent>
      </Card>
      <button className={`${sketchButton} w-full`} onClick={() => setAnalyticsExpanded((value) => !value)}><BarChart3 className="mr-2 inline h-4 w-4" />{analyticsExpanded ? 'Hide deep dive' : 'Open deep dive'}</button>
      {analyticsExpanded && (
        <Card className={sketchCard}>
          <CardHeader><CardTitle className="font-black">Exercise deep dive</CardTitle><CardDescription>Your most-used lifts and cardio entries.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {analytics.topExercises.length === 0 ? <p className={`text-sm ${subtleText}`}>No workout history yet.</p> : analytics.topExercises.map(([name, count]) => (
              <div key={name} className={`${sketchInset} flex items-center justify-between p-3`}><span className="font-bold">{name}</span><span className="rounded-full border px-2 py-1 text-xs">{count} times</span></div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
