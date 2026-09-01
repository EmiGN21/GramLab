import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { allItems, categoryMeta, findItem, relatedBacklinks, roleMeta, searchCatalog, tenseColumns, tenseGrid, tenseRows } from './data/catalog'
import { contentIssues } from './data/integrity'
import { irregularVerbs } from './data/verbs'
import { useProgress } from './hooks/useProgress'
import { useTheme } from './hooks/useTheme'
import type { ContentToken, Exercise, GrammarCategory, GrammarTable, GrammarTopic, LearningItem, ReferenceSection, SearchResult, TermLink } from './types'

type Go = (route: string) => void
type Feedback = { correct: boolean; message: string } | null

const isTopic = (item: LearningItem): item is GrammarTopic => 'structures' in item
const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/[.!?]/g, '').replace(/\s+/g, ' ')

function SpanishHint({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`es-subtitle ${className}`.trim()} lang="es">{children}</span>
}

const readRoute = () => {
  const raw = (window.location.hash || '#/').slice(1)
  const [path, query = ''] = raw.split('?')
  return { hash: `#${raw}`, path, params: new URLSearchParams(query) }
}

const routeForTerm = (term: TermLink) => term.kind === 'verb'
  ? `#/verbs?verb=${encodeURIComponent(term.targetId)}`
  : `#/topic/${term.targetId}${term.sectionId ? `?section=${encodeURIComponent(term.sectionId)}` : ''}`

function SearchBox({ go, compact = false }: { go: Go; compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = useMemo(() => searchCatalog(query), [query])
  const choose = (result: SearchResult) => { setQuery(''); setOpen(false); go(result.route) }
  const submit = (event: FormEvent) => { event.preventDefault(); if (results[0]) choose(results[0]) }

  return <div className={`search-wrap ${compact ? 'compact' : ''}`}>
    <form className="global-search" role="search" onSubmit={submit}>
      <span aria-hidden="true">⌕</span>
      <label className="sr-only" htmlFor={compact ? 'header-search' : 'hero-search'}>Search GramLab</label>
      <input id={compact ? 'header-search' : 'hero-search'} value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true) }} placeholder={compact ? 'Search at, went, present continuous…' : 'Ask a question: at, written, some, past continuous…'} autoComplete="off" />
      {query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
    </form>
    {open && query && <div className="search-results" role="listbox">
      {results.length ? results.map((result) => <button type="button" key={result.id} onClick={() => choose(result)} role="option">
        <span className={`result-kind ${result.kind}`}>{result.kind}</span>
        <span><strong>{result.title}</strong><small>{result.subtitle}</small></span>
        <b aria-hidden="true">↗</b>
      </button>) : <p>No result found. <SpanishHint>Prueba otra forma o significado.</SpanishHint></p>}
    </div>}
  </div>
}

function RoleLegend() {
  return <div className="role-legend" aria-label="Grammar category legend">
    {roleMeta.map((role) => <span className={`role-chip role-${role.id}`} key={role.id}><i aria-hidden="true" /><span>{role.label}<small>{role.spanishLabel}</small></span><small>{role.example}</small></span>)}
  </div>
}

function RichSentence({ tokens, go }: { tokens: ContentToken[]; go: Go }) {
  return <span className="rich-sentence">{tokens.map((entry, index) => {
    const roleLabel = entry.role ? roleMeta.find((role) => role.id === entry.role)?.label : undefined
    return entry.link
      ? <button className={entry.role ? `word-token role-${entry.role}` : 'term-link'} title={roleLabel} aria-label={roleLabel ? `${entry.text}, ${roleLabel}; open reference` : `Open ${entry.text}`} key={`${entry.text}-${index}`} onClick={() => go(routeForTerm(entry.link!))}>{entry.text}</button>
      : <span className={entry.role ? `word-token role-${entry.role}` : undefined} title={roleLabel} aria-label={roleLabel ? `${entry.text}, ${roleLabel}` : undefined} key={`${entry.text}-${index}`}>{entry.text}</span>
  })}</span>
}

