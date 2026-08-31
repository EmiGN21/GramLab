import type { Exercise, GrammarTable, GrammarTopic, LearningItem, Level } from '../types'

const choice = (id: string, prompt: string, options: string[], correctIndex: number, explanation: string): Exercise => ({
  id, type: 'choice', prompt, options, correctIndex, explanation,
})

const order = (id: string, prompt: string, words: string[], answer: string, explanation: string): Exercise => ({
  id, type: 'order', prompt, words, answer, explanation,
})

const input = (id: string, prompt: string, placeholder: string, acceptedAnswers: string[], explanation: string): Exercise => ({
  id, type: 'input', prompt, placeholder, acceptedAnswers, explanation,
})

const comingTense = (id: string, title: string, level: Level): GrammarTopic => ({
  id,
  title,
  shortTitle: title.replace(' tense', ''),
  level,
  category: 'Tense',
  status: 'coming-soon',
  overview: 'This pattern is mapped in your grammar canvas and will be expanded in the next study stage.',
  spanishOverview: 'Esta estructura ya está ubicada en tu mapa; la explicación y práctica llegarán en la siguiente etapa.',
  uses: [],
  structures: [],
  examples: [],
  traps: [],
  relatedTopicIds: [],
  exercises: [],
})

export const topics: GrammarTopic[] = [
  {
    id: 'present-simple', title: 'Present Simple', shortTitle: 'Present Simple', level: 'A1', category: 'Tense', status: 'ready',
    overview: 'Use it for routines, facts, and things that happen regularly.',
    spanishOverview: 'Úsalo para rutinas, hechos y acciones que ocurren regularmente.',
    uses: ['habits and routines', 'facts and general truths', 'schedules and timetables'],
    structures: [
      { label: 'Affirmative', formula: 'Subject + base verb / verb + -s', translation: 'He, she, and it add -s or -es.', example: 'She works from home.' },
      { label: 'Negative', formula: 'Subject + do/does not + base verb', translation: 'Use does not with he, she, and it.', example: 'He does not work on Sundays.' },
      { label: 'Question', formula: 'Do/Does + subject + base verb?', translation: 'The main verb stays in the base form.', example: 'Does she work here?' },
    ],
    examples: [
      { english: 'I study English every evening.', spanish: 'Estudio inglés cada tarde.' },
      { english: 'My brother watches movies on Fridays.', spanish: 'Mi hermano ve películas los viernes.', note: 'watch → watches' },
      { english: 'Do they live near the school?', spanish: '¿Viven cerca de la escuela?' },
    ],
    traps: ['Do not use “does” and “works” together: say “Does she work?”, not “Does she works?”.', 'Use an adverb of frequency before the main verb: “I usually walk.”'],
    relatedTopicIds: ['question-words', 'have-got', 'present-continuous'],
    exercises: [
      choice('ps-1', 'Choose the correct sentence.', ['She don’t like coffee.', 'She doesn’t likes coffee.', 'She doesn’t like coffee.'], 2, 'With she, use doesn’t + base verb: like.'),
      input('ps-2', 'Complete: My class ___ at 9:00 a.m. (start)', 'starts', ['starts'], 'Schedules use the Present Simple. With “class”, add -s: starts.'),
    ],
  },
  {
    id: 'present-continuous', title: 'Present Continuous', shortTitle: 'Present Continuous', level: 'A1', category: 'Tense', status: 'ready',
    overview: 'Use it for actions happening now, around now, or temporary situations.',
    spanishOverview: 'Úsalo para acciones que están pasando ahora, alrededor de ahora o situaciones temporales.',
    uses: ['actions happening now', 'temporary situations', 'arrangements already planned'],
    structures: [
      { label: 'Affirmative', formula: 'Subject + am/is/are + verb-ing', translation: 'Choose be from the subject.', example: 'I am reading a new book.' },
      { label: 'Negative', formula: 'Subject + am/is/are not + verb-ing', translation: 'not goes after am, is, or are.', example: 'They are not sleeping.' },
      { label: 'Question', formula: 'Am/Is/Are + subject + verb-ing?', translation: 'Start the question with be.', example: 'Are you working now?' },
    ],
    examples: [
      { english: 'We are learning the new words today.', spanish: 'Estamos aprendiendo las palabras nuevas hoy.' },
      { english: 'Is Ana cooking dinner?', spanish: '¿Ana está cocinando la cena?' },
      { english: 'He is not wearing a coat.', spanish: 'Él no lleva puesto un abrigo.' },
    ],
    traps: ['Do not omit be: say “She is studying”, not “She studying”.', 'Some verbs are not normally continuous: “I know”, “I like”, “I need”.'],
    relatedTopicIds: ['present-simple', 'past-continuous'],
    exercises: [
      order('pc-1', 'Put the words in order.', ['now', 'are', 'we', 'dinner', 'making'], 'we are making dinner now', 'Use subject + are + verb-ing.'),
      choice('pc-2', 'Which verb form fits? “Look! The bus ___.”', ['comes', 'is coming', 'come'], 1, 'Look! signals something happening now: is coming.'),
    ],
  },
  {
    id: 'past-simple', title: 'Past Simple', shortTitle: 'Past Simple', level: 'A1', category: 'Tense', status: 'ready',
    overview: 'Use it for completed actions at a finished time in the past.',
    spanishOverview: 'Úsalo para acciones terminadas en un momento acabado del pasado.',
    uses: ['finished actions', 'past habits or events', 'a sequence of completed actions'],
    structures: [
      { label: 'Affirmative', formula: 'Subject + past form', translation: 'Regular verbs usually add -ed; irregular verbs change.', example: 'We visited our friends.' },
      { label: 'Negative', formula: 'Subject + did not + base verb', translation: 'After did not, use the base verb.', example: 'I did not call yesterday.' },
      { label: 'Question', formula: 'Did + subject + base verb?', translation: 'Did carries the past meaning.', example: 'Did you see the movie?' },
    ],
    examples: [
      { english: 'Last night, I watched a documentary.', spanish: 'Anoche vi un documental.' },
      { english: 'Wendy bought a new phone.', spanish: 'Wendy compró un teléfono nuevo.', note: 'buy → bought' },
      { english: 'Did he eat breakfast?', spanish: '¿Él desayunó?' },
    ],
    traps: ['Do not use a double past: say “Did you go?”, not “Did you went?”.', 'Use a finished time expression: yesterday, last week, in 2024.'],
    relatedTopicIds: ['past-continuous', 'used-to', 'there-be'],
    exercises: [
      choice('past-1', 'Choose the correct question.', ['Did they went home?', 'Did they go home?', 'Do they went home?'], 1, 'After did, the verb is go, not went.'),
      input('past-2', 'Complete: I ___ my keys yesterday. (lose)', 'lost', ['lost'], 'Lose is irregular: lose → lost.'),
    ],
  },
  {
    id: 'past-continuous', title: 'Past Continuous', shortTitle: 'Past Continuous', level: 'A2', category: 'Tense', status: 'ready',
    overview: 'Use it for an action that was in progress at a particular time in the past.',
    spanishOverview: 'Úsalo para una acción que estaba en progreso en un momento del pasado.',
    uses: ['an action in progress in the past', 'background for a shorter event', 'two actions happening at the same time'],
    structures: [
      { label: 'Affirmative', formula: 'Subject + was/were + verb-ing', translation: 'I, he, she, it → was. You, we, they → were.', example: 'They were walking home.' },
      { label: 'Negative', formula: 'Subject + was/were not + verb-ing', translation: 'wasn’t / weren’t are common contractions.', example: 'I was not sleeping.' },
      { label: 'Question', formula: 'Was/Were + subject + verb-ing?', translation: 'Start with was or were.', example: 'Were you studying at 8:00?' },
    ],
    examples: [
      { english: 'I was cooking when you called.', spanish: 'Estaba cocinando cuando llamaste.' },
      { english: 'They were not listening.', spanish: 'Ellos no estaban escuchando.' },
      { english: 'What were you doing last night?', spanish: '¿Qué estabas haciendo anoche?' },
    ],
    traps: ['Use the Past Simple for the short interrupting action: “I was walking when it started to rain.”', 'Do not use was with plural subjects: “We were”, not “We was”.'],
    relatedTopicIds: ['past-simple', 'present-continuous'],
    exercises: [choice('pastc-1', 'Complete: At 10:00 p.m., they ___ TV.', ['watched', 'were watching', 'are watching'], 1, 'At a specific past time, use were + verb-ing.')],
  },
  {
    id: 'future-simple', title: 'Future with will', shortTitle: 'Future (will)', level: 'A1', category: 'Tense', status: 'ready',
    overview: 'Use will for quick decisions, predictions, promises, and offers.',
    spanishOverview: 'Usa will para decisiones rápidas, predicciones, promesas y ofrecimientos.',
    uses: ['a decision made now', 'predictions', 'promises and offers'],
    structures: [
      { label: 'Affirmative', formula: 'Subject + will + base verb', translation: 'will is the same for every subject.', example: 'I will help you.' },
      { label: 'Negative', formula: 'Subject + will not + base verb', translation: 'will not = won’t.', example: 'She will not forget.' },
      { label: 'Question', formula: 'Will + subject + base verb?', translation: 'Use the base verb after will.', example: 'Will you call me?' },
    ],
    examples: [
      { english: 'I think it will rain tomorrow.', spanish: 'Creo que lloverá mañana.' },
      { english: 'I will carry that for you.', spanish: 'Te llevaré eso.' },
      { english: 'Will they join us later?', spanish: '¿Se unirán a nosotros después?' },
    ],
    traps: ['Do not add to after will: “I will study”, not “I will to study”.', 'Use going to for a prior plan; use will for a decision made now.'],
    relatedTopicIds: ['used-to', 'there-be'],
    exercises: [order('future-1', 'Put the promise in order.', ['will', 'I', 'forget', 'not'], 'i will not forget', 'Will + base verb makes a future promise.')],
  },
  {
    id: 'present-perfect', title: 'Present Perfect', shortTitle: 'Present Perfect', level: 'A2', category: 'Tense', status: 'ready',
    overview: 'Use it for life experiences and past actions connected to the present when the exact time is not important.',
    spanishOverview: 'Úsalo para experiencias y acciones pasadas conectadas con el presente cuando la hora exacta no importa.',
    uses: ['life experiences', 'recent results', 'an unfinished time period'],
    structures: [
      { label: 'Affirmative', formula: 'Subject + have/has + past participle', translation: 'He, she, it use has.', example: 'She has visited Mexico.' },
      { label: 'Negative', formula: 'Subject + have/has not + past participle', translation: 'have not = haven’t; has not = hasn’t.', example: 'I have not finished yet.' },
      { label: 'Question', formula: 'Have/Has + subject + past participle?', translation: 'ever often asks about experience.', example: 'Have you ever tried sushi?' },
    ],
    examples: [
      { english: 'I have never been to Paris.', spanish: 'Nunca he estado en París.' },
      { english: 'Has he done his homework yet?', spanish: '¿Él ya ha hecho su tarea?' },
      { english: 'We have just arrived.', spanish: 'Acabamos de llegar.' },
    ],
    traps: ['Do not use a finished time such as yesterday with Present Perfect.', 'Learn irregular participles: go → gone, do → done, see → seen.'],
    relatedTopicIds: ['ever-never', 'past-simple', 'have-got'],
    exercises: [choice('pp-1', 'Choose the correct sentence.', ['I have seen her yesterday.', 'I saw her yesterday.', 'I have saw her yesterday.'], 1, 'Yesterday is a finished time, so use the Past Simple: saw.')],
  },
  comingTense('future-continuous', 'Future Continuous', 'B1'),
  comingTense('past-perfect', 'Past Perfect', 'B1'),
  comingTense('future-perfect', 'Future Perfect', 'B2'),
  comingTense('past-perfect-continuous', 'Past Perfect Continuous', 'B2'),
  comingTense('present-perfect-continuous', 'Present Perfect Continuous', 'B1'),
  comingTense('future-perfect-continuous', 'Future Perfect Continuous', 'B2'),
]

