import React, { useEffect, useMemo, useState } from 'react'
import { BarChart3, CheckCircle2, Dumbbell, Home, Save } from 'lucide-react'
import Header from './components/Header'
import SettingsPanel from './components/SettingsPanel'
import HomeView from './components/HomeView'
import WorkoutBuilder from './components/WorkoutBuilder'
import ExerciseCard from './components/ExerciseCard'
import ExerciseHistoryPanel from './components/ExerciseHistoryPanel'
import AnalyticsView from './components/AnalyticsView'
import { EXERCISES, MOVIE_QUOTES, STARTER_STEPS, DEFAULT_SETTINGS } from './lib/exercises'
import { createId, defaultSet, getStored, getStoredTemplates, persist, persistTemplates, STORAGE_KEYS } from './lib/storage'
import { getAnalytics, getExerciseHistory, getExerciseTint, getSuggestion } from './lib/analytics'
import { STARTER_TEMPLATES } from './lib/templates'

export default function App() {
  const [entries, setEntries] = useState([])
  const [history, setHistory] = useState([])
  const [query, setQuery] = useState('')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState('home')
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false)
  const [homeExpanded, setHomeExpanded] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [expandedEntryId, setExpandedEntryId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedExerciseName, setSelectedExerciseName] = useState('')
  const [customTemplates, setCustomTemplates] = useState([])

  useEffect(() => {
    setEntries(getStored(STORAGE_KEYS.current, []))
    setHistory(getStored(STORAGE_KEYS.history, []))
    setSettings(getStored(STORAGE_KEYS.settings, DEFAULT_SETTINGS))
    setCustomTemplates(getStoredTemplates())
  }, [])

  useEffect(() => persist(STORAGE_KEYS.current, entries), [entries])
  useEffect(() => persist(STORAGE_KEYS.history, history), [history])
  useEffect(() => persist(STORAGE_KEYS.settings, settings), [settings])
  useEffect(() => persistTemplates(customTemplates), [customTemplates])

  const filteredExercises = useMemo(() => {
    const lower = query.toLowerCase()
    return EXERCISES.filter((exercise) => `${exercise.name} ${exercise.category} ${exercise.muscle} ${exercise.type}`.toLowerCase().includes(lower))
  }, [query])

  const sortedExercises = useMemo(() => {
    return [...filteredExercises].sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category)
      if (a.muscle !== b.muscle) return a.muscle.localeCompare(b.muscle)
      return a.name.localeCompare(b.name)
    })
  }, [filteredExercises])

  const summary = useMemo(() => {
    const totalExercises = entries.length
    const totalSets = entries.reduce((acc, entry) => acc + entry.sets.length, 0)
    const muscles = [...new Set(entries.map((entry) => entry.muscle))].filter(Boolean)
    return { totalExercises, totalSets, muscles }
  }, [entries])

  const completedExercises = useMemo(
    () => entries.filter((entry) => entry.sets.length > 0 && entry.sets.every((set) => set.done)).length,
    [entries]
  )

  const suggestion = useMemo(() => getSuggestion(history, entries), [history, entries])
  const analytics = useMemo(() => getAnalytics(history), [history])
  const selectedHistory = useMemo(() => getExerciseHistory(history, selectedExerciseName), [history, selectedExerciseName])

  const dark = settings.darkMode
  const pageBg = dark ? 'paper-bg paper-bg-dark' : 'paper-bg'
  const sketchCard = dark ? 'sketch-card sketch-card-dark' : 'sketch-card'
  const sketchInset = dark ? 'sketch-inset sketch-inset-dark' : 'sketch-inset'
  const sketchButton = dark ? 'sketch-button sketch-button-dark' : 'sketch-button'
  const subtleText = dark ? 'subtle-text-dark' : 'subtle-text'

  const addExercise = (exercise) => {
    setEntries((prev) => {
      const existing = prev.find((entry) => entry.name === exercise.name)
      if (existing) return prev
      return [...prev, { id: createId(), ...exercise, sets: [defaultSet()], note: '' }]
    })
    if (!selectedExerciseName) setSelectedExerciseName(exercise.name)
  }

  const applyTemplate = (template) => {
    setEntries((prev) => {
      const existingNames = new Set(prev.map((entry) => entry.name))
      const additions = template.exercises
        .map((exerciseName) => EXERCISES.find((exercise) => exercise.name === exerciseName))
        .filter(Boolean)
        .filter((exercise) => !existingNames.has(exercise.name))
        .map((exercise) => ({ id: createId(), ...exercise, sets: [defaultSet()], note: '' }))

      return [...prev, ...additions]
    })
  }

  const saveCurrentTemplate = (name, exerciseNames) => {
    setCustomTemplates((prev) => {
      const deduped = exerciseNames.filter((exercise, index) => exerciseNames.indexOf(exercise) === index)
      const nextTemplate = { name, exercises: deduped, source: 'custom' }
      const remaining = prev.filter((template) => template.name.toLowerCase() !== name.toLowerCase())
      return [nextTemplate, ...remaining]
    })
  }

  const deleteTemplate = (templateName) => {
    setCustomTemplates((prev) => prev.filter((template) => template.name !== templateName))
  }

  const quickAddSet = (entryId) => {
    setEntries((prev) => prev.map((entry) => {
      if (entry.id !== entryId) return entry
      const lastSet = entry.sets[entry.sets.length - 1] || defaultSet()
      const copied = entry.category === 'Strength'
        ? { ...defaultSet(), weight: lastSet.weight || '', reps: lastSet.reps || '' }
        : { ...defaultSet(), duration: lastSet.duration || '', distance: lastSet.distance || '' }
      return { ...entry, sets: [...entry.sets, copied] }
    }))
  }

  const copyPreviousSetValues = (entryId, setIndex) => {
    if (setIndex < 1) return
    setEntries((prev) => prev.map((entry) => {
      if (entry.id !== entryId) return entry
      const previousSet = entry.sets[setIndex - 1]
      if (!previousSet) return entry

      return {
        ...entry,
        sets: entry.sets.map((set, index) => {
          if (index !== setIndex) return set
          return entry.category === 'Strength'
            ? { ...set, weight: previousSet.weight || '', reps: previousSet.reps || '' }
            : { ...set, duration: previousSet.duration || '', distance: previousSet.distance || '' }
        }),
      }
    }))
  }

  const nudgeSet = (entryId, setIndex, key, delta) => {
    setEntries((prev) => prev.map((entry) => {
      if (entry.id !== entryId) return entry
      return {
        ...entry,
        sets: entry.sets.map((set, index) => {
          if (index !== setIndex) return set
          const current = Number(set[key] || 0)
          const next = Math.max(0, current + delta)
          return { ...set, [key]: next ? String(next) : '' }
        }),
      }
    }))
  }

  const toggleSetDone = (entryId, setIndex) => {
    setEntries((prev) => prev.map((entry) => {
      if (entry.id !== entryId) return entry
      return { ...entry, sets: entry.sets.map((set, index) => index === setIndex ? { ...set, done: !set.done } : set) }
    }))
  }

  const completeSetAndNext = (entryId, setIndex) => {
    let nextExpandedId = entryId

    setEntries((prev) => {
      const currentIndex = prev.findIndex((entry) => entry.id === entryId)
      if (currentIndex < 0) return prev

      const updated = prev.map((entry, index) => {
        if (index !== currentIndex) return entry
        return {
          ...entry,
          sets: entry.sets.map((set, idx) => (idx === setIndex ? { ...set, done: true } : set)),
        }
      })

      const currentEntry = updated[currentIndex]
      const allSetsDone = currentEntry.sets.every((set) => set.done)
      if (allSetsDone && updated[currentIndex + 1]) {
        nextExpandedId = updated[currentIndex + 1].id
      }
      return updated
    })

    setExpandedEntryId(nextExpandedId)
  }

  const updateSet = (entryId, setIndex, key, value) => {
    setEntries((prev) => prev.map((entry) => entry.id === entryId ? {
      ...entry,
      sets: entry.sets.map((set, index) => index === setIndex ? { ...set, [key]: value } : set),
    } : entry))
  }

  const updateNote = (entryId, value) => setEntries((prev) => prev.map((entry) => entry.id === entryId ? { ...entry, note: value } : entry))
  const removeEntry = (entryId) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    if (expandedEntryId === entryId) setExpandedEntryId(null)
  }
  const startWorkout = () => {
    if (!entries.length) return
    setWorkoutStarted(true)
    setShowBuilder(false)
    setExpandedEntryId(entries[0]?.id || null)
  }
  const saveWorkout = () => {
    if (!entries.length) return
    const workout = { id: createId(), date: new Date().toISOString(), entries }
    setHistory((prev) => [workout, ...prev])
    setEntries([])
    setExpandedEntryId(null)
    setWorkoutStarted(false)
    setShowBuilder(false)
    setShowCompletion(true)
    setActiveTab('home')
    setQuoteIndex((prev) => (prev + 1) % MOVIE_QUOTES.length)
  }

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <div className="mx-auto max-w-md px-4 py-6 pb-24 sm:max-w-5xl sm:px-6">
        <Header sketchCard={sketchCard} onToggleSettings={() => setShowSettings((v) => !v)} />

        {showSettings && <SettingsPanel sketchCard={sketchCard} sketchInset={sketchInset} settings={settings} setSettings={setSettings} />}

        {showCompletion && (
          <div className={`${sketchCard} mb-4 p-4 flex items-start gap-3`}>
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-bold">Workout saved.</p>
              <p className={`text-sm ${subtleText}`}>Nice work. Your progress has been logged and your dashboard is updated.</p>
            </div>
            <button className={`${sketchButton} ml-auto`} onClick={() => setShowCompletion(false)}>Dismiss</button>
          </div>
        )}

        {activeTab === 'home' && (
          <HomeView
            analytics={analytics}
            summary={summary}
            sketchCard={sketchCard}
            sketchInset={sketchInset}
            sketchButton={sketchButton}
            subtleText={subtleText}
            dark={dark}
            homeExpanded={homeExpanded}
            setHomeExpanded={setHomeExpanded}
            starterSteps={STARTER_STEPS}
            settings={settings}
            suggestion={suggestion}
            history={history}
            formatDate={(d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            setActiveTab={setActiveTab}
            movieQuote={MOVIE_QUOTES[quoteIndex]}
            nextQuote={() => setQuoteIndex((prev) => (prev + 1) % MOVIE_QUOTES.length)}
          />
        )}

        {activeTab === 'workout' && (
          <div className="space-y-4">
            <WorkoutBuilder
              sketchCard={sketchCard}
              sketchInset={sketchInset}
              sketchButton={sketchButton}
              subtleText={subtleText}
              dark={dark}
              summary={summary}
              workoutStarted={workoutStarted}
              showBuilder={showBuilder}
              setShowBuilder={setShowBuilder}
              entries={entries}
              startWorkout={startWorkout}
              selectedExerciseName={selectedExerciseName}
              setSelectedExerciseName={setSelectedExerciseName}
              query={query}
              setQuery={setQuery}
              sortedExercises={sortedExercises}
              settings={settings}
              getExerciseTint={getExerciseTint}
              addExercise={addExercise}
              starterTemplates={STARTER_TEMPLATES}
              customTemplates={customTemplates}
              applyTemplate={applyTemplate}
              saveCurrentTemplate={saveCurrentTemplate}
              deleteTemplate={deleteTemplate}
            />

            {selectedExerciseName && (
              <ExerciseHistoryPanel
                selectedExerciseName={selectedExerciseName}
                selectedHistory={selectedHistory}
                sketchCard={sketchCard}
                sketchInset={sketchInset}
                dark={dark}
                subtleText={subtleText}
                setSelectedExerciseName={setSelectedExerciseName}
              />
            )}

            {entries.length === 0 ? (
              <div className={`${sketchCard} p-8 text-center ${subtleText}`}>No exercises added yet. Tap Build today’s workout and add 1–3 movements to start.</div>
            ) : (
              <>
                {workoutStarted && (
                  <div className={`${sketchCard} px-4 py-3 text-sm font-bold`}>
                    {completedExercises} of {entries.length} exercises completed
                  </div>
                )}
                {entries.map((entry) => (
                  <ExerciseCard
                    key={entry.id}
                    entry={entry}
                    sketchCard={sketchCard}
                    sketchInset={sketchInset}
                    sketchButton={sketchButton}
                    subtleText={subtleText}
                    dark={dark}
                    settings={settings}
                    expanded={expandedEntryId === entry.id}
                    onToggle={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                    onRemove={() => removeEntry(entry.id)}
                    quickAddSet={quickAddSet}
                    updateSet={updateSet}
                    updateNote={updateNote}
                    nudgeSet={nudgeSet}
                    toggleSetDone={toggleSetDone}
                    copyPreviousSetValues={copyPreviousSetValues}
                    completeSetAndNext={completeSetAndNext}
                  />
                ))}
                {workoutStarted && <button onClick={saveWorkout} className={`${sketchButton} h-12 w-full text-base`}><Save className="mr-2 inline h-4 w-4" /> Finish workout</button>}
              </>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            sketchCard={sketchCard}
            sketchInset={sketchInset}
            sketchButton={sketchButton}
            subtleText={subtleText}
            settings={settings}
            suggestion={suggestion}
            analyticsExpanded={analyticsExpanded}
            setAnalyticsExpanded={setAnalyticsExpanded}
            dark={dark}
          />
        )}

        <div className={`fixed bottom-0 left-0 right-0 bottom-nav ${dark ? 'bottom-nav-dark' : ''} backdrop-blur`}>
          <div className="mx-auto grid max-w-md grid-cols-3 px-4 py-3 sm:max-w-5xl sm:px-6">
            <TabButton active={activeTab === 'home'} subtleText={subtleText} dark={dark} onClick={() => setActiveTab('home')}><Home className="h-5 w-5" /><span>Home</span></TabButton>
            <TabButton active={activeTab === 'workout'} subtleText={subtleText} dark={dark} onClick={() => setActiveTab('workout')}><Dumbbell className="h-5 w-5" /><span>Workout</span></TabButton>
            <TabButton active={activeTab === 'analytics'} subtleText={subtleText} dark={dark} onClick={() => setActiveTab('analytics')}><BarChart3 className="h-5 w-5" /><span>Analytics</span></TabButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, subtleText, dark, onClick, children }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 text-xs font-bold ${active ? (dark ? 'tab-active-dark' : 'tab-active') : subtleText}`}>
      {children}
    </button>
  )
}
