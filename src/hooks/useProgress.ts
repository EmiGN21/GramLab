import { useEffect, useMemo, useState } from 'react'
import type { ProgressRecord } from '../types'

const STORAGE_KEY = 'grammar-canvas-progress-v1'

const emptyProgress = (): ProgressRecord => ({ version: 1, topics: {} })

const readProgress = (): ProgressRecord => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyProgress()
    const parsed = JSON.parse(saved) as ProgressRecord
    if (parsed.version !== 1 || !parsed.topics || typeof parsed.topics !== 'object') return emptyProgress()
    return parsed
  } catch {
    return emptyProgress()
  }
}

const validRecord = (value: unknown): value is ProgressRecord => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as ProgressRecord
  return candidate.version === 1 && !!candidate.topics && typeof candidate.topics === 'object'
}

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressRecord>(readProgress)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const recordAttempt = (topicId: string, correct: boolean) => {
    setProgress((current) => {
      const previous = current.topics[topicId] ?? { attempts: 0, correct: 0, completed: false }
      const nextCorrect = previous.correct + (correct ? 1 : 0)
      return {
        ...current,
        topics: {
          ...current.topics,
          [topicId]: {
            attempts: previous.attempts + 1,
            correct: nextCorrect,
            completed: previous.completed || correct,
            lastPracticedAt: new Date().toISOString(),
          },
        },
      }
    })
  }

  const resetProgress = () => setProgress(emptyProgress())

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'grammar-canvas-progress.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importProgress = async (file: File) => {
    const raw = await file.text()
    const parsed: unknown = JSON.parse(raw)
    if (!validRecord(parsed)) throw new Error('That file is not a Grammar Canvas progress backup.')
    setProgress(parsed)
  }

  const summary = useMemo(() => ({
    completed: Object.values(progress.topics).filter((topic) => topic.completed).length,
    attempts: Object.values(progress.topics).reduce((total, topic) => total + topic.attempts, 0),
  }), [progress])

  return { progress, recordAttempt, resetProgress, exportProgress, importProgress, summary }
}
