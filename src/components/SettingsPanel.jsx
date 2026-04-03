import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { Moon, Palette, Sparkles } from 'lucide-react'

export default function SettingsPanel({ sketchCard, sketchInset, settings, setSettings }) {
  return (
    <Card className={`${sketchCard} mb-4`}>
      <CardHeader>
        <CardTitle className="text-lg font-black">Settings</CardTitle>
        <CardDescription>Small switches, big vibes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row icon={<Moon className="h-4 w-4" />} label="Dark mode">
          <Toggle checked={settings.darkMode} onChange={(checked) => setSettings((prev) => ({ ...prev, darkMode: checked }))} />
        </Row>
        <Row icon={<Palette className="h-4 w-4" />} label="Subtle color coding">
          <Toggle checked={settings.colorCoding} onChange={(checked) => setSettings((prev) => ({ ...prev, colorCoding: checked }))} />
        </Row>
        <Row icon={<Sparkles className="h-4 w-4" />} label="Smart tools">
          <Toggle checked={settings.smartMode} onChange={(checked) => setSettings((prev) => ({ ...prev, smartMode: checked }))} />
        </Row>
      </CardContent>
    </Card>
  )

  function Row({ icon, label, children }) {
    return (
      <div className={`${sketchInset} flex items-center justify-between p-3`}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        {children}
      </div>
    )
  }
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full border-2 ${checked ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'} border-current`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-current transition-all ${checked ? 'left-6' : 'left-0.5'}`}
        style={{ backgroundColor: checked ? '#fff' : '#111' }}
      />
    </button>
  )
}
