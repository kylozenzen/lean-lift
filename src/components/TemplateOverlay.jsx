import React, { useMemo, useState } from 'react'
import { Bookmark, Save, Trash2, X } from 'lucide-react'

export default function TemplateOverlay({
  open,
  onClose,
  entries,
  starterTemplates,
  customTemplates,
  onApplyTemplate,
  onSaveCurrentTemplate,
  onDeleteTemplate,
}) {
  const [templateName, setTemplateName] = useState('')

  const currentPlanNames = useMemo(() => entries.map((entry) => entry.name), [entries])
  const canSave = entries.length > 0 && templateName.trim().length > 0

  if (!open) return null

  const handleSaveTemplate = () => {
    if (!canSave) return
    onSaveCurrentTemplate(templateName.trim(), currentPlanNames)
    setTemplateName('')
  }

  const handleApplyTemplate = (template) => {
    onApplyTemplate(template)
    onClose()
  }

  return (
    <div className="overlay-scrim" role="presentation" onClick={onClose}>
      <section
        className="template-overlay card-shell"
        role="dialog"
        aria-modal="true"
        aria-label="Workout templates"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="card-header row-between">
          <div>
            <p className="card-title" style={{ marginBottom: '0.2rem' }}>Templates</p>
            <p className="card-description">Load a split or save today’s plan for next time.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close templates">
            <X size={16} />
          </button>
        </div>

        <div className="card-content section-stack template-overlay-content">
          <div className="card-inset section-stack">
            <p className="label-text" style={{ margin: 0 }}>Starter templates</p>
            <div className="list-stack">
              {starterTemplates.map((template) => (
                <button
                  key={template.name}
                  className="secondary-button full-width template-row"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <span className="row-wrap" style={{ alignItems: 'center', gap: '0.4rem' }}>
                    <Bookmark size={14} />
                    {template.name}
                  </span>
                  <span className="small-text muted-text">{template.exercises.length} ex</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-inset section-stack">
            <p className="label-text" style={{ margin: 0 }}>Save current plan</p>
            <div className="row-wrap">
              <input
                value={templateName}
                onChange={(event) => setTemplateName(event.target.value)}
                placeholder={entries.length ? 'Template name' : 'Add exercises to save'}
                className="input-shell"
                style={{ flex: 1, minWidth: '11rem' }}
                disabled={!entries.length}
              />
              <button className="secondary-button" disabled={!canSave} onClick={handleSaveTemplate}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>

          <div className="card-inset section-stack">
            <p className="label-text" style={{ margin: 0 }}>Your templates</p>
            {customTemplates.length === 0 ? (
              <p className="small-text muted-text" style={{ margin: 0 }}>No custom templates yet.</p>
            ) : (
              <div className="list-stack">
                {customTemplates.map((template) => (
                  <div key={template.name} className="template-custom-row">
                    <button className="secondary-button template-row" onClick={() => handleApplyTemplate(template)}>
                      <span>{template.name}</span>
                      <span className="small-text muted-text">{template.exercises.length} ex</span>
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => onDeleteTemplate(template.name)}
                      aria-label={`Delete ${template.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
