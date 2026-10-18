import { useEffect, useMemo, useRef, useState } from 'react'
import { allItems } from './data/catalog'
import { findWorld, worlds } from './data/worlds'
import type { LearningWorld, WorldStop } from './data/worlds'
import type { ProgressRecord } from './types'
import teacher from './assets/profesor-guia-pixel.png'
import meadowArt from './assets/world-meadow-pixel.png'
import dunesArt from './assets/world-dunes-pixel.png'
import coastArt from './assets/world-coast-pixel.png'
import groveArt from './assets/world-grove-pixel.png'
import highlandsArt from './assets/world-highlands-pixel.png'
import iceArt from './assets/world-ice-pixel.png'
import volcanoArt from './assets/world-volcano-pixel.png'
import marsArt from './assets/world-mars-pixel.png'
import gothicArt from './assets/world-gothic-pixel.png'

type Go = (route: string) => void
type RecordAttempt = (id: string, correct: boolean) => void

const landscapeArt: Record<string, string> = {
  meadow: meadowArt,
  dunes: dunesArt,
  coast: coastArt,
  grove: groveArt,
  highlands: highlandsArt,
  ice: iceArt,
  volcano: volcanoArt,
  mars: marsArt,
  gothic: gothicArt,
}

const columns = [110, 355, 600, 845, 1090]
const rows = [128, 358, 588, 818]
const stopPosition = (index: number) => {
  const row = Math.floor(index / 5)
  const column = row % 2 === 0 ? index % 5 : 4 - index % 5
  return { x: columns[column], y: rows[row] }
}

function CastleIcon({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true"><path d="M8 23V12h12v7h10v-7h12v7h10v-7h12v11l-5 5v32H13V28l-5-5Z" fill="currentColor"/><path d="M28 60V45a8 8 0 0 1 16 0v15" fill="var(--castle-door, #f8f3e8)"/><path d="M8 28h56M20 12v16M42 12v16M52 12v16" stroke="var(--castle-lines, #f8f3e8)" strokeWidth="2"/></svg>
}

function RouteLine() {
  const points = Array.from({ length: 20 }, (_, index) => stopPosition(index))
  const path = points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' L 110 1005'
  return <svg className="route-line" viewBox="0 0 1200 1110" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true"><path d={path} className="route-line__edge"/><path d={path} className="route-line__bed"/><path d={path} className="route-line__dash"/></svg>
}

function StopButton({ stop, index, current, completed, go }: { stop: WorldStop; index: number; current: boolean; completed: boolean; go: Go }) {
  const { x, y } = stopPosition(index)
  return <button
    type="button"
    className={`map-stop ${stop.kind} ${completed ? 'is-complete' : ''} ${current ? 'is-current' : ''}`}
    style={{ left: x, top: y }}
    onClick={() => go(stop.route)}
    aria-label={`Parada ${index + 1}: ${stop.kind === 'verb' ? `verbo ${stop.title}` : stop.title}${completed ? ', practicada' : ''}`}
  >
    <span className="map-stop__marker">{completed ? <span aria-hidden="true">✓</span> : String(index + 1).padStart(2, '0')}</span>
    <span className="map-stop__copy"><strong>{stop.title}</strong><small>{stop.kind === 'verb' ? 'Verbo' : stop.kind === 'review' ? 'Repaso' : 'Lección'}</small></span>
  </button>
}

function WorldMap({ world, progress, go }: { world: LearningWorld; progress: ProgressRecord; go: Go }) {
  const mapScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (mapScrollRef.current) { mapScrollRef.current.scrollLeft = 0; mapScrollRef.current.scrollTop = 0 } }, [world.id])
  const done = world.stops.filter((stop) => progress.topics[stop.id]?.completed).length
  const currentIndex = world.stops.findIndex((stop) => !progress.topics[stop.id]?.completed)
  const characterIndex = currentIndex === -1 ? 19 : currentIndex
  const characterPosition = stopPosition(characterIndex)
  const challengeDone = Boolean(progress.topics[`world:${world.id}`]?.completed)
  return <section className="world-section" aria-labelledby="world-title">
    <div className="world-header">
      <div><span className="world-header__index">Mundo {worlds.indexOf(world) + 1} de {worlds.length}</span><h2 id="world-title">{world.name}</h2><p>{world.subtitle}</p></div>
      <div className="world-header__progress"><strong>{done}<span> / {world.stops.length}</span></strong><small>paradas practicadas</small><div className="world-progress-track"><span style={{ transform: `scaleX(${done / world.stops.length})` }} /></div></div>
    </div>
    <div ref={mapScrollRef} className="map-scroll" role="region" aria-label={`Mapa de ${world.name}; desplázate para explorar sus 20 paradas`} tabIndex={0}>
      <div className={`map-stage landscape-${world.landscape}`}>
        <img className="map-backdrop" src={landscapeArt[world.landscape]} alt="" aria-hidden="true" />
        <RouteLine />
        {world.stops.map((stop, index) => <StopButton key={stop.id} stop={stop} index={index} current={index === currentIndex} completed={Boolean(progress.topics[stop.id]?.completed)} go={go} />)}
        <div className="guide-figure" style={{ left: characterPosition.x + 37, top: characterPosition.y - 104 }} aria-hidden="true"><img src={teacher} alt="" /></div>
        <button className={`map-castle ${challengeDone ? 'is-complete' : ''}`} style={{ left: 110, top: 1005 }} onClick={() => go(`#/world/${world.id}/challenge`)}>
          <CastleIcon /><span><strong>Reto final</strong><small>{challengeDone ? 'Completado' : '5 preguntas · entrada libre'}</small></span>
        </button>
      </div>
    </div>
    <div className="world-underbar"><span><i className="legend-dot lesson" /> Lección <i className="legend-dot verb" /> Verbo <i className="legend-dot review" /> Repaso <i className="legend-dot complete" /> Practicada</span><div className="world-underbar__actions">{world.id === 'viaje-en-el-tiempo' && <button onClick={() => go('#/tenses')}>Ver matriz de tiempos →</button>}<button onClick={() => go(world.stops[Math.max(0, currentIndex)].route)}>Continuar por aquí <span aria-hidden="true">→</span></button></div></div>
  </section>
}

