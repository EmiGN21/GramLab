import { tables as legacyTables, topics as legacyTopics } from './grammar'
import { irregularVerbs } from './verbs'
import type { ContentToken, GrammarCategory, GrammarTable, LearningItem, Level, ReferenceSection, SearchResult, TermLink, WordRole } from '../types'

export const categoryMeta: Array<{ id: GrammarCategory; label: string; description: string; mark: string }> = [
  { id: 'Tenses & time', label: 'Tiempos y tiempo', description: 'Ubica una acción en el pasado, presente o futuro.', mark: '12×' },
  { id: 'Verbs & forms', label: 'Verbos y formas', description: 'Infinitivo, pasado, participio y verbos compuestos.', mark: 'V' },
  { id: 'Parts of speech', label: 'Partes de la oración', description: 'La función de cada palabra dentro de una idea.', mark: 'Aa' },
  { id: 'Pronouns & determiners', label: 'Pronombres y determinantes', description: 'I, me, my, mine; this, that y posesión.', mark: 'P' },
  { id: 'Prepositions & location', label: 'Preposiciones y ubicación', description: 'At, in, on, to, for y relaciones espaciales.', mark: '@' },
  { id: 'Questions & connectors', label: 'Preguntas y conectores', description: 'Cómo pedir información y unir ideas.', mark: '?' },
  { id: 'Quantity & comparison', label: 'Cantidad y comparación', description: 'Some, any, few, little y cantidades.', mark: '±' },
  { id: 'Modals & functions', label: 'Modales y funciones', description: 'Capacidad, posibilidad, consejo y cortesía.', mark: 'M' },
  { id: 'Everyday usage', label: 'Uso cotidiano', description: 'Diferencias y frases que aparecen al conversar.', mark: '✦' },
]

export const roleMeta: Array<{ id: WordRole; label: string; example: string }> = [
  { id: 'noun', label: 'sustantivo', example: 'coffee' },
  { id: 'verb', label: 'verbo', example: 'study' },
  { id: 'adjective', label: 'adjetivo', example: 'clear' },
  { id: 'adverb', label: 'adverbio', example: 'usually' },
  { id: 'pronoun', label: 'pronombre', example: 'they' },
  { id: 'preposition', label: 'preposición', example: 'at' },
  { id: 'auxiliary', label: 'auxiliar', example: 'did' },
  { id: 'connector', label: 'conector', example: 'because' },
]

const link = (targetId: string, sectionId?: string, kind: TermLink['kind'] = 'topic'): TermLink => ({ kind, targetId, sectionId })
const token = (text: string, role?: WordRole, termLink?: TermLink): ContentToken => ({ text, role, link: termLink })

const section = (value: ReferenceSection): ReferenceSection => value

