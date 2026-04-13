import { ProtocolDay } from '../data/protocol'
import { adaptText } from './gender'
import { TargetGender } from '../types'

// ── Card type definitions ─────────────────────────────────────────────────

export type CardType =
  | 'intro' | 'concept' | 'insight' | 'quiz'
  | 'checklist' | 'practice' | 'checkin'
  | 'affirmation' | 'xp_quiz' | 'visualization'
  | 'block_header' | 'block_content'

interface BaseCard { id: string; type: CardType }

export interface IntroCard extends BaseCard {
  type: 'intro'
  imageQuery: string; day: number; week: number; weekName: string; title: string; mission: string
}

export interface ConceptCard extends BaseCard {
  type: 'concept'
  emoji: string; text: string; keyPhrase: string; imageQuery: string
  conceptIndex: number; totalConcepts: number; fact: string
}

export interface InsightCard extends BaseCard {
  type: 'insight'
  quote: string; attribution: string
  applications: string[]
}

export interface QuizCard extends BaseCard {
  type: 'quiz'
  question: string
}

export interface ChecklistCard extends BaseCard {
  type: 'checklist'
  items: string[]
}

export interface PracticeCard extends BaseCard {
  type: 'practice'
  title: string; instructions: string; isBreathing: boolean
  scienceFact: string
}

export interface CheckinCard extends BaseCard {
  type: 'checkin'
}

export interface AffirmationCard extends BaseCard {
  type: 'affirmation'
  affirmations: string[]
}

export interface XpQuizOption {
  text: string; xp: number; feedback: string
}

export interface XpQuizCard extends BaseCard {
  type: 'xp_quiz'
  question: string
  options: XpQuizOption[]
}

export interface VisualizationCard extends BaseCard {
  type: 'visualization'
  title: string; steps: string[]; duration: number
}

// Novos cards para estrutura de 4 blocos
export interface BlockHeaderCard extends BaseCard {
  type: 'block_header'
  blockNumber: 1 | 2 | 3 | 4
  blockTitle: string
  blockSubtitle: string
  blockEmoji: string
}

export interface BlockContentCard extends BaseCard {
  type: 'block_content'
  blockNumber: 1 | 2 | 3 | 4
  contentType: 'reading' | 'estudo_caso' | 'quiz' | 'missao' | 'regras' | 'bio_hacking' | 'reestruturacao' | 'sobrecarga' | 'checkin' | 'termometro' | 'juramento' | 'recompensa'
  title: string
  content: string
  checkboxes?: string[]
}

export type GameCard =
  | IntroCard | ConceptCard | InsightCard | QuizCard
  | ChecklistCard | PracticeCard | CheckinCard
  | AffirmationCard | XpQuizCard | VisualizationCard
  | BlockHeaderCard | BlockContentCard

// ── Static content pools ──────────────────────────────────────────────────

const WEEK_IMAGE_QUERIES: Record<number, string[]> = {
  1: ['solitude dark night', 'inner strength mind', 'emotional control discipline', 'silence meditation dark', 'identity self dark', 'determination focus'],
  2: ['gym training confidence', 'style fashion elegant man', 'luxury perfume dark', 'books knowledge wisdom', 'charisma social skills', 'self improvement growth'],
  3: ['memory emotion nostalgia', 'mystery attractive', 'body language confident', 'social media influence', 'attraction tension couple', 'eye contact psychology'],
  4: ['reunion meeting elegant', 'romance tension cinematic', 'smile attraction warm', 'couple walking elegant', 'conversation intimate', 'love reconnection'],
  5: ['first message elegant', 'calm conversation coffee', 'natural connection smile', 'emotional safety couple', 'gradual reconnection', 'final consolidation love'],
}