function ExercisePanel({ exercise, topicId, onAttempt }: { exercise: Exercise; topicId: string; onAttempt: (id: string, correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [wordOrder, setWordOrder] = useState<number[]>([])
  const [feedback, setFeedback] = useState<Feedback>(null)
  useEffect(() => { setSelected(null); setTyped(''); setWordOrder([]); setFeedback(null) }, [exercise.id])
  const submit = (correct: boolean) => { setFeedback({ correct, message: exercise.explanation }); onAttempt(topicId, correct) }

  return <section className="practice-card">
    <p className="eyebrow">Quick practice</p><h3>{exercise.prompt}</h3>
    {exercise.type === 'choice' && <div className="answer-stack">{exercise.options.map((option, index) => <button key={option} disabled={Boolean(feedback)} className={selected === index ? 'selected' : ''} onClick={() => { setSelected(index); submit(index === exercise.correctIndex) }}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>}
    {exercise.type === 'input' && <form className="input-row" onSubmit={(event) => { event.preventDefault(); if (typed.trim()) submit(exercise.acceptedAnswers.some((answer) => normalizeAnswer(answer) === normalizeAnswer(typed))) }}><input value={typed} onChange={(event) => setTyped(event.target.value)} placeholder={exercise.placeholder} disabled={Boolean(feedback)} /><button className="primary-button" disabled={!typed.trim() || Boolean(feedback)}>Check</button></form>}
    {exercise.type === 'order' && <div><div className="order-answer">{wordOrder.length ? wordOrder.map((index) => exercise.words[index]).join(' ') : 'Build the sentence here.'}</div><div className="word-bank">{exercise.words.map((word, index) => <button key={`${word}-${index}`} disabled={wordOrder.includes(index) || Boolean(feedback)} onClick={() => setWordOrder((current) => [...current, index])}>{word}</button>)}</div><div className="practice-actions"><button onClick={() => setWordOrder([])} disabled={!wordOrder.length || Boolean(feedback)}>Clear</button><button className="primary-button" onClick={() => submit(normalizeAnswer(wordOrder.map((index) => exercise.words[index]).join(' ')) === normalizeAnswer(exercise.answer))} disabled={!wordOrder.length || Boolean(feedback)}>Check</button></div></div>}
    {feedback && <p className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`} role="status"><strong>{feedback.correct ? 'Correct.' : 'Almost.'}</strong> {feedback.message}</p>}
  </section>
}

function TenseMatrix({ go }: { go: Go }) {
  return <section className="panel tense-panel" aria-labelledby="tense-title">
    <div className="section-heading"><div><p className="eyebrow">Tense map</p><h2 id="tense-title">12 tenses in one view</h2><SpanishHint>12 tiempos en una sola vista</SpanishHint></div><p>Levels guide you; they never lock content.<SpanishHint>Los niveles orientan; nunca bloquean contenido.</SpanishHint></p></div>
    <div className="table-scroll"><div className="tense-matrix" role="table" aria-label="Verb tense matrix">
      <div className="matrix-corner" role="columnheader">Form →<br />Time ↓</div>
      {tenseColumns.map((column) => <div role="columnheader" className={`matrix-time ${column.toLowerCase()}`} key={column}>{column}</div>)}
      {tenseRows.flatMap((row) => [<div className="matrix-form" role="rowheader" key={`${row}-head`}>{row}</div>, ...tenseColumns.map((column) => {
        const item = findItem(tenseGrid[`${column}-${row}`])!
        return <button key={`${column}-${row}`} className="tense-cell" onClick={() => go(`#/topic/${item.id}`)}><span>{isTopic(item) ? item.shortTitle : item.title}</span><small>{item.level} · open</small></button>
      })])}
    </div></div>
  </section>
}

