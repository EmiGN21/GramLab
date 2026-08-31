import { allItems } from './catalog'
import { irregularVerbs } from './verbs'

export type ContentIssue = { type: 'duplicate' | 'broken-topic' | 'broken-section' | 'broken-verb' | 'verb-count'; detail: string }

export const validateContent = (): ContentIssue[] => {
  const issues: ContentIssue[] = []
  const ids = new Set<string>()
  const verbIds = new Set(irregularVerbs.map((entry) => entry.id))
  allItems.forEach((item) => {
    if (ids.has(item.id)) issues.push({ type: 'duplicate', detail: `ID duplicado: ${item.id}` })
    ids.add(item.id)
  })
  allItems.forEach((item) => {
    const sectionIds = new Set<string>()
    ;(item.sections ?? []).forEach((entry) => {
      if (sectionIds.has(entry.id)) issues.push({ type: 'duplicate', detail: `Sección duplicada: ${item.id}#${entry.id}` })
      sectionIds.add(entry.id)
    })
    item.relatedTopicIds.forEach((target) => {
      if (!ids.has(target)) issues.push({ type: 'broken-topic', detail: `${item.id} → ${target}` })
    })
    ;(item.sections ?? []).flatMap((entry) => entry.links ?? []).forEach((term) => {
      if (term.kind === 'verb' && !verbIds.has(term.targetId)) issues.push({ type: 'broken-verb', detail: `${item.id} → ${term.targetId}` })
      if (term.kind === 'topic') {
        const target = allItems.find((candidate) => candidate.id === term.targetId)
        if (!target) issues.push({ type: 'broken-topic', detail: `${item.id} → ${term.targetId}` })
        else if (term.sectionId && !(target.sections ?? []).some((entry) => entry.id === term.sectionId)) issues.push({ type: 'broken-section', detail: `${item.id} → ${term.targetId}#${term.sectionId}` })
      }
    })
  })
  if (irregularVerbs.length !== 100) issues.push({ type: 'verb-count', detail: `Se esperaban 100 verbos; hay ${irregularVerbs.length}.` })
  if (verbIds.size !== irregularVerbs.length) issues.push({ type: 'duplicate', detail: 'Hay IDs de verbos duplicados.' })
  return issues
}

export const contentIssues = validateContent()
