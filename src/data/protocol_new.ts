// NOVO PROTOCOLO - Conteúdo Profundo e Transformador
// 35 dias organizados em 5 Fases x 4 Blocos

export type TaskType =
  | 'block1_arsenal'
  | 'block2_execucao'
  | 'block3_blindagem'
  | 'block4_consolidacao'
  | 'quiz'
  | 'estudo_caso'
  | 'reestruturacao'
  | 'sobrecarga'
  | 'termometro'
  | 'juramento'
  | 'recompensa'
  // legacy types (backward compat)
  | 'reading'
  | 'insight'
  | 'action'
  | 'exercise'
  | 'reflection'
  | 'checklist'
  | 'checkin'

export interface Task {
  id: string
  type: TaskType
  titleKey: string
  descriptionKey?: string
}

export interface ProtocolDay {
  day: number
  module: number
  titleKey: string
  tasks: Task[]
}

export interface ProtocolModule {
  module: number
  titleKey: string
  goalKey: string
  days: ProtocolDay[]
}

// Gerar tasks para um dia específico com base no template de 4 blocos
function generateDayTasks(m: number, dm: number, dayTitle: string): Task[] {
  const d = m === 1 ? dm : (m - 1) * 7 + dm

  return [
    // BLOCO 1: ARSENAL TEÓRICO (5 tasks)
    { id: `m${m}d${dm}_b1_01`, type: 'block1_arsenal', titleKey: `p.m${m}.d${dm}.reading1.title`, descriptionKey: `p.m${m}.d${dm}.reading1.desc` },
    { id: `m${m}d${dm}_b1_02`, type: 'block1_arsenal', titleKey: `p.m${m}.d${dm}.reading2.title`, descriptionKey: `p.m${m}.d${dm}.reading2.desc` },
    { id: `m${m}d${dm}_b1_03`, type: 'block1_arsenal', titleKey: `p.m${m}.d${dm}.reading3.title`, descriptionKey: `p.m${m}.d${dm}.reading3.desc` },
    { id: `m${m}d${dm}_b1_caso`, type: 'estudo_caso', titleKey: `p.m${m}.d${dm}.caso.title`, descriptionKey: `p.m${m}.d${dm}.caso.desc` },
    { id: `m${m}d${dm}_b1_quiz`, type: 'quiz', titleKey: `p.m${m}.d${dm}.quiz.title`, descriptionKey: `p.m${m}.d${dm}.quiz.desc` },
    // BLOCO 2: EXECUÇÃO TÁTICA (4 tasks)
    { id: `m${m}d${dm}_b2_01`, type: 'block2_execucao', titleKey: `p.m${m}.d${dm}.mission1.title`, descriptionKey: `p.m${m}.d${dm}.mission1.desc` },
    { id: `m${m}d${dm}_b2_02`, type: 'block2_execucao', titleKey: `p.m${m}.d${dm}.mission2.title`, descriptionKey: `p.m${m}.d${dm}.mission2.desc` },
    { id: `m${m}d${dm}_b2_03`, type: 'block2_execucao', titleKey: `p.m${m}.d${dm}.mission3.title`, descriptionKey: `p.m${m}.d${dm}.mission3.desc` },
    { id: `m${m}d${dm}_b2_rules`, type: 'block2_execucao', titleKey: `p.m${m}.d${dm}.rules.title`, descriptionKey: `p.m${m}.d${dm}.rules.desc` },
    // BLOCO 3: BLINDAGEM EMOCIONAL (5 tasks)
    { id: `m${m}d${dm}_b3_bio1`, type: 'block3_blindagem', titleKey: `p.m${m}.d${dm}.bio1.title`, descriptionKey: `p.m${m}.d${dm}.bio1.desc` },
    { id: `m${m}d${dm}_b3_bio2`, type: 'block3_blindagem', titleKey: `p.m${m}.d${dm}.bio2.title`, descriptionKey: `p.m${m}.d${dm}.bio2.desc` },
    { id: `m${m}d${dm}_b3_restr`, type: 'reestruturacao', titleKey: `p.m${m}.d${dm}.restr.title`, descriptionKey: `p.m${m}.d${dm}.restr.desc` },
    { id: `m${m}d${dm}_b3_sobre`, type: 'sobrecarga', titleKey: `p.m${m}.d${dm}.sobre.title`, descriptionKey: `p.m${m}.d${dm}.sobre.desc` },
    { id: `m${m}d${dm}_b3_quebra`, type: 'sobrecarga', titleKey: `p.m${m}.d${dm}.quebra.title`, descriptionKey: `p.m${m}.d${dm}.quebra.desc` },
    // BLOCO 4: CONSOLIDAÇÃO (9 tasks)
    { id: `m${m}d${dm}_b4_check1`, type: 'block4_consolidacao', titleKey: 'p.generic.checkin1', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_check2`, type: 'block4_consolidacao', titleKey: 'p.generic.checkin2', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_check3`, type: 'block4_consolidacao', titleKey: 'p.generic.checkin3', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_check4`, type: 'block4_consolidacao', titleKey: 'p.generic.checkin4', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_check5`, type: 'block4_consolidacao', titleKey: 'p.generic.checkin5', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_check6`, type: 'block4_consolidacao', titleKey: 'p.generic.checkin6', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_termo`, type: 'termometro', titleKey: 'p.generic.termometro', descriptionKey: '' },
    { id: `m${m}d${dm}_b4_jura`, type: 'juramento', titleKey: 'p.generic.juramento', descriptionKey: 'p.generic.juramento.desc' },
    { id: `m${m}d${dm}_b4_rec`, type: 'recompensa', titleKey: 'p.generic.recompensa', descriptionKey: 'p.generic.recompensa.desc' },
  ]
}

