import { useEffect, useMemo, useRef, useState } from 'react'
import { allItems } from './data/catalog'
import { findWorld, worlds } from './data/worlds'
import type { LearningWorld, WorldStop } from './data/worlds'
import type { ProgressRecord } from './types'
import type { CSSProperties, KeyboardEvent } from 'react'
import { fieldMissionId, fieldMissionRoute, mapHeight, mapWidth, traceRoute, worldTrails } from './data/world-trails'
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

const worldCopy: Record<string, { name: string; subtitle: string }> = {
  'primeros-pasos': { name: 'First Steps', subtitle: 'Build your first English sentences.' },
  'viaje-en-el-tiempo': { name: 'Time Dunes', subtitle: 'Travel through present, past, and future.' },
  'vida-y-lugares': { name: 'Everyday Coast', subtitle: 'Move through places, errands, and daily life.' },
  conversaciones: { name: 'Conversation Grove', subtitle: 'Ask, connect, and shape your ideas.' },
  'mas-alla': { name: 'Beyond the Ridge', subtitle: 'Tackle longer forms and sharper structures.' },
  'cumbres-de-hielo': { name: 'Ice Summits', subtitle: 'Review time forms in clear, cold air.' },
  'caldera-de-lava': { name: 'Lava Caldera', subtitle: 'Test the structures that need courage.' },
  'marte-rojo': { name: 'Red Planet', subtitle: 'Explore locations and useful new words.' },
  'jardin-de-sombras': { name: 'Shadow Garden', subtitle: 'Solve language clues in moonlit ruins.' },
}

const mapPoint = (x: number, y: number) => ({ left: `${100 * x / mapWidth}%`, top: `${100 * y / mapHeight}%` })
const atlasColumns = [1, 2, 3, 3, 2, 1, 1, 2, 3]

const labelForStop = (stop: WorldStop) => stop.kind === 'verb' ? 'Verb mission' : stop.kind === 'review' ? 'Review mission' : 'Grammar mission'
const kindSymbol = (stop: WorldStop) => stop.kind === 'verb' ? 'V' : stop.kind === 'review' ? 'R' : 'G'
const chunkStops = (world: LearningWorld) => Array.from({ length: 5 }, (_, index) => world.stops.slice(index * 4, index * 4 + 4))
const displayWorldName = (world: LearningWorld) => worldCopy[world.id]?.name ?? world.name