function Home({ go }: { go: Go }) {
  const featured = ['prepositions', 'pronouns', 'verbs', 'present-perfect'].map(findItem).filter((item): item is LearningItem => Boolean(item))
  const quick = [
    { label: 'When do I use at?', route: '#/topic/prepositions?section=at' }, { label: 'went → go', route: '#/verbs?verb=go' },
    { label: 'to or for', route: '#/topic/to-for' }, { label: 'present continuous', route: '#/topic/present-continuous' },
  ]
  return <main className="editorial-home">
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">A visual grammar atlas</p>
        <h1>English,<br /><em>mapped.</em></h1>
        <SpanishHint>El inglés, trazado como un mapa.</SpanishHint>
        <p>Find the rule you need, then follow its connections through the language.<SpanishHint>Encuentra la regla que necesitas y sigue sus conexiones a través del idioma.</SpanishHint></p>
        <SearchBox go={go} />
        <div className="quick-queries">{quick.map((item) => <button key={item.label} onClick={() => go(item.route)}>{item.label}<span>↗</span></button>)}</div>
      </div>
      <aside className="atlas-specimen" aria-label="Preposition reference specimen">
        <div className="specimen-meta"><span>REFERENCE / PREPOSITION</span><span>A1</span></div>
        <button className="specimen-word" onClick={() => go('#/topic/prepositions?section=at')}>at</button>
        <p>A precise point in time or place.</p>
        <SpanishHint>Un punto preciso en el tiempo o el espacio.</SpanishHint>
        <div className="specimen-links"><button onClick={() => go('#/topic/prepositions?section=in')}>in <span>inside</span></button><button onClick={() => go('#/topic/prepositions?section=on')}>on <span>surface</span></button></div>
        <small>Each term is an entrance to a connected note.</small>
      </aside>
    </section>
    <RoleLegend />
    <section className="category-section"><div className="section-heading"><div><p className="eyebrow">Concept index</p><h2>Enter through the question you have.</h2><SpanishHint>Entra por la duda que tienes.</SpanishHint></div><button className="text-link" onClick={() => go('#/library')}>View every note →</button></div><div className="category-grid">{categoryMeta.map((category, index) => <button key={category.id} onClick={() => go(`#/library?category=${encodeURIComponent(category.id)}`)}><span className="category-mark">{category.mark}</span><div><small>{String(index + 1).padStart(2, '0')} / {allItems.filter((item) => item.category === category.id).length} notes</small><h3>{category.label}</h3><SpanishHint>{category.spanishLabel}</SpanishHint><p>{category.description}<SpanishHint>{category.spanishDescription}</SpanishHint></p></div></button>)}</div></section>
    <TenseMatrix go={go} />
    <section className="featured-section"><div className="section-heading"><div><p className="eyebrow">Lab shortcuts</p><h2>Reference notes worth keeping close</h2><SpanishHint>Tablas que conviene tener a mano</SpanishHint></div></div><div className="topic-grid">{featured.map((item) => <TopicCard item={item} go={go} key={item.id} />)}</div></section>
  </main>
}

function TopicCard({ item, go }: { item: LearningItem; go: Go }) {
  return <button className="topic-card" onClick={() => go(`#/topic/${item.id}`)}><div><span className="level-tag">{item.level}</span><span className="category-label">{item.category}</span></div><h3>{item.title}</h3><p>{item.overview}<SpanishHint>{item.spanishOverview}</SpanishHint></p><span className="card-arrow">Open note ↗</span></button>
}

function Library({ go, selectedCategory }: { go: Go; selectedCategory?: string }) {
  const [filter, setFilter] = useState(selectedCategory ?? 'All')
  useEffect(() => setFilter(selectedCategory ?? 'All'), [selectedCategory])
  const visible = filter === 'All' ? allItems : allItems.filter((item) => item.category === filter)
  return <main className="page-shell"><section className="page-intro"><p className="eyebrow">Concept library</p><h1>All of GramLab, no locked doors</h1><SpanishHint>Todo GramLab, sin candados</SpanishHint><p>A1–B2 labels only suggest an approximate difficulty. Every note is open.<SpanishHint>Las etiquetas A1–B2 sólo indican una dificultad aproximada. Puedes abrir cualquier ficha.</SpanishHint></p></section><div className="filter-row"><button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All <small>{allItems.length}</small></button>{categoryMeta.map((category) => <button className={filter === category.id ? 'active' : ''} onClick={() => setFilter(category.id)} key={category.id}>{category.label}<small>{allItems.filter((item) => item.category === category.id).length}</small></button>)}</div><div className="topic-grid library-grid">{visible.map((item) => <TopicCard item={item} go={go} key={item.id} />)}</div></main>
}

function RelatedLinks({ item, go }: { item: LearningItem; go: Go }) {
  const related = item.relatedTopicIds.map(findItem).filter((entry): entry is LearningItem => Boolean(entry))
  const backlinks = relatedBacklinks(item.id).filter((entry) => entry.id !== item.id && !related.some((candidate) => candidate.id === entry.id))
  if (!related.length && !backlinks.length) return null
  return <section className="connections panel"><p className="eyebrow">Connections</p><h2>Related topics</h2><SpanishHint>Términos relacionados</SpanishHint>{related.length > 0 && <div className="connection-row">{related.map((entry) => <button key={entry.id} onClick={() => go(`#/topic/${entry.id}`)}>{entry.title}<span>→</span></button>)}</div>}{backlinks.length > 0 && <><h3>Also appears in</h3><SpanishHint>También aparece en</SpanishHint><div className="connection-row secondary">{backlinks.map((entry) => <button key={entry.id} onClick={() => go(`#/topic/${entry.id}`)}>{entry.title}<span>↗</span></button>)}</div></>}</section>
}

