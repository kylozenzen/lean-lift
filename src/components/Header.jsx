import React from 'react'
import { CircleUserRound, Settings } from 'lucide-react'

export default function Header({ onToggleSettings }) {
  return (
    <div className="app-header">
      <h1 className="brand-title">LeanLift</h1>
      <div className="row-wrap">
        <button onClick={onToggleSettings} className="icon-button" aria-label="Open settings">
          <Settings size={18} />
        </button>
        <button className="icon-button" aria-label="Profile placeholder">
          <CircleUserRound size={18} />
        </button>
      </div>
    </div>
  )
}