export const tables: GrammarTable[] = [
  {
    id: 'pronouns', title: 'Pronouns & possessives', subtitle: 'Who? Whom? Whose?', level: 'A1', category: 'Building blocks', status: 'ready',
    overview: 'Choose a subject pronoun for the doer, an object pronoun after a verb or preposition, and a possessive word for ownership.',
    spanishOverview: 'Usa un pronombre sujeto para quien hace la acción, objeto después de verbo o preposición, y posesivo para pertenencia.',
    rows: [
      { left: 'I', middle: 'me / my / mine', right: 'I called my friend.' },
      { left: 'she', middle: 'her / her / hers', right: 'This is her book.' },
      { left: 'he', middle: 'him / his / his', right: 'The apple is for him.' },
      { left: 'it', middle: 'it / its', right: 'The bird is in its cage.' },
      { left: 'we', middle: 'us / our / ours', right: 'Our pizza is here.' },
      { left: 'they', middle: 'them / their / theirs', right: 'Their house is blue.' },
    ],
    notes: ['its = possession; it’s = it is.', 'Do not use “my” alone: say “my book” or “mine”.'],
    relatedTopicIds: ['present-simple', 'have-got'],
    exercise: choice('pro-1', 'Choose the correct word: “I am speaking to ___.”', ['she', 'her', 'hers'], 1, 'After to, use the object pronoun: her.'),
  },
  {
    id: 'there-be', title: 'There is / There are', subtitle: 'Say that something exists', level: 'A1', category: 'Building blocks', status: 'ready',
    overview: 'Use there is for one thing and there are for more than one thing.',
    spanishOverview: 'Usa there is para una cosa y there are para más de una.',
    rows: [
      { left: 'Singular', middle: 'There is / Is there…?', right: 'There is an apple.' },
      { left: 'Plural', middle: 'There are / Are there…?', right: 'There are five trees.' },
      { left: 'Past', middle: 'There was / There were', right: 'There were some flowers.' },
      { left: 'Future', middle: 'There will be', right: 'There will be a class.' },
    ],
    notes: ['Use any in most questions and negatives: “Are there any chairs?”', 'There is can contract to there’s; do not normally contract there are.'],
    relatedTopicIds: ['countable-quantifiers', 'past-simple', 'future-simple'],
    exercise: input('there-1', 'Complete: ___ there any apples on the table?', 'Are', ['are'], 'Use Are there with plural apples.'),
  },
  {
    id: 'articles', title: 'Articles: a / an / the', subtitle: 'Small words, clear meaning', level: 'A1', category: 'Building blocks', status: 'ready',
    overview: 'Use a or an for one non-specific countable noun. Use the for a specific thing that both people can identify.',
    spanishOverview: 'Usa a o an para un sustantivo contable singular no específico. Usa the para algo específico.',
    rows: [
      { left: 'a', middle: 'before a consonant sound', right: 'a book, a university' },
      { left: 'an', middle: 'before a vowel sound', right: 'an apple, an hour' },
      { left: 'the', middle: 'a specific thing', right: 'the book on the table' },
    ],
    notes: ['Choose by sound, not only spelling: an hour but a university.', 'Do not use a/an with plural nouns.'],
    relatedTopicIds: ['countable-quantifiers', 'there-be'],
    exercise: choice('art-1', 'Choose the correct article: “She is ___ honest person.”', ['a', 'an', 'the'], 1, 'Honest starts with a vowel sound, so use an.'),
  },
  {
    id: 'countable-quantifiers', title: 'Countable & uncountable', subtitle: 'How many? How much?', level: 'A1', category: 'Questions & quantity', status: 'ready',
    overview: 'Countable nouns can be counted. Uncountable nouns are measured or treated as a mass.',
    spanishOverview: 'Los sustantivos contables se pueden contar. Los incontables se miden o se tratan como una masa.',
    rows: [
      { left: 'Countable', middle: 'many / a few / How many?', right: 'How many books?' },
      { left: 'Uncountable', middle: 'much / a little / How much?', right: 'How much water?' },
      { left: 'Both', middle: 'some / any / a lot of', right: 'some apples / some milk' },
    ],
    notes: ['Use some in affirmative sentences and offers; use any in most questions and negatives.', 'Information, advice, and furniture are uncountable in English.'],
    relatedTopicIds: ['there-be', 'articles'],
    exercise: choice('quant-1', 'Which question is correct?', ['How much books do you have?', 'How many books do you have?', 'How many water do you have?'], 1, 'Books are countable plural, so use how many.'),
  },
  {
    id: 'question-words', title: 'Questions & auxiliaries', subtitle: 'Ask for the missing information', level: 'A1', category: 'Questions & quantity', status: 'ready',
    overview: 'Question words ask for a specific detail. In many Present Simple questions, use do or does after the question word.',
    spanishOverview: 'Las palabras interrogativas piden un detalle. En muchas preguntas en Present Simple, usa do o does después.',
    rows: [
      { left: 'What / Which', middle: 'thing or choice', right: 'Which book do you prefer?' },
      { left: 'Where / When', middle: 'place or time', right: 'Where do you live?' },
      { left: 'Who / Whose', middle: 'person or possession', right: 'Whose bag is this?' },
      { left: 'Why / How', middle: 'reason or method', right: 'How does it work?' },
    ],
    notes: ['Do not use do/does with be: “Where are you?”', 'Use which when the choices are limited or known.'],
    relatedTopicIds: ['present-simple', 'past-simple', 'prepositions'],
    exercise: order('question-1', 'Put the question in order.', ['do', 'where', 'you', 'live'], 'where do you live', 'Use question word + do + subject + base verb.'),
  },
  {
    id: 'prepositions', title: 'Prepositions of time & place', subtitle: 'at, in, on', level: 'A1', category: 'Building blocks', status: 'ready',
    overview: 'At, in, and on connect a noun to a time or place. Learn them in useful groups.',
    spanishOverview: 'At, in y on conectan un sustantivo con un lugar o tiempo. Apréndelos en grupos útiles.',
    rows: [
      { left: 'at', middle: 'a precise time / point', right: 'at 6 o’clock, at home' },
      { left: 'in', middle: 'months, years, large spaces', right: 'in January, in Mexico' },
      { left: 'on', middle: 'days and surfaces', right: 'on Friday, on the table' },
      { left: 'between / behind / next to', middle: 'position', right: 'The bag is behind the chair.' },
    ],
    notes: ['Say in the morning, but on Monday morning.', 'Use at night, not in night.'],
    relatedTopicIds: ['there-be', 'question-words'],
    exercise: choice('prep-1', 'Complete: My lesson is ___ Friday.', ['at', 'in', 'on'], 2, 'Use on with days of the week.'),
  },
  {
    id: 'modals', title: 'Modal verbs', subtitle: 'Ability, possibility & advice', level: 'A2', category: 'Modals', status: 'ready',
    overview: 'Modal verbs add meaning before a base verb. They do not change for he, she, or it.',
    spanishOverview: 'Los modales añaden significado antes de un verbo base. No cambian con he, she o it.',
    rows: [
      { left: 'can / could', middle: 'ability or polite request', right: 'Could you help me?' },
      { left: 'may / might', middle: 'possibility', right: 'It might rain later.' },
      { left: 'should / ought to', middle: 'advice', right: 'You should rest.' },
      { left: 'would', middle: 'polite wishes / preferences', right: 'I would like some tea.' },
    ],
    notes: ['Use a base verb after a modal: “She can swim”, not “can swims”.', 'Could is often more polite than can.'],
    relatedTopicIds: ['future-simple', 'used-to'],
    exercise: choice('modal-1', 'Choose the best advice: “I feel sick.”', ['You should rest.', 'You should to rest.', 'You rest should.'], 0, 'Should + base verb gives advice.'),
  },
  {
    id: 'have-got', title: 'Have got', subtitle: 'Possession in everyday English', level: 'A1', category: 'Building blocks', status: 'ready',
    overview: 'Have got is common for possession, family relationships, and physical features.',
    spanishOverview: 'Have got es común para posesión, relaciones familiares y rasgos físicos.',
    rows: [
      { left: 'I / you / we / they', middle: 'have got', right: 'They have got a car.' },
      { left: 'he / she / it', middle: 'has got', right: 'She has got a headache.' },
      { left: 'Question', middle: 'Have/Has + subject + got…?', right: 'Have you got time?' },
      { left: 'Negative', middle: 'haven’t / hasn’t got', right: 'He hasn’t got a bike.' },
    ],
    notes: ['I’ve got = I have got; she’s got = she has got.', 'For actions, use have without got: “I have lunch at noon.”'],
    relatedTopicIds: ['pronouns', 'present-simple'],
    exercise: input('got-1', 'Complete: She ___ got two sisters.', 'has', ['has'], 'With she, use has got.'),
  },
  {
    id: 'used-to', title: 'Used to', subtitle: 'A past habit or state', level: 'A2', category: 'Building blocks', status: 'ready',
    overview: 'Use used to for a past habit or state that is no longer true or important now.',
    spanishOverview: 'Usa used to para un hábito o estado del pasado que ya no es verdad o importante ahora.',
    rows: [
      { left: 'Affirmative', middle: 'subject + used to + base verb', right: 'I used to walk here.' },
      { left: 'Negative', middle: 'subject + didn’t use to + base verb', right: 'I didn’t use to like tea.' },
      { left: 'Question', middle: 'Did + subject + use to + base verb?', right: 'Did you use to live here?' },
    ],
    notes: ['In questions and negatives, use use (not used) after did/didn’t.', 'Do not use it for one completed action.'],
    relatedTopicIds: ['past-simple', 'modals'],
    exercise: choice('used-1', 'Choose the correct sentence.', ['Did you used to play soccer?', 'Did you use to play soccer?', 'Do you use to play soccer?'], 1, 'After did, use the base form: use to.'),
  },
  {
    id: 'ever-never', title: 'Ever & never', subtitle: 'Talk about experience', level: 'A2', category: 'Questions & quantity', status: 'ready',
    overview: 'Use ever mainly in questions about life experience. Use never for an experience that has not happened.',
    spanishOverview: 'Usa ever principalmente en preguntas sobre experiencias. Usa never para una experiencia que no ha ocurrido.',
    rows: [
      { left: 'ever', middle: 'Have you ever + participle…?', right: 'Have you ever flown?' },
      { left: 'never', middle: 'have/has never + participle', right: 'I have never flown.' },
      { left: 'already / yet', middle: 'recent completion / not completed', right: 'Have you finished yet?' },
    ],
    notes: ['Never is already negative in meaning: do not add not.', 'Use yet mainly in questions and negatives.'],
    relatedTopicIds: ['present-perfect'],
    exercise: choice('ever-1', 'Choose the question about experience.', ['Did you ever been to Canada?', 'Have you ever been to Canada?', 'Have you ever go to Canada?'], 1, 'Have you ever + past participle: been.'),
  },
]

