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

const worldCopy: Record<string, { name: string; subtitle: string; terrain: string; landmark: string }> = {
  'primeros-pasos': { name: 'First Steps', subtitle: 'Build your first English sentences.', terrain: 'meadow route', landmark: 'The Grammar Gate' },
  'viaje-en-el-tiempo': { name: 'Time Dunes', subtitle: 'Travel through present, past, and future.', terrain: 'sand route', landmark: 'The Clock Tower' },
  'vida-y-lugares': { name: 'Everyday Coast', subtitle: 'Move through places, errands, and daily life.', terrain: 'coast route', landmark: 'The Harbour Post' },
  conversaciones: { name: 'Conversation Grove', subtitle: 'Ask, connect, and shape your ideas.', terrain: 'forest route', landmark: 'The Echo Camp' },
  'mas-alla': { name: 'Beyond the Ridge', subtitle: 'Tackle longer forms and sharper structures.', terrain: 'highland route', landmark: 'The Signal Peak' },
  'cumbres-de-hielo': { name: 'Ice Summits', subtitle: 'Review time forms in clear, cold air.', terrain: 'ice route', landmark: 'The Crystal Lodge' },
  'caldera-de-lava': { name: 'Lava Caldera', subtitle: 'Test the structures that need courage.', terrain: 'volcanic route', landmark: 'The Ember Forge' },
  'marte-rojo': { name: 'Red Planet', subtitle: 'Explore locations and useful new words.', terrain: 'red route', landmark: 'The Rover Beacon' },
  'jardin-de-sombras': { name: 'Shadow Garden', subtitle: 'Solve language clues in moonlit ruins.', terrain: 'night route', landmark: 'The Moon Archive' },
}

const chapterPositions = [
  { x: 142, y: 672 }, { x: 354, y: 478 }, { x: 610, y: 590 }, { x: 842, y: 365 }, { x: 1036, y: 184 },
]

const chapterTitles = ['Trailhead', 'Practice Camp', 'Signal Crossing', 'Grammar Rise', 'Final Ascent']

const labelForStop = (stop: WorldStop) => stop.kind === 'verb' ? 'Verb mission' : stop.kind === 'review' ? 'Review mission' : 'Grammar mission'
const kindSymbol = (stop: WorldStop) => stop.kind === 'verb' ? 'V' : stop.kind === 'review' ? 'R' : 'G'
const chunkStops = (world: LearningWorld) => Array.from({ length: 5 }, (_, index) => world.stops.slice(index * 4, index * 4 + 4))
const displayWorldName = (world: LearningWorld) => worldCopy[world.id]?.name ?? world.name