export function AdventureHome({ selectedWorld, progress, go }: { selectedWorld?: string; progress: ProgressRecord; go: Go }) {
  const world = findWorld(selectedWorld ?? '') ?? worlds[0]
  const worldTabsRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const tabs = worldTabsRef.current
    const active = tabs?.querySelector<HTMLButtonElement>('button.active')
    if (tabs && active && tabs.scrollWidth > tabs.clientWidth) {
      tabs.scrollLeft += active.getBoundingClientRect().left - tabs.getBoundingClientRect().left - 8
    }
  }, [world.id])
  const totalStops = worlds.reduce((count, entry) => count + entry.stops.length, 0)
  const totalDone = worlds.flatMap((entry) => entry.stops).filter((stop) => progress.topics[stop.id]?.completed).length
  return <main className="adventure-home">
    <section className="adventure-intro"><div><h1>Tu inglés, paso a paso.</h1><p>Explora nueve mundos a tu ritmo. Cada parada abre una lección, un verbo o un repaso; ningún camino está bloqueado.</p></div><div className="adventure-intro__count"><strong>{totalDone}<span> / {totalStops}</span></strong><small>paradas practicadas</small></div></section>
    <nav ref={worldTabsRef} className="world-tabs" aria-label="Elegir mundo">{worlds.map((entry, index) => { const completed = entry.stops.filter((stop) => progress.topics[stop.id]?.completed).length; return <button key={entry.id} type="button" className={world.id === entry.id ? 'active' : ''} aria-current={world.id === entry.id ? 'page' : undefined} onClick={() => go(`#/?world=${entry.id}`)}><img src={landscapeArt[entry.landscape]} alt="" aria-hidden="true" /><span className="world-tab__copy"><strong>{entry.name}</strong><small>{String(index + 1).padStart(2, '0')} · {completed}/{entry.stops.length}</small></span></button> })}</nav>
    <WorldMap world={world} progress={progress} go={go} />
    <div className="adventure-bottom"><p>¿Buscas una regla concreta? Las {allItems.length} fichas y los 100 verbos siguen disponibles desde la barra superior.</p><button onClick={() => go('#/library')}>Ver todas las lecciones →</button></div>
  </main>
}