const WEEK_AFFIRMATIONS: Record<number, string[]> = {
  1: [
    'Meu silêncio é poder, não fraqueza.',
    'Cada dia sem contato me torna mais atraente.',
    'Eu tenho controle sobre minhas ações.',
    'Meu valor não depende da aprovação de ninguém.',
    'Estou construindo algo que ela vai perceber.',
  ],
  2: [
    'Estou me tornando a melhor versão de mim.',
    'Meu corpo e mente estão evoluindo juntos.',
    'Cada escolha saudável é um investimento em mim.',
    'Eu mereço respeito — e começo por mim mesmo.',
    'Minha transformação é real e visível.',
  ],
  3: [
    'Minha presença cria desejo sem que eu precise pedir.',
    'Sou interessante, misterioso e magnético.',
    'Eu controlo minha energia — não a entrego de graça.',
    'Minha ausência comunica mais do que mil palavras.',
    'Quem me conhece quer estar perto de mim.',
  ],
  4: [
    'Eu reconecto com inteligência emocional, não com desespero.',
    'Cada interação minha deixa ela querendo mais.',
    'Sou exatamente quem ela queria que eu fosse.',
    'Minha transformação fala mais alto que qualquer palavra.',
    'O futuro que construí é mais atraente que o passado que perdemos.',
  ],
  5: [
    'Cada palavra minha é escolhida com intenção, não com desespero.',
    'Reconecto com calma — minha transformação já fez o trabalho pesado.',
    'Sou desapegado do resultado e isso me torna irresistível.',
    'Cada interação minha cria curiosidade, não pressão.',
    'A reconexão que construo é sólida porque começa com quem me tornei.',
  ],
}

const WEEK_VISUALIZATIONS: Record<number, { title: string; steps: string[]; duration: number }> = {
  1: {
    title: 'Visualização do Futuro',
    steps: [
      'Feche os olhos. Respire fundo três vezes.',
      'Visualize a versão de você daqui 6 meses. Mais forte. Mais calmo. Mais atraente.',
      'Sinta a confiança que essa versão carrega. Como ela anda. Como ela fala.',
      'Traga uma imagem dela(e) te vendo assim pela primeira vez novamente.',
      'Veja a expressão no rosto dela(e). O reconhecimento. O interesse.',
      'Abra os olhos. Essa versão começa hoje.',
    ],
    duration: 8,
  },
  2: {
    title: 'Visualização da Transformação',
    steps: [
      'Respire fundo. Solte a tensão dos ombros.',
      'Visualize seu corpo se tornando mais forte a cada dia que passa.',
      'Veja sua mente ficando mais clara, mais focada, mais decidida.',
      'Imagine pessoas ao seu redor notando a diferença — sem que você precise dizer nada.',
      'Sinta a satisfação de ter escolhido a transformação ao invés da estagnação.',
      'Abra os olhos. Você já é essa versão.',
    ],
    duration: 8,
  },
  3: {
    title: 'Visualização da Atração',
    steps: [
      'Respire. Relaxe o corpo completamente.',
      'Visualize um encontro casual com ela(e).',
      'Você está diferente. Calmo. Presente. Magnético.',
      'Observe como ela(e) te olha com novos olhos.',
      'Sinta a atração na sala — criada pela sua presença, não pelas suas palavras.',
      'Abra os olhos. Essa energia já existe em você.',
    ],
    duration: 8,
  },
  4: {
    title: 'Visualização da Reconquista',
    steps: [
      'Respire profundamente. Você chegou longe.',
      'Visualize o momento da reconexão. Calmo, confiante, transformado.',
      'Você não está pedindo nem suplicando — está apresentando quem você se tornou.',
      'Ela(e) percebe a diferença. Genuinamente impressionada(o).',
      'Essa conversa acontece porque você fez o trabalho interno.',
      'Abra os olhos. O protocolo funcionou.',
    ],
    duration: 8,
  },
  5: {
    title: 'Visualização da Reconexão',
    steps: [
      'Respire fundo. Você está pronto(a) para este momento.',
      'Visualize o primeiro contato — calmo, natural, sem pressão.',
      'Sinta a diferença entre quem você era e quem você é agora.',
      'A conversa flui porque você não precisa de nada — apenas se importa.',
      'Observe a resposta dela(e) ao ver quem você se tornou.',
      'Abra os olhos. A reconexão começa com presença, não com palavras.',
    ],
    duration: 8,
  },
}

