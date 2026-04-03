import React from 'react'
import { CircleUserRound, Settings } from 'lucide-react'

export default function Header({ sketchCard, onToggleSettings }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ fontFamily: '"Trebuchet MS", "Comic Sans MS", ui-rounded, system-ui, sans-serif', letterSpacing: '-0.02em' }}
        >
          LeanLift
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggleSettings} className={`${sketchCard} flex h-11 w-11 items-center justify-center`} aria-label="Open settings">
          <Settings className="h-5 w-5" />
        </button>
        <button className={`${sketchCard} flex h-11 w-11 items-center justify-center`} aria-label="Profile placeholder">
          <CircleUserRound className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
