import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { allItems, findItem, routeByLevel, tenseColumns, tenseGrid, tenseRows } from './data/grammar'
import { useProgress } from './hooks/useProgress'
import type { Exercise, GrammarTable, GrammarTopic, LearningItem } from './types'

type Feedback = { correct: boolean; message: string } | null

const isTopic = (item: LearningItem): item is GrammarTopic => 'structures' in item

const currentRoute = () => window.location.hash || '#/'

const normalize = (value: string) => value.trim().toLowerCase().replace(/[.!?]/g, '').replace(/\s+/g, ' ')

function ExercisePanel({ exercise, topicId, onAttempt }: { exercise: Exercise; topicId: string; onAttempt: (topicId: string, correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [wordOrder, setWordOrder] = useState<number[]>([])
  const [feedback, setFeedback] = useState<Feedback>(null)

  useEffect(() => {
    setSelected(null)
    setTyped('')
    setWordOrder([])
    setFeedback(null)
  }, [exercise.id])

  const submit = (correct: boolean) => {
    setFeedback({ correct, message: exercise.explanation })
    onAttempt(topicId, correct)
  }

  return (
    <section className="practice-card" aria-labelledby={`practice-${exercise.id}`}>
      <div className="section-eyebrow"><span>Practice</span><span className="mini-dot" aria-hidden="true" /></div>
      <h3 id={`practice-${exercise.id}`}>Try the pattern</h3>
      <p className="exercise-prompt">{exercise.prompt}</p>

      {exercise.type === 'choice' && (
        <div className="answer-stack" role="group" aria-label="Answer choices">
          {exercise.options.map((option, index) => (
            <button
              className={`answer-option ${selected === index ? 'selected' : ''}`}
              key={option}
              disabled={feedback !== null}
              onClick={() => { setSelected(index); submit(index === exercise.correctIndex) }}
            >
              <span className="answer-letter">{String.fromCharCode(65 + index)}</span>{option}
            </button>
          ))}
        </div>
      )}

      {exercise.type === 'input' && (
        <form onSubmit={(event) => { event.preventDefault(); if (typed.trim()) submit(exercise.acceptedAnswers.some((answer) => normalize(answer) === normalize(typed))) }}>
          <label className="sr-only" htmlFor={`input-${exercise.id}`}>Your answer</label>
          <div className="input-row">
            <input id={`input-${exercise.id}`} value={typed} disabled={feedback !== null} onChange={(event) => setTyped(event.target.value)} placeholder={exercise.placeholder} autoComplete="off" />
            <button className="button button-dark" disabled={!typed.trim() || feedback !== null}>Check</button>
          </div>
        </form>
      )}

      {exercise.type === 'order' && (
        <div>
          <div className="order-answer" aria-live="polite">{wordOrder.length ? wordOrder.map((index) => exercise.words[index]).join(' ') : 'Build your sentence here.'}</div>
          <div className="word-bank" aria-label="Word bank">
            {exercise.words.map((word, index) => (
              <button key={`${word}-${index}`} disabled={wordOrder.includes(index) || feedback !== null} onClick={() => setWordOrder((current) => [...current, index])}>{word}</button>
            ))}
          </div>
          <div className="practice-actions">
            <button className="text-button" onClick={() => setWordOrder([])} disabled={!wordOrder.length || feedback !== null}>Clear</button>
            <button className="button button-dark" onClick={() => submit(normalize(wordOrder.map((index) => exercise.words[index]).join(' ')) === normalize(exercise.answer))} disabled={!wordOrder.length || feedback !== null}>Check</button>
          </div>
        </div>
      )}

      {feedback && <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`} role="status"><strong>{feedback.correct ? 'Nice work.' : 'Almost.'}</strong> {feedback.message}</div>}
    </section>
  )
}

function TenseGrid({ go }: { go: (route: string) => void }) {
  return (
    <section className="tense-section reveal" aria-labelledby="tense-map-title">
      <div className="section-heading">
        <div><p className="eyebrow">The grammar map</p><h2 id="tense-map-title">Find the time. Find the pattern.</h2></div>
        <p>Click a card to study it. Cards with a dot are ready; outlined cards belong to your next stage.</p>
      </div>
      <div className="table-scroll">
        <div className="tense-grid" role="table" aria-label="English tense map">
          <div className="corner-cell" role="columnheader">Form →<br />Time ↓</div>
          {tenseColumns.map((column) => <div className={`time-heading ${column.toLowerCase()}`} role="columnheader" key={column}>{column}</div>)}
          {tenseRows.flatMap((row) => [
            <div className="form-heading" role="rowheader" key={`${row}-heading`}>{row}</div>,
            ...tenseColumns.map((column) => {
              const item = findItem(tenseGrid[`${column}-${row}`])!
              const available = item.status === 'ready'
              return <button key={`${column}-${row}`} className={`tense-cell ${available ? 'available' : 'upcoming'}`} onClick={() => available && go(`#/topic/${item.id}`)} disabled={!available}>
                <span className="cell-state" aria-label={available ? 'Ready to study' : 'Coming soon'}>{available ? '•' : '○'}</span>
                <span>{isTopic(item) ? item.shortTitle : item.title}</span><small>{item.level}</small>
              </button>
            }),
          ])}
        </div>
      </div>
    </section>
  )
}

