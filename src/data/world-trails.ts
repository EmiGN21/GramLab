type MapPoint = readonly [x: number, y: number]
type Checkpoint = readonly [name: string, ...point: MapPoint]

type FieldQuestion = {
  prompt: string
  options: readonly [string, string, string]
  answer: 0 | 1 | 2
  feedback: string
}

type Trail = {
  checkpoints: readonly [Checkpoint, Checkpoint, Checkpoint, Checkpoint, Checkpoint]
  sign: MapPoint
  gate: MapPoint
  color: string
  mission: {
    position: MapPoint
    branchFrom: 0 | 1 | 2 | 3 | 4
    object: string
    sprite: readonly [string, string, string, string, string, string, string]
    title: string
    briefing: string
    spanishBriefing: string
    hint: string
    reference: string
    questions: readonly [FieldQuestion, FieldQuestion]
  }
}

export const worldTrails: Record<string, Trail> = {
  'primeros-pasos': {
    color: '#f5d98f',
    checkpoints: [['Trailhead', 142, 672], ['Practice Camp', 354, 478], ['Signal Crossing', 610, 590], ['Grammar Rise', 842, 365], ['Final Ascent', 1036, 184]],
    sign: [465, 214],
    gate: [1042, 78],
    mission: {
      position: [797, 674],
      branchFrom: 2,
      object: 'Seed satchel',
      sprite: ['..###..', '..#.#..', '.#####.', '##.#.##', '#..#..#', '#.###.#', '.#####.'],
      title: 'The gardener’s labels',
      briefing: 'Help the gardener label the seedlings and tell a visitor who owns them.',
      spanishBriefing: 'Ayuda al jardinero a etiquetar las plantas y explicar de quién son.',
      hint: 'Before a noun, use a word such as her or their. On its own, use hers or theirs.',
      reference: 'pronouns',
      questions: [
        { prompt: 'Maya planted the mint. Which label belongs beside it?', options: ['Hers mint', 'Her mint', 'She mint'], answer: 1, feedback: 'Her goes before the noun mint.' },
        { prompt: 'Leo and Inés planted the basil. Complete: “The basil is ___.”', options: ['their', 'them', 'theirs'], answer: 2, feedback: 'Theirs can stand on its own. Their needs a noun after it.' },
      ],
    },
  },
  'viaje-en-el-tiempo': {
    color: '#ffc272',
    checkpoints: [['Sun Gate', 144, 340], ['Oasis Camp', 341, 599], ['Hourglass Pass', 589, 440], ['Dune Crossing', 832, 624], ['Clock Tower', 1052, 320]],
    sign: [247, 190],
    gate: [1042, 119],
    mission: {
      position: [660, 218],
      branchFrom: 2,
      object: 'Hourglass',
      sprite: ['#######', '.#####.', '..#.#..', '...#...', '..#.#..', '.#####.', '#######'],
      title: 'The dusk dispatch',
      briefing: 'Put the guide’s desert report in the right order before sunset.',
      spanishBriefing: 'Ordena el informe del guía antes de que se ponga el sol.',
      hint: 'Past continuous gives the background. Past simple tells what happened next.',
      reference: 'past-continuous',
      questions: [
        { prompt: 'The guide was already walking when the wind changed. Which report fits?', options: ['I was walking when the wind changed.', 'I will walk when the wind changed.', 'I am walking when the wind changed.'], answer: 0, feedback: 'Was walking sets the scene. Changed marks the event that happened during it.' },
        { prompt: 'At noon, the storm was already over. Complete: “The storm ___ before noon.”', options: ['is ending', 'had ended', 'will end'], answer: 1, feedback: 'Had ended places the end of the storm before another point in the past.' },
      ],
    },
  },
  'vida-y-lugares': {
    color: '#9de7e5',
    checkpoints: [['Market Pier', 150, 615], ['Tide Steps', 342, 425], ['Harbour Walk', 576, 286], ['Boardwalk', 825, 397], ['Ferry Landing', 1047, 620]],
    sign: [269, 213],
    gate: [1044, 383],
    mission: {
      position: [631, 592],
      branchFrom: 2,
      object: 'Harbour compass',
      sprite: ['..###..', '.#...#.', '#...###', '#..##.#', '###...#', '.#...#.', '..###..'],
      title: 'Meet me at the harbour',
      briefing: 'Send directions to a friend who just arrived at the coast.',
      spanishBriefing: 'Dale indicaciones a una amistad que acaba de llegar a la costa.',
      hint: 'At marks a meeting point. Give something to a receiver or buy it for someone.',
      reference: 'prepositions',
      questions: [
        { prompt: 'The lighthouse is your meeting point. Complete: “Meet me ___ the lighthouse.”', options: ['at', 'between', 'on'], answer: 0, feedback: 'At identifies the lighthouse as the meeting point.' },
        { prompt: 'You are giving the ferry map to Jo. Which message says that?', options: ['I’ll hand the map at Jo.', 'I’ll hand the map for Jo.', 'I’ll hand the map to Jo.'], answer: 2, feedback: 'With hand something to someone, to marks the person receiving it.' },
      ],
    },
  },
  conversaciones: {
    color: '#dcc596',
    checkpoints: [['Fern Path', 154, 678], ['Echo Camp', 350, 611], ['Old Footbridge', 574, 387], ['Canopy Rest', 807, 227], ['Grove Lookout', 1037, 405]],
    sign: [281, 400],
    gate: [1042, 180],
    mission: {
      position: [835, 600],
      branchFrom: 2,
      object: 'Trail radio',
      sprite: ['.....#.', '....#..', '.#####.', '##...##', '#.###.#', '#.###.#', '.#####.'],
      title: 'A call from the grove',
      briefing: 'Use the radio to ask for directions and check which trail is open.',
      spanishBriefing: 'Usa la radio para pedir indicaciones y confirmar qué sendero está abierto.',
      hint: 'After “Could you tell me…”, use statement word order in the question that follows.',
      reference: 'question-words',
      questions: [
        { prompt: 'You want to ask politely where the bridge is. Which line fits?', options: ['Could you tell me where is the bridge?', 'Could you tell me where the bridge is?', 'Could you tell me where does the bridge be?'], answer: 1, feedback: 'In an embedded question, the subject the bridge comes before is.' },
        { prompt: 'The North Trail and the River Trail are on your map. Ask your guide to choose between them.', options: ['Which trail should we take?', 'Who trail should we take?', 'How many trail should we take?'], answer: 0, feedback: 'Use which when you are choosing from known options.' },
      ],
    },
  },
  'mas-alla': {
    color: '#c7cfeb',
    checkpoints: [['Lower Ridge', 143, 650], ['Switchback', 365, 338], ['Cable Bridge', 596, 516], ['High Shelter', 824, 244], ['Signal Peak', 1052, 416]],
    sign: [253, 195],
    gate: [1046, 205],
    mission: {
      position: [843, 617],
      branchFrom: 2,
      object: 'Weather vane',
      sprite: ['...#...', '..###..', '.#####.', '#######', '...#...', '...#...', '.#####.'],
      title: 'A forecast for the ridge',
      briefing: 'Call the shelter and explain what the crew will be doing and what they’ll have finished.',
      spanishBriefing: 'Llama al refugio y explica qué estará haciendo el equipo y qué habrá terminado.',
      hint: 'At a future time, use will be + -ing for an activity in progress. By a deadline, will have + participle shows completion.',
      reference: 'future-perfect',
      questions: [
        { prompt: 'At 6 p.m. the crew will be halfway through the climb. What should you say?', options: ['At six, the crew will have reached the summit.', 'At six, the crew has climbed yesterday.', 'At six, the crew will be climbing.'], answer: 2, feedback: 'Will be climbing shows the climb still in progress at six.' },
        { prompt: 'The repair will be complete before nightfall. Which forecast fits?', options: ['By nightfall, the crew will have repaired the radio.', 'By nightfall, the crew will be repairing the radio.', 'By nightfall, the crew is still repairing the radio.'], answer: 0, feedback: 'Will have repaired tells us the work will be complete by nightfall.' },
      ],
    },
  },
  'cumbres-de-hielo': {
    color: '#b9f2ff',
    checkpoints: [['Snowline', 149, 411], ['Glacier Bend', 357, 627], ['Frost Camp', 590, 534], ['Crystal Pass', 827, 350], ['Ice Lodge', 1045, 194]],
    sign: [317, 217],
    gate: [1043, 83],
    mission: {
      position: [816, 634],
      branchFrom: 3,
      object: 'Ice crystal',
      sprite: ['...#...', '..###..', '.#####.', '#######', '.#####.', '..###..', '...#...'],
      title: 'The lodge logbook',
      briefing: 'Write two entries about how long the lodge has been open.',
      spanishBriefing: 'Escribe dos entradas sobre cuánto tiempo lleva abierto el refugio.',
      hint: 'Since introduces the starting point. For introduces the duration.',
      reference: 'since-for',
      questions: [
        { prompt: 'The lodge opened in 2014 and is still open. Complete: “It has been open ___ 2014.”', options: ['during', 'for', 'since'], answer: 2, feedback: 'Since 2014 identifies the starting point.' },
        { prompt: 'The patrol began three hours ago and is still outside. Complete: “They’ve been out ___ three hours.”', options: ['for', 'since', 'at'], answer: 0, feedback: 'For three hours measures the duration.' },
      ],
    },
  },
  'caldera-de-lava': {
    color: '#ffa077',
    checkpoints: [['Ash Trail', 145, 678], ['Basalt Walk', 356, 376], ['Ember Bridge', 588, 235], ['Steam Vent', 835, 426], ['Forge Road', 1045, 617]],
    sign: [269, 199],
    gate: [1042, 397],
    mission: {
      position: [646, 600],
      branchFrom: 3,
      object: 'Forge bell',
      sprite: ['...#...', '..###..', '..###..', '.#####.', '.#####.', '#######', '...#...'],
      title: 'Safety at the forge',
      briefing: 'Choose the wording for two signs that visitors will rely on.',
      spanishBriefing: 'Elige cómo redactar dos avisos de seguridad para visitantes.',
      hint: 'Mustn’t forbids an action. Don’t have to means it is optional.',
      reference: 'modals',
      questions: [
        { prompt: 'Visitors are forbidden to touch the forge. Which sign says so?', options: ['You don’t have to touch the forge.', 'You can touch the forge.', 'You mustn’t touch the forge.'], answer: 2, feedback: 'Mustn’t means the action is not allowed.' },
        { prompt: 'Gloves are available for a cold display, but they’re optional. What should the sign say?', options: ['You don’t have to wear gloves here.', 'You mustn’t wear gloves here.', 'You must wear gloves here.'], answer: 0, feedback: 'Don’t have to means there is no obligation. Visitors can still wear gloves.' },
      ],
    },
  },
  'marte-rojo': {
    color: '#ffbe93',
    checkpoints: [['Landing Zone', 140, 483], ['Dust Basin', 375, 650], ['Red Canyon', 610, 533], ['Antenna Field', 833, 280], ['Rover Beacon', 1060, 410]],
    sign: [316, 260],
    gate: [1057, 182],
    mission: {
      position: [845, 624],
      branchFrom: 2,
      object: 'Sample canister',
      sprite: ['..###..', '.#####.', '##...##', '#.###.#', '#.###.#', '##...##', '.#####.'],
      title: 'Supplies for the rover',
      briefing: 'Report what’s in the rover before it leaves the canyon.',
      spanishBriefing: 'Informa qué lleva el vehículo antes de que salga del cañón.',
      hint: 'Use how many with plural countable things and how much with uncountable amounts.',
      reference: 'countable-quantifiers',
      questions: [
        { prompt: 'Ask about the number of batteries in the rover.', options: ['How many batteries are there?', 'How much batteries is there?', 'How many battery is there?'], answer: 0, feedback: 'Batteries are countable and plural, so use how many and are there.' },
        { prompt: 'Oxygen is measured in litres. Complete: “How ___ oxygen is left?”', options: ['many', 'much', 'few'], answer: 1, feedback: 'How much asks about the amount of oxygen, an uncountable noun.' },
      ],
    },
  },
  'jardin-de-sombras': {
    color: '#d4baff',
    checkpoints: [['Moon Gate', 149, 645], ['Ivy Court', 359, 416], ['Ruined Steps', 592, 627], ['Moonlit Walk', 823, 483], ['Archive Door', 1041, 257]],
    sign: [279, 167],
    gate: [1043, 108],
    mission: {
      position: [622, 227],
      branchFrom: 1,
      object: 'Archive key',
      sprite: ['.###...', '##.##..', '#...#..', '##.##..', '.#####.', '...#.##', '...#...'],
      title: 'Clues in the archive',
      briefing: 'Guide a visitor through two clues left beside the archive door.',
      spanishBriefing: 'Ayuda a interpretar dos pistas junto a la puerta del archivo.',
      hint: 'Use a or an for a new singular thing, then the when both speakers know which one.',
      reference: 'articles',
      questions: [
        { prompt: 'You’re mentioning an old map for the first time. Complete: “I found ___ old map.”', options: ['a', 'some', 'an'], answer: 2, feedback: 'Old starts with a vowel sound, so choose an.' },
        { prompt: 'Your friend already knows about the old map. Complete: “___ map shows a hidden door.”', options: ['An', 'The', 'Some'], answer: 1, feedback: 'The points back to the particular map both speakers know about.' },
      ],
    },
  },
}

export const mapWidth = 1200
export const mapHeight = 820

export function traceRoute(points: readonly MapPoint[]) {
  const [start, ...rest] = points
  return rest.reduce((path, [x, y], index) => {
    const [previousX, previousY] = points[index]
    const middleX = (previousX + x) / 2
    return `${path} C${middleX} ${previousY}, ${middleX} ${y}, ${x} ${y}`
  }, `M${start[0]} ${start[1]}`)
}

export const fieldMissionId = (worldId: string) => `field:${worldId}`
export const fieldMissionRoute = (worldId: string) => `#/world/${worldId}/field`
