import React, { useMemo, useState } from 'react'
import { Bookmark, Save, Trash2 } from 'lucide-react'

export default function TemplatePicker({
  sketchInset,
  sketchButton,
  subtleText,
  dark,
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
    <div className={`${sketchInset} space-y-3 p-3`}>
      <div>
        <p className="text-sm font-bold">Templates</p>
        <p className={`text-xs ${subtleText}`}>Fast-load splits or save your own recurring plan.</p>
      </div>

      <div>
        <p className={`mb-2 text-[11px] font-bold uppercase tracking-wide ${subtleText}`}>Starter templates</p>
        <div className="grid grid-cols-2 gap-2">
          {starterTemplates.map((template) => (
            <button key={template.name} className={`${sketchButton} text-left text-sm`} onClick={() => onApplyTemplate(template)}>
              <Bookmark className="mr-1 inline h-4 w-4" /> {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className={`text-[11px] font-bold uppercase tracking-wide ${subtleText}`}>Save current plan</p>
        <div className="flex gap-2">
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name"
            className={`flex-1 rounded-2xl px-3 py-2 ${dark ? 'border-2 border-neutral-100 bg-[#111]' : 'border-2 border-neutral-900 bg-white'}`}
          />
          <button className={sketchButton} disabled={!canSave} onClick={handleSave}>
            <Save className="mr-1 inline h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {customTemplates.length > 0 && (
        <div>
          <p className={`mb-2 text-[11px] font-bold uppercase tracking-wide ${subtleText}`}>Your templates</p>
          <div className="space-y-2">
            {customTemplates.map((template) => (
              <div key={template.name} className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 ${dark ? 'border-neutral-100 bg-[#121212]' : 'border-neutral-900 bg-white'}`}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{template.name}</p>
                  <p className={`truncate text-xs ${subtleText}`}>{template.exercises.length} exercises</p>
                </div>
                <button className={sketchButton} onClick={() => onApplyTemplate(template)}>Apply</button>
                <button className={sketchButton} onClick={() => onDeleteTemplate(template.name)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
