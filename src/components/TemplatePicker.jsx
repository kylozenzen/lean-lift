import React, { useMemo, useState } from 'react'
import { Bookmark, Save, Trash2 } from 'lucide-react'

export default function TemplatePicker({
  entries,
  starterTemplates,
  customTemplates,
  onApplyTemplate,
  onSaveCurrentTemplate,
  onDeleteTemplate,
}) {
  const [templateName, setTemplateName] = useState('')

  const canSave = templateName.trim().length > 0 && entries.length > 0
  const currentPlanNames = useMemo(() => entries.map((entry) => entry.name), [entries])

  const handleSave = () => {
    if (!canSave) return
    onSaveCurrentTemplate(templateName.trim(), currentPlanNames)
    setTemplateName('')
  }

  return (
    <div className="card-inset section-stack">
      <div>
        <p className="small-text" style={{ margin: 0, fontWeight: 700 }}>Templates</p>
        <p className="small-text muted-text" style={{ margin: '0.18rem 0 0' }}>Fast-load splits or save your own recurring plan.</p>
      </div>

      <div>
        <p className="label-text" style={{ margin: '0 0 0.4rem' }}>Starter templates</p>
        <div className="grid-list-2">
          {starterTemplates.map((template) => (
            <button key={template.name} className="secondary-button" onClick={() => onApplyTemplate(template)}>
              <Bookmark size={14} /> {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="section-stack">
        <p className="label-text" style={{ margin: 0 }}>Save current plan</p>
        <div className="row-wrap">
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name"
            className="input-shell"
            style={{ flex: 1, minWidth: '11rem' }}
          />
          <button className="secondary-button" disabled={!canSave} onClick={handleSave}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      {customTemplates.length > 0 && (
        <div>
          <p className="label-text" style={{ margin: '0 0 0.4rem' }}>Your templates</p>
          <div className="list-stack">
            {customTemplates.map((template) => (
              <div key={template.name} className="card-inset row-between">
                <div style={{ minWidth: 0 }}>
                  <p className="small-text" style={{ margin: 0, fontWeight: 700 }}>{template.name}</p>
                  <p className="small-text muted-text" style={{ margin: '0.15rem 0 0' }}>{template.exercises.length} exercises</p>
                </div>
                <div className="row-wrap" style={{ justifyContent: 'flex-end' }}>
                  <button className="secondary-button" onClick={() => onApplyTemplate(template)}>Apply</button>
                  <button className="secondary-button" onClick={() => onDeleteTemplate(template.name)} aria-label={`Delete ${template.name}`}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