function CastleIcon({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true"><path d="M8 23V12h12v7h10v-7h12v7h10v-7h12v11l-5 5v32H13V28l-5-5Z" fill="currentColor"/><path d="M28 60V45a8 8 0 0 1 16 0v15" fill="var(--castle-door, #f8f3e8)"/><path d="M8 28h56M20 12v16M42 12v16M52 12v16" stroke="var(--castle-lines, #f8f3e8)" strokeWidth="2"/></svg>
}

function RouteLine() {
  const path = 'M142 672 C 220 640 272 520 354 478 S 528 556 610 590 S 754 432 842 365 S 970 272 1036 184'
  return <svg className="quest-route" viewBox="0 0 1200 820" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true"><path d={path} className="quest-route__edge"/><path d={path} className="quest-route__bed"/><path d={path} className="quest-route__dash"/></svg>
}

function WorldMap({ world, progress, go, onTravel }: { world: LearningWorld; progress: ProgressRecord; go: Go; onTravel: () => void }) {
  const mapScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (mapScrollRef.current) { mapScrollRef.current.scrollLeft = 0; mapScrollRef.current.scrollTop = 0 } }, [world.id])
  const chapters = useMemo(() => chunkStops(world), [world])
  const done = world.stops.filter((stop) => progress.topics[stop.id]?.completed).length
  const currentIndex = world.stops.findIndex((stop) => !progress.topics[stop.id]?.completed)
  const currentChapter = Math.min(chapters.length - 1, Math.max(0, Math.floor((currentIndex === -1 ? world.stops.length - 1 : currentIndex) / 4)))
  const [selectedChapter, setSelectedChapter] = useState(currentChapter)
  const [mapMessage, setMapMessage] = useState('Pick a checkpoint to open its mission list.')
  useEffect(() => { setSelectedChapter(currentChapter); setMapMessage('Your guide is waiting at the next mission.'); }, [world.id, currentChapter])
  const selectedStops = chapters[selectedChapter]
  const selectedDone = selectedStops.filter((stop) => progress.topics[stop.id]?.completed).length
  const characterPosition = chapterPositions[currentChapter]
  const challengeDone = Boolean(progress.topics[`world:${world.id}`]?.completed)
  const copy = worldCopy[world.id]
  return <section className={`world-section landscape-${world.landscape}`} aria-labelledby="world-title">
    <div className="world-header world-header--game">
      <div><span className="world-header__index">World {String(worlds.indexOf(world) + 1).padStart(2, '0')} / {String(worlds.length).padStart(2, '0')}</span><h2 id="world-title">{copy.name}</h2><p>{copy.subtitle}</p><small lang="es">{world.name} · {world.subtitle}</small></div>
      <div className="world-header__progress"><strong>{done}<span> / {world.stops.length}</span></strong><small>missions practised</small><div className="world-progress-track"><span style={{ transform: `scaleX(${done / world.stops.length})` }} /></div></div>
    </div>
    <div className="quest-frame">
      <div ref={mapScrollRef} className="map-scroll" role="region" aria-label={`${copy.name} mission map; choose a checkpoint to see its four missions`} tabIndex={0}>
      <div className={`map-stage map-stage--quest landscape-${world.landscape}`}>
        <img className="map-backdrop" src={landscapeArt[world.landscape]} alt="" aria-hidden="true" />
        <span className="map-pixel-cloud map-pixel-cloud--one" aria-hidden="true" /><span className="map-pixel-cloud map-pixel-cloud--two" aria-hidden="true" />
        <RouteLine />
        {chapters.map((stops, index) => {
          const position = chapterPositions[index]
          const completed = stops.filter((stop) => progress.topics[stop.id]?.completed).length
          const isCurrent = index === currentChapter
          return <button key={index} className={`quest-checkpoint ${selectedChapter === index ? 'is-selected' : ''} ${isCurrent ? 'is-current' : ''} ${completed === stops.length ? 'is-complete' : ''}`} style={{ left: position.x, top: position.y }} onClick={() => { setSelectedChapter(index); setMapMessage(`${chapterTitles[index]} holds ${stops.length} missions.`) }} aria-pressed={selectedChapter === index}>
            <span className="quest-checkpoint__orb">{completed === stops.length ? '✓' : String(index + 1).padStart(2, '0')}</span><span className="quest-checkpoint__copy"><strong>{chapterTitles[index]}</strong><small>{completed}/{stops.length} missions</small></span>
          </button>
        })}
        <div className="guide-figure guide-figure--quest" style={{ left: characterPosition.x + 39, top: characterPosition.y - 111 }} aria-hidden="true"><img src={teacher} alt="" /></div>
        <button className="map-object map-object--sign" style={{ left: 520, top: 170 }} onClick={() => setMapMessage(`Tip: every colour means a different kind of mission. ${copy.landmark} is ahead.`)}><span aria-hidden="true">?</span><span>Trail sign</span></button>
        <button className="map-object map-object--lantern" style={{ left: 742, top: 690 }} onClick={() => setMapMessage('Lantern lit: use the map for direction, then use the notes when you need detail.')}><span aria-hidden="true">✦</span><span>Language lantern</span></button>
        <button className={`map-castle map-castle--quest ${challengeDone ? 'is-complete' : ''}`} style={{ left: 1042, top: 89 }} onClick={() => go(`#/world/${world.id}/challenge`)}>
          <CastleIcon /><span><strong>World challenge</strong><small>{challengeDone ? 'Cleared' : '5 questions · always open'}</small></span>
        </button>
      </div>
      </div>
      <aside className="mission-console" aria-live="polite"><div className="mission-console__top"><span>MISSION LOG</span><strong>{String(selectedChapter + 1).padStart(2, '0')} / 05</strong></div><h3>{chapterTitles[selectedChapter]}</h3><p>{selectedDone === selectedStops.length ? 'This checkpoint is clear. Revisit any mission whenever you want.' : `${selectedStops.length - selectedDone} mission${selectedStops.length - selectedDone === 1 ? '' : 's'} waiting here.`}</p><div className="mission-console__list">{selectedStops.map((stop, index) => { const complete = Boolean(progress.topics[stop.id]?.completed); const current = stop.id === world.stops[currentIndex]?.id; return <button key={stop.id} className={`${stop.kind} ${complete ? 'is-complete' : ''} ${current ? 'is-current' : ''}`} onClick={() => go(stop.route)}><span>{complete ? '✓' : kindSymbol(stop)}</span><strong>{String(selectedChapter * 4 + index + 1).padStart(2, '0')}. {stop.title}</strong><small>{current ? 'Next objective' : labelForStop(stop)}</small></button> })}</div><button className="mission-console__continue" onClick={() => go(world.stops[Math.max(0, currentIndex)].route)}>{currentIndex === -1 ? 'Replay a mission' : 'Resume next mission'} <span aria-hidden="true">→</span></button></aside>
    </div>
    <div className="world-underbar world-underbar--game"><div className="guide-message"><img src={teacher} alt="" aria-hidden="true" /><p><strong>Guide note</strong>{mapMessage}<small lang="es">Consejo del guía: elige una estación o continúa tu siguiente misión.</small></p></div><div className="world-underbar__actions">{world.id === 'viaje-en-el-tiempo' && <button onClick={() => go('#/tenses')}>Open tense matrix →</button>}<button onClick={onTravel}>Open world map</button></div></div>
  </section>
}