const metadata: Record<string, { category: GrammarCategory; aliases?: string[]; keywords?: string[]; sections?: ReferenceSection[] }> = {
  'present-simple': {
    category: 'Tenses & time', aliases: ['simple present', 'presente simple'], keywords: ['do', 'does', 'routine', 'habits'],
    sections: [section({ id: 'quick', title: 'Respuesta rápida', quickAnswer: 'Usa Present Simple para rutinas, hechos y horarios. En he/she/it el verbo afirmativo lleva -s; en preguntas usa does + verbo base.', pattern: 'Subject + base verb (or verb + -s)', links: [link('question-words'), link('frequency-adverbs')] })],
  },
  'present-continuous': {
    category: 'Tenses & time', aliases: ['present progressive', 'presente continuo'], keywords: ['now', 'ing', 'am is are'],
    sections: [section({ id: 'now', title: 'Una acción en progreso', quickAnswer: 'El auxiliar am/is/are coloca la acción en el presente; el verbo en -ing muestra que está en desarrollo.', pattern: 'Subject + am/is/are + verb-ing', examples: [{ tokens: [token('She', 'pronoun'), token(' is ', 'auxiliary'), token('studying', 'verb'), token(' now', 'adverb')], spanish: 'Ella está estudiando ahora.' }], mistakes: ['No omitas be: She is studying, no She studying.'], links: [link('present-simple')] })],
  },
  'past-simple': {
    category: 'Tenses & time', aliases: ['simple past', 'pasado simple'], keywords: ['did', 'yesterday', 'finished'],
    sections: [section({ id: 'did', title: 'Preguntas con did', quickAnswer: 'Did ya contiene el pasado; por eso el verbo principal vuelve a su forma base.', pattern: 'Did + subject + base verb?', examples: [{ tokens: [token('Did', 'auxiliary'), token(' you ', 'pronoun'), token('go', 'verb', link('go', undefined, 'verb')), token(' home?', 'noun')], spanish: '¿Fuiste a casa?' }], mistakes: ['Di Did you go?, no Did you went.'], links: [link('verbs')] })],
  },
  'past-continuous': { category: 'Tenses & time', aliases: ['past progressive', 'pasado continuo'], keywords: ['was were ing while when'] },
  'future-simple': { category: 'Tenses & time', aliases: ['future with will', 'futuro con will'], keywords: ['will', 'prediction', 'promise'] },
  'present-perfect': { category: 'Tenses & time', aliases: ['presente perfecto'], keywords: ['have has participle experience since for'], sections: [section({ id: 'experience', title: 'Experiencia y conexión con el presente', quickAnswer: 'Usa have/has + participio cuando importa el resultado o la experiencia, no un momento pasado terminado.', pattern: 'Subject + have/has + past participle', links: [link('ever-never'), link('already-yet-still'), link('verbs')] })] },
  pronouns: { category: 'Pronouns & determiners', aliases: ['subject pronouns', 'object pronouns', 'possessives', 'her his their'], keywords: ['I me my mine she her hers he him his they them their theirs'] },
  'there-be': { category: 'Everyday usage', aliases: ['there is there are', 'hay'], keywords: ['there was were will be existence'] },
  articles: { category: 'Parts of speech', aliases: ['a an the', 'artículos'], keywords: ['definite indefinite'] },
  'countable-quantifiers': { category: 'Quantity & comparison', aliases: ['countable uncountable', 'much many'], keywords: ['how much how many some any'] },
  'question-words': { category: 'Questions & connectors', aliases: ['wh questions', 'question words'], keywords: ['what which where when who whose why how do does did'] },
  prepositions: {
    category: 'Prepositions & location', aliases: ['at in on', 'prepositions of time', 'prepositions of place'], keywords: ['next to behind between in front of under over beside'],
    sections: [
      section({ id: 'at', title: 'AT · un punto preciso', quickAnswer: 'Usa at para una hora exacta o un punto visto como ubicación, no como espacio interior.', whenToUse: ['horas: at 6:30', 'puntos y eventos: at the door, at school', 'expresiones fijas: at night, at home'], pattern: 'at + precise point', rows: [{ key: 'time', meaning: 'hora exacta', example: 'The lesson starts at nine.' }, { key: 'place', meaning: 'punto o actividad', example: 'Meet me at the station.' }], contrasts: ['at the station = el punto; in the station = dentro del edificio'], mistakes: ['At night, pero in the morning.'], links: [link('prepositions', 'in'), link('prepositions', 'on')] }),
      section({ id: 'in', title: 'IN · dentro de un espacio', quickAnswer: 'Usa in para algo dentro de límites y para periodos amplios.', whenToUse: ['espacios: in the room', 'ciudades y países: in Chihuahua, in Mexico', 'meses, años y partes del día: in August, in 2026, in the morning'], pattern: 'in + enclosed space / broad period', rows: [{ key: 'place', meaning: 'dentro de', example: 'The keys are in the bag.' }, { key: 'time', meaning: 'periodo amplio', example: 'We travel in December.' }], contrasts: ['in the car, pero on the bus'], links: [link('prepositions', 'at'), link('prepositions', 'on')] }),
      section({ id: 'on', title: 'ON · sobre una superficie o día', quickAnswer: 'Usa on para contacto con una superficie y para días o fechas.', whenToUse: ['superficies: on the table', 'días y fechas: on Friday, on May 4', 'medios y tecnología: on the bus, on TV'], pattern: 'on + surface / day', rows: [{ key: 'place', meaning: 'sobre una superficie', example: 'Your phone is on the desk.' }, { key: 'time', meaning: 'día o fecha', example: 'I work on Monday.' }], mistakes: ['On Monday morning, aunque normalmente dices in the morning.'], links: [link('prepositions', 'at'), link('prepositions', 'in')] }),
      section({ id: 'position', title: 'Ubicación y relación espacial', quickAnswer: 'Estas expresiones indican dónde está una cosa respecto de otra.', rows: [{ key: 'next to / beside', meaning: 'al lado de', example: 'The pharmacy is next to the bank.' }, { key: 'between', meaning: 'entre dos elementos', example: 'The café is between the hotel and the museum.' }, { key: 'behind', meaning: 'detrás de', example: 'The bag is behind the chair.' }, { key: 'in front of', meaning: 'delante de', example: 'Wait in front of the building.' }, { key: 'under / below', meaning: 'debajo de', example: 'The shoes are under the bed.' }, { key: 'above / over', meaning: 'encima de', example: 'The lamp is above the table.' }], links: [link('there-be')] }),
    ],
  },
  modals: { category: 'Modals & functions', aliases: ['can could may might should ought to would'], keywords: ['ability possibility advice request'] },
  'have-got': { category: 'Pronouns & determiners', aliases: ['have got has got'], keywords: ['possession own'] },
  'used-to': { category: 'Tenses & time', aliases: ['used to past habits'], keywords: ['solía past state'] },
  'ever-never': { category: 'Tenses & time', aliases: ['ever never'], keywords: ['present perfect experience'] },
}

const reference = (id: string, title: string, subtitle: string, level: Level, category: GrammarCategory, overview: string, spanishOverview: string, rows: GrammarTable['rows'], notes: string[], relatedTopicIds: string[], aliases: string[] = [], keywords: string[] = [], sections: ReferenceSection[] = []): GrammarTable => ({
  id, title, subtitle, level, category, status: 'ready', overview, spanishOverview, rows, notes, relatedTopicIds, aliases, keywords, sections,
})

