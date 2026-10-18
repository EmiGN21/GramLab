import { allItems, findItem } from './catalog'
import { irregularVerbs } from './verbs'
import type { LearningItem, VerbEntry } from '../types'

type WorldSpec = {
  id: string
  name: string
  subtitle: string
  landscape: string
  lessonIds?: string[]
  reviewIds?: string[]
  verbIds: string[]
}

export type WorldStop =
  | { id: string; kind: 'lesson'; title: string; subtitle: string; route: string; item: LearningItem }
  | { id: string; kind: 'review'; title: string; subtitle: string; route: string; item: LearningItem }
  | { id: string; kind: 'verb'; title: string; subtitle: string; route: string; verb: VerbEntry }

export type LearningWorld = Omit<WorldSpec, 'lessonIds' | 'reviewIds' | 'verbIds'> & { stops: WorldStop[] }

const specs: WorldSpec[] = [
  {
    id: 'primeros-pasos', name: 'Primeros pasos', subtitle: 'Construye tus primeras frases', landscape: 'meadow',
    lessonIds: ['parts-of-speech', 'pronouns', 'articles', 'present-simple', 'there-be', 'do-auxiliary', 'have-got', 'demonstratives', 'possessive-s', 'countable-quantifiers', 'frequency-adverbs'],
    verbIds: ['be', 'have', 'do', 'make', 'go', 'get', 'give', 'take', 'see'],
  },
  {
    id: 'viaje-en-el-tiempo', name: 'Desierto del tiempo', subtitle: 'Cuenta lo que pasa, pasó y pasará', landscape: 'dunes',
    lessonIds: ['present-continuous', 'past-simple', 'past-continuous', 'future-simple', 'going-to', 'present-perfect', 'ever-never', 'since-for', 'already-yet-still', 'used-to'],
    verbIds: ['begin', 'come', 'leave', 'sleep', 'wake', 'feel', 'know', 'think', 'grow', 'become'],
  },
  {
    id: 'vida-y-lugares', name: 'Vida y lugares', subtitle: 'Muévete por situaciones cotidianas', landscape: 'coast',
    lessonIds: ['prepositions', 'to-for', 'reflexive-pronouns', 'indefinite-pronouns', 'one-ones', 'other-another', 'body-vocabulary', 'shopping', 'numbers-time-age', 'food-restaurant'],
    verbIds: ['buy', 'eat', 'drink', 'drive', 'ride', 'meet', 'pay', 'find', 'bring', 'put'],
  },
  {
    id: 'conversaciones', name: 'Conversaciones', subtitle: 'Pregunta, conecta y matiza tus ideas', landscape: 'grove',
    lessonIds: ['question-words', 'modals', 'too-either-neither', 'what-which-that', 'some-any', 'few-little', 'manner-adverbs', 'everyday-every-day', 'just-only-alone', 'aint'],
    verbIds: ['say', 'tell', 'speak', 'hear', 'read', 'write', 'send', 'show', 'teach', 'learn'],
  },
  {
    id: 'mas-alla', name: 'Más allá', subtitle: 'Domina formas y estructuras avanzadas', landscape: 'highlands',
    lessonIds: ['verbs', 'phrasal-verbs', 'get', 'passive-voice', 'future-continuous', 'past-perfect', 'future-perfect', 'past-perfect-continuous', 'present-perfect-continuous', 'future-perfect-continuous'],
    verbIds: ['build', 'break', 'choose', 'catch', 'fall', 'fly', 'run', 'rise', 'lead', 'win'],
  },
  {
    id: 'cumbres-de-hielo', name: 'Cumbres de hielo', subtitle: 'Repasa el tiempo entre nieve y cristales', landscape: 'ice',
    reviewIds: ['past-simple', 'past-continuous', 'present-perfect', 'since-for', 'already-yet-still', 'used-to', 'future-simple'],
    verbIds: ['freeze', 'blow', 'hide', 'hold', 'keep', 'lie', 'sit', 'stand', 'wear', 'tear', 'smell', 'dream', 'cut'],
  },
  {
    id: 'caldera-de-lava', name: 'Caldera de lava', subtitle: 'Pon a prueba las estructuras más intensas', landscape: 'volcano',
    reviewIds: ['modals', 'passive-voice', 'phrasal-verbs', 'get', 'future-continuous', 'past-perfect', 'future-perfect'],
    verbIds: ['burn', 'bleed', 'fight', 'hit', 'hurt', 'light', 'shake', 'shoot', 'spill', 'spoil', 'strike', 'throw', 'bite'],
  },
  {
    id: 'marte-rojo', name: 'Marte rojo', subtitle: 'Explora lugares y descubre nuevas palabras', landscape: 'mars',
    reviewIds: ['there-be', 'prepositions', 'demonstratives', 'question-words', 'numbers-time-age', 'some-any', 'countable-quantifiers'],
    verbIds: ['dig', 'draw', 'feed', 'hang', 'let', 'mean', 'prove', 'set', 'spend', 'stick', 'swim', 'understand', 'cost'],
  },
  {
    id: 'jardin-de-sombras', name: 'Jardín de sombras', subtitle: 'Resuelve pistas entre ruinas y luz de luna', landscape: 'gothic',
    reviewIds: ['articles', 'possessive-s', 'reflexive-pronouns', 'indefinite-pronouns', 'other-another', 'too-either-neither', 'what-which-that', 'manner-adverbs'],
    verbIds: ['deal', 'forget', 'forgive', 'lend', 'lose', 'ring', 'sell', 'shut', 'sing', 'spell', 'steal', 'sweep'],
  },
]

