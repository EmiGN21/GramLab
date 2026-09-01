export type Level = 'A1' | 'A2' | 'B1' | 'B2'

export type TopicStatus = 'ready' | 'coming-soon'

export type GrammarCategory =
  | 'Tenses & time'
  | 'Verbs & forms'
  | 'Parts of speech'
  | 'Pronouns & determiners'
  | 'Prepositions & location'
  | 'Questions & connectors'
  | 'Quantity & comparison'
  | 'Modals & functions'
  | 'Everyday usage'

export type WordRole = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'auxiliary' | 'connector'

export type TermLink = {
  kind: 'topic' | 'verb'
  targetId: string
  sectionId?: string
}

export type ContentToken = {
  text: string
  role?: WordRole
  link?: TermLink
}

export type RichExample = {
  tokens: ContentToken[]
  spanish: string
  note?: string
}

export type ReferenceRow = {
  key: string
  meaning: string
  example: string
  spanishMeaning?: string
  spanishExample?: string
}

export type ReferenceSection = {
  id: string
  title: string
  quickAnswer: string
  spanishTitle?: string
  spanishQuickAnswer?: string
  whenToUse?: string[]
  spanishWhenToUse?: string[]
  pattern?: string
  rows?: ReferenceRow[]
  examples?: RichExample[]
  contrasts?: string[]
  spanishContrasts?: string[]
  mistakes?: string[]
  spanishMistakes?: string[]
  links?: TermLink[]
}

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
  tokens?: ContentToken[]
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
  rows: Array<{ left: string; middle: string; right?: string; spanishLeft?: string; spanishMiddle?: string; spanishRight?: string }>
  notes: string[]
  relatedTopicIds: string[]
  exercise?: Exercise
  aliases?: string[]
  keywords?: string[]
  sections?: ReferenceSection[]
}

export type GrammarTopic = {
  id: string
  title: string
  shortTitle: string
  level: Level
  category: string
  status: TopicStatus
  overview: string
  spanishOverview: string
  uses: string[]
  structures: Structure[]
  examples: Example[]
  traps: string[]
  relatedTopicIds: string[]
  exercises: Exercise[]
  aliases?: string[]
  keywords?: string[]
  sections?: ReferenceSection[]
}

export type LearningItem = GrammarTopic | GrammarTable

export type TopicProgress = {
  attempts: number
  correct: number
  completed: boolean
  lastPracticedAt?: string
}

export type LegacyProgressRecord = {
  version: 1
  topics: Record<string, TopicProgress>
}

export type TopicNote = {
  text: string
  updatedAt: string
}

export type ProgressRecord = {
  version: 2
  topics: Record<string, TopicProgress>
  notes: Record<string, TopicNote>
}

export type VerbEntry = {
  id: string
  base: string
  past: string
  participle: string
  meaning: string
  examples: [string, string]
  aliases?: string[]
}

export type SearchResult = {
  id: string
  kind: 'topic' | 'section' | 'verb'
  title: string
  subtitle: string
  route: string
  category: GrammarCategory
  searchableText: string
}