const addedItems: GrammarTable[] = [
  reference('numbers-time-age', 'Numbers, dates & age', 'Números para hablar de tiempo y edad', 'A1', 'Everyday usage', 'Use cardinal numbers for quantity and age, ordinal numbers for order and many dates, and at for clock times.', 'Usa números cardinales para cantidad y edad, ordinales para orden y muchas fechas, y at para la hora.', [
    { left: 'age', middle: 'be + number + years old', right: 'I am twenty years old. / How old are you?' }, { left: 'clock time', middle: 'at + time', right: 'The class starts at seven thirty.' }, { left: 'days', middle: 'on + day', right: 'We meet on Tuesday.' }, { left: 'dates', middle: 'month + ordinal in speech', right: 'My birthday is on May fourth.' },
  ], ['En inglés la edad usa be, no have.', 'Thirteen y thirty tienen acento distinto al hablar.'], ['prepositions', 'question-words'], ['numbers days age time date how old'], ['cardinal ordinal']),
  reference('do-auxiliary', 'Do: verb or auxiliary?', 'Hacer y construir preguntas', 'A1', 'Verbs & forms', 'Do can be the main verb meaning “hacer” or an auxiliary that carries tense and negation.', 'Do puede ser el verbo principal “hacer” o un auxiliar que carga el tiempo y la negación.', [
    { left: 'main verb', middle: 'do = hacer', right: 'I do my homework after dinner.' }, { left: 'question helper', middle: 'do/does/did + subject + base', right: 'Does she work here?' }, { left: 'negative helper', middle: "do/does/did + not + base", right: "They didn't go." }, { left: 'short answer', middle: 'repeat the auxiliary', right: 'Do you drive? Yes, I do.' },
  ], ['Después de does o did, el verbo principal queda en forma base.', 'Con be no añadas do: Where are you?'], ['present-simple', 'past-simple', 'question-words'], ['do does did auxiliary verb'], ['questions negatives short answers']),
  reference('food-restaurant', 'Restaurant & food phrases', 'Pedir alimentos con naturalidad', 'A1', 'Everyday usage', 'Use polite modal questions and countable or uncountable patterns to order food.', 'Usa preguntas modales corteses y patrones contables o incontables para pedir comida.', [
    { left: 'order', middle: "I'd like… / Can I have…?", right: "I'd like the soup, please." }, { left: 'ask', middle: 'Do you have…?', right: 'Do you have any vegetarian dishes?' }, { left: 'quantity', middle: 'some / a / an', right: 'Can I have some water and an apple?' }, { left: 'bill', middle: 'Could we have the check?', right: 'Could we have the check, please?' },
  ], ['Food suele ser incontable al hablar de comida en general; foods habla de tipos.', 'I want es correcto, pero I’d like suena más cortés al pedir.'], ['modals', 'some-any', 'countable-quantifiers'], ['restaurant food order menu check bill'], ['would like can I have']),
  reference('since-for', 'Since, for & how long', 'Inicio, duración y pregunta', 'A2', 'Tenses & time', 'Use since for the starting point, for for a duration, and how long to ask about duration.', 'Usa since para el punto de inicio, for para una duración y how long para preguntar cuánto tiempo.', [
    { left: 'since', middle: 'starting point', right: 'I have lived here since 2022.' }, { left: 'for', middle: 'length of time', right: 'I have lived here for four years.' }, { left: 'how long', middle: 'duration question', right: 'How long have you lived here?' },
  ], ['No confundas for + duración con during + evento o periodo nombrado.', 'Una situación que continúa suele usar Present Perfect.'], ['present-perfect', 'to-for', 'question-words'], ['since for how long duration'], ['present perfect time']),
  reference('verbs', 'Verb forms', 'Base, past and past participle', 'A1', 'Verbs & forms', 'The base form follows most auxiliaries; the past form tells a finished past action; the participle works with have or in the passive.', 'La forma base sigue a la mayoría de auxiliares; el pasado expresa una acción terminada; el participio acompaña a have o forma la pasiva.', [
    { left: 'base form', middle: 'after do, did, will, can…', right: 'Did you go? / I will go.' }, { left: 'past', middle: 'affirmative Past Simple', right: 'I went yesterday.' }, { left: 'past participle', middle: 'after have/has/had', right: 'She has gone home.' },
  ], ['Busca cualquier forma —por ejemplo went o written— para abrir su verbo base.', 'El diccionario contiene 100 verbos irregulares esenciales.'], ['past-simple', 'present-perfect', 'passive-voice'], ['verb forms base past participle irregular verbs'], ['went written gone'], [section({ id: 'dictionary', title: 'Diccionario conectado', quickAnswer: 'Abre el Diccionario de verbos desde la navegación superior y busca por infinitivo, pasado, participio o significado.', links: [link('go', undefined, 'verb'), link('write', undefined, 'verb')] })]),
  reference('parts-of-speech', 'Parts of speech', 'La función de cada palabra', 'A1', 'Parts of speech', 'A word can name, act, describe, modify, replace, connect, or locate.', 'Una palabra puede nombrar, actuar, describir, modificar, reemplazar, conectar o ubicar.', [
    { left: 'noun · sustantivo', middle: 'names a person, place, thing, or idea', right: 'teacher, city, coffee, freedom' },
    { left: 'verb · verbo', middle: 'expresses an action or state', right: 'run, study, be, know' },
    { left: 'adjective · adjetivo', middle: 'describes a noun', right: 'a clear explanation' },
    { left: 'adverb · adverbio', middle: 'modifies a verb, adjective, or adverb', right: 'speak slowly; very clear' },
    { left: 'pronoun · pronombre', middle: 'replaces a noun', right: 'she, it, them' },
    { left: 'preposition · preposición', middle: 'shows a relation', right: 'at, in, on, for' },
    { left: 'connector · conector', middle: 'joins ideas', right: 'and, but, because' },
  ], ['La función depende del uso: “work” puede ser verbo o sustantivo.', 'El color siempre aparece acompañado del nombre de la categoría.'], ['pronouns', 'prepositions', 'frequency-adverbs'], ['grammar categories', 'noun verb adjective adverb'], ['parts of a sentence']),
  reference('to-for', 'To or for?', 'Destino, receptor, propósito y beneficio', 'A1', 'Prepositions & location', 'To usually points toward a destination or recipient; for often gives purpose, benefit, duration, or reason.', 'To normalmente apunta a un destino o receptor; for suele expresar propósito, beneficio, duración o razón.', [
    { left: 'to', middle: 'destination / recipient', right: 'I sent the file to Ana.' },
    { left: 'for', middle: 'benefit / purpose', right: 'I made this for Ana.' },
    { left: 'to + verb', middle: 'purpose with an action', right: 'I called to ask a question.' },
    { left: 'for + noun / -ing', middle: 'purpose or function', right: 'This app is for studying.' },
  ], ['Compare: I went to the store for milk.', 'Después de for usa sustantivo o verbo en -ing, no un infinitivo simple.'], ['prepositions'], ['to vs for', 'para', 'purpose recipient'], ['destination benefit']),
  reference('already-yet-still', 'Already, yet & still', 'Ya, todavía y aún', 'A2', 'Tenses & time', 'These adverbs show whether an expected action happened or continues.', 'Estos adverbios muestran si una acción esperada ocurrió o continúa.', [
    { left: 'already', middle: 'sooner than expected; usually affirmative', right: 'I have already finished.' },
    { left: 'yet', middle: 'until now; usually question/negative, at the end', right: 'Have you finished yet?' },
    { left: 'still', middle: 'continues now; before the main verb', right: 'I still need help.' },
  ], ['Not yet = todavía no.', 'Already can show surprise in questions: Have you finished already?'], ['present-perfect', 'ever-never'], ['already yet still', 'ya todavía aún'], ['adverbs present perfect']),
  reference('going-to', 'Future with going to', 'Planes y evidencia visible', 'A1', 'Tenses & time', 'Use be going to for a prior plan or a prediction based on present evidence.', 'Usa be going to para un plan previo o una predicción basada en evidencia presente.', [
    { left: 'affirmative', middle: 'subject + be + going to + base verb', right: 'We are going to travel.' },
    { left: 'negative', middle: 'subject + be not + going to + base verb', right: 'I am not going to buy it.' },
    { left: 'question', middle: 'be + subject + going to + base verb?', right: 'Are you going to study?' },
  ], ['Going to necesita una forma de be.', 'Will suele ser una decisión del momento; going to, un plan anterior.'], ['future-simple', 'present-continuous'], ['be going to', 'future plans'], ['plan prediction']),
  reference('demonstratives', 'This, that, these & those', 'Señalar cerca o lejos', 'A1', 'Pronouns & determiners', 'Choose by distance and number.', 'Elige según distancia y número.', [
    { left: 'this', middle: 'one, near', right: 'This book is useful.' }, { left: 'that', middle: 'one, farther away', right: 'That chair is free.' },
    { left: 'these', middle: 'more than one, near', right: 'These keys are mine.' }, { left: 'those', middle: 'more than one, farther away', right: 'Those shoes are new.' },
  ], ['This/that + singular; these/those + plural.'], ['pronouns', 'one-ones'], ['this that these those', 'demonstratives'], ['near far singular plural']),
  reference('reflexive-pronouns', 'Reflexive pronouns', 'Myself, yourself, themselves', 'A2', 'Pronouns & determiners', 'Use a reflexive pronoun when the subject and object are the same person or to add emphasis.', 'Usa un reflexivo cuando sujeto y objeto son la misma persona o para enfatizar.', [
    { left: 'I / you', middle: 'myself / yourself', right: 'I taught myself English.' }, { left: 'he / she / it', middle: 'himself / herself / itself', right: 'She introduced herself.' }, { left: 'we / you / they', middle: 'ourselves / yourselves / themselves', right: 'They made it themselves.' },
  ], ['By myself también significa solo, sin ayuda.', 'No uses myself como reemplazo elegante de I o me.'], ['pronouns'], ['myself yourself himself herself itself ourselves themselves'], ['reflexive emphasis']),
  reference('possessive-s', "Possessive 's", 'Pertenencia con nombres', 'A1', 'Pronouns & determiners', "Add 's to a person or singular noun to show possession.", "Añade 's a una persona o sustantivo singular para mostrar pertenencia.", [
    { left: "Ana's book", middle: 'one owner', right: "This is Ana's book." }, { left: "the students' room", middle: 'plural ending in -s', right: "The students' room is upstairs." }, { left: "children's games", middle: 'irregular plural', right: "These are children's games." },
  ], ["It's = it is; its = posesión sin apóstrofo."], ['pronouns'], ["possessive s", "apostrophe s", 'ownership'], ['genitive']),
  reference('other-another', 'Other or another?', 'Otro, otra y otros', 'A2', 'Pronouns & determiners', 'Another means one more or a different singular item. Other goes with plural or uncountable nouns.', 'Another significa uno más o uno diferente en singular. Other acompaña plurales o incontables.', [
    { left: 'another', middle: 'one more / a different one', right: 'Can I have another cup?' }, { left: 'other + plural', middle: 'different or remaining items', right: 'Where are the other books?' }, { left: 'the other', middle: 'the remaining one', right: 'One is red; the other is blue.' },
  ], ['Another ya contiene an: no digas an another.'], ['one-ones', 'articles'], ['other another the other others'], ['difference remainder']),
  reference('some-any', 'Some & any', 'Cantidad no específica', 'A1', 'Quantity & comparison', 'Some is common in affirmatives and offers; any is common in questions and negatives.', 'Some es común en afirmaciones y ofrecimientos; any en preguntas y negativas.', [
    { left: 'some', middle: 'affirmative / offer', right: 'We need some water. Would you like some?' }, { left: 'any', middle: 'question / negative', right: "Do you have any questions? I don't have any." },
  ], ['Usa some en una pregunta cuando ofreces o esperas un sí.'], ['countable-quantifiers', 'indefinite-pronouns'], ['some any'], ['quantity offers questions']),
  reference('few-little', 'Few, a few, little & a little', 'Cantidad y matiz', 'A2', 'Quantity & comparison', 'Few goes with countable nouns; little with uncountable nouns. Adding a gives a more positive meaning.', 'Few va con contables; little con incontables. Añadir a crea un matiz más positivo.', [
    { left: 'few / little', middle: 'almost not enough', right: 'Few people came. We have little time.' }, { left: 'a few / a little', middle: 'some; enough to be useful', right: 'I have a few ideas and a little time.' },
  ], ['People es contable; time y money suelen ser incontables.'], ['countable-quantifiers', 'some-any'], ['few a few little a little'], ['quantifiers countable uncountable']),
  reference('indefinite-pronouns', 'Someone, anything, everything…', 'Personas, cosas y lugares indefinidos', 'A2', 'Pronouns & determiners', 'Combine some-, any-, no-, and every- with -one, -body, -thing, or -where.', 'Combina some-, any-, no- y every- con -one, -body, -thing o -where.', [
    { left: 'some-', middle: 'affirmative / unknown item', right: 'Someone called. I need something.' }, { left: 'any-', middle: 'question / negative / no limit', right: 'Did anyone call? You can sit anywhere.' }, { left: 'no-', middle: 'zero; verb stays affirmative', right: 'Nobody knows. Nothing happened.' }, { left: 'every-', middle: 'all members', right: 'Everyone is ready.' },
  ], ['Everyone y nobody toman verbo singular.', "No doble negativo estándar: Nobody came, no Nobody didn't come."], ['some-any'], ['someone anyone no one everyone something anything nothing everything somewhere anywhere'], ['indefinite compounds']),
  reference('frequency-adverbs', 'Adverbs of frequency', 'Always, usually, sometimes, never', 'A1', 'Parts of speech', 'Put frequency adverbs before the main verb but after be.', 'Coloca los adverbios de frecuencia antes del verbo principal, pero después de be.', [
    { left: 'always / usually / often', middle: 'high frequency', right: 'I usually walk to work.' }, { left: 'sometimes / rarely / never', middle: 'medium to zero', right: 'She is never late.' },
  ], ['Main verb: I often study. Be: I am often tired.'], ['present-simple', 'ever-never'], ['always usually often sometimes rarely seldom never'], ['frequency position']),
  reference('manner-adverbs', 'Adverbs of manner', 'Cómo ocurre una acción', 'A2', 'Parts of speech', 'Many manner adverbs use adjective + -ly and normally follow the verb or object.', 'Muchos adverbios de modo usan adjetivo + -ly y suelen ir después del verbo u objeto.', [
    { left: 'slow → slowly', middle: 'regular -ly form', right: 'Please speak slowly.' }, { left: 'careful → carefully', middle: 'describes the action', right: 'She checked the work carefully.' }, { left: 'good → well', middle: 'irregular', right: 'He speaks English well.' },
  ], ['Fast y hard pueden ser adverbios sin -ly; hardly significa casi no.'], ['parts-of-speech'], ['adverbs of manner slowly carefully well'], ['how action happens']),
  reference('passive-voice', 'Passive voice', 'Enfocar la acción o el resultado', 'B1', 'Verbs & forms', 'Use be + past participle when the action or receiver matters more than the doer.', 'Usa be + participio cuando importa más la acción o quien la recibe que quien la hace.', [
    { left: 'present', middle: 'am/is/are + participle', right: 'English is spoken here.' }, { left: 'past', middle: 'was/were + participle', right: 'The window was broken.' }, { left: 'agent', middle: 'by + doer, only when useful', right: 'The song was written by Adele.' },
  ], ['El tiempo aparece en be; el verbo principal permanece en participio.'], ['verbs', 'present-simple', 'past-simple'], ['passive voice', 'be past participle'], ['active passive']),
  reference('too-either-neither', 'Too, either & neither', 'Coincidir con una idea', 'A2', 'Questions & connectors', 'Use too after an affirmative agreement, either after a negative, and neither to begin a negative agreement.', 'Usa too para coincidir con una afirmación, either con una negación y neither al iniciar una coincidencia negativa.', [
    { left: 'too', middle: 'affirmative agreement', right: 'I like it too.' }, { left: 'either', middle: 'negative agreement', right: "I don't like it either." }, { left: 'neither', middle: 'negative inversion', right: 'Neither do I.' },
  ], ['Me too, pero Me neither para una idea negativa.'], ['question-words'], ['too either neither so do I'], ['agreement']),
  reference('what-which-that', 'What, which & that', 'Pregunta o unión de ideas', 'A2', 'Questions & connectors', 'What asks openly, which chooses from a limited set, and that can connect a defining clause.', 'What pregunta de forma abierta, which elige de un grupo limitado y that puede conectar una oración especificativa.', [
    { left: 'what', middle: 'open information', right: 'What do you need?' }, { left: 'which', middle: 'limited choice', right: 'Which color do you prefer?' }, { left: 'that', middle: 'defines a noun', right: 'The book that I bought is useful.' },
  ], ['Which puede ser interrogativo o relativo; observa si hay una elección.'], ['question-words'], ['what which that relative pronoun'], ['choice clause']),
  reference('one-ones', 'One & ones', 'Evitar repetir un sustantivo', 'A2', 'Pronouns & determiners', 'Use one for a singular countable noun and ones for plural countable nouns already understood.', 'Usa one para un sustantivo contable singular y ones para plurales ya conocidos.', [
    { left: 'one', middle: 'singular replacement', right: 'I want the blue one.' }, { left: 'ones', middle: 'plural replacement', right: 'The small ones are cheaper.' },
  ], ['No reemplazan sustantivos incontables: prefer this coffee, no this one si no hay tipos contrastados.'], ['demonstratives', 'other-another'], ['one ones replacement'], ['avoid repetition']),
  reference('everyday-every-day', 'Everyday or every day?', 'Adjetivo frente a expresión de tiempo', 'A1', 'Everyday usage', 'Everyday is an adjective meaning ordinary; every day is an adverbial phrase meaning each day.', 'Everyday es un adjetivo que significa cotidiano; every day significa cada día.', [
    { left: 'everyday', middle: 'adjective before a noun', right: 'This is an everyday problem.' }, { left: 'every day', middle: 'frequency phrase', right: 'I practice every day.' },
  ], ['Prueba con ordinary: si funciona, usa everyday.'], ['frequency-adverbs', 'parts-of-speech'], ['everyday every day'], ['daily common']),
  reference('phrasal-verbs', 'Phrasal verbs', 'Verbo + partícula, significado nuevo', 'A2', 'Verbs & forms', 'A phrasal verb combines a verb and a particle. Learn the complete unit, not each word separately.', 'Un phrasal verb combina verbo y partícula. Aprende la unidad completa, no cada palabra por separado.', [
    { left: 'get up', middle: 'levantarse', right: 'I get up at seven.' }, { left: 'turn on / off', middle: 'encender / apagar', right: 'Please turn off the light.' }, { left: 'look for', middle: 'buscar', right: "I'm looking for my keys." }, { left: 'find out', middle: 'averiguar', right: 'We need to find out why.' },
  ], ['Algunos son separables: turn the light off / turn it off.'], ['get', 'prepositions', 'verbs'], ['phrasal verbs get up turn on look for find out'], ['multiword verbs']),
  reference('get', 'Get: usos esenciales', 'Recibir, obtener, llegar, ponerse…', 'A2', 'Verbs & forms', 'Get changes meaning with its complement; learn it in short patterns.', 'Get cambia de significado según su complemento; apréndelo en patrones cortos.', [
    { left: 'get + noun', middle: 'obtener / recibir', right: 'I got a message.' }, { left: 'get + place', middle: 'llegar', right: 'What time did you get home?' }, { left: 'get + adjective', middle: 'ponerse / volverse', right: 'It is getting cold.' }, { left: 'get + participle', middle: 'cambio o pasiva informal', right: 'We got lost.' },
  ], ['El pasado de get es got; en inglés estadounidense el participio puede ser gotten.'], ['phrasal-verbs', 'verbs'], ['get got gotten'], ['receive arrive become']),
  reference('aint', "Ain't", 'Forma informal y no estándar', 'B1', 'Everyday usage', "Ain't appears in informal speech for am not, isn't, aren't, haven't, or hasn't, but avoid it in formal English.", "Ain't aparece en habla informal por varias negaciones, pero evítalo en inglés formal.", [
    { left: "I ain't ready.", middle: 'informal: I am not ready.', right: 'Use the standard form in class or work.' }, { left: "She ain't seen it.", middle: "informal: She hasn't seen it.", right: 'Common in songs and conversation.' },
  ], ['Reconócelo para comprender; no lo uses como opción neutral en escritura.'], ['modals'], ["ain't aint", 'informal negative'], ['slang register']),
  reference('just-only-alone', 'Just, only & alone', 'Recién, solamente y sin compañía', 'A2', 'Everyday usage', 'Just can mean recently or exactly; only limits; alone means without other people.', 'Just puede significar recién o exactamente; only limita; alone significa sin compañía.', [
    { left: 'just', middle: 'recently / exactly', right: 'I have just arrived.' }, { left: 'only', middle: 'no more than', right: 'I only need five minutes.' }, { left: 'alone', middle: 'without company', right: 'She lives alone.' },
  ], ['Lonely describe un sentimiento; alone describe la ausencia de compañía.'], ['present-perfect', 'parts-of-speech'], ['just only alone lonely'], ['recently merely without company']),
  reference('body-vocabulary', 'Body vocabulary', 'Partes del cuerpo en contexto', 'A1', 'Everyday usage', 'Use body words with possessives and common health expressions.', 'Usa las partes del cuerpo con posesivos y expresiones comunes de salud.', [
    { left: 'head / face / neck', middle: 'cabeza / cara / cuello', right: 'My neck hurts.' }, { left: 'arm / hand / finger', middle: 'brazo / mano / dedo', right: 'Raise your hand.' }, { left: 'leg / foot / toe', middle: 'pierna / pie / dedo del pie', right: 'I hurt my foot.' }, { left: 'stomach / back / chest', middle: 'estómago / espalda / pecho', right: 'My back feels better.' },
  ], ['Foot → feet y tooth → teeth son plurales irregulares.'], ['pronouns'], ['body parts head hand arm leg foot feet'], ['health vocabulary']),
  reference('shopping', 'Shopping phrases', 'Comprar, pedir y comparar', 'A1', 'Everyday usage', 'Use short question patterns for price, size, availability, and payment.', 'Usa preguntas breves para precio, talla, disponibilidad y pago.', [
    { left: 'price', middle: 'How much is it?', right: 'How much are these shoes?' }, { left: 'availability', middle: 'Do you have…?', right: 'Do you have this in blue?' }, { left: 'trying', middle: 'Can I try it on?', right: 'Where are the fitting rooms?' }, { left: 'decision', middle: "I'll take it.", right: 'Can I pay by card?' },
  ], ['How much is…? para precio; How many…? para número de objetos.'], ['demonstratives', 'countable-quantifiers', 'modals'], ['shopping store price size pay card try on'], ['buying phrases']),
]