const normalized = (value: string) => value.toLowerCase().trim()

export function VerbPractice({ verbId, progress, onAttempt, go }: { verbId: string; progress: ProgressRecord; onAttempt: RecordAttempt; go: Go }) {
  const stop = worlds.flatMap((world) => world.stops).find((entry) => entry.kind === 'verb' && entry.verb.id === verbId)
  const [selected, setSelected] = useState<string | null>(null)
  const world = worlds.find((entry) => entry.stops.some((entryStop) => entryStop.id === `verb:${verbId}`))
  const options = useMemo(() => {
    if (!stop || stop.kind !== 'verb' || !world) return []
    const distractors = world.stops.filter((entry): entry is Extract<WorldStop, { kind: 'verb' }> => entry.kind === 'verb' && entry.id !== stop.id).map((entry) => entry.verb.past).filter((past) => normalized(past) !== normalized(stop.verb.past))
    return [stop.verb.past, ...distractors.slice(0, 3)].sort((a, b) => a.localeCompare(b))
  }, [stop, world])
  if (!stop || stop.kind !== 'verb' || !world) return null
  const answer = stop.verb.past
  const completed = Boolean(progress.topics[stop.id]?.completed)
  return <main className="adventure-page"><button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Volver a {world.name}</button><div className="practice-layout"><section className="practice-main"><span className="adventure-tag">Práctica de verbo</span><h1>{stop.verb.base}</h1><p className="practice-meaning">{stop.verb.meaning}</p><div className="practice-question"><h2>¿Cuál es su forma en pasado?</h2><div className="practice-choices">{options.map((option) => <button key={option} disabled={selected !== null} className={selected === option ? (option === answer ? 'correct' : 'wrong') : ''} onClick={() => { setSelected(option); onAttempt(stop.id, option === answer) }}>{option}</button>)}</div>{selected !== null && <div className="practice-feedback" role="status"><strong>{selected === answer ? '¡Bien hecho!' : `La forma correcta es ${answer}.`}</strong><p>Participio: <b>{stop.verb.participle}</b></p><button onClick={() => setSelected(null)}>Intentar otra vez</button></div>}</div></section><aside className="practice-aside"><img src={teacher} alt="Profesor guía de GramLab" /><h2>Una palabra, tres formas</h2><p>{stop.verb.base} → {stop.verb.past} → {stop.verb.participle}</p><blockquote>{stop.verb.examples[0]}</blockquote><button onClick={() => go(`#/verbs?verb=${stop.verb.id}`)}>Ver en el diccionario →</button>{completed && <small>Ya practicaste esta parada.</small>}</aside></div></main>
}

type ChallengeQuestion = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string }

function reviewQuestionFor(stop: Extract<WorldStop, { kind: 'review' }>): ChallengeQuestion {
  const item = stop.item
  const exercises = 'structures' in item ? item.exercises : item.exercise ? [item.exercise] : []
  const choice = exercises.find((exercise) => exercise.type === 'choice')
  if (choice && choice.type === 'choice') return { id: stop.id, prompt: choice.prompt, options: choice.options, correctIndex: choice.correctIndex, explanation: choice.explanation }

  const alternatives = [
    ...allItems.filter((entry) => entry.id !== item.id && entry.category === item.category),
    ...allItems.filter((entry) => entry.id !== item.id && entry.category !== item.category),
  ].slice(0, 3).map((entry) => entry.title)
  const options = [item.title, ...alternatives].sort((a, b) => a.localeCompare(b))
  return {
    id: stop.id,
    prompt: `¿A qué lección corresponde esta idea? ${item.spanishOverview}`,
    options,
    correctIndex: options.indexOf(item.title),
    explanation: `${item.title}: ${item.spanishOverview}`,
  }
}