function ItemPill({ item, go }: { item: LearningItem; go: (route: string) => void }) {
  const available = item.status === 'ready'
  return <button className={`item-pill ${available ? '' : 'locked'}`} onClick={() => available && go(`#/topic/${item.id}`)} disabled={!available}>
    <span>{item.title}</span><small>{available ? item.category : `${item.level} · coming soon`}</small>
  </button>
}

function Home({ go, completed }: { go: (route: string) => void; completed: number }) {
  const tableItems = allItems.filter((item) => !isTopic(item))
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="hero-dot" />Personal grammar studio</p>
          <h1 id="hero-title">Build the sentence.<br /><em>See the pattern.</em></h1>
          <p className="hero-description">A calm, visual place to understand English grammar one clear pattern at a time.</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => go('#/topic/present-simple')}>Start with Present Simple <span aria-hidden="true">→</span></button><button className="button button-light" onClick={() => document.getElementById('route')?.scrollIntoView({ behavior: 'smooth' })}>View my route</button></div>
        </div>
        <div className="hero-note" aria-label="Today’s study note">
          <span className="paper-pin" aria-hidden="true" />
          <p className="note-label">TODAY’S REMINDER</p>
          <p>Every clear sentence starts with a pattern.</p>
          <div className="note-rule"><span>Subject</span><i>+</i><span>verb</span><i>+</i><span>meaning</span></div>
          <small>{completed ? `${completed} topic${completed === 1 ? '' : 's'} completed` : 'Your first topic is waiting'}</small>
        </div>
      </section>
      <TenseGrid go={go} />
      <section className="dashboard-grid" id="route">
        <div className="route-card reveal">
          <div className="section-heading compact"><div><p className="eyebrow">Study route</p><h2>One step at a time.</h2></div><p>Start at A1, return to the map whenever you need a quick answer.</p></div>
          <div className="route-list">
            {routeByLevel.map((stage) => <article className={`route-stage ${stage.level === 'B1' || stage.level === 'B2' ? 'future-stage' : ''}`} key={stage.level}>
              <div className="route-level">{stage.level}</div>
              <div><h3>{stage.title}</h3><p>{stage.description}</p><div className="pill-row">{stage.ids.map((id) => <ItemPill item={findItem(id)!} go={go} key={id} />)}</div></div>
            </article>)}
          </div>
        </div>
        <aside className="quick-card reveal">
          <p className="eyebrow">Quick tables</p><h2>Need a fast answer?</h2>
          <p className="quick-intro">Open a reference table without leaving your study path.</p>
          <div className="quick-links">{tableItems.map((item) => <ItemPill item={item} go={go} key={item.id} />)}</div>
          <div className="tip-box"><span aria-hidden="true">✦</span><p><strong>Study tip</strong>Say every example out loud once. Your mouth learns the pattern too.</p></div>
        </aside>
      </section>
    </>
  )
}