const advancedTenses: GrammarTable[] = [
  reference('future-continuous', 'Future Continuous', 'Una acción en progreso en el futuro', 'B1', 'Tenses & time', 'Use it for an action that will be in progress at a future time.', 'Úsalo para una acción que estará en progreso en un momento futuro.', [{ left: 'form', middle: 'will be + verb-ing', right: 'At eight, I will be studying.' }], ['No expresa necesariamente una interrupción; enfoca el desarrollo futuro.'], ['future-simple', 'present-continuous'], ['future progressive'], ['will be ing']),
  reference('past-perfect', 'Past Perfect', 'Un pasado anterior a otro pasado', 'B1', 'Tenses & time', 'Use it for an action completed before another past reference.', 'Úsalo para una acción terminada antes de otro punto pasado.', [{ left: 'form', middle: 'had + past participle', right: 'She had left before I arrived.' }], ['El evento más antiguo usa had + participio.'], ['past-simple', 'verbs'], ['pluperfect pasado perfecto'], ['had participle']),
  reference('future-perfect', 'Future Perfect', 'Completado antes de un punto futuro', 'B2', 'Tenses & time', 'Use it for something that will be complete by a future deadline.', 'Úsalo para algo que estará terminado antes de un límite futuro.', [{ left: 'form', middle: 'will have + past participle', right: 'By Friday, we will have finished.' }], ['By marca el límite; no la duración.'], ['future-simple', 'verbs'], ['futuro perfecto'], ['will have participle']),
  reference('past-perfect-continuous', 'Past Perfect Continuous', 'Duración previa a un punto pasado', 'B2', 'Tenses & time', 'Use it to emphasize how long an activity continued before a past point.', 'Úsalo para enfatizar cuánto duró una actividad antes de un punto pasado.', [{ left: 'form', middle: 'had been + verb-ing', right: 'I had been waiting for an hour.' }], ['Usa for para duración y since para el inicio.'], ['past-perfect', 'present-perfect-continuous'], ['past perfect progressive'], ['had been ing']),
  reference('present-perfect-continuous', 'Present Perfect Continuous', 'Actividad que llega hasta el presente', 'B1', 'Tenses & time', 'Use it for a continuing or recently stopped activity with present relevance.', 'Úsalo para una actividad que continúa o acaba de parar y todavía importa.', [{ left: 'form', middle: 'have/has been + verb-ing', right: 'She has been studying since noon.' }], ['Con verbos de estado suele preferirse Present Perfect simple: I have known her.'], ['present-perfect', 'past-perfect-continuous'], ['present perfect progressive'], ['have been ing since for']),
  reference('future-perfect-continuous', 'Future Perfect Continuous', 'Duración hasta un límite futuro', 'B2', 'Tenses & time', 'Use it to emphasize duration continuing up to a future point.', 'Úsalo para enfatizar una duración que llegará hasta un punto futuro.', [{ left: 'form', middle: 'will have been + verb-ing', right: 'By June, I will have been working here for a year.' }], ['Se usa poco en conversación cotidiana; elige esta forma sólo cuando la duración es el foco.'], ['future-perfect', 'present-perfect-continuous'], ['future perfect progressive'], ['will have been ing']),
]