function ReferenceSectionCard({ entry, go }: { entry: ReferenceSection; go: Go }) {
  return <article className="reference-section" id={`section-${entry.id}`}>
    <div className="section-index">#{entry.id}</div><h2>{entry.title}</h2>{entry.spanishTitle && <SpanishHint>{entry.spanishTitle}</SpanishHint>}<p className="quick-answer"><strong>Quick answer</strong><span>{entry.quickAnswer}{entry.spanishQuickAnswer && <SpanishHint>{entry.spanishQuickAnswer}</SpanishHint>}</span></p>
    {entry.whenToUse?.length ? <div className="mini-block"><h3>When to use it</h3><SpanishHint>Cuándo se usa</SpanishHint><ul>{entry.whenToUse.map((use, index) => <li key={use}>{use}{entry.spanishWhenToUse?.[index] && <SpanishHint>{entry.spanishWhenToUse[index]}</SpanishHint>}</li>)}</ul></div> : null}
    {entry.pattern && <div className="pattern-box"><span>PATTERN</span><code>{entry.pattern}</code></div>}
    {entry.rows?.length ? <div className="reference-table-wrap"><table><thead><tr><th>Key</th><th>Use</th><th>Example</th></tr></thead><tbody>{entry.rows.map((row) => <tr key={`${row.key}-${row.example}`}><td>{row.key}</td><td>{row.meaning}{row.spanishMeaning && <SpanishHint>{row.spanishMeaning}</SpanishHint>}</td><td>{row.example}{row.spanishExample && <SpanishHint>{row.spanishExample}</SpanishHint>}</td></tr>)}</tbody></table></div> : null}
    {entry.examples?.length ? <div className="rich-examples">{entry.examples.map((example, index) => <div key={`${entry.id}-${index}`}><RichSentence tokens={example.tokens} go={go} /><small>{example.spanish}</small>{example.note && <em>{example.note}</em>}</div>)}</div> : null}
    {(entry.contrasts?.length || entry.mistakes?.length) ? <div className="contrast-grid">{entry.contrasts?.length ? <div><h3>Compare</h3><SpanishHint>Contrasta</SpanishHint>{entry.contrasts.map((copy, index) => <p key={copy}>{copy}{entry.spanishContrasts?.[index] && <SpanishHint>{entry.spanishContrasts[index]}</SpanishHint>}</p>)}</div> : null}{entry.mistakes?.length ? <div className="warning-box"><h3>Common mistake</h3><SpanishHint>Error común</SpanishHint>{entry.mistakes.map((copy, index) => <p key={copy}>{copy}{entry.spanishMistakes?.[index] && <SpanishHint>{entry.spanishMistakes[index]}</SpanishHint>}</p>)}</div> : null}</div> : null}
    {entry.links?.length ? <div className="inline-links"><span>Connect with</span>{entry.links.map((term) => {
      const targetItem = term.kind === 'topic' ? findItem(term.targetId) : undefined
      const target = term.kind === 'verb'
        ? irregularVerbs.find((verb) => verb.id === term.targetId)?.base
        : term.sectionId
          ? targetItem?.sections?.find((candidate) => candidate.id === term.sectionId)?.title
          : targetItem?.title
      return <button key={`${term.kind}-${term.targetId}-${term.sectionId ?? ''}`} onClick={() => go(routeForTerm(term))}>{target ?? term.targetId} ↗</button>
    })}</div> : null}
  </article>
}