function FormulaCard({ structure }: { structure: GrammarTopic['structures'][number] }) {
  return <article className={`formula-card ${structure.label.toLowerCase()}`}>
    <p>{structure.label}</p><div className="formula">{structure.formula}</div><small>{structure.translation}</small><blockquote>“{structure.example}”</blockquote>
  </article>
}

function TopicPage({ item, go, onAttempt }: { item: LearningItem; go: (route: string) => void; onAttempt: (topicId: string, correct: boolean) => void }) {
  const [showSpanish, setShowSpanish] = useState(true)
  const related = item.relatedTopicIds.map(findItem).filter((relatedItem): relatedItem is LearningItem => Boolean(relatedItem))
  const available = item.status === 'ready'

  if (!available) return <main className="lesson-shell coming-page"><button className="back-link" onClick={() => go('#/')}><span aria-hidden="true">←</span> Back to the map</button><p className="eyebrow">{item.level} · next stage</p><h1>{item.title}</h1><p>{item.overview}</p><div className="coming-stamp">Coming soon</div></main>

  const topic = isTopic(item) ? item : null
  const table = !topic ? item as GrammarTable : null
  const exercises = topic?.exercises ?? (table?.exercise ? [table.exercise] : [])
  return <main className="lesson-shell">
    <button className="back-link" onClick={() => go('#/')}><span aria-hidden="true">←</span> Back to the map</button>
    <section className="lesson-intro">
      <div><p className="eyebrow">{item.level} · {item.category}</p><h1>{item.title}</h1><p>{item.overview}</p>{showSpanish && <p className="spanish-help">{item.spanishOverview}</p>}</div>
      <button className={`language-toggle ${showSpanish ? 'active' : ''}`} onClick={() => setShowSpanish((value) => !value)} aria-pressed={showSpanish}><span aria-hidden="true">ES</span> Spanish help: {showSpanish ? 'on' : 'off'}</button>
    </section>

    {topic ? <>
      <section className="use-section"><div className="section-heading compact"><div><p className="eyebrow">When to use it</p><h2>Think of this pattern when…</h2></div></div><ul className="use-list">{topic.uses.map((use) => <li key={use}><span aria-hidden="true">✓</span>{use}</li>)}</ul></section>
      <section className="structure-section"><div className="section-heading compact"><div><p className="eyebrow">The structure</p><h2>Build it with care.</h2></div><p className="color-key"><span className="key-subject">Subject</span><span className="key-aux">helper</span><span className="key-verb">main verb</span></p></div><div className="formula-grid">{topic.structures.map((structure) => <FormulaCard structure={structure} key={structure.label} />)}</div></section>
      <section className="examples-section"><div className="section-heading compact"><div><p className="eyebrow">Examples</p><h2>See it in real sentences.</h2></div></div><div className="example-list">{topic.examples.map((example) => <article className="example-card" key={example.english}><p>{example.english}</p>{showSpanish && <small>{example.spanish}</small>}{example.note && <em>{example.note}</em>}</article>)}</div></section>
      <section className="traps-section"><p className="eyebrow">Watch out</p><h2>Common traps</h2><ul>{topic.traps.map((trap) => <li key={trap}><span aria-hidden="true">!</span>{trap}</li>)}</ul></section>
    </> : table && <>
      <section className="reference-table-section"><div className="section-heading compact"><div><p className="eyebrow">Reference table</p><h2>{table.subtitle}</h2></div></div><div className="reference-table-wrap"><table><thead><tr><th>Key</th><th>Meaning / form</th><th>Example</th></tr></thead><tbody>{table.rows.map((row) => <tr key={row.left}><td>{row.left}</td><td>{row.middle}</td><td>{row.right}</td></tr>)}</tbody></table></div></section>
      <section className="traps-section"><p className="eyebrow">Remember</p><h2>Quick notes</h2><ul>{table.notes.map((note) => <li key={note}><span aria-hidden="true">!</span>{note}</li>)}</ul></section>
    </>}

    <div className="practice-grid">{exercises.map((exercise) => <ExercisePanel exercise={exercise} topicId={item.id} onAttempt={onAttempt} key={exercise.id} />)}</div>
    <section className="related-section"><p className="eyebrow">Connect the dots</p><h2>Study next</h2><div className="related-links">{related.map((relatedItem) => <ItemPill key={relatedItem.id} item={relatedItem} go={go} />)}</div></section>
  </main>
}

