import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { RefreshCw } from 'lucide-react'

export default function HomeView({
  analytics, summary, sketchCard, sketchInset, sketchButton, subtleText,
  dark, homeExpanded, setHomeExpanded, starterSteps, settings, suggestion,
  history, formatDate, setActiveTab, movieQuote, nextQuote,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat title="Workouts" value={analytics.totalWorkouts} />
        <Stat title="Sets" value={analytics.totalSets} />
        <Stat title="Focus" value={summary.muscles[0] || 'Ready'} />
      </div>

      <Card className={sketchCard}>
        <button onClick={() => setHomeExpanded((prev) => !prev)} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-black">Getting started</CardTitle>
                <CardDescription>Your clean setup, guidance, and recent activity.</CardDescription>
              </div>
              <span className={subtleText}>{homeExpanded ? '−' : '+'}</span>
            </div>
          </CardHeader>
        </button>
        {homeExpanded && (
          <CardContent className="space-y-3 pt-0">
            {starterSteps.map((step, index) => (
              <div key={step} className={`${sketchInset} flex items-start gap-3 p-3`}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${dark ? 'border-2 border-neutral-100 bg-neutral-800 text-neutral-100' : 'border-2 border-neutral-900 bg-[#fff7cc] text-neutral-900'} text-sm font-black`}>{index + 1}</div>
                <p className={`pt-1 text-sm ${dark ? 'text-neutral-200' : 'text-neutral-700'}`}>{step}</p>
              </div>
            ))}
            {settings.smartMode && <p className={`${sketchInset} p-3 text-sm ${dark ? 'text-neutral-200' : 'text-neutral-700'}`}>{suggestion}</p>}
            <div className="space-y-2">
              <p className={`text-sm font-bold ${dark ? 'text-neutral-200' : 'text-neutral-700'}`}>Recent activity</p>
              {history.length === 0 ? <p className={`text-sm ${subtleText}`}>No workouts saved yet.</p> : history.slice(0, 3).map((workout) => (
                <div key={workout.id} className={`${sketchInset} p-3`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold">{formatDate(workout.date)}</p>
                    <span className="rounded-full border px-2 py-1 text-xs">{workout.entries.length} exercises</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button className={sketchButton} onClick={() => setActiveTab('workout')}>Build today’s workout</button>
              <button className={sketchButton} onClick={() => setActiveTab('analytics')}>View analytics</button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className={sketchCard}>
        <CardHeader>
          <CardTitle className="text-lg font-black">Movie quote mode</CardTitle>
          <CardDescription>Notebook energy, blockbuster pep talk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`text-sm leading-6 ${dark ? 'text-neutral-200' : 'text-neutral-700'}`}>{movieQuote}</p>
          <button className={sketchButton} onClick={nextQuote}><RefreshCw className="mr-2 inline h-4 w-4" /> New quote</button>
        </CardContent>
      </Card>
    </div>
  )

  function Stat({ title, value }) {
    return (
      <Card className={sketchCard}>
        <CardContent className="p-4">
          <p className={`text-[11px] uppercase tracking-wide ${subtleText}`}>{title}</p>
          <p className="text-2xl font-black">{value}</p>
        </CardContent>
      </Card>
    )
  }
}