const verbById = new Map(irregularVerbs.map((verb) => [verb.id, verb]))

export const worlds: LearningWorld[] = specs.map(({ lessonIds = [], reviewIds = [], verbIds, ...world }) => {
  const lessons: WorldStop[] = lessonIds.map((id) => {
    const item = findItem(id)
    if (!item) throw new Error(`World ${world.id} references missing lesson ${id}`)
    return { id, kind: 'lesson', title: item.title, subtitle: item.spanishOverview, route: `#/topic/${id}`, item }
  })
  const reviews: WorldStop[] = reviewIds.map((id) => {
    const item = findItem(id)
    if (!item) throw new Error(`World ${world.id} references missing review ${id}`)
    return { id: `review:${world.id}:${id}`, kind: 'review', title: item.title, subtitle: item.spanishOverview, route: `#/world/${world.id}/review/${id}`, item }
  })
  const verbs: WorldStop[] = verbIds.map((id) => {
    const verb = verbById.get(id)
    if (!verb) throw new Error(`World ${world.id} references missing verb ${id}`)
    return { id: `verb:${id}`, kind: 'verb', title: verb.base, subtitle: verb.meaning, route: `#/practice/verb/${id}`, verb }
  })
  const content = [...lessons, ...reviews]
  const stops = Array.from({ length: Math.max(content.length, verbs.length) }, (_, index) => [content[index], verbs[index]].filter((stop): stop is WorldStop => Boolean(stop))).flat()
  return { ...world, stops }
})

const allStops = worlds.flatMap((world) => world.stops)
const allLessonIds = allStops.filter((stop) => stop.kind === 'lesson').map((stop) => stop.id)
const allVerbIds = allStops.filter((stop) => stop.kind === 'verb').map((stop) => stop.verb.id)
if (worlds.some((world) => world.stops.length !== 20) || new Set(allStops.map((stop) => stop.id)).size !== allStops.length || allLessonIds.length !== allItems.length || new Set(allLessonIds).size !== allItems.length || allVerbIds.length !== irregularVerbs.length || new Set(allVerbIds).size !== irregularVerbs.length) {
  throw new Error('World map must contain 20 unique stops per world, every lesson once, and every irregular verb once.')
}

export const findWorld = (id: string) => worlds.find((world) => world.id === id)