function TopicPage({ item, sectionId, go, note, saveNote, onAttempt }: { item: LearningItem; sectionId?: string; go: Go; note: string; saveNote: (id: string, text: string) => void; onAttempt: (id: string, correct: boolean) => void }) {
  const [showSpanish, setShowSpanish] = useState(true)
  const [noteValue, setNoteValue] = useState(note)
  useEffect(() => setNoteValue(note), [item.id, note])
  useEffect(() => {
    if (!sectionId) { window.scrollTo({ top: 0, behavior: 'auto' }); return }
    window.setTimeout(() => {
      const target = document.getElementById(`section-${sectionId}`)
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' })
    }, 60)
  }, [item.id, sectionId])
  useEffect(() => { const timeout = window.setTimeout(() => { if (noteValue !== note) saveNote(item.id, noteValue) }, 450); return () => window.clearTimeout(timeout) }, [item.id, note, noteValue, saveNote])

  const topic = isTopic(item) ? item : null
  const table = !topic ? item as GrammarTable : null
  const exercises = topic?.exercises ?? (table?.exercise ? [table.exercise] : [])

  return <main className={`page-shell topic-page ${showSpanish ? '' : 'hide-spanish'}`.trim()}>
    <button className="back-button" onClick={() => go('#/library')}>← Library</button>
    <section className="topic-hero"><div><div className="topic-meta"><span className="level-tag">{item.level}</span><span>{item.category}</span></div><h1>{item.title}</h1><p>{item.overview}</p>{showSpanish && <p className="spanish-overview" lang="es">{item.spanishOverview}</p>}</div><button className={`language-toggle ${showSpanish ? 'active' : ''}`} onClick={() => setShowSpanish((value) => !value)} aria-pressed={showSpanish}><span>ES</span> Spanish support {showSpanish ? 'visible' : 'hidden'}</button></section>
    <RoleLegend />
    {topic && <>
      <section className="panel"><p className="eyebrow">When to use it</p><SpanishHint>Cuándo se usa</SpanishHint><div className="use-grid">{topic.uses.map((use, index) => <div key={use}><span>{String(index + 1).padStart(2, '0')}</span><p>{use}</p></div>)}</div></section>
      <section className="formula-grid">{topic.structures.map((structure) => <article key={structure.label} className="formula-card"><span>{structure.label}</span><code>{structure.formula}</code><p>{structure.translation}</p><blockquote>{structure.example}</blockquote></article>)}</section>
      <section className="panel"><p className="eyebrow">Examples</p><SpanishHint>Ejemplos</SpanishHint><div className="example-grid">{topic.examples.map((example) => <article key={example.english}>{example.tokens ? <RichSentence tokens={example.tokens} go={go} /> : <strong>{example.english}</strong>}{showSpanish && <small lang="es">{example.spanish}</small>}{example.note && <em>{example.note}</em>}</article>)}</div></section>
      {topic.traps.length > 0 && <section className="warning-panel"><p className="eyebrow">Common mistakes</p><SpanishHint>Errores comunes</SpanishHint>{topic.traps.map((trap) => <p key={trap}><span>!</span>{trap}</p>)}</section>}
    </>}
    {table && <><section className="panel"><p className="eyebrow">Quick reference</p><SpanishHint>Tabla rápida</SpanishHint><h2>{table.subtitle}</h2><div className="reference-table-wrap"><table><thead><tr><th>Key</th><th>Meaning or form</th><th>Example</th></tr></thead><tbody>{table.rows.map((row) => <tr key={`${row.left}-${row.middle}`}><td>{row.left}{row.spanishLeft && <SpanishHint>{row.spanishLeft}</SpanishHint>}</td><td>{row.middle}{row.spanishMiddle && <SpanishHint>{row.spanishMiddle}</SpanishHint>}</td><td>{row.right}{row.spanishRight && <SpanishHint>{row.spanishRight}</SpanishHint>}</td></tr>)}</tbody></table></div></section>{table.notes.length > 0 && <section className="warning-panel"><p className="eyebrow">Remember</p><SpanishHint>Recuerda</SpanishHint>{table.notes.map((entry) => <p key={entry}><span>!</span>{entry}</p>)}</section>}</>}
    {(item.sections ?? []).length > 0 && <section className="deep-sections"><div className="section-heading"><div><p className="eyebrow">Linked sections</p><h2>Jump straight to the detail</h2><SpanishHint>Ve directo al detalle</SpanishHint></div><div className="anchor-list">{item.sections!.map((entry) => <button onClick={() => go(`#/topic/${item.id}?section=${entry.id}`)} key={entry.id}>#{entry.id}</button>)}</div></div>{item.sections!.map((entry) => <ReferenceSectionCard entry={entry} go={go} key={entry.id} />)}</section>}
    {exercises.length > 0 && <div className="practice-grid">{exercises.map((exercise) => <ExercisePanel key={exercise.id} exercise={exercise} topicId={item.id} onAttempt={onAttempt} />)}</div>}
    <section className="note-panel panel"><div><p className="eyebrow">My local note</p><SpanishHint>Mi nota local</SpanishHint><h2>Write what you want to remember</h2><SpanishHint>Escribe lo que quieres recordar</SpanishHint><p>It saves automatically in this browser only.<SpanishHint>Se guarda automáticamente sólo en este navegador.</SpanishHint></p></div><label className="sr-only" htmlFor="topic-note">Personal note about {item.title}</label><textarea id="topic-note" value={noteValue} onChange={(event) => setNoteValue(event.target.value)} placeholder="Example: at = a point; in = inside something…" rows={6} /><small>{noteValue === note ? 'Saved locally' : 'Saving…'}</small></section>
    <RelatedLinks item={item} go={go} />
  </main>
}

function VerbDictionary({ selectedId, go }: { selectedId?: string; go: Go }) {
  const [query, setQuery] = useState('')
  const selectedRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!selectedId) return
    window.setTimeout(() => {
      const target = selectedRef.current
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2), behavior: 'smooth' })
    }, 80)
  }, [selectedId])
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return irregularVerbs
    return irregularVerbs.filter((entry) => [entry.base, entry.past, entry.participle, entry.meaning, ...entry.examples].join(' ').toLowerCase().includes(needle))
  }, [query])
  return <main className="page-shell"><section className="page-intro verb-intro"><p className="eyebrow">Connected dictionary</p><h1>100 essential irregular verbs</h1><SpanishHint>100 verbos irregulares esenciales</SpanishHint><p>Search by infinitive, past, participle, or meaning. <button className="inline-demo" onClick={() => go('#/verbs?verb=go')}>went</button> opens <strong>go</strong>; <button className="inline-demo" onClick={() => go('#/verbs?verb=write')}>written</button> opens <strong>write</strong>.<SpanishHint>Busca por infinitivo, pasado, participio o significado.</SpanishHint></p><div className="verb-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search go, went, written, escribir…" /></div></section><div className="verb-count">{filtered.length} of {irregularVerbs.length} verbs</div><section className="verb-list">{filtered.map((entry) => <div className={`verb-row ${selectedId === entry.id ? 'selected-verb' : ''}`} ref={selectedId === entry.id ? selectedRef : undefined} key={entry.id} id={`verb-${entry.id}`}><div className="verb-base"><span>BASE</span><strong>{entry.base}</strong><small lang="es">{entry.meaning}</small></div><div><span>PAST</span><strong>{entry.past}</strong></div><div><span>PARTICIPLE</span><strong>{entry.participle}</strong></div><div className="verb-examples"><p>{entry.examples[0]}</p><p>{entry.examples[1]}</p></div><button title="Direct link" onClick={() => go(`#/verbs?verb=${entry.id}`)}>#</button></div>)}</section>{!filtered.length && <div className="empty-state">I couldn't find that verb form.<SpanishHint>No encontré esa forma verbal.</SpanishHint></div>}</main>
}

function DataPage({ completed, attempts, noteCount, exportProgress, importProgress, resetProgress }: { completed: number; attempts: number; noteCount: number; exportProgress: () => void; importProgress: (file: File) => Promise<void>; resetProgress: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; try { await importProgress(file); setMessage('Backup imported successfully.') } catch (error) { setMessage(error instanceof Error ? error.message : 'The backup could not be imported.') } event.target.value = '' }
  return <main className="page-shell"><section className="page-intro"><p className="eyebrow">Local data</p><h1>Your laboratory lives in this browser</h1><SpanishHint>Tu laboratorio vive en este navegador</SpanishHint><p>No account, cloud, or external services. Your practice and notes can travel in a JSON backup.<SpanishHint>Sin cuenta, nube ni servicios externos. Tus prácticas y notas pueden viajar en un respaldo JSON.</SpanishHint></p></section><section className="stats-grid"><div><strong>{allItems.length}</strong><span>available notes</span></div><div><strong>{completed}</strong><span>practiced topics</span></div><div><strong>{attempts}</strong><span>attempts</span></div><div><strong>{noteCount}</strong><span>personal notes</span></div></section><section className="panel backup-panel"><div><p className="eyebrow">GramLab v2 backup</p><h2>Export or restore everything</h2><SpanishHint>Exporta o restaura todo</SpanishHint><p>It also accepts Grammar Canvas v1 backups and preserves attempts and completed topics.<SpanishHint>También acepta respaldos v1 de Grammar Canvas y conserva intentos y temas completados.</SpanishHint></p></div><div><button className="primary-button" onClick={exportProgress}>Export backup</button><button className="secondary-button" onClick={() => fileRef.current?.click()}>Import backup</button><input hidden ref={fileRef} type="file" accept=".json,application/json" onChange={handleImport} />{message && <p role="status" className="import-message">{message}</p>}</div></section><section className="panel integrity-panel"><div><p className="eyebrow">Content integrity</p><h2>{contentIssues.length ? `${contentIssues.length} warnings to review` : 'Index verified'}</h2><p>{contentIssues.length ? 'The app found pending editorial references.' : 'No duplicate IDs, broken links, missing sections, or missing verb references.'}</p></div><span className={contentIssues.length ? 'status-warn' : 'status-ok'}>{contentIssues.length ? 'REVIEW' : 'OK'}</span>{contentIssues.length > 0 && <ul>{contentIssues.map((issue) => <li key={`${issue.type}-${issue.detail}`}>{issue.detail}</li>)}</ul>}</section><section className="danger-zone"><h2>Reset local data</h2><SpanishHint>Reiniciar datos locales</SpanishHint><p>Deletes GramLab practice and notes in this browser. Your color theme remains unchanged.<SpanishHint>Borra prácticas y notas de GramLab en este navegador. El modo de color se conserva.</SpanishHint></p><button onClick={() => { if (window.confirm('Delete GramLab practice and local notes?')) resetProgress() }}>Delete practice and notes</button></section></main>
}

function NotFound({ go }: { go: Go }) { return <main className="page-shell empty-state"><p className="eyebrow">404</p><h1>That note does not exist</h1><SpanishHint>Esa ficha no existe</SpanishHint><button className="primary-button" onClick={() => go('#/')}>Back to the laboratory</button></main> }

function App() {
  const [route, setRoute] = useState(readRoute)
  const { theme, toggleTheme } = useTheme()
  const { progress, recordAttempt, saveNote, resetProgress, exportProgress, importProgress, summary } = useProgress()
  useEffect(() => { const update = () => setRoute(readRoute()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
  const go: Go = (next) => { if (window.location.hash === next) setRoute(readRoute()); else window.location.hash = next }
  const topicId = route.path.startsWith('/topic/') ? decodeURIComponent(route.path.replace('/topic/', '')) : undefined
  const item = topicId ? findItem(topicId) : undefined

  let content
  if (route.path === '/') content = <Home go={go} />
  else if (route.path === '/library') content = <Library go={go} selectedCategory={route.params.get('category') ?? undefined} />
  else if (route.path === '/verbs') content = <VerbDictionary selectedId={route.params.get('verb') ?? undefined} go={go} />
  else if (route.path === '/data') content = <DataPage completed={summary.completed} attempts={summary.attempts} noteCount={summary.notes} exportProgress={exportProgress} importProgress={importProgress} resetProgress={resetProgress} />
  else if (item) content = <TopicPage item={item} sectionId={route.params.get('section') ?? undefined} go={go} note={progress.notes[item.id]?.text ?? ''} saveNote={saveNote} onAttempt={recordAttempt} />
  else content = <NotFound go={go} />

  return <div className="app-shell"><header className="site-header"><button className="brand" onClick={() => go('#/')} aria-label="Go to the GramLab home page"><strong>GramLab</strong><small>A visual grammar atlas</small></button><SearchBox go={go} compact /><nav aria-label="Main navigation"><button className={route.path === '/' ? 'active' : ''} onClick={() => go('#/')}>Lab</button><button className={route.path === '/library' ? 'active' : ''} onClick={() => go('#/library')}>Index</button><button className={route.path === '/verbs' ? 'active' : ''} onClick={() => go('#/verbs')}>Verbs</button><button className={route.path === '/data' ? 'active' : ''} onClick={() => go('#/data')}>Data</button></nav><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`${theme === 'light' ? 'Dark' : 'Light'} mode`}><span aria-hidden="true">{theme === 'light' ? '◐' : '☀'}</span></button></header>{content}<footer><span><strong>GramLab</strong> · a visual grammar atlas</span><span>{allItems.length} notes · {irregularVerbs.length} verbs · offline</span></footer></div>
}

export default App