const WEEK_FACTS: Record<number, string[]> = {
  1: [
    'Pesquisas mostram que quem mantém contato frequente após um término leva 2× mais tempo para superar emocionalmente.',
    'O cérebro límbico processa rejeição social nas mesmas áreas que processa dor física.',
    'Estudos de neuroimagem confirmam: ausência estratégica ativa o sistema de apego da outra pessoa.',
    'Navy SEALs usam box breathing para regular o sistema nervoso em situações de alto estresse.',
    'A teoria do apego de Bowlby foi desenvolvida ao observar crianças separadas de suas mães nos anos 1960.',
    'Comportamentos de busca de aprovação pós-término são classificados como "locus de controle externo" em psicologia.',
  ],
  2: [
    'O exercício aeróbico aumenta BDNF — proteína que reconstrói conexões neurais e melhora o humor.',
    'Pessoas que criam novas rotinas após términos reportam 40% menos ruminação obsessiva.',
    'A dopamina liberada durante aprendizado de novas habilidades substitui a que estava atrelada ao relacionamento.',
    'Aparência bem cuidada aumenta em 34% a percepção de competência social, segundo estudos de psicologia social.',
  ],
  3: [
    'O mistério aumenta a dopamina: o cérebro prefere recompensas intermitentes a constantes — princípio do slot machine.',
    'A linguagem corporal representa 55% da comunicação total, segundo os estudos de Albert Mehrabian.',
    'Pessoas com "abundância social" percebida são avaliadas como mais atraentes em estudos de atração.',
    'Contato visual sustentado por 4 segundos libera oxitocina e cria sensação de conexão involuntária.',
  ],
  4: [
    'O efeito de escassez (Cialdini) aumenta o valor percebido de qualquer coisa — inclusive pessoas.',
    'Reconexões bem-sucedidas têm em comum: mudança visível + ausência de desespero + presença emocional.',
    'Mensagens espaçadas e imprevisíveis têm 3× mais impacto emocional que mensagens frequentes e previsíveis.',
  ],
  5: [
    'A primeira mensagem após no-contact deve ser leve, positiva e sem carga emocional — como se você estivesse bem.',
    'Responder devagar e encerrar conversas primeiro são os dois hábitos que mais aumentam o interesse percebido.',
    'Psicólogos chamam de "presença calibrada": estar presente sem parecer necessitado — o maior atrativo em reconexões.',
    'Pessoas que demonstram crescimento real, sem precisar anunciá-lo, são as que criam mais desejo de reconexão.',
  ],
}

const WEEK_SCIENCE_FACTS: Record<number, string> = {
  1: '🧠 Box breathing reduz cortisol em até 23% em apenas 4 ciclos — técnica usada pela Marinha Americana.',
  2: '🧠 Exercício físico de 30 minutos libera a mesma quantidade de endorfina que 10mg de morfina, segundo estudos de Harvard.',
  3: '🧠 Meditação de 5 minutos por dia altera a espessura do córtex pré-frontal em 8 semanas — região do autocontrole.',
  4: '🧠 Visualização mental ativa os mesmos circuitos neurais que a ação real, preparando o cérebro para o comportamento desejado.',
  5: '🧠 Estudos de comunicação mostram que mensagens breves e espaçadas criam 3× mais antecipação emocional do que mensagens frequentes.',
}

interface XpQuizData { question: string; options: XpQuizOption[] }