function ProgressPage({ go, completed, attempts, exportProgress, importProgress, resetProgress }: { go: (route: string) => void; completed: number; attempts: number; exportProgress: () => void; importProgress: (file: File) => Promise<void>; resetProgress: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try { await importProgress(file); setMessage('Progress restored successfully.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not restore this file.') }
    event.target.value = ''
  }
  return <main className="progress-page lesson-shell">
    <button className="back-link" onClick={() => go('#/')}><span aria-hidden="true">←</span> Back to the map</button>
    <section className="progress-hero"><p className="eyebrow">Your study space</p><h1>Your progress stays with you.</h1><p>Everything is stored only in this browser on this computer.</p><div className="progress-numbers"><div><strong>{completed}</strong><span>topics completed</span></div><div><strong>{attempts}</strong><span>practice attempts</span></div><div><strong>{allItems.filter((item) => item.status === 'ready').length}</strong><span>ready topics</span></div></div></section>
    <section className="backup-card"><p className="eyebrow">Backup</p><h2>Keep a copy of your work.</h2><p>Download your progress as a small JSON file and use it to restore your study history later.</p><div className="backup-actions"><button className="button button-dark" onClick={exportProgress}>Export progress</button><button className="button button-light" onClick={() => inputRef.current?.click()}>Import progress</button><input ref={inputRef} type="file" accept="application/json,.json" onChange={handleImport} hidden /></div>{message && <p className="import-message" role="status">{message}</p>}</section>
    <section className="reset-card"><h2>Start over</h2><p>This removes your local practice history from this browser. Export it first if you might want it later.</p><button className="text-button danger" onClick={() => { if (window.confirm('Reset all Grammar Canvas progress on this browser?')) resetProgress() }}>Reset local progress</button></section>
  </main>
}

function App() {
  const [route, setRoute] = useState(currentRoute)
  const { progress, recordAttempt, resetProgress, exportProgress, importProgress, summary } = useProgress()
  const readyCount = allItems.filter((item) => item.status === 'ready').length
  const currentItem = useMemo(() => route.startsWith('#/topic/') ? findItem(route.replace('#/topic/', '')) : undefined, [route])

  useEffect(() => {
    const updateRoute = () => { setRoute(currentRoute()); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [route])

  const go = (nextRoute: string) => {
    if (window.location.hash === nextRoute) { setRoute(nextRoute); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    else window.location.hash = nextRoute
  }

  return <div className="app-shell">
    <header className="site-header"><button className="brand" onClick={() => go('#/')} aria-label="Go to Grammar Canvas home"><span className="brand-mark" aria-hidden="true">G</span><span>Grammar <b>Canvas</b></span></button><nav aria-label="Main navigation"><button className={route === '#/' ? 'active' : ''} onClick={() => go('#/')}>Map</button><button onClick={() => { go('#/'); window.setTimeout(() => document.getElementById('route')?.scrollIntoView({ behavior: 'smooth' }), 80) }}>Route</button><button className={route === '#/progress' ? 'active' : ''} onClick={() => go('#/progress')}>Progress <span className="nav-count">{summary.completed}/{readyCount}</span></button></nav></header>
    {route === '#/progress' ? <ProgressPage go={go} completed={summary.completed} attempts={summary.attempts} exportProgress={exportProgress} importProgress={importProgress} resetProgress={resetProgress} /> : currentItem ? <TopicPage item={currentItem} go={go} onAttempt={recordAttempt} /> : <main><Home go={go} completed={summary.completed} /></main>}
    <footer><span>Grammar Canvas · built for calm, consistent practice.</span><span>Offline · American English</span></footer>
  </div>
}

export default App