export const allItems: LearningItem[] = [...topics, ...tables]

export const findItem = (id: string) => allItems.find((item) => item.id === id)
export const findTopic = (id: string) => topics.find((topic) => topic.id === id)

export const tenseColumns = ['Past', 'Present', 'Future'] as const
export const tenseRows = ['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'] as const
export const tenseGrid: Record<string, string> = {
  'Past-Simple': 'past-simple',
  'Present-Simple': 'present-simple',
  'Future-Simple': 'future-simple',
  'Past-Continuous': 'past-continuous',
  'Present-Continuous': 'present-continuous',
  'Future-Continuous': 'future-continuous',
  'Past-Perfect': 'past-perfect',
  'Present-Perfect': 'present-perfect',
  'Future-Perfect': 'future-perfect',
  'Past-Perfect Continuous': 'past-perfect-continuous',
  'Present-Perfect Continuous': 'present-perfect-continuous',
  'Future-Perfect Continuous': 'future-perfect-continuous',
}

export const routeByLevel: Array<{ level: Level; title: string; description: string; ids: string[] }> = [
  { level: 'A1', title: 'Core sentence building', description: 'Build clear everyday sentences.', ids: ['pronouns', 'articles', 'there-be', 'present-simple', 'present-continuous', 'past-simple', 'future-simple', 'question-words', 'prepositions', 'countable-quantifiers', 'have-got'] },
  { level: 'A2', title: 'Time, experience & meaning', description: 'Connect ideas across time.', ids: ['past-continuous', 'present-perfect', 'ever-never', 'used-to', 'modals'] },
  { level: 'B1', title: 'More precise timelines', description: 'Planned next: longer and connected events.', ids: ['future-continuous', 'past-perfect', 'present-perfect-continuous'] },
  { level: 'B2', title: 'Advanced control', description: 'Planned next: nuanced time and complex patterns.', ids: ['future-perfect', 'past-perfect-continuous', 'future-perfect-continuous'] },
]