const legacyReady = [...legacyTopics, ...legacyTables].filter((item) => item.status === 'ready')

export const allItems: LearningItem[] = [...legacyReady, ...advancedTenses, ...addedItems].map((item) => {
  const extra = metadata[item.id]
  return extra ? { ...item, ...extra } : item
})

export const findItem = (id: string) => allItems.find((item) => item.id === id)

export const tenseColumns = ['Past', 'Present', 'Future'] as const
export const tenseRows = ['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'] as const
export const tenseGrid: Record<string, string> = {
  'Past-Simple': 'past-simple', 'Present-Simple': 'present-simple', 'Future-Simple': 'future-simple',
  'Past-Continuous': 'past-continuous', 'Present-Continuous': 'present-continuous', 'Future-Continuous': 'future-continuous',
  'Past-Perfect': 'past-perfect', 'Present-Perfect': 'present-perfect', 'Future-Perfect': 'future-perfect',
  'Past-Perfect Continuous': 'past-perfect-continuous', 'Present-Perfect Continuous': 'present-perfect-continuous', 'Future-Perfect Continuous': 'future-perfect-continuous',
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en').trim()

const itemText = (item: LearningItem) => [
  item.title, 'subtitle' in item ? item.subtitle : item.shortTitle, item.overview, item.spanishOverview,
  ...(item.aliases ?? []), ...(item.keywords ?? []),
  ...('rows' in item ? item.rows.flatMap((row) => [row.left, row.middle, row.right ?? '']) : []),
  ...(item.sections ?? []).flatMap((entry) => [entry.title, entry.quickAnswer, entry.pattern ?? '', ...(entry.whenToUse ?? []), ...(entry.rows ?? []).flatMap((row) => [row.key, row.meaning, row.example])]),
].join(' ')

export const searchIndex: SearchResult[] = [
  ...allItems.map((item): SearchResult => ({ id: item.id, kind: 'topic', title: item.title, subtitle: item.spanishOverview, route: `#/topic/${item.id}`, category: item.category as GrammarCategory, searchableText: normalize(itemText(item)) })),
  ...allItems.flatMap((item) => (item.sections ?? []).map((entry): SearchResult => ({ id: `${item.id}:${entry.id}`, kind: 'section', title: entry.title, subtitle: item.title, route: `#/topic/${item.id}?section=${entry.id}`, category: item.category as GrammarCategory, searchableText: normalize([entry.id, entry.title, entry.quickAnswer, entry.pattern ?? '', ...(entry.whenToUse ?? []), ...(entry.rows ?? []).flatMap((row) => [row.key, row.meaning, row.example])].join(' ')) }))),
  ...irregularVerbs.map((entry): SearchResult => ({ id: `verb:${entry.id}`, kind: 'verb', title: `${entry.base} · ${entry.past} · ${entry.participle}`, subtitle: entry.meaning, route: `#/verbs?verb=${entry.id}`, category: 'Verbs & forms', searchableText: normalize([entry.base, entry.past, entry.participle, entry.meaning, ...(entry.aliases ?? []), ...entry.examples].join(' ')) })),
]

export const searchCatalog = (query: string, limit = 9) => {
  const needle = normalize(query)
  if (!needle) return []
  const words = needle.split(/\s+/)
  return searchIndex
    .filter((entry) => words.every((word) => entry.searchableText.includes(word)))
    .sort((a, b) => {
      const aTitle = normalize(a.title)
      const bTitle = normalize(b.title)
      return Number(bTitle === needle) - Number(aTitle === needle) || Number(bTitle.startsWith(needle)) - Number(aTitle.startsWith(needle)) || a.title.localeCompare(b.title)
    })
    .slice(0, limit)
}

export const relatedBacklinks = (itemId: string) => allItems.filter((item) => item.relatedTopicIds.includes(itemId) || (item.sections ?? []).some((entry) => (entry.links ?? []).some((term) => term.kind === 'topic' && term.targetId === itemId)))
