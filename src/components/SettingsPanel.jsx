import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { Moon, Palette, Sparkles } from 'lucide-react'

export default function SettingsPanel({ settings, setSettings }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Small switches, big vibes.</CardDescription>
      </CardHeader>
      <CardContent className="section-stack">
        <Row icon={<Moon size={15} />} label="Dark mode">
          <Toggle checked={settings.darkMode} onChange={(checked) => setSettings((prev) => ({ ...prev, darkMode: checked }))} />
        </Row>
        <Row icon={<Palette size={15} />} label="Subtle color coding">
          <Toggle checked={settings.colorCoding} onChange={(checked) => setSettings((prev) => ({ ...prev, colorCoding: checked }))} />
        </Row>
        <Row icon={<Sparkles size={15} />} label="Smart tools">
          <Toggle checked={settings.smartMode} onChange={(checked) => setSettings((prev) => ({ ...prev, smartMode: checked }))} />
        </Row>
      </CardContent>
    </Card>
  )

  function Row({ icon, label, children }) {
    return (
      <div className="card-inset row-between">
        <div className="row-wrap small-text" style={{ fontWeight: 600 }}>
          {icon}
          <span>{label}</span>
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
      className={`toggle-switch ${checked ? 'is-on' : ''}`}
    />
  )
}