function CastleIcon({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true"><path d="M8 23V12h12v7h10v-7h12v7h10v-7h12v11l-5 5v32H13V28l-5-5Z" fill="currentColor"/><path d="M28 60V45a8 8 0 0 1 16 0v15" fill="var(--castle-door, #f8f3e8)"/><path d="M8 28h56M20 12v16M42 12v16M52 12v16" stroke="var(--castle-lines, #f8f3e8)" strokeWidth="2"/></svg>
}

function RouteLine({ route, branch }: { route: string; branch: string }) {
  return <svg className="quest-route" viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true">
    <path d={route} className="quest-route__edge" />
    <path d={route} className="quest-route__bed" />
    <path d={route} className="quest-route__dash" />
    <path d={branch} className="quest-route__branch-shadow" />
    <path d={branch} className="quest-route__branch" />
  </svg>
}

function RelicSprite({ pixels }: { pixels: readonly string[] }) {
  return <span className="relic-sprite" aria-hidden="true">
    {[...pixels.join('')].map((pixel, index) => <i key={index} className={pixel === '#' ? 'is-filled' : undefined} />)}
  </span>
}

function WorldMap({ world, progress, go, onTravel, showField }: { world: LearningWorld; progress: ProgressRecord; go: Go; onTravel: () => void; showField: boolean }) {
  const { checkpoints, mission, color, sign, gate } = worldTrails[world.id]
  const routePath = traceRoute(checkpoints.map(([, x, y]) => [x, y]))
  const [, branchX, branchY] = checkpoints[mission.branchFrom]
  const branchPath = traceRoute([[branchX, branchY], mission.position])
  const mapScrollRef = useRef<HTMLDivElement>(null)
  const chapters = useMemo(() => chunkStops(world), [world])
  const done = world.stops.filter((stop) => progress.topics[stop.id]?.completed).length
  const currentIndex = world.stops.findIndex((stop) => !progress.topics[stop.id]?.completed)
  const currentChapter = Math.min(chapters.length - 1, Math.max(0, Math.floor((currentIndex === -1 ? world.stops.length - 1 : currentIndex) / 4)))
  const [selection, setSelection] = useState<number | 'field'>(showField ? 'field' : currentChapter)
  const fieldSelected = selection === 'field'
  const selectedChapter = selection === 'field' ? mission.branchFrom : selection
  const sideTrailMessage = `The dotted trail branches off at ${checkpoints[mission.branchFrom][0]}.`
  const [mapMessage, setMapMessage] = useState(showField ? sideTrailMessage : 'Choose a checkpoint to open its missions, or follow the dotted side trail.')
  const [signRead, setSignRead] = useState(false)
  useEffect(() => {
    const map = mapScrollRef.current
    const x = showField ? mission.position[0] : checkpoints[currentChapter][1]
    if (map) map.scrollLeft = map.scrollWidth * x / mapWidth - map.clientWidth / 2
  }, [currentChapter, checkpoints, mission, showField])
  const selectedStops = chapters[selectedChapter]
  const selectedDone = selectedStops.filter((stop) => progress.topics[stop.id]?.completed).length
  const [, checkpointX, checkpointY] = checkpoints[selectedChapter]
  const [guideX, guideY] = fieldSelected ? mission.position : [checkpointX, checkpointY]
  const challengeDone = Boolean(progress.topics[`world:${world.id}`]?.completed)
  const fieldDone = Boolean(progress.topics[fieldMissionId(world.id)]?.completed)
  const copy = worldCopy[world.id]

  function selectStop(next: number | 'field', panMap = false) {
    setSelection(next)
    setMapMessage(next === 'field' ? sideTrailMessage : `${checkpoints[next][0]} has ${chapters[next].length} missions.`)
    const map = mapScrollRef.current
    if (!panMap || !map) return
    const x = next === 'field' ? mission.position[0] : checkpoints[next][1]
    const left = map.scrollWidth * x / mapWidth - map.clientWidth / 2
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    map.scrollTo({ left, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  function moveInMinimap(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    const buttons = [...event.currentTarget.querySelectorAll('button')]
    const index = buttons.findIndex((button) => button === event.target)
    if (index === -1) return
    event.preventDefault()
    const next = index + (event.key === 'ArrowLeft' ? -1 : 1)
    const button = buttons[(next + buttons.length) % buttons.length]
    button.focus()
    button.click()
  }

  return <section className="world-section" aria-labelledby="world-title" style={{ '--trail-color': color } as CSSProperties}>
    <div className="world-header world-header--game">
      <div><span className="world-header__index">World {String(worlds.indexOf(world) + 1).padStart(2, '0')} / {String(worlds.length).padStart(2, '0')}</span><h2 id="world-title" tabIndex={-1}>{copy.name}</h2><p>{copy.subtitle}</p><small lang="es">{world.name} · {world.subtitle}</small></div>
      <div className="world-header__progress"><strong>{done}<span> / {world.stops.length}</span></strong><small>missions practised</small><div className="world-progress-track"><span style={{ transform: `scaleX(${done / world.stops.length})` }} /></div></div>
    </div>
    <div className="quest-frame">
      <div ref={mapScrollRef} className="map-scroll" role="region" aria-label={`${copy.name} mission map; choose a checkpoint to see its four missions`} tabIndex={0}>
      <div className={`map-stage map-stage--quest landscape-${world.landscape}`}>
        <img className="map-backdrop" src={landscapeArt[world.landscape]} alt="" aria-hidden="true" />
        <span className="map-weather map-weather--one" aria-hidden="true" />
        <span className="map-weather map-weather--two" aria-hidden="true" />
        <RouteLine route={routePath} branch={branchPath} />
        {chapters.map((stops, index) => {
          const [title, x, y] = checkpoints[index]
          const completed = stops.filter((stop) => progress.topics[stop.id]?.completed).length
          const isCurrent = index === currentChapter
          return <button key={index} className={`quest-checkpoint ${selection === index ? 'is-selected' : ''} ${isCurrent ? 'is-current' : ''} ${completed === stops.length ? 'is-complete' : ''}`} style={mapPoint(x, y)} onClick={() => selectStop(index)} aria-pressed={selection === index}>
            <span className="quest-checkpoint__orb">{completed === stops.length ? '✓' : String(index + 1).padStart(2, '0')}</span><span className="quest-checkpoint__copy"><strong>{title}</strong><small>{completed}/{stops.length} missions</small></span>
          </button>
        })}
        <div className="guide-figure guide-figure--quest" style={mapPoint(guideX + (guideX > 970 ? -128 : 47), guideY - 95)} aria-hidden="true"><img src={teacher} alt="" /></div>
        <button className="map-object map-object--sign" style={mapPoint(...sign)} aria-label="Trail sign" aria-expanded={signRead} onClick={() => {
          setSignRead(!signRead)
          setMapMessage(signRead ? 'Trail sign closed.' : mission.hint)
        }}>
          <span className="map-object__tile" aria-hidden="true">?</span><span className="map-object__label">Trail sign</span>
          {signRead && <span className="map-object__hint">{mission.hint}</span>}
        </button>
        <button className={`map-object map-object--relic ${fieldDone ? 'is-complete' : ''}`} style={mapPoint(...mission.position)} aria-pressed={fieldSelected} onClick={() => selectStop('field')}>
          <span className="map-object__tile"><RelicSprite pixels={mission.sprite} /></span><span className="map-object__label">{mission.object}</span>
          {fieldDone && <span className="map-object__check" aria-label="Cleared">✓</span>}
        </button>
        <button className={`map-castle map-castle--quest ${challengeDone ? 'is-complete' : ''}`} style={mapPoint(...gate)} onClick={() => go(`#/world/${world.id}/challenge`)}>
          <CastleIcon /><span><strong>World challenge</strong><small>{challengeDone ? 'Cleared' : '5 questions · always open'}</small></span>
        </button>
      </div>
      </div>
      <aside className="mission-console" aria-label="Mission log">
        <div className="mission-console__top"><span>MISSION LOG</span><strong>{fieldSelected ? 'SIDE TRAIL' : `${selectedChapter + 1} / ${chapters.length}`}</strong></div>
        <nav className="mission-console__minimap" aria-label="Minimap checkpoints" style={{ backgroundImage: `url("${landscapeArt[world.landscape]}")` }} onKeyDown={moveInMinimap}>
          <span>MINIMAP</span>
          <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true"><path d={routePath} /><path d={branchPath} className="minimap__branch" /></svg>
          {chapters.map((stops, index) => {
            const completed = stops.every((stop) => progress.topics[stop.id]?.completed)
            const [title, x, y] = checkpoints[index]
            return <button
              key={index}
              className={completed ? 'is-complete' : undefined}
              style={mapPoint(x, y)}
              onClick={() => selectStop(index, true)}
              aria-label={`Open ${title}${completed ? ', cleared' : ''}`}
              aria-pressed={selection === index}
            >{completed ? '✓' : index + 1}</button>
          })}
          <button className={`minimap__relic ${fieldDone ? 'is-complete' : ''}`} style={mapPoint(...mission.position)} onClick={() => selectStop('field', true)} aria-label={`Open ${mission.object}${fieldDone ? ', cleared' : ''}`} aria-pressed={fieldSelected}>
            {fieldDone ? '✓' : <RelicSprite pixels={mission.sprite} />}
          </button>
        </nav>
        <div className="mission-console__summary" aria-live="polite">
          <h3>{fieldSelected ? mission.title : checkpoints[selectedChapter][0]}</h3>
          <p>{fieldSelected ? (fieldDone ? 'Side mission cleared.' : 'Optional · Two questions') : `${selectedDone} of ${selectedStops.length} missions cleared.`}</p>
        </div>
        {fieldSelected ? <div className="mission-console__side">
          <p>{mission.briefing}</p>
          <small lang="es">{mission.spanishBriefing}</small>
        </div> : <div className="mission-console__list">
          {selectedStops.map((stop, index) => {
            const complete = Boolean(progress.topics[stop.id]?.completed)
            const current = stop.id === world.stops[currentIndex]?.id
            return <button key={stop.id} className={`${stop.kind} ${complete ? 'is-complete' : ''} ${current ? 'is-current' : ''}`} onClick={() => go(stop.route)}>
              <span aria-hidden="true">{complete ? '✓' : kindSymbol(stop)}</span>
              <strong>{selectedChapter * 4 + index + 1}. {stop.title}</strong>
              <small>{complete ? 'Cleared' : current ? 'Next objective' : labelForStop(stop)}</small>
            </button>
          })}
        </div>}
        {fieldSelected
          ? <button className="mission-console__continue" onClick={() => go(fieldMissionRoute(world.id))}>{fieldDone ? 'Replay side mission' : 'Start side mission'} <span aria-hidden="true">→</span></button>
          : <button className="mission-console__continue" onClick={() => go(world.stops[Math.max(0, currentIndex)].route)}>{currentIndex === -1 ? 'Replay a mission' : 'Resume next mission'} <span aria-hidden="true">→</span></button>}
        <p className="mission-console__tip" role="status">{signRead ? mission.hint : mapMessage}</p>
      </aside>
    </div>
    <div className="world-underbar world-underbar--game"><div className="world-underbar__actions">{world.id === 'viaje-en-el-tiempo' && <button onClick={() => go('#/tenses')}>Open tense matrix →</button>}<button onClick={onTravel}>Open world map</button></div></div>
  </section>
}

export function AdventureHome({ selectedWorld, progress, go, showField = false }: { selectedWorld?: string; progress: ProgressRecord; go: Go; showField?: boolean }) {
  const world = findWorld(selectedWorld ?? '') ?? worlds[0]
  const [atlasOpen, setAtlasOpen] = useState(false)
  const arrivingAt = useRef<string | null>(null)
  useEffect(() => {
    if (atlasOpen || showField || arrivingAt.current !== world.id) return
    arrivingAt.current = null
    document.getElementById('world-title')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [atlasOpen, showField, world.id])
  const totalStops = worlds.reduce((count, entry) => count + entry.stops.length, 0)
  const totalDone = worlds.flatMap((entry) => entry.stops).filter((stop) => progress.topics[stop.id]?.completed).length
  const fieldsDone = worlds.filter((entry) => progress.topics[fieldMissionId(entry.id)]?.completed).length
  const currentIndex = world.stops.findIndex((stop) => !progress.topics[stop.id]?.completed)
  const currentStop = world.stops[Math.max(0, currentIndex)]
  return <main className="adventure-home adventure-home--game">
    <section className="adventure-intro adventure-intro--game">
      <div className="adventure-intro__body">
        <div>
          <h1>English Quest</h1>
          <p>Pick a world or resume your next mission.</p>
          <small lang="es">Elige un mundo o continúa tu próxima misión.</small>
        </div>
        <div className="adventure-intro__actions">
          <button className="quest-primary" onClick={() => go(currentStop.route)}>{currentIndex === -1 ? 'Replay a mission' : 'Resume mission'} <span aria-hidden="true">▶</span></button>
          <button className="quest-secondary" onClick={() => setAtlasOpen((value) => !value)} aria-expanded={atlasOpen} aria-controls="world-atlas">World map <span aria-hidden="true">{atlasOpen ? '▲' : '▼'}</span></button>
        </div>
      </div>
      <div className="adventure-intro__count">
        <strong>{totalDone}<span> / {totalStops}</span></strong>
        <small>missions practised</small>
        <div><i style={{ transform: `scaleX(${totalDone / totalStops})` }} /></div>
        <small className="adventure-intro__side-count">{fieldsDone}/{worlds.length} side missions</small>
      </div>
    </section>
    {atlasOpen && <section id="world-atlas" className="world-atlas" aria-label="World map">
      <div className="world-atlas__heading"><div><h2>World atlas</h2><p>Follow the route or pick any world.</p></div><button onClick={() => setAtlasOpen(false)} aria-label="Close world map">×</button></div>
      <div className="world-atlas__grid">
        <svg className="world-atlas__route" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 48 H250 V150 H50 V252 H250" />
        </svg>
        {worlds.map((entry, index) => {
        const completed = entry.stops.filter((stop) => progress.topics[stop.id]?.completed).length
        const fieldDone = progress.topics[fieldMissionId(entry.id)]?.completed
        const position = { '--atlas-row': Math.floor(index / 3) + 1, '--atlas-column': atlasColumns[index] } as CSSProperties
        return <button key={entry.id} className={world.id === entry.id ? 'is-active' : ''} aria-current={world.id === entry.id ? 'true' : undefined} style={position} onClick={() => {
          arrivingAt.current = entry.id
          go(`#/?world=${entry.id}`)
          setAtlasOpen(false)
        }}>
          <img src={landscapeArt[entry.landscape]} alt="" loading="lazy" />
          <span><small>WORLD {String(index + 1).padStart(2, '0')}</small><strong>{displayWorldName(entry)}</strong><em>{completed}/{entry.stops.length} missions{fieldDone ? ' · Side mission cleared' : ''}</em></span>
        </button>
      })}</div>
    </section>}
    <WorldMap key={`${world.id}:${showField}`} world={world} progress={progress} go={go} showField={showField} onTravel={() => {
      setAtlasOpen(true)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }} />
    <div className="adventure-bottom adventure-bottom--game"><p>Need one precise rule instead? All {allItems.length} reference notes and 100 irregular verbs are still one click away.</p><button onClick={() => go('#/library')}>Open grammar library →</button></div>
  </main>
}

const normalized = (value: string) => value.toLowerCase().trim()

function CompletionBurst({ label = 'Mission cleared' }: { label?: string }) {
  return <div className="completion-burst" aria-label={label} role="status"><span aria-hidden="true">✦</span><span aria-hidden="true">✦</span><span aria-hidden="true">✦</span><strong>{label}</strong></div>
}

export function WorldFieldMission({ world, progress, onAttempt, go }: { world: LearningWorld; progress: ProgressRecord; onAttempt: RecordAttempt; go: Go }) {
  const { mission, color } = worldTrails[world.id]
  const id = fieldMissionId(world.id)
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const question = mission.questions[step]
  const correct = selected === question?.answer
  const finished = step === mission.questions.length
  const backRoute = `#/?world=${world.id}&view=field`
  const questionHeading = useRef<HTMLHeadingElement>(null)

  function answer(index: number) {
    setSelected(index)
    if (index !== question.answer) onAttempt(id, false)
  }

  function advance() {
    if (step + 1 === mission.questions.length) onAttempt(id, true)
    setSelected(null)
    setStep(step + 1)
    requestAnimationFrame(() => questionHeading.current?.focus())
  }

  return <main className="adventure-page field-page" style={{ '--trail-color': color } as CSSProperties}>
    <button className="adventure-back" onClick={() => go(backRoute)}>← Back to {displayWorldName(world)}</button>
    <div className="practice-layout">
      <section className="practice-main">
        <div className="field-page__item"><RelicSprite pixels={mission.sprite} /><span className="adventure-tag">Side mission · {displayWorldName(world)}</span></div>
        <h1>{mission.title}</h1>
        <p>{mission.briefing}</p>
        <small className="es-subtitle" lang="es">{mission.spanishBriefing}</small>
        {finished ? <section className="practice-question">
          <h2 ref={questionHeading} tabIndex={-1}>Both questions answered</h2>
          <CompletionBurst label="Side mission cleared" />
          <p>{mission.object} is marked as cleared on your map.</p>
          <button className="quest-primary" onClick={() => go(backRoute)}>Return to the trail →</button>
        </section> : <section className="practice-question">
          <span className="adventure-tag">Question {step + 1} of {mission.questions.length}</span>
          <h2 ref={questionHeading} tabIndex={-1}>{question.prompt}</h2>
          <div className="practice-choices">{question.options.map((option, index) => <button key={option} disabled={selected !== null} className={selected === index ? (correct ? 'correct' : 'wrong') : undefined} onClick={() => answer(index)}>{option}</button>)}</div>
          {selected !== null && <div className="practice-feedback">
            <p role="status">{correct ? question.feedback : 'Try again. The guide’s hint can help.'}</p>
            {correct
              ? <button onClick={advance}>{step + 1 === mission.questions.length ? 'Complete mission' : 'Next question →'}</button>
              : <button onClick={() => {
                setSelected(null)
                questionHeading.current?.focus()
              }}>Try again</button>}
          </div>}
        </section>}
      </section>
      <aside className="practice-aside">
        <img src={teacher} alt="GramLab guide" />
        <h2>Guide’s hint</h2>
        <p>{mission.hint}</p>
        <button onClick={() => go(`#/topic/${mission.reference}`)}>Open grammar note →</button>
        {!finished && progress.topics[id]?.completed && <small>You cleared this side mission before.</small>}
      </aside>
    </div>
  </main>
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
  const nextRoute = world.stops[world.stops.indexOf(stop) + 1]?.route ?? `#/world/${world.id}/challenge`
  return <main className="adventure-page">
    <button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Back to {displayWorldName(world)}</button>
    <div className="practice-layout">
      <section className="practice-main">
        <span className="adventure-tag">Verb mission</span>
        <h1>{stop.verb.base}</h1>
        <p className="practice-meaning"><span>Meaning</span><small lang="es">{stop.verb.meaning}</small></p>
        <div className="practice-question">
          <h2>What is its past form?</h2>
          <div className="practice-choices">{options.map((option) => <button key={option} disabled={selected !== null} className={selected === option ? (isCorrect ? 'correct' : 'wrong') : ''} onClick={() => {
            setSelected(option)
            onAttempt(stop.id, option === answer)
          }}>{option}</button>)}</div>
          {isCorrect && <CompletionBurst />}
          {selected !== null && <div className="practice-feedback">
            {!isCorrect && <strong role="status">The correct form is {answer}.</strong>}
            <p>Past participle: <b>{stop.verb.participle}</b></p>
            <div className="review-feedback-actions">
              <button onClick={() => setSelected(null)}>Try again</button>
              {isCorrect && <button onClick={() => go(nextRoute)}>Next mission →</button>}
            </div>
          </div>}
        </div>
      </section>
      <aside className="practice-aside">
        <img src={teacher} alt="GramLab guide" />
        <h2>One word, three forms</h2>
        <p>{stop.verb.base} → {stop.verb.past} → {stop.verb.participle}</p>
        <blockquote>{stop.verb.examples[0]}</blockquote>
        <button onClick={() => go(`#/verbs?verb=${stop.verb.id}`)}>Open in dictionary →</button>
        {completed && selected === null && <small>You already practised this mission.</small>}
      </aside>
    </div>
  </main>
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
    prompt: `Which lesson matches this idea? ${item.overview}`,
    options,
    correctIndex: options.indexOf(item.title),
    explanation: `${item.title}: ${item.overview}`,
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
  const nextWorld = worlds[worlds.indexOf(world) + 1]

  function answerQuestion(index: number) {
    const next = [...answers, index]
    setAnswers(next)
    if (next.length === questions.length) {
      const correct = next.filter((answer, questionIndex) => answer === questions[questionIndex].correctIndex).length
      onAttempt(`world:${worldId}`, correct >= 4)
    }
  }

  return <main className="adventure-page">
    <button className="adventure-back" onClick={() => go(`#/?world=${world.id}`)}>← Back to map</button>
    <section className="challenge-shell">
      <div className="challenge-heading">
        <CastleIcon />
        <span className="adventure-tag">World challenge · {displayWorldName(world)}</span>
        <h1>Show what you know</h1>
        <p>Get four of five right to clear this world. You can retry anytime.</p>
        <small className="es-subtitle" lang="es">Acierta cuatro de cinco para superar el reto.</small>
      </div>
      {!done ? <div className="challenge-question">
        <div className="challenge-count"><span>Question {answers.length + 1} of {questions.length}</span><div><i style={{ width: `${answers.length / questions.length * 100}%` }} /></div></div>
        <h2>{question.prompt}</h2>
        <div className="practice-choices">{question.options.map((option, index) => <button key={`${option}-${index}`} onClick={() => answerQuestion(index)}>{option}</button>)}</div>
      </div> : <div className="challenge-result">
        {cleared && <CompletionBurst label="World cleared" />}
        <strong>{score} / {questions.length}</strong>
        <h2>{cleared ? 'World cleared!' : 'Try the challenge again'}</h2>
        <div className="challenge-review">{questions.map((entry, index) => <p key={entry.id}><span>{answers[index] === entry.correctIndex ? '✓' : '×'}</span>{entry.explanation}</p>)}</div>
        <div className="challenge-actions">
          <button onClick={() => setAnswers([])}>Retry challenge</button>
          <button onClick={() => go(`#/?world=${world.id}`)}>Back to map</button>
          {cleared && nextWorld && <button onClick={() => go(`#/?world=${nextWorld.id}`)}>Travel to {displayWorldName(nextWorld)} →</button>}
        </div>
      </div>}
      {completedBefore && !done && <p className="challenge-completed">You cleared this challenge before. Replay it whenever you want.</p>}
    </section>
  </main>
}

export function ReviewPage({ progress, go }: { progress: ProgressRecord; go: Go }) {
  const stops = worlds.flatMap((world) => world.stops)
  const practiced = stops.filter((stop) => progress.topics[stop.id]?.completed)
  const pending = stops.filter((stop) => !progress.topics[stop.id]?.completed)
  const suggestions = [...practiced.slice(-4).reverse(), ...pending.slice(0, Math.max(0, 6 - practiced.length))].slice(0, 6)
  return <main className="adventure-page review-page"><span className="adventure-tag">Review station</span><h1>One small step every day.</h1><p>Return to a mission you have practised, or continue where you left off.</p><small lang="es">Repasa una parada anterior o continúa desde donde lo dejaste.</small><div className="review-metrics"><div><strong>{practiced.length}</strong><span>missions practised</span></div><div><strong>{worlds.filter((world) => progress.topics[`world:${world.id}`]?.completed).length}</strong><span>world challenges cleared</span></div></div><section className="review-list"><h2>Today's missions</h2>{suggestions.map((stop) => <button key={stop.id} onClick={() => go(stop.route)}><span className={`review-kind ${stop.kind}`}>{stop.kind === 'verb' ? 'Verb' : stop.kind === 'review' ? 'Review' : 'Grammar'}</span><strong>{stop.title}</strong><small>{progress.topics[stop.id]?.completed ? 'Review' : 'Start'} →</small></button>)}</section></main>
}