export function AdventureHome({ selectedWorld, progress, go }: { selectedWorld?: string; progress: ProgressRecord; go: Go }) {
  const world = findWorld(selectedWorld ?? '') ?? worlds[0]
  const [atlasOpen, setAtlasOpen] = useState(false)
  const totalStops = worlds.reduce((count, entry) => count + entry.stops.length, 0)
  const totalDone = worlds.flatMap((entry) => entry.stops).filter((stop) => progress.topics[stop.id]?.completed).length
  const currentIndex = world.stops.findIndex((stop) => !progress.topics[stop.id]?.completed)
  const currentStop = world.stops[Math.max(0, currentIndex)]
  const copy = worldCopy[world.id]
  return <main className="adventure-home adventure-home--game">
    <section className="adventure-intro adventure-intro--game"><div className="adventure-intro__flag"><span>GRAMLAB ADVENTURE</span><small>LOCAL SAVE · NO ACCOUNT</small></div><div className="adventure-intro__body"><div><p className="adventure-kicker">YOUR ENGLISH QUEST</p><h1>One world. One useful rule. One step forward.</h1><p>Choose a world, enter a checkpoint, and keep every grammar note close when a real conversation needs it.</p><small lang="es">Un mundo, una regla útil y un paso adelante. Todo tu progreso se queda guardado aquí.</small></div><div className="adventure-intro__actions"><button className="quest-primary" onClick={() => go(currentStop.route)}>Resume mission <span aria-hidden="true">▶</span></button><button className="quest-secondary" onClick={() => setAtlasOpen((value) => !value)} aria-expanded={atlasOpen}>World map <span aria-hidden="true">{atlasOpen ? '▲' : '▼'}</span></button></div></div><div className="adventure-intro__count"><strong>{totalDone}<span> / {totalStops}</span></strong><small>missions practised</small><div><i style={{ transform: `scaleX(${totalDone / totalStops})` }} /></div></div></section>
    {atlasOpen && <section className="world-atlas" aria-label="World map"><div className="world-atlas__heading"><div><span>WORLD MAP</span><h2>Pick a territory</h2><p>Every world is open. The route is a suggestion, never a lock.</p></div><button onClick={() => setAtlasOpen(false)} aria-label="Close world map">×</button></div><div className="world-atlas__grid">{worlds.map((entry, index) => { const completed = entry.stops.filter((stop) => progress.topics[stop.id]?.completed).length; const entryCopy = worldCopy[entry.id]; return <button key={entry.id} className={world.id === entry.id ? 'is-active' : ''} onClick={() => { go(`#/?world=${entry.id}`); setAtlasOpen(false) }}><img src={landscapeArt[entry.landscape]} alt="" aria-hidden="true" /><span><small>WORLD {String(index + 1).padStart(2, '0')}</small><strong>{entryCopy.name}</strong><em>{completed}/{entry.stops.length} missions</em></span></button> })}</div></section>}
    <WorldMap world={world} progress={progress} go={go} onTravel={() => setAtlasOpen(true)} />
    <div className="adventure-bottom adventure-bottom--game"><p>Need one precise rule instead? All {allItems.length} reference notes and 100 irregular verbs are still one click away.</p><button onClick={() => go('#/library')}>Open grammar library →</button></div>
  </main>
}