const DAY_QUIZZES: Record<number, XpQuizData> = {
  1: {
    question: 'Checar o perfil dela nas redes sociais após o término é...',
    options: [
      { text: 'Inofensivo, é só olhar', xp: 10, feedback: 'Na verdade, cada verificação reforça o vínculo emocional e atrasa sua recuperação.' },
      { text: 'Prejudicial para mim', xp: 25, feedback: 'Exato. Mas há algo ainda mais importante que você precisa entender...' },
      { text: 'Uma forma de contato indireto', xp: 15, feedback: 'Correto! Isso te mantém preso emocionalmente sem que ela saiba.' },
      { text: 'Prejudicial E reduz meu valor percebido', xp: 50, feedback: 'Perfeito! Não é só sobre você — é sobre o que comunica a ela.' },
    ],
  },
  2: {
    question: 'Quando você desaparece estrategicamente, o sistema de apego da outra pessoa...',
    options: [
      { text: 'Não muda — ela não vai notar', xp: 10, feedback: 'Errado: a ausência ativa o sistema nervoso de busca e intensifica o desejo de reconexão.' },
      { text: 'Fica aliviado pela ausência', xp: 15, feedback: 'Possível a curto prazo — mas o sistema de apego começa a sentir falta após um período.' },
      { text: 'Aumenta o desejo de reconexão', xp: 40, feedback: 'Correto! Bowlby descobriu exatamente isso nos anos 1960.' },
      { text: 'Aumenta o desejo E cria curiosidade sobre o que mudou em você', xp: 50, feedback: 'Exato! É dupla ativação: apego + curiosidade. Extremamente poderoso.' },
    ],
  },
}

const DEFAULT_QUIZ: XpQuizData = {
  question: 'O que mais impacta a atração de longo prazo?',
  options: [
    { text: 'Gestos românticos frequentes', xp: 10, feedback: 'Gestos são importantes, mas previsibilidade reduz a tensão emocional.' },
    { text: 'Aparência física exclusivamente', xp: 5, feedback: 'A física abre a porta, mas não mantém ninguém lá dentro.' },
    { text: 'Autodesenvolvimento contínuo', xp: 35, feedback: 'Pessoas em crescimento são naturalmente mais atraentes ao longo do tempo.' },
    { text: 'Autodesenvolvimento + presença emocional equilibrada', xp: 50, feedback: 'Perfeito: crescimento pessoal + regulação emocional = código da atração duradoura.' },
  ],
}

const INSIGHT_APPLICATIONS: Record<string, string[]> = {
  'Marcus Aurelius': ['Escolha uma ação hoje baseada em quem você quer ser, não em como você se sente.', 'O controle começa pelo que você faz — não pelo que pensa.'],
  'Bowlby': ['Entenda que a saudade dela(e) é biologia, não fraqueza.', 'Use esse conhecimento para não reagir ao impulso de contato.'],
  default: ['Reflita como essa ideia muda sua perspectiva sobre a situação atual.', 'Identifique uma ação concreta que você pode tomar amanhã baseada nisso.'],
}

// ── Helper functions ──────────────────────────────────────────────────────

function getConceptEmoji(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('cérebro') || t.includes('neural') || t.includes('límbico') || t.includes('neuroimagem')) return '🧠'
  if (t.includes('ausência') || t.includes('silêncio') || t.includes('desaparece') || t.includes('invisível')) return '🌑'
  if (t.includes('força') || t.includes('controle emocional') || t.includes('poder') || t.includes('disciplina')) return '💪'
  if (t.includes('comportamento') || t.includes('padrão') || t.includes('hábito') || t.includes('atitude')) return '🔄'
  if (t.includes('tempo') || t.includes('processo') || t.includes('semanas') || t.includes('construção')) return '⏳'
  if (t.includes('sistema') || t.includes('mecanismo') || t.includes('teoria') || t.includes('evolutivo')) return '⚙️'
  if (t.includes('emoção') || t.includes('sentimento') || t.includes('saudade') || t.includes('dor')) return '💭'
  if (t.includes('apego') || t.includes('vínculo') || t.includes('reconexão') || t.includes('relacionamento')) return '🔗'
  if (t.includes('atração') || t.includes('desejo') || t.includes('magnético') || t.includes('fascinação')) return '✨'
  if (t.includes('estratégia') || t.includes('calculado') || t.includes('consciente') || t.includes('intencional')) return '♟️'
  if (t.includes('confiança') || t.includes('valor') || t.includes('identidade') || t.includes('autoestima')) return '👑'
  return '📖'
}

