import { useEffect, useMemo, useState } from 'react'
import type { LegacyProgressRecord, ProgressRecord } from '../types'

const STORAGE_KEY = 'gramlab-data-v2'
const LEGACY_KEY = 'grammar-canvas-progress-v1'

const emptyProgress = (): ProgressRecord => ({ version: 2, topics: {}, notes: {} })
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object'
const isLegacy = (value: unknown): value is LegacyProgressRecord => isObject(value) && value.version === 1 && isObject(value.topics)
const isCurrent = (value: unknown): value is ProgressRecord => isObject(value) && value.version === 2 && isObject(value.topics) && isObject(value.notes)
const migrate = (value: LegacyProgressRecord): ProgressRecord => ({ version: 2, topics: value.topics, notes: {} })

const readProgress = (): ProgressRecord => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (isCurrent(parsed)) return parsed
      if (isLegacy(parsed)) return migrate(parsed)
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy)
      if (isLegacy(parsed)) return migrate(parsed)
    }
  } catch {
    // A corrupt value should never prevent GramLab from opening.
  }
  return emptyProgress()
}

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressRecord>(readProgress)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const recordAttempt = (topicId: string, correct: boolean) => {
    setProgress((current) => {
      const previous = current.topics[topicId] ?? { attempts: 0, correct: 0, completed: false }
      return {
        ...current,
        topics: {
          ...current.topics,
          [topicId]: {
            attempts: previous.attempts + 1,
            correct: previous.correct + (correct ? 1 : 0),
            completed: previous.completed || correct,
            lastPracticedAt: new Date().toISOString(),
          },
        },
      }
    })
  }

  const saveNote = (topicId: string, text: string) => {
    setProgress((current) => ({ ...current, notes: { ...current.notes, [topicId]: { text, updatedAt: new Date().toISOString() } } }))
  }

  const resetProgress = () => setProgress(emptyProgress())

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'gramlab-backup.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importProgress = async (file: File) => {
    const parsed: unknown = JSON.parse(await file.text())
    if (isCurrent(parsed)) setProgress(parsed)
    else if (isLegacy(parsed)) setProgress(migrate(parsed))
    else throw new Error('This file is not a valid GramLab or Grammar Canvas backup.')
  }

  const summary = useMemo(() => ({
    completed: Object.values(progress.topics).filter((topic) => topic.completed).length,
    attempts: Object.values(progress.topics).reduce((total, topic) => total + topic.attempts, 0),
    notes: Object.values(progress.notes).filter((note) => note.text.trim()).length,
  }), [progress])

  return { progress, recordAttempt, saveNote, resetProgress, exportProgress, importProgress, summary }
}