const normalized = (value: string) => value.toLowerCase().trim()

function CompletionBurst({ label = 'Mission cleared' }: { label?: string }) {
  return <div className="completion-burst" aria-label={label} role="status"><span aria-hidden="true">✦</span><span aria-hidden="true">✦</span><span aria-hidden="true">✦</span><strong>{label}</strong></div>
}

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
  const isCorrect = selected === answer
  return <main className="adventure-page"><button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Back to {displayWorldName(world)}</button><div className="practice-layout"><section className="practice-main"><span className="adventure-tag">Verb mission</span><h1>{stop.verb.base}</h1><p className="practice-meaning"><span>Meaning</span><small lang="es">{stop.verb.meaning}</small></p><div className="practice-question"><h2>What is its past form?</h2><div className="practice-choices">{options.map((option) => <button key={option} disabled={selected !== null} className={selected === option ? (option === answer ? 'correct' : 'wrong') : ''} onClick={() => { setSelected(option); onAttempt(stop.id, option === answer) }}>{option}</button>)}</div>{isCorrect && <CompletionBurst />}{selected !== null && <div className="practice-feedback" role="status"><strong>{isCorrect ? 'Mission complete!' : `The correct form is ${answer}.`}</strong><p>Past participle: <b>{stop.verb.participle}</b></p><button onClick={() => setSelected(null)}>Try again</button></div>}</div></section><aside className="practice-aside"><img src={teacher} alt="GramLab guide" /><h2>One word, three forms</h2><p>{stop.verb.base} → {stop.verb.past} → {stop.verb.participle}</p><blockquote>{stop.verb.examples[0]}</blockquote><button onClick={() => go(`#/verbs?verb=${stop.verb.id}`)}>Open in dictionary →</button>{completed && <small>You already practised this mission.</small>}</aside></div></main>
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
    prompt: `Which lesson matches this idea? ${item.spanishOverview}`,
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
  const isCorrect = selected === question.correctIndex
  return <main className="adventure-page"><button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Back to {displayWorldName(world)}</button><div className="practice-layout"><section className="practice-main"><span className="adventure-tag">Review mission · {displayWorldName(world)}</span><h1>{stop.title}</h1><p className="practice-meaning"><span>Mission clue</span><small lang="es">{stop.subtitle}</small></p><div className="practice-question"><h2>{question.prompt}</h2><div className="practice-choices">{question.options.map((option, index) => <button key={`${option}-${index}`} disabled={selected !== null} className={selected === index ? (index === question.correctIndex ? 'correct' : 'wrong') : ''} onClick={() => { setSelected(index); onAttempt(stop.id, index === question.correctIndex) }}>{option}</button>)}</div>{isCorrect && <CompletionBurst />}{selected !== null && <div className="practice-feedback" role="status"><strong>{isCorrect ? 'Mission complete!' : 'You can try again.'}</strong><p>{question.explanation}</p><div className="review-feedback-actions"><button onClick={() => setSelected(null)}>Try again</button>{isCorrect && <button onClick={() => go(nextRoute)}>Next mission →</button>}</div></div>}</div></section><aside className="practice-aside"><img src={teacher} alt="GramLab guide" /><h2>Return to the note</h2><p>If you need a clue, reread the explanation and its examples before you answer.</p><button onClick={() => go(`#/topic/${stop.item.id}`)}>Open {stop.title} →</button>{completed && <small>You already cleared this review.</small>}</aside></div></main>
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
    return { id: stop.id, prompt: `What is the past form of ${stop.verb.base}?`, options, correctIndex: options.indexOf(stop.verb.past), explanation: `${stop.verb.base} → ${stop.verb.past} → ${stop.verb.participle}` }
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
  const cleared = score >= 4
  return <main className="adventure-page"><button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Back to map</button><section className="challenge-shell"><div className="challenge-heading"><CastleIcon /><span className="adventure-tag">World challenge · {displayWorldName(world)}</span><h1>Show what you know</h1><p>Five quick questions. You can retry whenever you want.</p><small lang="es">Reto final: cinco preguntas rápidas, sin contenido bloqueado.</small></div>{!done ? <div className="challenge-question"><div className="challenge-count"><span>Question {answers.length + 1} of {questions.length}</span><div><i style={{ width: `${(answers.length / questions.length) * 100}%` }} /></div></div><h2>{question.prompt}</h2><div className="practice-choices">{question.options.map((option, index) => <button key={`${option}-${index}`} onClick={() => { const next = [...answers, index]; setAnswers(next); if (next.length === questions.length) onAttempt(`world:${world.id}`, next.filter((answer, questionIndex) => answer === questions[questionIndex].correctIndex).length >= 4) }}>{option}</button>)}</div></div> : <div className="challenge-result" role="status">{cleared && <CompletionBurst label="World cleared" />}<strong>{score} / {questions.length}</strong><h2>{cleared ? 'World cleared!' : 'Try the challenge again'}</h2><p>{cleared ? 'You cleared this world challenge.' : 'Review the missions and try again. Nothing is locked.'}</p><div className="challenge-review">{questions.map((entry, index) => <p key={entry.id}><span>{answers[index] === entry.correctIndex ? '✓' : '×'}</span>{entry.explanation}</p>)}</div><div className="challenge-actions"><button onClick={() => setAnswers([])}>Retry challenge</button><button onClick={() => go(`#/?world=${world.id}`)}>Back to map →</button></div></div>}{completedBefore && !done && <p className="challenge-completed">You cleared this challenge before. Replay it whenever you want.</p>}</section></main>
}

