export type Level = 'A1' | 'A2' | 'B1' | 'B2'

export type TopicStatus = 'ready' | 'coming-soon'

export type Structure = {
  label: 'Affirmative' | 'Negative' | 'Question'
  formula: string
  translation: string
  example: string
}

export type Example = {
  english: string
  spanish: string
  note?: string
}

export type ChoiceExercise = {
  id: string
  type: 'choice'
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type OrderExercise = {
  id: string
  type: 'order'
  prompt: string
  words: string[]
  answer: string
  explanation: string
}

export type InputExercise = {
  id: string
  type: 'input'
  prompt: string
  placeholder: string
  acceptedAnswers: string[]
  explanation: string
}

export type Exercise = ChoiceExercise | OrderExercise | InputExercise

export type GrammarTable = {
  id: string
  title: string
  subtitle: string
  level: Level
  category: string
  status: TopicStatus
  overview: string
  spanishOverview: string
  rows: Array<{ left: string; middle: string; right?: string }>
  notes: string[]
  relatedTopicIds: string[]
  exercise?: Exercise
}

export type GrammarTopic = {
  id: string
  title: string
  shortTitle: string
  level: Level
  category: 'Tense' | 'Building blocks' | 'Modals' | 'Questions & quantity'
  status: TopicStatus
  overview: string
  spanishOverview: string
  uses: string[]
  structures: Structure[]
  examples: Example[]
  traps: string[]
  relatedTopicIds: string[]
  exercises: Exercise[]
}

export type LearningItem = GrammarTopic | GrammarTable

export type TopicProgress = {
  attempts: number
  correct: number
  completed: boolean
  lastPracticedAt?: string
}

export type ProgressRecord = {
  version: 1
  topics: Record<string, TopicProgress>
}