export function WorldReview({ worldId, topicId, progress, onAttempt, go }: { worldId: string; topicId: string; progress: ProgressRecord; onAttempt: RecordAttempt; go: Go }) {
  const world = findWorld(worldId)
  const stop = world?.stops.find((entry): entry is Extract<WorldStop, { kind: 'review' }> => entry.kind === 'review' && entry.item.id === topicId)
  const [selected, setSelected] = useState<number | null>(null)
  if (!world || !stop) return null
  const question = reviewQuestionFor(stop)
  const completed = Boolean(progress.topics[stop.id]?.completed)
  const stopIndex = world.stops.indexOf(stop)
  const nextRoute = world.stops[stopIndex + 1]?.route ?? `#/world/${world.id}/challenge`
  return <main className="adventure-page"><button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Volver a {world.name}</button><div className="practice-layout"><section className="practice-main"><span className="adventure-tag">Repaso · {world.name}</span><h1>{stop.title}</h1><p className="practice-meaning">{stop.subtitle}</p><div className="practice-question"><h2>{question.prompt}</h2><div className="practice-choices">{question.options.map((option, index) => <button key={`${option}-${index}`} disabled={selected !== null} className={selected === index ? (index === question.correctIndex ? 'correct' : 'wrong') : ''} onClick={() => { setSelected(index); onAttempt(stop.id, index === question.correctIndex) }}>{option}</button>)}</div>{selected !== null && <div className="practice-feedback" role="status"><strong>{selected === question.correctIndex ? '¡Bien hecho!' : 'Todavía puedes intentarlo otra vez.'}</strong><p>{question.explanation}</p><div className="review-feedback-actions"><button onClick={() => setSelected(null)}>Intentar otra vez</button>{selected === question.correctIndex && <button onClick={() => go(nextRoute)}>Siguiente parada →</button>}</div></div>}</div></section><aside className="practice-aside"><img src={teacher} alt="Profesor guía de GramLab" /><h2>Vuelve a la lección</h2><p>Si necesitas una pista, relee la explicación y sus ejemplos antes de responder.</p><button onClick={() => go(`#/topic/${stop.item.id}`)}>Abrir {stop.title} →</button>{completed && <small>Ya completaste este repaso.</small>}</aside></div></main>
}

function questionsFor(world: LearningWorld): ChallengeQuestion[] {
  const grammar = world.stops.flatMap((stop) => {
    if (stop.kind === 'review') return [reviewQuestionFor(stop)]
    if (stop.kind !== 'lesson') return []
    const item = stop.item
    const exercises = 'structures' in item ? item.exercises : item.exercise ? [item.exercise] : []
    return exercises.filter((exercise) => exercise.type === 'choice').map((exercise) => ({ id: exercise.id, prompt: exercise.prompt, options: exercise.options, correctIndex: exercise.correctIndex, explanation: exercise.explanation }))
  })
  const verbs = world.stops.filter((stop): stop is Extract<WorldStop, { kind: 'verb' }> => stop.kind === 'verb')
  const verbQuestions = verbs.filter((stop) => !stop.verb.past.includes('/')).map((stop, index) => {
    const distractors = verbs.filter((other) => other.id !== stop.id && !other.verb.past.includes('/')).slice(index + 1).concat(verbs.slice(0, index).filter((other) => other.id !== stop.id && !other.verb.past.includes('/'))).slice(0, 3)
    const options = [stop.verb.past, ...distractors.map((other) => other.verb.past)].sort((a, b) => a.localeCompare(b))
    return { id: stop.id, prompt: `¿Cuál es el pasado de ${stop.verb.base}?`, options, correctIndex: options.indexOf(stop.verb.past), explanation: `${stop.verb.base} → ${stop.verb.past} → ${stop.verb.participle}` }
  })
  return [...grammar.slice(0, 3), ...verbQuestions].slice(0, 5)
}