function extractKeyPhrase(text: string): string {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15 && s.length < 100)
  const boostWords = ['não', 'nunca', 'sempre', 'exatamente', 'apenas', 'fundamental', 'paradoxalmente', 'estratégica', 'genuinamente', 'poderosa', 'verdadeira']
  const scored = sentences.map(s => ({
    text: s.trim(),
    score: boostWords.filter(k => s.toLowerCase().includes(k)).length,
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.text.slice(0, 90) || ''
}

function detectQuote(text: string): { isQuote: boolean; quote: string; attribution: string } {
  const AUTHOR_PATTERN = /(Marcus Aurelius|Bowlby|Nietzsche|Einstein|Naval Ravikant|Shakespeare|Dostoiévski|Sócrates|Aristóteles|Carl Jung|Viktor Frankl|Brené Brown|Sun Tzu|Epictetus|Sêneca)/i
  const quoteMatch = text.match(/["""]([^"""]{40,})[""""]/)
  const authorMatch = text.match(AUTHOR_PATTERN)
  if (quoteMatch && authorMatch) {
    return { isQuote: true, quote: quoteMatch[1].trim(), attribution: authorMatch[1] }
  }
  return { isQuote: false, quote: '', attribution: '' }
}

// ── Main parser ───────────────────────────────────────────────────────────

export function parseProtocolDayToCards(
  day: ProtocolDay,
  tFn: (key: string) => string,
  targetGender: TargetGender = 'female',
): GameCard[] {
  const cards: GameCard[] = []
  const module = day.module
  const weekPool = WEEK_IMAGE_QUERIES[module] || WEEK_IMAGE_QUERIES[1]
  const factPool = WEEK_FACTS[module] || WEEK_FACTS[1]
  const quizData = DAY_QUIZZES[day.day] || DEFAULT_QUIZ

  // Check if this day uses new 4-block structure
  const hasBlockStructure = day.tasks.some(t =>
    t.type === 'block1_arsenal' || t.type === 'block2_execucao' ||
    t.type === 'block3_blindagem' || t.type === 'block4_consolidacao'
  )

  // If using new 4-block structure, parse accordingly
  if (hasBlockStructure) {
    return parseFourBlockStructure(day, tFn, targetGender, weekPool)
  }

  // Group tasks by type (legacy structure)
  const insightTasks = day.tasks.filter(t => t.type === 'insight' || t.type === 'reading')
  const actionTasks = day.tasks.filter(t => t.type === 'action')
  const exerciseTasks = day.tasks.filter(t => t.type === 'exercise' || t.type === 'reflection')
  const checklistTasks = day.tasks.filter(t => t.type === 'checklist')

  // ── 1. INTRO ─────────────────────────────────────────────────────────────
  cards.push({
    id: 'intro', type: 'intro',
    imageQuery: weekPool[0],
    day: day.day, week: module, weekName: tFn(`p.m${module}.title`),
    title: tFn(day.titleKey),
    mission: adaptText(tFn(`p.m${module}.goal`), targetGender),
  })

  // ── 2. AFFIRMATIONS ───────────────────────────────────────────────────────
  const affirmations = (WEEK_AFFIRMATIONS[module] || WEEK_AFFIRMATIONS[1]).map(a => adaptText(a, targetGender))
  cards.push({ id: 'affirmation', type: 'affirmation', affirmations: affirmations.slice(0, 3) })

  let imgIdx = 1
  const totalConcepts = Math.min(insightTasks.length, 4)

  // ── 3-4. First 2 concept cards ────────────────────────────────────────────
  insightTasks.slice(0, 2).forEach((task, i) => {
    const text = adaptText(tFn(task.titleKey), targetGender)
    cards.push({
      id: `concept_${i}`, type: 'concept',
      emoji: getConceptEmoji(text),
      text,
      keyPhrase: text,
      imageQuery: weekPool[imgIdx++ % weekPool.length],
      conceptIndex: i + 1, totalConcepts,
      fact: factPool[i % factPool.length],
    })
  })

  // ── 5. XP QUIZ ────────────────────────────────────────────────────────────
  const adaptedQuizEarly = {
    question: adaptText(quizData.question, targetGender),
    options: quizData.options.map(o => ({
      ...o,
      text: adaptText(o.text, targetGender),
      feedback: adaptText(o.feedback, targetGender),
    })),
  }
  cards.push({ id: 'xp_quiz', type: 'xp_quiz', question: adaptedQuizEarly.question, options: adaptedQuizEarly.options })

  // ── 6. 3rd concept card ───────────────────────────────────────────────────
  if (insightTasks[2]) {
    const text = adaptText(tFn(insightTasks[2].titleKey), targetGender)
    cards.push({
      id: 'concept_2', type: 'concept',
      emoji: getConceptEmoji(text),
      text,
      keyPhrase: text,
      imageQuery: weekPool[imgIdx++ % weekPool.length],
      conceptIndex: 3, totalConcepts,
      fact: factPool[2 % factPool.length],
    })
  }

  // ── 7. 4th concept card ───────────────────────────────────────────────────
  if (insightTasks[3]) {
    const text = adaptText(tFn(insightTasks[3].titleKey), targetGender)
    cards.push({
      id: 'concept_3', type: 'concept',
      emoji: getConceptEmoji(text),
      text,
      keyPhrase: text,
      imageQuery: weekPool[imgIdx++ % weekPool.length],
      conceptIndex: 4, totalConcepts,
      fact: factPool[3 % factPool.length],
    })
  }

  // ── 8. VISUALIZATION ──────────────────────────────────────────────────────
  const visRaw = WEEK_VISUALIZATIONS[module] || WEEK_VISUALIZATIONS[1]
  const vis = { ...visRaw, steps: visRaw.steps.map(s => adaptText(s, targetGender)) }
  cards.push({ id: 'visualization', type: 'visualization', ...vis })

  // ── 9. REFLECTION QUIZ ────────────────────────────────────────────────────
  const exerciseTask = exerciseTasks[0]
  cards.push({
    id: 'quiz', type: 'quiz',
    question: adaptText(exerciseTask ? tFn(exerciseTask.titleKey) : tFn(day.titleKey), targetGender),
  })

  // ── 10. CHECKLIST ─────────────────────────────────────────────────────────
  if (checklistTasks.length > 0) {
    cards.push({ id: 'checklist', type: 'checklist', items: checklistTasks.map(t => tFn(t.titleKey)) })
  }

  // ── 11. PRACTICE ──────────────────────────────────────────────────────────
  const practiceTask = actionTasks[0]
  if (practiceTask) {
    const instructions = adaptText(tFn(practiceTask.titleKey) || tFn(practiceTask.descriptionKey || ''), targetGender)
    const isBreathing = /inspir|expir|respir|breath/i.test(instructions)
    cards.push({
      id: 'practice', type: 'practice',
      title: tFn(day.titleKey),
      instructions,
      isBreathing,
      scienceFact: WEEK_SCIENCE_FACTS[module] || WEEK_SCIENCE_FACTS[1],
    })
  }

  // ── 12. CHECKIN ───────────────────────────────────────────────────────────
  cards.push({ id: 'checkin', type: 'checkin' })

  return cards
}

// ── 4-Block Structure Parser ───────────────────────────────────────────────

function parseFourBlockStructure(
  day: ProtocolDay,
  tFn: (key: string) => string,
  targetGender: TargetGender,
  weekPool: string[],
): GameCard[] {
  const cards: GameCard[] = []
  const module = day.module
  // Helper: translate + adapt gender in one step
  const ta = (key: string) => adaptText(tFn(key), targetGender)
  const adapt = (s: string) => adaptText(s, targetGender)

  // Group tasks by block
  const block1Tasks = day.tasks.filter(t => t.type === 'block1_arsenal' || t.type === 'reading' || t.type === 'insight')
  const block2Tasks = day.tasks.filter(t => t.type === 'block2_execucao' || t.type === 'action')
  const block3Tasks = day.tasks.filter(t => t.type === 'block3_blindagem' || t.type === 'exercise')
  const block4Tasks = day.tasks.filter(t => t.type === 'block4_consolidacao' || t.type === 'checklist' || t.type === 'checkin')

  // ── 1. INTRO ─────────────────────────────────────────────────────────────
  cards.push({
    id: 'intro', type: 'intro',
    imageQuery: weekPool[0],
    day: day.day, week: module, weekName: tFn(`p.m${module}.title`),
    title: tFn(day.titleKey),
    mission: adaptText(tFn(`p.m${module}.goal`), targetGender),
  })

  // ── BLOCO 1: ARSENAL TEÓRICO ─────────────────────────────────────────────
  if (block1Tasks.length > 0) {
    cards.push({
      id: 'block1_header', type: 'block_header',
      blockNumber: 1,
      blockTitle: 'BLOCO 1: ARSENAL TEÓRICO',
      blockSubtitle: 'O que aprender',
      blockEmoji: '📚'
    })

    // Add readings, caso and quiz for block 1
    const quizTask = day.tasks.find(t => t.type === 'quiz')
    block1Tasks.forEach((task, i) => {
      const text = ta(task.titleKey)
      const desc = task.descriptionKey ? ta(task.descriptionKey) : ''
      const ctype = task.type === 'estudo_caso' ? 'estudo_caso' : 'reading'
      cards.push({
        id: `block1_${i}`, type: 'block_content',
        blockNumber: 1,
        contentType: ctype,
        title: text,
        content: desc,
      })
    })

    // Add quiz using actual content from protocol
    if (quizTask) {
      cards.push({
        id: 'block1_quiz', type: 'block_content',
        blockNumber: 1,
        contentType: 'quiz',
        title: ta(quizTask.titleKey),
        content: quizTask.descriptionKey ? ta(quizTask.descriptionKey) : '',
      })
    }
  }

  // ── BLOCO 2: EXECUÇÃO TÁTICA ─────────────────────────────────────────────
  if (block2Tasks.length > 0) {
    cards.push({
      id: 'block2_header', type: 'block_header',
      blockNumber: 2,
      blockTitle: 'BLOCO 2: EXECUÇÃO TÁTICA',
      blockSubtitle: 'O que fazer',
      blockEmoji: '⚡'
    })

    // Split missions from rules task
    const rulesTask = day.tasks.find(t => t.type === 'block2_execucao' && t.id.includes('rules'))
    const missionTasks = block2Tasks.filter(t => !t.id.includes('rules'))

    missionTasks.forEach((task, i) => {
      const text = ta(task.titleKey)
      const desc = task.descriptionKey ? ta(task.descriptionKey) : ''
      // Parse [ ] items: split by newline, take lines that start with [ ]
      const checkboxItems = desc.split('\n')
        .filter(l => l.trim().startsWith('[ ]'))
        .map(l => l.replace(/^\s*\[ \]\s*/, '').trim())
        .filter(l => l.length > 0)
      cards.push({
        id: `block2_${i}`, type: 'block_content',
        blockNumber: 2,
        contentType: 'missao',
        title: text,
        content: checkboxItems.length > 0 ? '' : desc,
        checkboxes: checkboxItems.length > 0 ? checkboxItems : undefined,
      })
    })

    // Add rules card with actual content from protocol
    if (rulesTask) {
      const rulesDesc = rulesTask.descriptionKey ? ta(rulesTask.descriptionKey) : ''
      cards.push({
        id: 'block2_rules', type: 'block_content',
        blockNumber: 2,
        contentType: 'regras',
        title: ta(rulesTask.titleKey),
        content: rulesDesc,
      })
    }
  }

  // ── BLOCO 3: BLINDAGEM EMOCIONAL ─────────────────────────────────────────
  if (block3Tasks.length > 0) {
    cards.push({
      id: 'block3_header', type: 'block_header',
      blockNumber: 3,
      blockTitle: 'BLOCO 3: BLINDAGEM EMOCIONAL',
      blockSubtitle: 'Tratando o Coração e a Mente',
      blockEmoji: '🛡️'
    })

    // Bio-hacking (bio1, bio2), reestruturação, sobrecarga, quebra — all with actual i18n content
    block3Tasks.forEach((task, i) => {
      const title = ta(task.titleKey)
      const desc = task.descriptionKey ? ta(task.descriptionKey) : ''
      let ctype: BlockContentCard['contentType']
      if (task.type === 'reestruturacao') ctype = 'reestruturacao'
      else if (task.type === 'sobrecarga') ctype = 'sobrecarga'
      else ctype = 'bio_hacking'
      cards.push({
        id: `block3_${i}`, type: 'block_content',
        blockNumber: 3,
        contentType: ctype,
        title,
        content: desc,
      })
    })
  }

  // ── BLOCO 4: CONSOLIDAÇÃO DA JORNADA ─────────────────────────────────────
  if (block4Tasks.length > 0) {
    cards.push({
      id: 'block4_header', type: 'block_header',
      blockNumber: 4,
      blockTitle: 'BLOCO 4: CONSOLIDAÇÃO DA JORNADA',
      blockSubtitle: 'Status da Reconquista',
      blockEmoji: '🏆'
    })

    // Check-in de sobrevivência — uses actual checkin tasks from protocol
    const checkinItems = block4Tasks
      .filter(t => t.type === 'block4_consolidacao' && t.id.includes('check'))
      .map(t => adapt(tFn(t.titleKey)))
      .filter(s => s.length > 0)

    cards.push({
      id: 'block4_checkin', type: 'block_content',
      blockNumber: 4,
      contentType: 'checkin',
      title: adapt('Check-in de Sobrevivência'),
      content: adapt('Responda com honestidade sobre seu dia'),
      checkboxes: checkinItems.length > 0 ? checkinItems : [
        adapt('Mantive o protocolo sem infrações?'),
        adapt('Completei todas as missões?'),
        adapt('Pratiquei as técnicas de blindagem?'),
      ],
    })

    // Termômetro de humor
    const termoTask = day.tasks.find(t => t.type === 'termometro')
    cards.push({
      id: 'block4_termometro', type: 'block_content',
      blockNumber: 4,
      contentType: 'termometro',
      title: termoTask ? ta(termoTask.titleKey) : adapt('Termômetro de Humor'),
      content: adapt('Como está seu estado emocional hoje? (1 = péssimo, 10 = excelente)'),
    })

    // Juramento de honra — with actual text from i18n
    const jurTask = day.tasks.find(t => t.type === 'juramento')
    cards.push({
      id: 'block4_juramento', type: 'block_content',
      blockNumber: 4,
      contentType: 'juramento',
      title: jurTask ? ta(jurTask.titleKey) : adapt('O Juramento de Honra'),
      content: jurTask?.descriptionKey ? ta(jurTask.descriptionKey) : adapt('Eu juro pela minha integridade que mantive o compromisso hoje. Meu valor não depende dela.'),
    })

    // Recompensa narrativa — with actual text from i18n + next day teaser
    const recTask = day.tasks.find(t => t.type === 'recompensa')
    const nextDay = day.day + 1
    const teaser = ta('p.generic.teaser')
    cards.push({
      id: 'block4_recompensa', type: 'block_content',
      blockNumber: 4,
      contentType: 'recompensa',
      title: recTask ? ta(recTask.titleKey) : adapt('Recompensa do Dia'),
      content: (recTask?.descriptionKey ? ta(recTask.descriptionKey) : adapt('Você avançou na jornada. Cada dia de disciplina é uma vitória.')) +
        (nextDay <= 35 ? `\n\n🔮 Amanhã — Dia ${nextDay}: ${teaser}` : adapt('\n\n🏆 Você completou os 35 dias do protocolo!')),
    })
  }

  // Final checkin card to trigger day completion + celebration
  cards.push({ id: 'checkin_final', type: 'checkin' })

  return cards
}

/** @deprecated Use parseProtocolDayToCards */
export const parseContentToCards = parseProtocolDayToCards as unknown as (
  day: ProtocolDay, tFn: (key: string) => string, targetGender?: TargetGender,
) => GameCard[]
