import type { TargetGender } from '../types'

export type { TargetGender }
export type UserGender = 'male' | 'female'

/**
 * Adapts text to the target gender.
 * Default content is written for a female target (reconquering a woman).
 * When targetGender === 'male', we replace female pronouns/terms with male equivalents.
 * Works across PT, ES and EN (patterns are language-specific so they never collide).
 */
export const adaptText = (text: string, targetGender: TargetGender): string => {
  if (targetGender !== 'male') return text

  return text
    // ── PORTUGUESE ─────────────────────────────────────────────────────────
    // Handle alternating forms like "ela(e)" → "ele", "dela(e)" → "dele"
    .replace(/\bEla\(e\)/g, 'Ele')
    .replace(/\bela\(e\)/g, 'ele')
    .replace(/\bDela\(e\)/g, 'Dele')
    .replace(/\bdela\(e\)/g, 'dele')
    // Handle adjective alternates: "impressionada(o)" → "impressionado", "pronto(a)" → "pronto"
    .replace(/([a-záàãâéêíóôõúüç]+)a\(o\)/gi, '$1o')
    .replace(/([a-záàãâéêíóôõúüç]+)o\(a\)/gi, '$1o')
    // Pronouns — capitalized first
    .replace(/\bEla\b/g, 'Ele')
    .replace(/\bDela\b/g, 'Dele')
    .replace(/\bNela\b/g, 'Nele')
    .replace(/\bPara ela\b/g, 'Para ele')
    .replace(/\bCom ela\b/g, 'Com ele')
    // Lowercase
    .replace(/\bela\b/g, 'ele')
    .replace(/\bdela\b/g, 'dele')
    .replace(/\bnela\b/g, 'nele')
    .replace(/\bpara ela\b/g, 'para ele')
    .replace(/\bcom ela\b/g, 'com ele')
    // Relationship terms
    .replace(/\bNamorada\b/g, 'Namorado')
    .replace(/\bnamorada\b/g, 'namorado')
    .replace(/\bEx-namorada\b/g, 'Ex-namorado')
    .replace(/\bex-namorada\b/g, 'ex-namorado')
    .replace(/\bEx-parceira\b/g, 'Ex-parceiro')
    .replace(/\bex-parceira\b/g, 'ex-parceiro')
    .replace(/\bSua ex\b/g, 'Seu ex')
    .replace(/\bsua ex\b/g, 'seu ex')
    .replace(/\ba mulher\b/g, 'o homem')
    .replace(/\bA mulher\b/g, 'O homem')
    .replace(/\ba ex\b/g, 'o ex')
    .replace(/\bA ex\b/g, 'O ex')

    // ── SPANISH ──────────────────────────────────────────────────────────────
    .replace(/\bElla\b/g, 'Él')
    .replace(/\bella\b/g, 'él')
    .replace(/\bDe ella\b/g, 'De él')
    .replace(/\bde ella\b/g, 'de él')
    .replace(/\bNovia\b/g, 'Novio')
    .replace(/\bnovia\b/g, 'novio')
    .replace(/\bEx-novia\b/g, 'Ex-novio')
    .replace(/\bex-novia\b/g, 'ex-novio')
    .replace(/\bla ex\b/g, 'el ex')
    .replace(/\bLa ex\b/g, 'El ex')

    // ── ENGLISH ──────────────────────────────────────────────────────────────
    .replace(/\bShe\b/g, 'He')
    .replace(/\bshe\b/g, 'he')
    .replace(/\bHer\b/g, 'Him')
    .replace(/\bher\b/g, 'him')
    // possessive: "her smile" → "his smile" — context matters but "his" is safer
    .replace(/\bhim ([a-z])/g, 'his $1')
    .replace(/\bHim ([A-Z])/g, 'His $1')
    .replace(/\bGirlfriend\b/g, 'Boyfriend')
    .replace(/\bgirlfriend\b/g, 'boyfriend')
    .replace(/\bex-girlfriend\b/g, 'ex-boyfriend')
    .replace(/\bEx-girlfriend\b/g, 'Ex-boyfriend')
    .replace(/\bthe woman\b/g, 'the man')
    .replace(/\bThe woman\b/g, 'The man')
}

export const getAISystemPrompt = (targetGender: TargetGender, language: string): string => {
  const lang = language === 'pt' ? 'português' : language === 'es' ? 'español' : 'english'
  if (targetGender === 'female') {
    return `Você é Cristina, uma coach de relacionamentos especializada em reconquista emocional e desenvolvimento pessoal masculino. Você ajuda homens a se recuperarem emocionalmente após términos e desenvolverem confiança genuína para reconquistar mulheres. Seu método é baseado no livro "Código Invisível da Reconquista": distanciamento calculado, autorreconstrução, reativação do Sexto Neurônio, reaproximação gradual e ativação da paixão. Você é empática mas direta. Nunca incentiva manipulação. Foca em transformação pessoal real. Responda sempre em ${lang}. Máximo 150 palavras por resposta.`
  }
  return `Você é Cristina, uma coach de relacionamentos especializada em reconquista emocional e desenvolvimento pessoal feminino. Você ajuda mulheres a se recuperarem emocionalmente após términos e desenvolverem autoconfiança para reconquistar homens. Entende profundamente a psicologia masculina: como homens processam emoções, por que fogem quando pressionados, o que desperta o instinto de caça. Você é empática mas direta. Responda sempre em ${lang}. Máximo 150 palavras por resposta.`
}

export const getModuleName = (moduleId: string, targetGender: TargetGender): string => {
  const names: Record<string, { female: string; male: string }> = {
    attraction: { female: 'Como Atrair Qualquer Mulher', male: 'Como Atrair Qualquer Homem' },
    psychology: { female: 'Psicologia Feminina', male: 'Psicologia Masculina' },
    communication: { female: 'Comunicação & Confiança Masculina', male: 'Comunicação & Autoconfiança Feminina' },
    style: { female: 'Estilo & Aparência Masculina', male: 'Estilo & Presença Feminina' },
    social: { female: 'Vida Social de Alto Valor', male: 'Vida Social Magnética' },
    mindset: { female: 'Mentalidade Estoica', male: 'Mentalidade de Mulher de Alto Valor' },
  }
  return names[moduleId]?.[targetGender] ?? ''
}