export function WorldChallenge({ worldId, progress, onAttempt, go }: { worldId: string; progress: ProgressRecord; onAttempt: RecordAttempt; go: Go }) {
  const world = findWorld(worldId)
  const [answers, setAnswers] = useState<number[]>([])
  const questions = useMemo(() => world ? questionsFor(world) : [], [world])
  if (!world) return null
  const done = answers.length === questions.length
  const score = answers.filter((answer, index) => answer === questions[index].correctIndex).length
  const question = questions[answers.length]
  const completedBefore = Boolean(progress.topics[`world:${world.id}`]?.completed)
  return <main className="adventure-page"><button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Volver al mapa</button><section className="challenge-shell"><div className="challenge-heading"><CastleIcon /><span className="adventure-tag">Reto final · {world.name}</span><h1>Demuestra lo aprendido</h1><p>Cinco preguntas rápidas. Puedes volver a intentarlo cuando quieras.</p></div>{!done ? <div className="challenge-question"><div className="challenge-count"><span>Pregunta {answers.length + 1} de {questions.length}</span><div><i style={{ width: `${(answers.length / questions.length) * 100}%` }} /></div></div><h2>{question.prompt}</h2><div className="practice-choices">{question.options.map((option, index) => <button key={`${option}-${index}`} onClick={() => { const next = [...answers, index]; setAnswers(next); if (next.length === questions.length) onAttempt(`world:${world.id}`, next.filter((answer, questionIndex) => answer === questions[questionIndex].correctIndex).length >= 4) }}>{option}</button>)}</div></div> : <div className="challenge-result" role="status"><strong>{score} / {questions.length}</strong><h2>{score >= 4 ? '¡Mundo superado!' : 'Vuelve a intentarlo'}</h2><p>{score >= 4 ? 'Completaste el reto de este mundo.' : 'Revisa las lecciones y prueba de nuevo. No se bloquea ningún contenido.'}</p><div className="challenge-review">{questions.map((entry, index) => <p key={entry.id}><span>{answers[index] === entry.correctIndex ? '✓' : '×'}</span>{entry.explanation}</p>)}</div><div className="challenge-actions"><button onClick={() => setAnswers([])}>Repetir reto</button><button onClick={() => go(`#/?world=${world.id}`)}>Volver al mapa →</button></div></div>}{completedBefore && !done && <p className="challenge-completed">Ya superaste este reto. Puedes repetirlo para repasar.</p>}</section></main>
}

export function ReviewPage({ progress, go }: { progress: ProgressRecord; go: Go }) {
  const stops = worlds.flatMap((world) => world.stops)
  const practiced = stops.filter((stop) => progress.topics[stop.id]?.completed)
  const pending = stops.filter((stop) => !progress.topics[stop.id]?.completed)
  const suggestions = [...practiced.slice(-4).reverse(), ...pending.slice(0, Math.max(0, 6 - practiced.length))].slice(0, 6)
  return <main className="adventure-page review-page"><span className="adventure-tag">Repaso</span><h1>Un paso más cada día.</h1><p>Vuelve a una parada que ya practicaste o continúa desde donde lo dejaste.</p><div className="review-metrics"><div><strong>{practiced.length}</strong><span>paradas practicadas</span></div><div><strong>{worlds.filter((world) => progress.topics[`world:${world.id}`]?.completed).length}</strong><span>retos superados</span></div></div><section className="review-list"><h2>Paradas para hoy</h2>{suggestions.map((stop) => <button key={stop.id} onClick={() => go(stop.route)}><span className={`review-kind ${stop.kind}`}>{stop.kind === 'verb' ? 'Verbo' : 'Lección'}</span><strong>{stop.title}</strong><small>{progress.topics[stop.id]?.completed ? 'Repasar' : 'Empezar'} →</small></button>)}</section></main>
}