export function ReviewPage({ progress, go }: { progress: ProgressRecord; go: Go }) {
  const stops = worlds.flatMap((world) => world.stops)
  const practiced = stops.filter((stop) => progress.topics[stop.id]?.completed)
  const pending = stops.filter((stop) => !progress.topics[stop.id]?.completed)
  const suggestions = [...practiced.slice(-4).reverse(), ...pending.slice(0, Math.max(0, 6 - practiced.length))].slice(0, 6)
  return <main className="adventure-page review-page"><span className="adventure-tag">Review station</span><h1>One small step every day.</h1><p>Return to a mission you have practised, or continue where you left off.</p><small lang="es">Repasa una parada anterior o continúa desde donde lo dejaste.</small><div className="review-metrics"><div><strong>{practiced.length}</strong><span>missions practised</span></div><div><strong>{worlds.filter((world) => progress.topics[`world:${world.id}`]?.completed).length}</strong><span>world challenges cleared</span></div></div><section className="review-list"><h2>Today's missions</h2>{suggestions.map((stop) => <button key={stop.id} onClick={() => go(stop.route)}><span className={`review-kind ${stop.kind}`}>{stop.kind === 'verb' ? 'Verb' : stop.kind === 'review' ? 'Review' : 'Grammar'}</span><strong>{stop.title}</strong><small>{progress.topics[stop.id]?.completed ? 'Review' : 'Start'} →</small></button>)}</section></main>
}