export const PROTOCOL: ProtocolModule[] = [
  // ==================== MÓDULO 1: AFASTAMENTO INTELIGENTE (Dias 1-7) ====================
  {
    module: 1,
    titleKey: 'p.m1.title',
    goalKey: 'p.m1.goal',
    days: [
      { day: 1, module: 1, titleKey: 'p.m1.d1.title', tasks: generateDayTasks(1, 1, 'O Silêncio como Arma') },
      { day: 2, module: 1, titleKey: 'p.m1.d2.title', tasks: generateDayTasks(1, 2, 'O Modo Espectro') },
      { day: 3, module: 1, titleKey: 'p.m1.d3.title', tasks: generateDayTasks(1, 3, 'O Valor Crescente') },
      { day: 4, module: 1, titleKey: 'p.m1.d4.title', tasks: generateDayTasks(1, 4, 'Ancoragem de Identidade') },
      { day: 5, module: 1, titleKey: 'p.m1.d5.title', tasks: generateDayTasks(1, 5, 'Magnetismo Seletivo') },
      { day: 6, module: 1, titleKey: 'p.m1.d6.title', tasks: generateDayTasks(1, 6, 'Espelho de Aço') },
      { day: 7, module: 1, titleKey: 'p.m1.d7.title', tasks: generateDayTasks(1, 7, 'Consolidação da Fase 1') },
    ],
  },
  // ==================== MÓDULO 2: RECONSTRUÇÃO (Dias 8-14) ====================
  {
    module: 2,
    titleKey: 'p.m2.title',
    goalKey: 'p.m2.goal',
    days: [
      { day: 8, module: 2, titleKey: 'p.m2.d1.title', tasks: generateDayTasks(2, 1, 'Arquitetura Masculina') },
      { day: 9, module: 2, titleKey: 'p.m2.d2.title', tasks: generateDayTasks(2, 2, 'Força Interior') },
      { day: 10, module: 2, titleKey: 'p.m2.d3.title', tasks: generateDayTasks(2, 3, 'Propósito e Direção') },
      { day: 11, module: 2, titleKey: 'p.m2.d4.title', tasks: generateDayTasks(2, 4, 'Rede de Conexões') },
      { day: 12, module: 2, titleKey: 'p.m2.d5.title', tasks: generateDayTasks(2, 5, 'Corpo e Mente') },
      { day: 13, module: 2, titleKey: 'p.m2.d6.title', tasks: generateDayTasks(2, 6, 'Transformação Visível') },
      { day: 14, module: 2, titleKey: 'p.m2.d7.title', tasks: generateDayTasks(2, 7, 'Consolidação da Fase 2') },
    ],
  },
  // ==================== MÓDULO 3: CRIAÇÃO DE VALOR (Dias 15-21) ====================
  {
    module: 3,
    titleKey: 'p.m3.title',
    goalKey: 'p.m3.goal',
    days: [
      { day: 15, module: 3, titleKey: 'p.m3.d1.title', tasks: generateDayTasks(3, 1, 'O Homem de Alto Valor') },
      { day: 16, module: 3, titleKey: 'p.m3.d2.title', tasks: generateDayTasks(3, 2, 'Comunicação Persuasiva') },
      { day: 17, module: 3, titleKey: 'p.m3.d3.title', tasks: generateDayTasks(3, 3, 'Presença e Postura') },
      { day: 18, module: 3, titleKey: 'p.m3.d4.title', tasks: generateDayTasks(3, 4, 'Inteligência Emocional') },
      { day: 19, module: 3, titleKey: 'p.m3.d5.title', tasks: generateDayTasks(3, 5, 'Magnetismo Natural') },
      { day: 20, module: 3, titleKey: 'p.m3.d6.title', tasks: generateDayTasks(3, 6, 'Demonstração de Valor') },
      { day: 21, module: 3, titleKey: 'p.m3.d7.title', tasks: generateDayTasks(3, 7, 'Consolidação da Fase 3') },
    ],
  },
  // ==================== MÓDULO 4: MIND HACK (Dias 22-28) ====================
  {
    module: 4,
    titleKey: 'p.m4.title',
    goalKey: 'p.m4.goal',
    days: [
      { day: 22, module: 4, titleKey: 'p.m4.d1.title', tasks: generateDayTasks(4, 1, 'Psicologia do Apego') },
      { day: 23, module: 4, titleKey: 'p.m4.d2.title', tasks: generateDayTasks(4, 2, 'Despertar o Desejo') },
      { day: 24, module: 4, titleKey: 'p.m4.d3.title', tasks: generateDayTasks(4, 3, 'Escassez e Urgência') },
      { day: 25, module: 4, titleKey: 'p.m4.d4.title', tasks: generateDayTasks(4, 4, 'Reconexão Estratégica') },
      { day: 26, module: 4, titleKey: 'p.m4.d5.title', tasks: generateDayTasks(4, 5, 'Negociação Emocional') },
      { day: 27, module: 4, titleKey: 'p.m4.d6.title', tasks: generateDayTasks(4, 6, 'A Proposta Irrecusável') },
      { day: 28, module: 4, titleKey: 'p.m4.d7.title', tasks: generateDayTasks(4, 7, 'Consolidação da Fase 4') },
    ],
  },
  // ==================== MÓDULO 5: RECONEXÃO (Dias 29-35) ====================
  {
    module: 5,
    titleKey: 'p.m5.title',
    goalKey: 'p.m5.goal',
    days: [
      { day: 29, module: 5, titleKey: 'p.m5.d1.title', tasks: generateDayTasks(5, 1, 'O Momento da Verdade') },
      { day: 30, module: 5, titleKey: 'p.m5.d2.title', tasks: generateDayTasks(5, 2, 'Reconstruindo a Conexão') },
      { day: 31, module: 5, titleKey: 'p.m5.d3.title', tasks: generateDayTasks(5, 3, 'Novo Dinâmica de Relacionamento') },
      { day: 32, module: 5, titleKey: 'p.m5.d4.title', tasks: generateDayTasks(5, 4, 'Consolidação da Mudança') },
      { day: 33, module: 5, titleKey: 'p.m5.d5.title', tasks: generateDayTasks(5, 5, 'Proteção do Recomeço') },
      { day: 34, module: 5, titleKey: 'p.m5.d6.title', tasks: generateDayTasks(5, 6, 'O Futuro do Relacionamento') },
      { day: 35, module: 5, titleKey: 'p.m5.d7.title', tasks: generateDayTasks(5, 7, 'Consolidação Final') },
    ],
  },
]

export const getDayContent = (day: number): ProtocolDay | undefined =>
  PROTOCOL.flatMap(m => m.days).find(d => d.day === day)

export const getModuleContent = (module: number): ProtocolModule | undefined =>
  PROTOCOL.find(m => m.module === module)

export const getDayModule = (day: number): ProtocolModule | undefined =>
  PROTOCOL.find(m => m.days.some(d => d.day === day))
